// services/BluetoothService.ts

import { PermissionsAndroid, Platform } from 'react-native';
import RNBluetoothClassic, {
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

class BluetoothService {
  private connectedDevice: BTDevice | null = null;
  private isHost: boolean = false;
  private messageCallback: ((message: GameMessage) => void) | null = null;
  private subscriptions: BluetoothEventSubscription[] = [];

  async requestBluetoothPermissions(): Promise<boolean> {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        ]);

        return Object.values(granted).every(v => v === PermissionsAndroid.RESULTS.GRANTED);
      } catch (err) {
        console.warn('Error requesting permissions:', err);
        return false;
      }
    }
    return true;
  }

  /**
   * HOST inicia el servidor
   */
  async startServer(): Promise<void> {
    const hasPermission = await this.requestBluetoothPermissions();
    if (!hasPermission) throw new Error('Bluetooth permissions not granted');

    this.isHost = true;
    console.log('🟢 Iniciando servidor Bluetooth...');

    const available = await RNBluetoothClassic.isBluetoothAvailable();
    if (!available) throw new Error('Bluetooth not available');

    // 👇 accept() requiere un objeto en esta versión
    const serverDevice = await RNBluetoothClassic.accept({ delimiter: '\n' });
    this.connectedDevice = serverDevice;

    this.onMessage({ type: 'PLAYER_JOINED', playerName: serverDevice.name ?? 'Jugador' });

    this.listenToDevice(serverDevice);
  }

  async searchDevices(): Promise<BluetoothDevice[]> {
    const hasPermission = await this.requestBluetoothPermissions();
    if (!hasPermission) throw new Error('Bluetooth permissions not granted');

    console.log('🔍 Buscando dispositivos Bluetooth emparejados...');
    const devices = await RNBluetoothClassic.getBondedDevices();

    return devices.map(d => ({
      id: d.id,
      name: d.name,
      address: d.address,
    }));
  }

  async connectToDevice(deviceId: string): Promise<void> {
    console.log('🔗 Conectando a dispositivo:', deviceId);

    const device = await RNBluetoothClassic.connectToDevice(deviceId, { delimiter: '\n' });
    this.connectedDevice = device;
    this.isHost = false;

    this.listenToDevice(device);
    console.log('✅ Conectado a:', device.name);
  }

  private listenToDevice(device: BTDevice) {
    const sub = device.onDataReceived(event => {
      try {
        // Para esta versión el campo es "message"
        const raw = (event as any).message ?? (event as any).data;
        const message = JSON.parse(raw) as GameMessage;
        this.onMessage(message);
      } catch (err) {
        console.error('❌ Error interpretando mensaje:', err);
      }
    });

    this.subscriptions.push(sub);
  }

  async sendMessage(message: GameMessage): Promise<void> {
    if (!this.connectedDevice) throw new Error('Not connected to any device');

    console.log('📤 Enviando mensaje:', message);
    await this.connectedDevice.write(JSON.stringify(message) + '\n');
  }

  onMessageReceived(callback: (message: GameMessage) => void): void {
    this.messageCallback = callback;
  }

  private onMessage(message: GameMessage): void {
    console.log('📥 Mensaje recibido:', message);
    if (this.messageCallback) this.messageCallback(message);
  }

  async disconnect(): Promise<void> {
    console.log('🔌 Desconectando...');

    this.subscriptions.forEach(s => s.remove());
    this.subscriptions = [];

    if (this.connectedDevice) {
      try {
        await this.connectedDevice.disconnect();
      } catch {
        console.warn('⚠️ Error al desconectar desde el dispositivo');
      }
    }

    this.connectedDevice = null;
    this.isHost = false;
    this.messageCallback = null;
  }

  isConnected(): boolean {
    return this.connectedDevice != null;
  }

  isHostDevice(): boolean {
    return this.isHost;
  }
}

export default new BluetoothService();
