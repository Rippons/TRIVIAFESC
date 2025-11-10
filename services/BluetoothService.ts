// services/BluetoothService.ts
import { PermissionsAndroid, Platform } from 'react-native';
import RNBluetoothClassicLib, {
  BluetoothDevice as BTDevice,
  BluetoothEventSubscription,
} from 'react-native-bluetooth-classic';

export type GameMessage =
  | { type: 'PLAYER_JOINED'; playerName: string }
  | { type: 'GAME_START' }
  | { type: 'CATEGORY_SELECTED'; category: string }
  | { type: 'ANSWER_SUBMITTED'; answer: string; isCorrect: boolean; score: number }
  | { type: 'TURN_CHANGED'; currentPlayer: number }
  | { type: 'GAME_OVER'; winner: string; scores: { player1: number; player2: number } };

export interface BluetoothDevice {
  id: string;
  name?: string;
  address?: string;
}

type Transport = 'bluetooth' | 'websocket';

const WS_URL = 'ws://localhost:8787'; // ⬅️ cámbialo por tu IP/LAN si hace falta

// El módulo puede ser undefined en web/iOS/Expo Go
const RNBluetoothClassic: any = RNBluetoothClassicLib;

class BluetoothService {
  // Estado común
  private connectedDevice: BTDevice | null = null;
  private isHost = false;
  private messageCallback: ((message: GameMessage) => void) | null = null;
  private subscriptions: BluetoothEventSubscription[] = [];

  // WebSocket fallback
  private ws: WebSocket | null = null;

  // Detección de transporte preferente
  private get transport(): Transport {
    const bluetoothSupported =
      Platform.OS === 'android' &&
      !!RNBluetoothClassic &&
      typeof RNBluetoothClassic.isBluetoothAvailable === 'function';
    return bluetoothSupported ? 'bluetooth' : 'websocket';
  }

  // ===== Permisos (Android) =====
  async requestBluetoothPermissions(): Promise<boolean> {
    if (Platform.OS === 'android' && this.transport === 'bluetooth') {
      try {
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        ]);
        return Object.values(granted).every(
          (v) => v === PermissionsAndroid.RESULTS.GRANTED,
        );
      } catch (err) {
        console.warn('Error requesting permissions:', err);
        return false;
      }
    }
    return true;
  }

  // ====== HOST / SERVER ======
  async startServer(): Promise<void> {
    if (this.transport === 'bluetooth') {
      const hasPermission = await this.requestBluetoothPermissions();
      if (!hasPermission) throw new Error('Bluetooth permissions not granted');

      this.isHost = true;
      console.log('🟢 Iniciando servidor Bluetooth...');
      const available = await RNBluetoothClassic.isBluetoothAvailable();
      if (!available) throw new Error('Bluetooth not available');

      // En esta lib accept() recibe opciones
      const serverDevice = await RNBluetoothClassic.accept({ delimiter: '\n' });
      this.connectedDevice = serverDevice;
      this.onMessage({
        type: 'PLAYER_JOINED',
        playerName: serverDevice.name ?? 'Jugador',
      });
      this.listenToDevice(serverDevice);
      return;
    }

    // --- WebSocket fallback ---
    this.isHost = true;
    console.log('🟢 Iniciando sala WS en', WS_URL);
    await this.ensureWS();
    // Marca de host
    this.sendRawWS({ _sys: 'hello', role: 'host' });
    this.onMessage({ type: 'PLAYER_JOINED', playerName: 'Invitado' });
  }

  // ====== DISCOVERY / SEARCH ======
  async searchDevices(): Promise<BluetoothDevice[]> {
    if (this.transport === 'bluetooth') {
      const hasPermission = await this.requestBluetoothPermissions();
      if (!hasPermission) throw new Error('Bluetooth permissions not granted');
      console.log('🔍 Buscando dispositivos emparejados...');
      const devices = await RNBluetoothClassic.getBondedDevices();
      return devices.map((d: any) => ({
        id: d.id,
        name: d.name,
        address: d.address,
      }));
    }

    // --- WebSocket fallback: mostramos una “sala” fija ---
    return [{ id: 'ws-room', name: 'Sala LAN (WebSocket)' }];
  }

  // ====== CLIENT / JOIN ======
  async connectToDevice(deviceId: string): Promise<void> {
    if (this.transport === 'bluetooth') {
      console.log('🔗 Conectando a dispositivo:', deviceId);
      const device = await RNBluetoothClassic.connectToDevice(deviceId, { delimiter: '\n' });
      this.connectedDevice = device;
      this.isHost = false;
      this.listenToDevice(device);
      console.log('✅ Conectado a:', device.name);

      // 🚀 Anuncia unión al host (handshake)
      if (this.connectedDevice) {
        await this.connectedDevice.write(
          JSON.stringify({ type: 'PLAYER_JOINED', playerName: device.name ?? 'Jugador' }) + '\n'
        );
      }
      return;
    }

    // --- WebSocket fallback ---
    console.log('🔗 Uniendo a sala WS:', WS_URL);
    this.isHost = false;
    await this.ensureWS();
    this.sendRawWS({ _sys: 'hello', role: 'guest' });
  }

  // ====== LISTEN ======
  private listenToDevice(device: BTDevice) {
    if (!device?.onDataReceived) return;
    const sub = device.onDataReceived((event: any) => {
      try {
        const raw = event?.message ?? event?.data;
        if (!raw) return;
        const message = JSON.parse(String(raw)) as GameMessage;
        this.onMessage(message);
      } catch (err) {
        console.error('❌ Error interpretando mensaje BT:', err);
      }
    });
    this.subscriptions.push(sub);
  }


  private ensureWS(): Promise<void> {
    if (this.ws && (this.ws.readyState === 1 || this.ws.readyState === 0)) {
      return Promise.resolve();
    }
    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(WS_URL);
        this.ws.onopen = () => {
          console.log('🔌 WS abierta');
          resolve();
        };
        this.ws.onmessage = (e) => {
          try {
            const msg = JSON.parse(String(e.data));
            // Ignora mensajes de sistema
            if (msg && !msg._sys) this.onMessage(msg as GameMessage);
          } catch (err) {
            console.warn('WS parse err', err);
          }
        };
        this.ws.onerror = (e) => {
          console.error('WS error', e);
        };
        this.ws.onclose = () => {
          console.log('WS cerrada');
        };
      } catch (err) {
        reject(err);
      }
    });
  }

  private sendRawWS(payload: unknown) {
    if (!this.ws || this.ws.readyState !== 1) {
      console.warn('WS no está lista todavía');
      return;
    }
    this.ws.send(JSON.stringify(payload));
  }

  // ====== SEND ======
  async sendMessage(message: GameMessage): Promise<void> {
    // Bluetooth
    if (this.transport === 'bluetooth') {
      if (!this.connectedDevice) throw new Error('Not connected to any device');
      console.log('📤 (BT) Enviando mensaje:', message);
      await this.connectedDevice.write(JSON.stringify(message) + '\n');
      return;
    }
    // WebSocket
    console.log('📤 (WS) Enviando mensaje:', message);
    this.sendRawWS(message);
  }

  // ====== EVENTING API ======
  onMessageReceived(callback: (message: GameMessage) => void): void {
    this.messageCallback = callback;
  }

  // BluetoothService.ts
  private onMessage(message: GameMessage): void {
    console.log('📥 Mensaje recibido:', message);

    // 🧠 Lógica de orquestación básica
    if (this.isHost && message?.type === 'PLAYER_JOINED' && this.connectedDevice) {
      // Opcional: también podrías avisar el nombre del host al cliente aquí
      const start: GameMessage = { type: 'GAME_START' };
      // Enviar al peer por BT
      this.connectedDevice.write(JSON.stringify(start) + '\n').catch(() => { });
      // Y notificar al propio host (para que navegue igual que el cliente)
      this.messageCallback?.(start);
    }

    if (this.messageCallback) this.messageCallback(message);
  }


  // ====== DISCONNECT ======
  async disconnect(): Promise<void> {
    console.log('🔌 Desconectando...');
    this.subscriptions.forEach((s) => s.remove?.());
    this.subscriptions = [];

    if (this.connectedDevice) {
      try {
        await this.connectedDevice.disconnect();
      } catch {
        console.warn('⚠️ Error al desconectar BT');
      }
      this.connectedDevice = null;
    }

    if (this.ws) {
      try {
        this.ws.close();
      } catch { }
      this.ws = null;
    }

    this.isHost = false;
    this.messageCallback = null;
  }

  isConnected(): boolean {
  const wsReady = this.ws && this.ws.readyState === 1;
  return !!this.connectedDevice || !!wsReady;
}


  isHostDevice(): boolean {
    return this.isHost;
  }
}

export default new BluetoothService();
