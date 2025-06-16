# 📘 Nuxt Firebase Nearby Chat App – Phase Plan

This document outlines the phased development approach for a Firebase-powered Nuxt app that allows users to chat with nearby people.

---

## ✅ Phase 1: Core Setup
**Goal:** Authenticate the user anonymously and store their geolocation in Firestore.

### Modules to Implemented:
- Firebase SDK initialization
- Anonymous auth composable (`useAuth.ts`)
- Geolocation fetch composable (`useLocation.ts`)
- Firestore write for user location (`useUsers.ts`)
- Basic login UI (`pages/index.vue`)
- Nearby users listing UI (`pages/nearby.vue`)
- Nuxt config & runtime env

---

## 🚧 Phase 2: Nearby Filtering & Real-time Sync
**Goal:** Improve the listing to show users within a specific radius and reflect changes in real-time.

### 🔧 Tasks:
- [ ] Add Haversine distance filter to `getNearbyUsers()`
- [ ] Display distance in UI (`e.g. 1.2 km away`)
- [ ] Use Firestore `onSnapshot()` for real-time updates
- [ ] Update user's `lastSeen` timestamp every minute

---

## 🔗 Phase 3: Chat Request System
**Goal:** Enable sending, receiving, and accepting chat requests.

### 🔧 Tasks:
- [ ] Create `requests` Firestore collection
- [ ] `sendRequest(toUid)` method in composable
- [ ] Display pending requests (incoming/outgoing)
- [ ] Accept or reject requests via buttons in UI
- [ ] Auto-create chat session if request accepted

---

## 💬 Phase 4: Real-time Messaging
**Goal:** Implement private chat rooms between accepted users.

### 🔧 Tasks:
- [ ] Create `chats` collection (with participants/messages)
- [ ] `useChat.ts` composable to send and receive messages
- [ ] `pages/chat/[chatId].vue` for individual chat room
- [ ] Tailwind-based basic chat UI

---

## 🔐 Phase 5: Security & UX Polishing
**Goal:** Secure and polish the final app for production.

### 🔧 Tasks:
- [ ] Firestore security rules:
  - Allow only logged-in users
  - Limit request spam
  - Hide rejected/expired requests
- [ ] Add loading indicators
- [ ] Add profile name or avatar support
- [ ] Responsive layout, optional dark mode

---

## 📦 Dependencies
```bash
npm install firebase @pinia/nuxt
