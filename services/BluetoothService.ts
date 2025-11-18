// services/BluetoothService.ts
import { PermissionsAndroid, Platform } from 'react-native';
import RNBluetoothClassicLib, {
  BluetoothDevice as BTDevice,
  BluetoothEventSubscription,
} from 'react-native-bluetooth-classic';

// =========================
// TIPOS DE MENSAJE DEL JUEGO
// =========================
export type GameMessage =
  | { type: 'PLAYER_JOINED'; playerName: string }
  | { type: 'GAME_START' }
  | { type: 'CATEGORY_SELECTED'; category: string }
  | { type: 'ANSWER_SUBMITTED'; answer: string; isCorrect: boolean; score: number }
  | { type: 'TURN_CHANGED'; currentPlayer: number }
  | { type: 'GAME_OVER'; winner: string; scores: { player1: number; player2: number } }
  | { type: 'REQUEST_SPIN_CATEGORY' }; // 🔥 Para que el otro gire la ruleta también

export interface BluetoothDevice {
  id: string;
  name?: string;
  address?: string;
}

type Transport = 'bluetooth' | 'websocket';

// =========================
// CONFIG DE WEBSOCKET
// =========================
const WS_URL = 'ws://localhost:8787'; // <-- Cambiar a tu LAN si usas WS en vez de BT

// Evita errores en web/iOS/ExpoGo
const RNBluetoothClassic: any = RNBluetoothClassicLib;

class BluetoothService {
  private connectedDevice: BTDevice | null = null;
  private isHost = false;
  private messageCallback: ((message: GameMessage) => void) | null = null;
  private subscriptions: BluetoothEventSubscription[] = [];

  // Fallback WebSocket
  private ws: WebSocket | null = null;

  // Determina transporte: Bluetooth real o WS
  private get transport(): Transport {
    const supportsBT =
      Platform.OS === 'android' &&
      !!RNBluetoothClassic &&
      typeof RNBluetoothClassic.isBluetoothAvailable === 'function';

    return supportsBT ? 'bluetooth' : 'websocket';
  }

  // =========================
  // PERMISOS BLUETOOTH
  // =========================
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
      } catch {
        return false;
      }
    }

    return true;
  }

  // =========================
  // HOST (SERVIDOR)
  // =========================
  async startServer(): Promise<void> {
    if (this.transport === 'bluetooth') {
      const ok = await this.requestBluetoothPermissions();
      if (!ok) throw new Error('No se otorgaron permisos Bluetooth');

      this.isHost = true;
      const available = await RNBluetoothClassic.isBluetoothAvailable();
      if (!available) throw new Error('Bluetooth no disponible');

      const serverDevice = await RNBluetoothClassic.accept({ delimiter: '\n' });
      this.connectedDevice = serverDevice;

      // Notifica llegada
      this.onMessage({
        type: 'PLAYER_JOINED',
        playerName: serverDevice.name ?? 'Jugador',
      });

      this.listenToDevice(serverDevice);
      return;
    }

    // Fallback WebSocket
    this.isHost = true;
    await this.ensureWS();
    this.sendRawWS({ _sys: 'hello', role: 'host' });

    this.onMessage({ type: 'PLAYER_JOINED', playerName: 'Invitado' });
  }

  // =========================
  // BUSCAR DISPOSITIVOS
  // =========================
  async searchDevices(): Promise<BluetoothDevice[]> {
    if (this.transport === 'bluetooth') {
      const ok = await this.requestBluetoothPermissions();
      if (!ok) throw new Error('Bluetooth permissions not granted');

      const list = await RNBluetoothClassic.getBondedDevices();
      return list.map((d: any) => ({
        id: d.id,
        name: d.name,
        address: d.address,
      }));
    }

    // Fallback WS
    return [{ id: 'ws-room', name: 'Sala LAN (WebSocket)' }];
  }

  // =========================
  // CLIENTE
  // =========================
  async connectToDevice(deviceId: string): Promise<void> {
    if (this.transport === 'bluetooth') {
      const device = await RNBluetoothClassic.connectToDevice(deviceId, {
        delimiter: '\n',
      });

      this.isHost = false;
      this.connectedDevice = device;

      this.listenToDevice(device);

      // Envía handshake
      await device.write(
        JSON.stringify({
          type: 'PLAYER_JOINED',
          playerName: device.name ?? 'Jugador',
        }) + '\n',
      );

      return;
    }

    // WS fallback
    this.isHost = false;
    await this.ensureWS();
    this.sendRawWS({ _sys: 'hello', role: 'guest' });
  }

  // =========================
  // ESCUCHAR MENSAJES
  // =========================
  private listenToDevice(device: BTDevice) {
    if (!device?.onDataReceived) return;

    const sub = device.onDataReceived((event: any) => {
      try {
        const raw = event?.message ?? event?.data;
        if (!raw) return;

        const msg = JSON.parse(String(raw)) as GameMessage;
        this.onMessage(msg);
      } catch (e) {
        console.warn('Error interpretando mensaje BT:', e);
      }
    });

    this.subscriptions.push(sub);
  }

  // =========================
  // MANEJO DE WS
  // =========================
  private ensureWS(): Promise<void> {
    if (this.ws && (this.ws.readyState === 1 || this.ws.readyState === 0))
      return Promise.resolve();

    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(WS_URL);

        this.ws.onopen = () => resolve();

        this.ws.onmessage = (e) => {
          try {
            const msg = JSON.parse(String(e.data));
            if (!msg._sys) this.onMessage(msg as GameMessage);
          } catch (err) {
            console.warn('WS message parse fail:', err);
          }
        };

        this.ws.onerror = (e) => console.warn('WS error', e);
        this.ws.onclose = () => console.log('WS closed');
      } catch (err) {
        reject(err);
      }
    });
  }

  private sendRawWS(payload: unknown) {
    if (!this.ws || this.ws.readyState !== 1) {
      return console.warn('WS no está lista');
    }
    this.ws.send(JSON.stringify(payload));
  }

  // =========================
  // ENVIAR MENSAJES
  // =========================
  async sendMessage(msg: GameMessage): Promise<void> {
    if (this.transport === 'bluetooth') {
      if (!this.connectedDevice) throw new Error('No conectado');

      await this.connectedDevice.write(JSON.stringify(msg) + '\n');
      return;
    }

    this.sendRawWS(msg);
  }

  // =========================
  // REGISTER CALLBACK
  // =========================
  onMessageReceived(cb: (msg: GameMessage) => void) {
    this.messageCallback = cb;
  }

  // =========================
  // PROCESAR MENSAJE
  // =========================
  private onMessage(message: GameMessage) {
    console.log('📥 Mensaje recibido:', message);

    // Host auto-inicia partida al recibir PLAYER_JOINED
    if (this.isHost && message.type === 'PLAYER_JOINED' && this.connectedDevice) {
      const startMsg: GameMessage = { type: 'GAME_START' };

      this.connectedDevice
        .write(JSON.stringify(startMsg) + '\n')
        .catch(() => {});

      this.messageCallback?.(startMsg);
    }

    // Delegar mensaje al componente del juego
    this.messageCallback?.(message);
  }

  // =========================
  // DESCONECTAR
  // =========================
  async disconnect(): Promise<void> {
    console.log('🔌 Desconectando...');
    this.subscriptions.forEach((s) => s.remove?.());
    this.subscriptions = [];

    if (this.connectedDevice) {
      try {
        await this.connectedDevice.disconnect();
      } catch {}
      this.connectedDevice = null;
    }

    if (this.ws) {
      try {
        this.ws.close();
      } catch {}
      this.ws = null;
    }

    this.isHost = false;
    this.messageCallback = null;
  }

  // =========================
  // UTILS
  // =========================
  isConnected(): boolean {
    const wsReady = this.ws && this.ws.readyState === 1;
    return !!this.connectedDevice || !!wsReady;
  }

  isHostDevice(): boolean {
    return this.isHost;
  }
}

export default new BluetoothService();
