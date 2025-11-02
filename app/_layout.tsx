// app/_layout.tsx
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { LanguageProvider, useLanguage } from '../contexts/LanguageContext';

function TabsLayout() {
  const { t } = useLanguage();

  return (
    <Tabs
      screenOptions={{
        headerStyle: {
          backgroundColor: '#E53935',
        },
        headerTintColor: '#fff',
        headerTitleAlign: 'center',
        headerTitleStyle: {
          fontSize: 24,
          fontWeight: '700',
        },
        tabBarActiveTintColor: '#E53935',
        tabBarInactiveTintColor: '#999',
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#E0E0E0',
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="leaderboard"
        options={{
          title: t('tabs.leaderboard'),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="trophy" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="index"
        options={{
          title: t('tabs.home'),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: t('tabs.profile'),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />

      {/* Pantallas sin tabs (ocultas de la barra de navegación) */}
      <Tabs.Screen
        name="game"
        options={{
          href: null,
          title: t('game.title'),
        }}
      />

      <Tabs.Screen
        name="gameover"
        options={{
          href: null,
          title: 'Game Over',
        }}
      />
    </Tabs>
  );
}

export default function Layout() {
  return (
    <LanguageProvider>
      <TabsLayout />
    </LanguageProvider>
  );
}