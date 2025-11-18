// components/GameModeSelector.tsx
import { useLanguage } from '@/contexts/LanguageContext';
import BluetoothService from '@/services/BluetoothService';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface Props {
  visible: boolean;
  onClose: () => void;
}

type DeviceItem = { id: string; name?: string; address?: string };

export default function GameModeSelector({ visible, onClose }: Props) {
  const { t } = useLanguage();
  const router = useRouter();

  const [selectedMode, setSelectedMode] = useState<'single' | 'multi' | null>(null);
  const [multiplayerStep, setMultiplayerStep] =
    useState<'select' | 'host' | 'join'>('select');
  const [isBusy, setIsBusy] = useState(false);
  const [devices, setDevices] = useState<DeviceItem[]>([]);
  const [connectedPlayer, setConnectedPlayer] = useState<string | null>(null);

  // 📡 Listener global de mensajes
  useEffect(() => {
    const cb = (msg: any) => {
      if (!msg) return;

      // Invitado se unió → actualizar UI del host
      if (msg.type === 'PLAYER_JOINED') {
        setConnectedPlayer(msg.playerName ?? 'Jugador');
      }

      // Host decide iniciar juego → ambos entran
      if (msg.type === 'GAME_START') {
        onClose();
        router.push({ pathname: '/game', params: { mode: 'multi' } });
      }
    };

    BluetoothService.onMessageReceived(cb);
    return () => BluetoothService.onMessageReceived(() => {});
  }, [router, onClose]);

  // Cuando se cierra el modal → limpiar todo
  useEffect(() => {
    if (!visible) {
      setSelectedMode(null);
      setMultiplayerStep('select');
      setDevices([]);
      setConnectedPlayer(null);
      setIsBusy(false);
    }
  }, [visible]);

  // ─────────────────────────────
  // 🔹 MODO SINGLE PLAYER
  // ─────────────────────────────
  const handleSinglePlayer = () => {
    onClose();
    router.push({ pathname: '/game', params: { mode: 'single' } });
  };

  // ─────────────────────────────
  // 🔹 ENTRAR A MENÚ MULTIJUGADOR
  // ─────────────────────────────
  const handleMultiplayer = () => {
    setSelectedMode('multi');
    setMultiplayerStep('select');
  };

  // ─────────────────────────────
  // 🔹 HOST (Servidor)
  // ─────────────────────────────
  const handleHost = async () => {
    setMultiplayerStep('host');
    setIsBusy(true);
    try {
      await BluetoothService.startServer();
    } catch (e: any) {
      Alert.alert('Error', e?.message ?? String(e));
      setMultiplayerStep('select');
    } finally {
      setIsBusy(false);
    }
  };

  const startGameAsHost = async () => {
    try {
      await BluetoothService.sendMessage({ type: 'GAME_START' });
      onClose();
      router.push({ pathname: '/game', params: { mode: 'multi' } });
    } catch {
      Alert.alert('Error', 'No se pudo iniciar la partida');
    }
  };

  // ─────────────────────────────
  // 🔹 CLIENTE / INVITADO
  // ─────────────────────────────
  const handleJoin = async () => {
    setMultiplayerStep('join');
    setIsBusy(true);
    try {
      const found = await BluetoothService.searchDevices();
      setDevices(found);
    } catch (e: any) {
      Alert.alert('Error', e?.message ?? String(e));
      setMultiplayerStep('select');
    } finally {
      setIsBusy(false);
    }
  };

  const connectTo = async (dev: DeviceItem) => {
    setIsBusy(true);
    try {
      await BluetoothService.connectToDevice(dev.id);
      // El host enviará GAME_START, así que aquí no navegamos
    } catch (e: any) {
      Alert.alert('Error al conectar', e?.message ?? String(e));
    } finally {
      setIsBusy(false);
    }
  };

  // ─────────────────────────────
  // 🔹 BOTÓN ATRÁS
  // ─────────────────────────────
  const handleBack = () => {
    if (multiplayerStep === 'select') {
      setSelectedMode(null);
      return;
    }
    setMultiplayerStep('select');
    setDevices([]);
    setConnectedPlayer(null);
    setIsBusy(false);
  };

  // ─────────────────────────────
  // 🔹 RENDERIZADOS
  // ─────────────────────────────
  const renderMainMenu = () => (
    <>
      <Text style={styles.title}>{t('gameMode.title')}</Text>

      <TouchableOpacity style={styles.modeCard} onPress={handleSinglePlayer}>
        <View style={[styles.iconContainer, { backgroundColor: '#4CAF50' }]}>
          <Ionicons name="person" size={40} color="#fff" />
        </View>
        <View style={styles.modeInfo}>
          <Text style={styles.modeTitle}>{t('gameMode.singlePlayer')}</Text>
          <Text style={styles.modeDesc}>{t('gameMode.singlePlayerDesc')}</Text>
        </View>
        <Ionicons name="chevron-forward" size={24} color="#ccc" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.modeCard} onPress={handleMultiplayer}>
        <View style={[styles.iconContainer, { backgroundColor: '#2196F3' }]}>
          <Ionicons name="people" size={40} color="#fff" />
        </View>
        <View style={styles.modeInfo}>
          <Text style={styles.modeTitle}>{t('gameMode.multiplayer')}</Text>
          <Text style={styles.modeDesc}>{t('gameMode.multiplayerDesc')}</Text>
        </View>
        <Ionicons name="chevron-forward" size={24} color="#ccc" />
      </TouchableOpacity>
    </>
  );

  const renderMultiplayerSelect = () => (
    <>
      <TouchableOpacity style={styles.backButton} onPress={handleBack}>
        <Ionicons name="arrow-back" size={24} color="#333" />
      </TouchableOpacity>

      <Text style={styles.title}>{t('gameMode.multiplayer')}</Text>

      <TouchableOpacity style={styles.modeCard} onPress={handleHost}>
        <View style={[styles.iconContainer, { backgroundColor: '#FF9800' }]}>
          <Ionicons name="wifi" size={40} color="#fff" />
        </View>
        <View style={styles.modeInfo}>
          <Text style={styles.modeTitle}>{t('gameMode.host')}</Text>
          <Text style={styles.modeDesc}>{t('gameMode.hostDesc')}</Text>
        </View>
        <Ionicons name="chevron-forward" size={24} color="#ccc" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.modeCard} onPress={handleJoin}>
        <View style={[styles.iconContainer, { backgroundColor: '#9C27B0' }]}>
          <Ionicons name="search" size={40} color="#fff" />
        </View>
        <View style={styles.modeInfo}>
          <Text style={styles.modeTitle}>{t('gameMode.join')}</Text>
          <Text style={styles.modeDesc}>{t('gameMode.joinDesc')}</Text>
        </View>
        <Ionicons name="chevron-forward" size={24} color="#ccc" />
      </TouchableOpacity>
    </>
  );

  const renderHostWaiting = () => (
    <>
      <TouchableOpacity style={styles.backButton} onPress={handleBack}>
        <Ionicons name="arrow-back" size={24} color="#333" />
      </TouchableOpacity>

      <View style={styles.centerContent}>
        <Ionicons name="bluetooth" size={80} color="#2196F3" />

        <Text style={styles.waitingText}>{t('gameMode.waiting')}</Text>
        <Text style={styles.waitingSubtext}>
          {connectedPlayer
            ? `${connectedPlayer} conectado`
            : 'Esperando jugador...'}
        </Text>

        {isBusy && (
          <ActivityIndicator
            size="large"
            color="#2196F3"
            style={styles.loader}
          />
        )}

        {connectedPlayer && (
          <TouchableOpacity style={styles.startBtn} onPress={startGameAsHost}>
            <Text style={styles.startBtnText}>{t('gameMode.startNow')}</Text>
          </TouchableOpacity>
        )}
      </View>
    </>
  );

  const renderJoinSearching = () => (
    <>
      <TouchableOpacity style={styles.backButton} onPress={handleBack}>
        <Ionicons name="arrow-back" size={24} color="#333" />
      </TouchableOpacity>

      <View style={styles.centerContent}>
        <Ionicons name="search-circle" size={80} color="#9C27B0" />

        <Text style={styles.waitingText}>{t('gameMode.searching')}</Text>

        <View style={styles.devicesList}>
          <Text style={styles.devicesTitle}>Dispositivos:</Text>

          {devices.length === 0 ? (
            <Text style={{ textAlign: 'center', color: '#666' }}>(Vacío)</Text>
          ) : (
            devices.map((d) => (
              <TouchableOpacity
                key={d.id}
                style={styles.deviceCard}
                onPress={() => connectTo(d)}
              >
                <Ionicons name="phone-portrait" size={24} color="#333" />
                <Text style={styles.deviceName}>
                  {d.name ?? d.address ?? d.id}
                </Text>
                <Ionicons name="chevron-forward" size={20} color="#ccc" />
              </TouchableOpacity>
            ))
          )}
        </View>

        {isBusy && (
          <ActivityIndicator
            size="large"
            color="#9C27B0"
            style={styles.loader}
          />
        )}
      </View>
    </>
  );

  // ─────────────────────────────
  // 🔹 RETURN
  // ─────────────────────────────
  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close-circle" size={32} color="#E53935" />
          </TouchableOpacity>

          {!selectedMode && renderMainMenu()}

          {selectedMode === 'multi' && multiplayerStep === 'select' && renderMultiplayerSelect()}

          {selectedMode === 'multi' && multiplayerStep === 'host' && renderHostWaiting()}

          {selectedMode === 'multi' && multiplayerStep === 'join' && renderJoinSearching()}
        </View>
      </View>
    </Modal>
  );
}

// ─────────────────────────────
// 🔹 ESTILOS
// ─────────────────────────────
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 25,
    width: '90%',
    maxHeight: '85%',
  },
  closeButton: { position: 'absolute', top: 15, right: 15, zIndex: 10 },
  backButton: { marginBottom: 15 },
  title: {
    fontSize: 26,
    fontWeight: '900',
    color: '#333',
    textAlign: 'center',
    marginBottom: 30,
  },
  modeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    padding: 15,
    borderRadius: 15,
    marginBottom: 15,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  modeInfo: { flex: 1 },
  modeTitle: { fontSize: 18, fontWeight: '800', color: '#333', marginBottom: 5 },
  modeDesc: { fontSize: 14, color: '#666' },
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  loader: { marginVertical: 20 },
  waitingText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#333',
    marginTop: 15,
    textAlign: 'center',
  },
  waitingSubtext: {
    fontSize: 16,
    color: '#777',
    marginTop: 5,
    textAlign: 'center',
  },
  devicesList: { width: '100%', marginTop: 20 },
  devicesTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 10,
  },
  deviceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7F7F7',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  deviceName: { flex: 1, fontSize: 16, color: '#333', marginLeft: 15 },
  startBtn: {
    marginTop: 30,
    backgroundColor: '#27AE60',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 8,
  },
  startBtnText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 18,
  },
});
