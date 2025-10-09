// app/profile.tsx
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Alert, Modal, ScrollView, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  
  const [userData, setUserData] = useState({
    name: 'Estudiante FESC',
    email: 'estudiante@fesc.edu.co',
    career: 'Ingeniería de Sistemas',
    semester: '5°',
  });

  const [settings, setSettings] = useState({
    language: 'Español',
    notifications: true,
    sound: true,
    vibration: true,
    darkMode: false,
  });

  const [stats] = useState({
    gamesPlayed: 15,
    totalScore: 850,
    averageScore: 56.7,
    bestScore: 150,
    correctAnswers: 45,
    totalQuestions: 75,
  });

  const handleSave = () => {
    Alert.alert('Perfil actualizado', '¡Tus datos han sido guardados!');
    setIsEditing(false);
  };

  const handleLanguageChange = (lang: string) => {
    setSettings({ ...settings, language: lang });
    Alert.alert('Idioma cambiado', `El idioma se ha cambiado a ${lang}`);
  };

  const handleLogout = () => {
    Alert.alert(
      'Cerrar sesión',
      '¿Estás seguro de que deseas cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Cerrar sesión', style: 'destructive', onPress: () => {
          Alert.alert('Sesión cerrada', 'Has cerrado sesión correctamente');
          setShowSettings(false);
        }},
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Eliminar cuenta',
      '¿Estás seguro? Esta acción no se puede deshacer.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', style: 'destructive', onPress: () => {
          Alert.alert('Cuenta eliminada', 'Tu cuenta ha sido eliminada');
        }},
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Botón de configuración flotante */}
      <TouchableOpacity 
        style={styles.settingsButton}
        onPress={() => setShowSettings(true)}
      >
        <Ionicons name="settings" size={24} color="#fff" />
      </TouchableOpacity>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Sección de foto y nombre */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Ionicons name="person-circle" size={100} color="#E53935" />
          </View>
          
          {isEditing ? (
            <TextInput
              style={styles.nameInput}
              value={userData.name}
              onChangeText={(text) => setUserData({ ...userData, name: text })}
            />
          ) : (
            <Text style={styles.name}>{userData.name}</Text>
          )}
        </View>

        {/* Información del usuario */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>📚 Información Personal</Text>
            <TouchableOpacity onPress={() => isEditing ? handleSave() : setIsEditing(true)}>
              <Ionicons
                name={isEditing ? 'checkmark-circle' : 'create'}
                size={24}
                color="#E53935"
              />
            </TouchableOpacity>
          </View>

          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Ionicons name="mail" size={20} color="#666" />
              {isEditing ? (
                <TextInput
                  style={styles.infoInput}
                  value={userData.email}
                  onChangeText={(text) => setUserData({ ...userData, email: text })}
                />
              ) : (
                <Text style={styles.infoText}>{userData.email}</Text>
              )}
            </View>

            <View style={styles.infoRow}>
              <Ionicons name="school" size={20} color="#666" />
              {isEditing ? (
                <TextInput
                  style={styles.infoInput}
                  value={userData.career}
                  onChangeText={(text) => setUserData({ ...userData, career: text })}
                />
              ) : (
                <Text style={styles.infoText}>{userData.career}</Text>
              )}
            </View>

            <View style={styles.infoRow}>
              <Ionicons name="calendar" size={20} color="#666" />
              {isEditing ? (
                <TextInput
                  style={styles.infoInput}
                  value={userData.semester}
                  onChangeText={(text) => setUserData({ ...userData, semester: text })}
                />
              ) : (
                <Text style={styles.infoText}>Semestre {userData.semester}</Text>
              )}
            </View>
          </View>
        </View>

        {/* Estadísticas */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📊 Estadísticas</Text>
          
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{stats.gamesPlayed}</Text>
              <Text style={styles.statLabel}>Partidas Jugadas</Text>
            </View>

            <View style={styles.statCard}>
              <Text style={styles.statValue}>{stats.bestScore}</Text>
              <Text style={styles.statLabel}>Mejor Puntaje</Text>
            </View>

            <View style={styles.statCard}>
              <Text style={styles.statValue}>{stats.totalScore}</Text>
              <Text style={styles.statLabel}>Puntos Totales</Text>
            </View>

            <View style={styles.statCard}>
              <Text style={styles.statValue}>{stats.averageScore.toFixed(1)}</Text>
              <Text style={styles.statLabel}>Promedio</Text>
            </View>
          </View>

          <View style={styles.accuracyCard}>
            <Text style={styles.accuracyTitle}>Precisión de Respuestas</Text>
            <View style={styles.accuracyBar}>
              <View
                style={[
                  styles.accuracyFill,
                  { width: `${(stats.correctAnswers / stats.totalQuestions) * 100}%` }
                ]}
              />
            </View>
            <Text style={styles.accuracyText}>
              {stats.correctAnswers} correctas de {stats.totalQuestions} preguntas (
              {((stats.correctAnswers / stats.totalQuestions) * 100).toFixed(1)}%)
            </Text>
          </View>
        </View>

        {/* Logros */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🏅 Logros</Text>
          
          <View style={styles.achievementsContainer}>
            <View style={styles.achievementCard}>
              <Text style={styles.achievementIcon}>🎯</Text>
              <Text style={styles.achievementName}>Primera Victoria</Text>
            </View>

            <View style={styles.achievementCard}>
              <Text style={styles.achievementIcon}>🔥</Text>
              <Text style={styles.achievementName}>Racha de 5</Text>
            </View>

            <View style={[styles.achievementCard, styles.achievementLocked]}>
              <Text style={styles.achievementIcon}>👑</Text>
              <Text style={styles.achievementName}>Perfección</Text>
            </View>

            <View style={[styles.achievementCard, styles.achievementLocked]}>
              <Text style={styles.achievementIcon}>⚡</Text>
              <Text style={styles.achievementName}>Velocista</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Modal de Configuración */}
      <Modal
        visible={showSettings}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowSettings(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Header del modal */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>⚙️ Configuración</Text>
              <TouchableOpacity onPress={() => setShowSettings(false)}>
                <Ionicons name="close-circle" size={32} color="#E53935" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalScroll}>
              {/* Idioma */}
              <View style={styles.settingSection}>
                <Text style={styles.settingSectionTitle}>🌐 Idioma</Text>
                <View style={styles.settingCard}>
                  <TouchableOpacity
                    style={[
                      styles.languageOption,
                      settings.language === 'Español' && styles.languageOptionActive
                    ]}
                    onPress={() => handleLanguageChange('Español')}
                  >
                    <Text style={[
                      styles.languageText,
                      settings.language === 'Español' && styles.languageTextActive
                    ]}>
                      🇪🇸 Español
                    </Text>
                    {settings.language === 'Español' && (
                      <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
                    )}
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.languageOption,
                      settings.language === 'English' && styles.languageOptionActive
                    ]}
                    onPress={() => handleLanguageChange('English')}
                  >
                    <Text style={[
                      styles.languageText,
                      settings.language === 'English' && styles.languageTextActive
                    ]}>
                      🇺🇸 English
                    </Text>
                    {settings.language === 'English' && (
                      <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
                    )}
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.languageOption,
                      settings.language === 'Português' && styles.languageOptionActive
                    ]}
                    onPress={() => handleLanguageChange('Português')}
                  >
                    <Text style={[
                      styles.languageText,
                      settings.language === 'Português' && styles.languageTextActive
                    ]}>
                      🇧🇷 Português
                    </Text>
                    {settings.language === 'Português' && (
                      <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
                    )}
                  </TouchableOpacity>
                </View>
              </View>

              {/* Notificaciones y Sonidos */}
              <View style={styles.settingSection}>
                <Text style={styles.settingSectionTitle}>🔔 Notificaciones y Sonido</Text>
                <View style={styles.settingCard}>
                  <View style={styles.switchRow}>
                    <View style={styles.switchInfo}>
                      <Ionicons name="notifications" size={24} color="#666" />
                      <Text style={styles.switchLabel}>Notificaciones</Text>
                    </View>
                    <Switch
                      value={settings.notifications}
                      onValueChange={(value) => setSettings({ ...settings, notifications: value })}
                      trackColor={{ false: '#ccc', true: '#E53935' }}
                      thumbColor={settings.notifications ? '#fff' : '#f4f3f4'}
                    />
                  </View>

                  <View style={styles.switchRow}>
                    <View style={styles.switchInfo}>
                      <Ionicons name="volume-high" size={24} color="#666" />
                      <Text style={styles.switchLabel}>Efectos de sonido</Text>
                    </View>
                    <Switch
                      value={settings.sound}
                      onValueChange={(value) => setSettings({ ...settings, sound: value })}
                      trackColor={{ false: '#ccc', true: '#E53935' }}
                      thumbColor={settings.sound ? '#fff' : '#f4f3f4'}
                    />
                  </View>

                  <View style={styles.switchRow}>
                    <View style={styles.switchInfo}>
                      <Ionicons name="phone-portrait" size={24} color="#666" />
                      <Text style={styles.switchLabel}>Vibración</Text>
                    </View>
                    <Switch
                      value={settings.vibration}
                      onValueChange={(value) => setSettings({ ...settings, vibration: value })}
                      trackColor={{ false: '#ccc', true: '#E53935' }}
                      thumbColor={settings.vibration ? '#fff' : '#f4f3f4'}
                    />
                  </View>
                </View>
              </View>

              {/* Apariencia */}
              <View style={styles.settingSection}>
                <Text style={styles.settingSectionTitle}>🎨 Apariencia</Text>
                <View style={styles.settingCard}>
                  <View style={styles.switchRow}>
                    <View style={styles.switchInfo}>
                      <Ionicons name="moon" size={24} color="#666" />
                      <Text style={styles.switchLabel}>Modo oscuro</Text>
                    </View>
                    <Switch
                      value={settings.darkMode}
                      onValueChange={(value) => setSettings({ ...settings, darkMode: value })}
                      trackColor={{ false: '#ccc', true: '#E53935' }}
                      thumbColor={settings.darkMode ? '#fff' : '#f4f3f4'}
                    />
                  </View>
                </View>
              </View>

              {/* Acerca de */}
              <View style={styles.settingSection}>
                <Text style={styles.settingSectionTitle}>ℹ️ Acerca de</Text>
                <View style={styles.settingCard}>
                  <TouchableOpacity style={styles.infoRow}>
                    <Ionicons name="help-circle" size={24} color="#666" />
                    <Text style={styles.infoText}>Ayuda y soporte</Text>
                    <Ionicons name="chevron-forward" size={20} color="#ccc" />
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.infoRow}>
                    <Ionicons name="document-text" size={24} color="#666" />
                    <Text style={styles.infoText}>Términos y condiciones</Text>
                    <Ionicons name="chevron-forward" size={20} color="#ccc" />
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.infoRow}>
                    <Ionicons name="shield-checkmark" size={24} color="#666" />
                    <Text style={styles.infoText}>Política de privacidad</Text>
                    <Ionicons name="chevron-forward" size={20} color="#ccc" />
                  </TouchableOpacity>

                  <View style={styles.infoRow}>
                    <Ionicons name="information-circle" size={24} color="#666" />
                    <Text style={styles.infoText}>Versión 1.0.0</Text>
                  </View>
                </View>
              </View>

              {/* Acciones de cuenta */}
              <View style={styles.settingSection}>
                <Text style={styles.settingSectionTitle}>👤 Cuenta</Text>
                <View style={styles.settingCard}>
                  <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={handleLogout}
                  >
                    <Ionicons name="log-out" size={24} color="#FF9800" />
                    <Text style={[styles.actionText, { color: '#FF9800' }]}>
                      Cerrar sesión
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={handleDeleteAccount}
                  >
                    <Ionicons name="trash" size={24} color="#F44336" />
                    <Text style={[styles.actionText, { color: '#F44336' }]}>
                      Eliminar cuenta
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  profileHeader: {
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingVertical: 30,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  avatarContainer: {
    marginBottom: 15,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
  },
  nameInput: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    borderBottomWidth: 2,
    borderBottomColor: '#E53935',
    paddingHorizontal: 10,
    paddingVertical: 5,
    minWidth: 200,
    textAlign: 'center',
  },
  section: {
    marginTop: 20,
    paddingHorizontal: 15,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 12,
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  infoText: {
    marginLeft: 15,
    fontSize: 16,
    color: '#555',
    flex: 1,
  },
  infoInput: {
    marginLeft: 15,
    fontSize: 16,
    color: '#555',
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#E53935',
    paddingVertical: 2,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  statCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    width: '48%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '800',
    color: '#E53935',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  accuracyCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  accuracyTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  accuracyBar: {
    height: 12,
    backgroundColor: '#E0E0E0',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 8,
  },
  accuracyFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 6,
  },
  accuracyText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  achievementsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  achievementCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    width: '48%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  achievementLocked: {
    opacity: 0.4,
  },
  achievementIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  achievementName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  settingsButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    backgroundColor: '#E53935',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    maxHeight: '90%',
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
  },
  modalScroll: {
    paddingHorizontal: 20,
  },
  settingSection: {
    marginTop: 20,
  },
  settingSectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 10,
  },
  settingCard: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 5,
  },
  languageOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    marginVertical: 5,
    marginHorizontal: 5,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  languageOptionActive: {
    borderColor: '#4CAF50',
    backgroundColor: '#F1F8F4',
  },
  languageText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  languageTextActive: {
    color: '#333',
    fontWeight: '700',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    marginVertical: 5,
    marginHorizontal: 5,
    borderRadius: 10,
  },
  switchInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  switchLabel: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },

  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    marginVertical: 5,
    marginHorizontal: 5,
    borderRadius: 10,
    gap: 12,
  },
  actionText: {
    fontSize: 16,
    fontWeight: '600',
  },
});