// app/profile.tsx
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/lib/supabase';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function Profile() {
  const { t, language, setLanguage } = useLanguage();
  const router = useRouter();

  const [isEditing, setIsEditing] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const [userData, setUserData] = useState({
    name: t('profile.studentName'),
    email: 'estudiante@fesc.edu.co',
    career: 'Ingeniería de Sistemas',
    semester: '5°',
    age: '18',            // 👈 nuevo
  });


  const [settings, setSettings] = useState({
    notifications: true,
    sound: true,
    vibration: true,
    darkMode: false,
  });

  // 🔹 stats base: dejamos correctAnswers/totalQuestions ESTÁTICOS
  const [stats, setStats] = useState({
    gamesPlayed: 15,
    totalScore: 850,
    averageScore: 56.7,
    bestScore: 150,
    correctAnswers: 45,
    totalQuestions: 75,
  });

  // ─────────────────────────────
  // Cargar usuario + puntuaciones desde Supabase
  // ─────────────────────────────
  useEffect(() => {
    async function loadUserAndScores() {
      // Usuario logueado
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.log('Error cargando usuario:', error.message);
        return;
      }
      const user = data.user;
      if (!user) return;

      // 👤 Datos de perfil desde user_metadata (si existen)
      setUserData(prev => ({
        ...prev,
        name:
          (user.user_metadata?.full_name as string | undefined) ??
          (user.user_metadata?.name as string | undefined) ??
          prev.name,
        email: user.email ?? prev.email,
        career: (user.user_metadata?.career as string | undefined) ?? prev.career,
        semester: (user.user_metadata?.semester as string | undefined) ?? prev.semester,
        age:
          user.user_metadata?.age !== undefined && user.user_metadata?.age !== null
            ? String(user.user_metadata?.age)
            : prev.age,
      }));


      // 🏆 Cargar puntuaciones desde tabla "scores"
      const { data: scoresData, error: scoresError } = await supabase
        .from('scores')
        .select('score')
        .eq('user_id', user.id);

      if (scoresError) {
        console.log('Error cargando scores:', scoresError.message);
        return;
      }

      if (!scoresData || scoresData.length === 0) {
        // si nunca ha jugado, dejamos las stats por defecto
        return;
      }

      const gamesPlayed = scoresData.length;
      const totalScore = scoresData.reduce(
        (sum: number, row: any) => sum + (row.score ?? 0),
        0,
      );
      const bestScore = Math.max(...scoresData.map((row: any) => row.score ?? 0));
      const averageScore = totalScore / gamesPlayed;

      setStats(prev => ({
        ...prev,
        gamesPlayed,
        totalScore,
        bestScore,
        averageScore,
      }));
    }

    loadUserAndScores();
  }, []);

  const handleSave = async () => {
    try {
      // Guardar en metadatos del usuario en Supabase
      const { error } = await supabase.auth.updateUser({
        data: {
          full_name: userData.name,
          career: userData.career,
          semester: userData.semester,
          age: userData.age ? Number(userData.age) : null,  // 👈 nuevo
        },
      });

      if (error) {
        Alert.alert('Error', error.message);
        return;
      }

      Alert.alert(t('profile.profileUpdated'), t('profile.profileUpdatedMessage'));
      setIsEditing(false);
    } catch (e: any) {
      Alert.alert('Error', e?.message ?? 'No se pudo guardar el perfil');
    }
  };

  const handleLanguageChange = async (lang: 'es' | 'en' | 'pt') => {
    await setLanguage(lang);
    const langNames = {
      es: 'Español',
      en: 'English',
      pt: 'Português',
    };
    Alert.alert(
      t('settings.languageChanged'),
      `${t('settings.languageChangedMessage')} ${langNames[lang]}`,
    );
  };

  const handleLogout = () => {
    Alert.alert(
      t('settings.logout'),
      t('settings.logoutConfirm'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('settings.logout'),
          style: 'destructive',
          onPress: async () => {
            // 1) Cerrar sesión en Supabase
            const { error } = await supabase.auth.signOut();

            if (error) {
              Alert.alert('Error', error.message);
              return;
            }

            // 2) Mensaje de éxito
            Alert.alert(
              t('settings.logoutSuccess'),
              t('settings.logoutSuccessMessage')
            );

            // 3) Cerrar el modal de ajustes
            setShowSettings(false);

            // 4) Forzar navegación al login
            router.replace('/login');
          },
        },
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(t('settings.deleteAccount'), t('settings.deleteConfirm'), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('settings.deleteAccount'),
        style: 'destructive',
        onPress: () => {
          // Aquí normalmente llamarías a una función backend que borre el usuario.
          Alert.alert(t('settings.accountDeleted'), t('settings.accountDeletedMessage'));
        },
      },
    ]);
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
              onChangeText={text => setUserData({ ...userData, name: text })}
            />
          ) : (
            <Text style={styles.name}>{userData.name}</Text>
          )}
        </View>

        {/* Información del usuario */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t('profile.personalInfo')}</Text>
            <TouchableOpacity
              onPress={() => (isEditing ? handleSave() : setIsEditing(true))}
            >
              <Ionicons
                name={isEditing ? 'checkmark-circle' : 'create'}
                size={24}
                color="#E53935"
              />
            </TouchableOpacity>
          </View>

          <View style={styles.infoCard}>
            <View className="info-row" style={styles.infoRow}>
              <Ionicons name="mail" size={20} color="#666" />
              {isEditing ? (
                <TextInput
                  style={styles.infoInput}
                  value={userData.email}
                  onChangeText={text => setUserData({ ...userData, email: text })}
                  placeholder={t('profile.email')}
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
                  onChangeText={text => setUserData({ ...userData, career: text })}
                  placeholder={t('profile.career')}
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
                  onChangeText={text => setUserData({ ...userData, semester: text })}
                  placeholder={t('profile.semester')}
                />
              ) : (
                <Text style={styles.infoText}>
                  {t('profile.semester')} {userData.semester}
                </Text>
              )}
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="person" size={20} color="#666" />
              {isEditing ? (
                <TextInput
                  style={styles.infoInput}
                  value={userData.age}
                  onChangeText={text => setUserData({ ...userData, age: text })}
                  placeholder={t('profile.age') ?? 'Edad'}
                  keyboardType="numeric"
                />
              ) : (
                <Text style={styles.infoText}>
                  {t('profile.age') ?? 'Edad'}: {userData.age}
                </Text>
              )}
            </View>

          </View>
        </View>

        {/* Estadísticas */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('profile.statistics')}</Text>

          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{stats.gamesPlayed}</Text>
              <Text style={styles.statLabel}>{t('profile.gamesPlayed')}</Text>
            </View>

            <View style={styles.statCard}>
              <Text style={styles.statValue}>{stats.bestScore}</Text>
              <Text style={styles.statLabel}>{t('profile.bestScore')}</Text>
            </View>

            <View style={styles.statCard}>
              <Text style={styles.statValue}>{stats.totalScore}</Text>
              <Text style={styles.statLabel}>{t('profile.totalPoints')}</Text>
            </View>

            <View style={styles.statCard}>
              <Text style={styles.statValue}>{stats.averageScore.toFixed(1)}</Text>
              <Text style={styles.statLabel}>{t('profile.average')}</Text>
            </View>
          </View>

          <View style={styles.accuracyCard}>
            <Text style={styles.accuracyTitle}>{t('profile.accuracy')}</Text>
            <View style={styles.accuracyBar}>
              <View
                style={[
                  styles.accuracyFill,
                  {
                    width: `${(stats.correctAnswers / stats.totalQuestions) * 100}%`,
                  },
                ]}
              />
            </View>
            <Text style={styles.accuracyText}>
              {stats.correctAnswers} {t('profile.correctAnswers')}{' '}
              {stats.totalQuestions} {t('profile.questions')} (
              {((stats.correctAnswers / stats.totalQuestions) * 100).toFixed(1)}%)
            </Text>
          </View>
        </View>

        {/* Logros */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('profile.achievements')}</Text>

          <View style={styles.achievementsContainer}>
            <View style={styles.achievementCard}>
              <Text style={styles.achievementIcon}>🎯</Text>
              <Text style={styles.achievementName}>{t('profile.firstVictory')}</Text>
            </View>

            <View style={styles.achievementCard}>
              <Text style={styles.achievementIcon}>🔥</Text>
              <Text style={styles.achievementName}>{t('profile.streak5')}</Text>
            </View>

            <View style={[styles.achievementCard, styles.achievementLocked]}>
              <Text style={styles.achievementIcon}>👑</Text>
              <Text style={styles.achievementName}>{t('profile.perfection')}</Text>
            </View>

            <View style={[styles.achievementCard, styles.achievementLocked]}>
              <Text style={styles.achievementIcon}>⚡</Text>
              <Text style={styles.achievementName}>{t('profile.speedster')}</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Modal de Configuración (lo dejo exactamente igual) */}
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
              <Text style={styles.modalTitle}>{t('settings.title')}</Text>
              <TouchableOpacity onPress={() => setShowSettings(false)}>
                <Ionicons name="close-circle" size={32} color="#E53935" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalScroll}>
              {/* Idioma */}
              <View style={styles.settingSection}>
                <Text style={styles.settingSectionTitle}>
                  {t('settings.language')}
                </Text>
                <View style={styles.settingCard}>
                  <TouchableOpacity
                    style={[
                      styles.languageOption,
                      language === 'es' && styles.languageOptionActive,
                    ]}
                    onPress={() => handleLanguageChange('es')}
                  >
                    <Text
                      style={[
                        styles.languageText,
                        language === 'es' && styles.languageTextActive,
                      ]}
                    >
                      {t('settings.spanish')}
                    </Text>
                    {language === 'es' && (
                      <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
                    )}
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.languageOption,
                      language === 'en' && styles.languageOptionActive,
                    ]}
                    onPress={() => handleLanguageChange('en')}
                  >
                    <Text
                      style={[
                        styles.languageText,
                        language === 'en' && styles.languageTextActive,
                      ]}
                    >
                      {t('settings.english')}
                    </Text>
                    {language === 'en' && (
                      <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
                    )}
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.languageOption,
                      language === 'pt' && styles.languageOptionActive,
                    ]}
                    onPress={() => handleLanguageChange('pt')}
                  >
                    <Text
                      style={[
                        styles.languageText,
                        language === 'pt' && styles.languageTextActive,
                      ]}
                    >
                      {t('settings.portuguese')}
                    </Text>
                    {language === 'pt' && (
                      <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
                    )}
                  </TouchableOpacity>
                </View>
              </View>

              {/* Notificaciones y Sonidos */}
              <View style={styles.settingSection}>
                <Text style={styles.settingSectionTitle}>
                  {t('settings.notifications')}
                </Text>
                <View style={styles.settingCard}>
                  <View style={styles.switchRow}>
                    <View style={styles.switchInfo}>
                      <Ionicons name="notifications" size={24} color="#666" />
                      <Text style={styles.switchLabel}>
                        {t('settings.notificationsToggle')}
                      </Text>
                    </View>
                    <Switch
                      value={settings.notifications}
                      onValueChange={value =>
                        setSettings({ ...settings, notifications: value })
                      }
                      trackColor={{ false: '#ccc', true: '#E53935' }}
                      thumbColor={settings.notifications ? '#fff' : '#f4f3f4'}
                    />
                  </View>

                  <View style={styles.switchRow}>
                    <View style={styles.switchInfo}>
                      <Ionicons name="volume-high" size={24} color="#666" />
                      <Text style={styles.switchLabel}>
                        {t('settings.sound')}
                      </Text>
                    </View>
                    <Switch
                      value={settings.sound}
                      onValueChange={value =>
                        setSettings({ ...settings, sound: value })
                      }
                      trackColor={{ false: '#ccc', true: '#E53935' }}
                      thumbColor={settings.sound ? '#fff' : '#f4f3f4'}
                    />
                  </View>

                  <View style={styles.switchRow}>
                    <View style={styles.switchInfo}>
                      <Ionicons name="phone-portrait" size={24} color="#666" />
                      <Text style={styles.switchLabel}>
                        {t('settings.vibration')}
                      </Text>
                    </View>
                    <Switch
                      value={settings.vibration}
                      onValueChange={value =>
                        setSettings({ ...settings, vibration: value })
                      }
                      trackColor={{ false: '#ccc', true: '#E53935' }}
                      thumbColor={settings.vibration ? '#fff' : '#f4f3f4'}
                    />
                  </View>
                </View>
              </View>

              {/* Apariencia */}
              <View style={styles.settingSection}>
                <Text style={styles.settingSectionTitle}>
                  {t('settings.appearance')}
                </Text>
                <View style={styles.settingCard}>
                  <View style={styles.switchRow}>
                    <View style={styles.switchInfo}>
                      <Ionicons name="moon" size={24} color="#666" />
                      <Text style={styles.switchLabel}>
                        {t('settings.darkMode')}
                      </Text>
                    </View>
                    <Switch
                      value={settings.darkMode}
                      onValueChange={value =>
                        setSettings({ ...settings, darkMode: value })
                      }
                      trackColor={{ false: '#ccc', true: '#E53935' }}
                      thumbColor={settings.darkMode ? '#fff' : '#f4f3f4'}
                    />
                  </View>
                </View>
              </View>

              {/* Acerca de */}
              <View style={styles.settingSection}>
                <Text style={styles.settingSectionTitle}>
                  {t('settings.about')}
                </Text>
                <View style={styles.settingCard}>
                  <TouchableOpacity style={styles.infoRow}>
                    <Ionicons name="help-circle" size={24} color="#666" />
                    <Text style={styles.infoText}>{t('settings.help')}</Text>
                    <Ionicons name="chevron-forward" size={20} color="#ccc" />
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.infoRow}>
                    <Ionicons name="document-text" size={24} color="#666" />
                    <Text style={styles.infoText}>{t('settings.terms')}</Text>
                    <Ionicons name="chevron-forward" size={20} color="#ccc" />
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.infoRow}>
                    <Ionicons name="shield-checkmark" size={24} color="#666" />
                    <Text style={styles.infoText}>{t('settings.privacy')}</Text>
                    <Ionicons name="chevron-forward" size={20} color="#ccc" />
                  </TouchableOpacity>

                  <View style={styles.infoRow}>
                    <Ionicons name="information-circle" size={24} color="#666" />
                    <Text style={styles.infoText}>
                      {t('settings.version')} 1.0.0
                    </Text>
                  </View>
                </View>
              </View>

              {/* Acciones de cuenta */}
              <View style={styles.settingSection}>
                <Text style={styles.settingSectionTitle}>
                  {t('settings.account')}
                </Text>
                <View style={styles.settingCard}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={handleLogout}
                  >
                    <Ionicons name="log-out" size={24} color="#FF9800" />
                    <Text
                      style={[styles.actionText, { color: '#FF9800' }]}
                    >
                      {t('settings.logout')}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={handleDeleteAccount}
                  >
                    <Ionicons name="trash" size={24} color="#F44336" />
                    <Text
                      style={[styles.actionText, { color: '#F44336' }]}
                    >
                      {t('settings.deleteAccount')}
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
