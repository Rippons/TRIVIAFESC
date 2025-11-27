// app/login.tsx
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { supabase } from '@/lib/supabase';
import { useLanguage } from '@/contexts/LanguageContext';

type AuthMode = 'login' | 'signup';

export default function Login() {
  const { t } = useLanguage();
  const [mode, setMode] = useState<AuthMode>('login');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // 🔹 Campos extra para el registro
  const [fullName, setFullName] = useState('');
  const [age, setAge] = useState('');
  const [career, setCareer] = useState('');
  const [semester, setSemester] = useState('');

  const [loading, setLoading] = useState(false);

  const isLogin = mode === 'login';

  async function handleSubmit() {
    if (!email || !password) {
      Alert.alert('Error', t('auth.missingFields') ?? 'Completa todos los campos');
      return;
    }

    // Validaciones extra solo en registro
    if (!isLogin) {
      if (!fullName || !career) {
        Alert.alert(
          'Error',
          'Nombre y carrera son obligatorios para crear la cuenta.'
        );
        return;
      }
    }

    try {
      setLoading(true);

      if (isLogin) {
        // ───── LOGIN ─────
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          Alert.alert('Error', error.message);
          return;
        }
        // useAuth + RootNavigator se encargan del redirect
      } else {
        // ───── SIGNUP ─────
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              age: age ? Number(age) : null,
              career,
              semester,
            },
          },
        });

        if (error) {
          Alert.alert('Error', error.message);
          return;
        }

        // Si hay confirmación por email, normalmente no hay sesión directa
        if (!data.session) {
          Alert.alert(
            t('auth.signupSuccessTitle') ?? 'Cuenta creada',
            t('auth.signupSuccessMessage') ??
            'Revisa tu correo para confirmar la cuenta antes de iniciar sesión.'
          );
          // volvemos al modo login
          setMode('login');
          setPassword('');
        }
      }
    } catch (e: any) {
      Alert.alert('Error inesperado', e?.message ?? 'Intenta de nuevo');
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {isLogin
          ? t('auth.title') ?? 'Iniciar sesión'
          : t('auth.signupTitle') ?? 'Crear cuenta'}
      </Text>

      {/* Campos extra solo al crear cuenta */}
      {!isLogin && (
        <>
          <Text style={styles.label}>{t('auth.fullName') ?? 'Nombre completo'}</Text>
          <TextInput
            style={styles.input}
            placeholder={t('auth.fullName') ?? 'Nombre completo'}
            value={fullName}
            onChangeText={setFullName}
          />
          <Text style={styles.label}>{t('auth.age') ?? 'Edad'}</Text>
          <TextInput
            style={styles.input}
            placeholder={t('auth.age') ?? 'Edad'}
            keyboardType="numeric"
            value={age}
            onChangeText={setAge}
          />
          <Text style={styles.label}>{t('profile.career') ?? 'Carrera'}</Text>
          <TextInput
            style={styles.input}
            placeholder={t('profile.career') ?? 'Carrera'}
            value={career}
            onChangeText={setCareer}
          />
          <Text style={styles.label}>{t('profile.semester') ?? 'Semestre (ej: 5°)'}</Text>
          <TextInput
            style={styles.input}
            placeholder={t('profile.semester') ?? 'Semestre (ej: 5°)'}
            value={semester}
            onChangeText={setSemester}
          />
        </>
      )}

      <Text style={styles.label}>{t('auth.email') ?? 'Email'}</Text>
      <TextInput
        style={styles.input}
        placeholder={t('auth.email') ?? 'Email'}
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />
      <Text style={styles.label}>{t('auth.password') ?? 'Contraseña'}</Text>
      <TextInput
        style={styles.input}
        placeholder={t('auth.password') ?? 'Contraseña'}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity
        style={[styles.button, loading && { opacity: 0.7 }]}
        onPress={handleSubmit}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading
            ? isLogin
              ? (t('auth.loading') ?? 'Entrando...')
              : (t('auth.signupLoading') ?? 'Creando cuenta...')
            : isLogin
              ? (t('auth.loginButton') ?? 'Entrar')
              : (t('auth.signupButton') ?? 'Crear cuenta')}
        </Text>
      </TouchableOpacity>

      {/* Toggle entre Login / Registro */}
      <TouchableOpacity
        style={styles.toggleContainer}
        onPress={() => setMode(isLogin ? 'signup' : 'login')}
        disabled={loading}
      >
        <Text style={styles.toggleText}>
          {isLogin
            ? t('auth.noAccount') ?? '¿No tienes cuenta? Crear una'
            : t('auth.haveAccount') ?? '¿Ya tienes cuenta? Inicia sesión'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: '#F7FFF7',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 24,
    textAlign: 'center',
    color: '#333',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
    color: '#444',
    marginTop: 10,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  button: {
    backgroundColor: '#E53935',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600'
  },
  toggleContainer: {
    marginTop: 16,
    alignItems: 'center',
  },
  toggleText: {
    color: '#E53935',
    fontSize: 14,
    fontWeight: '500',
  },
});
