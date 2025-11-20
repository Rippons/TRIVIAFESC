// app/_layout.tsx
import React, { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { Slot, useRouter, useSegments } from 'expo-router';

import { LanguageProvider } from '../contexts/LanguageContext';
import { useAuth } from '../hooks/useAuth';

function RootNavigator() {
  const { session, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    // El grupo protegido es (tabs)
    const inTabsGroup = segments[0] === '(tabs)';

    if (!session && inTabsGroup) {
      // No logueado y quiere entrar a tabs → mándalo a login
      router.replace('/login');
    } else if (session && !inTabsGroup) {
      // Logueado y en cualquier sitio que no sea tabs → mándalo al home (tabs/index)
      router.replace('/');
    }
  }, [session, loading, segments, router]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }

  // Slot deja que expo-router renderice la ruta que toque (login o (tabs)/...)
  return <Slot />;
}

export default function Layout() {
  return (
    <LanguageProvider>
      <RootNavigator />
    </LanguageProvider>
  );
}
