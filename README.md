# 🎮 TriviaFESC  
Aplicación móvil educativa desarrollada con **React Native + Expo + TypeScript**, conectada a **Supabase** y con modo **multijugador vía Bluetooth**.

---

## 📌 Descripción del proyecto

**TriviaFESC** es una app interactiva diseñada para reforzar conocimientos académicos mediante dinámicas de juego. Incluye preguntas de **ingeniería**, **medicina** y otras áreas, con modos de juego individuales y multijugador.  

Los jugadores pueden competir respondiendo preguntas con tiempo límite, utilizar una ruleta de categoría, ver su perfil, mejorar su puntuación y competir en un leaderboard global.  
El modo multijugador permite que dos personas se conecten mediante **Bluetooth** para una experiencia en tiempo real.

---

## 🚀 Funcionalidades principales

### 🧩 Generales
- Registro e inicio de sesión con **Supabase Auth**
- Sistema de perfiles: foto, nombre, país, puntuación total
- Leaderboard global conectado a la base de datos
- Geolocalización básica

### 🎮 Modo Single Player
- Preguntas por categorías
- Ruleta interactiva para seleccionar categoría
- Contador de vidas
- Contador de tiempo
- Sistema de puntos
- Retroalimentación inmediata

### 👥 Modo Multijugador (Bluetooth)
- Conexión host–invitado
- Sincronización de preguntas
- Envío de estados de juego
- Actualización remota de puntajes
- Partidas en tiempo real sin internet

### ⚙️ Configuración
- Cambios en tema, idioma y notificaciones
- Edición de datos del perfil

### 🏗️ Tecnología
- **React Native + Expo (TypeScript)**
- **Supabase (Auth, DB, Storage)**
- **React Navigation**
- **Zustand o Context API**
- **Bluetooth API / react-native-ble-plx**
- **Expo Location**
- **Expo EAS Build**

---

## 🛠️ Tecnologías utilizadas

| Capa | Tecnología |
|------|------------|
| **Frontend móvil** | React Native, Expo, TypeScript |
| **Estado** | Zustand / Context API |
| **Backend** | Supabase (Auth, PostgREST, Storage) |
| **Base de datos** | PostgreSQL en Supabase |
| **Servicios externos** | Expo Bluetooth, Expo Location |
| **Build** | EAS Build (Android APK) |

---

## 🧱 Arquitectura general

