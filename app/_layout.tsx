// app/_layout.tsx
import { Stack } from 'expo-router';
import React from 'react';

export default function Layout() {
  return (
   <Stack
  screenOptions={{
    headerStyle: {
      backgroundColor: '#E53935',
    },
    headerTintColor: '#fff',
    headerTitleAlign: 'center', 
    headerTitleStyle: {
      fontFamily: 'Pixelify Sans', 
      fontSize: 30,
      fontWeight: 'normal', 
    },
  }}
>
  <Stack.Screen 
    name="index" 
    options={{ 
      title: 'Inicio',
    }} 
  />

  <Stack.Screen 
    name="game" 
    options={{ 
      title: 'Juego',
    }} 
  />

  <Stack.Screen 
    name="gameover" 
    options={{ 
      title: 'Game Over',
    }} 
  />
</Stack>
  );
}