# Vettri TN — Citizen Super App

**Tamil Nadu's Digital Governance Platform**
Inspired by TVK's vision for a modern, transparent Tamil Nadu — similar to Dubai Now & TAMM Abu Dhabi.

---

## TVK Official Brand Colors

| Role            | Color Name   | Hex Code    | Usage                          |
|-----------------|-------------|-------------|-------------------------------|
| Primary         | TVK Red      | `#C41E3A`  | Headers, CTAs, splash bg       |
| Primary Dark    | TVK Maroon   | `#8B0000`  | Status bar, deep accents       |
| Accent          | TVK Yellow   | `#F5C518`  | Badges, highlights, logo ring  |
| Accent Dark     | TVK Gold     | `#C9A000`  | Text on yellow backgrounds     |

> **Flag Reference:** The TVK flag has Maroon-Red at top & bottom with Golden Yellow in the center, featuring a Vaagai flower and two elephants.

---

## Features

| Screen           | Description                                              |
|-----------------|-----------------------------------------------------------|
| Splash Screen   | Animated TVK-branded launch screen                       |
| Home Dashboard  | Citizen stats, quick actions, activity feed              |
| Citizen ID Card | Digital ID with QR code for identity verification        |
| Documents       | All govt certificates with status & download             |
| AI Chat         | GPT-4 powered assistant for govt service queries         |
| Grievances      | File & track complaints with department routing          |
| Welfare Schemes | Browse, check eligibility & enroll in schemes            |
| Services        | 6 service categories with request tracking               |
| Profile         | Complete citizen profile with civic information          |

---

## Tech Stack

| Layer        | Technology                                              |
|-------------|----------------------------------------------------------|
| Mobile      | Expo SDK 55 + React Native 0.83 + TypeScript            |
| Navigation  | Expo Router (typed file-based routes + tabs + stack)    |
| AI Chatbot  | OpenAI GPT-4o via `openai` npm package                  |
| State       | React hooks (useState, useCallback, useRef)             |
| Storage     | AsyncStorage for chat history                           |
| Styling     | StyleSheet API with centralized TVK theme               |

---

## Project Structure

```
VettriTN/
├── app/                             # Expo Router routes and layouts
├── index.js                         # Expo Router entry point
├── app.json                         # Expo app config
├── package.json                     # Dependencies
├── tsconfig.json                    # TypeScript config
├── babel.config.js                  # Babel + path aliases
├── .env.example                     # Environment variables template
│
├── src/
│   ├── theme/
│   │   ├── colors.ts               # TVK color palette
│   │   ├── typography.ts           # Font styles & spacing
│   │   └── index.ts                # Barrel export
│   │
│   ├── components/
│   │   ├── Badge.tsx               # Status badge component
│   │   ├── Card.tsx                # Surface card component
│   │   └── PrimaryButton.tsx       # Button (filled/outline/ghost)
│   │
│   ├── services/
│   │   └── aiService.ts            # OpenAI GPT-4 integration
│   │
│   └── screens/
│       ├── SplashScreen.tsx        # Animated TVK launch screen
│       ├── HomeScreen.tsx          # Dashboard
│       ├── DocumentsScreen.tsx     # Govt certificates
│       ├── ChatScreen.tsx          # AI chatbot
│       ├── GrievancesScreen.tsx    # File & track complaints
│       ├── SchemesScreen.tsx       # Welfare schemes
│       └── OtherScreens.tsx        # CitizenID, Services, Profile
│
├── android/
│   └── app/src/main/
│       ├── java/com/vettritn/
│       │   └── MainActivity.kt     # Splash → App theme switch
│       └── res/
│           ├── values/
│           │   ├── colors.xml      # TVK color resources
│           │   └── styles.xml      # SplashTheme + AppTheme
│           └── drawable/
│               └── launch_background.xml  # TVK Red background
│
└── ios/VettriTN/
    ├── LaunchScreen.storyboard     # iOS TVK branded splash
    └── Info.plist                  # Permissions + launch config
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- Expo Go on device or Android Studio / Xcode
- JDK 17 if you plan to prebuild native projects

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment

```bash
cp .env.example .env
# Edit .env and add your Expo-compatible OpenAI key for local demos
```

### 3. Run on Android

```bash
npm run android
```

### 4. Run on iOS

```bash
npm run ios
```

### 5. Run on Web

```bash
npm run web
```

---

## AI Chatbot Setup

The Vettri AI chatbot uses OpenAI GPT-4o with a Tamil Nadu government knowledge base:

1. Get an API key from [platform.openai.com](https://platform.openai.com/api-keys)
2. Add it to your `.env` file: `EXPO_PUBLIC_OPENAI_API_KEY=sk-...`
3. For production, move the OpenAI request behind your own backend instead of shipping a public client key
3. The chatbot falls back to offline responses if the API is unavailable

**Cost estimate:** ~₹0.05 per conversation (GPT-4o pricing)
**For production:** Use RAG with a vector DB of TN govt scheme documents

---

## Launch Screen Colors

### Android
The splash theme is defined in `res/values/styles.xml`:
- **Background:** `#C41E3A` (TVK Red) via `launch_background.xml`
- **Status bar:** `#8B0000` (TVK Maroon)

### iOS
Defined in `LaunchScreen.storyboard`:
- **Background color:** RGB (0.769, 0.118, 0.227) = `#C41E3A`
- **Logo ring:** RGB (0.961, 0.773, 0.094) = `#F5C518`
- **Status bar style:** `UIStatusBarStyleLightContent` (white icons)

---

## Roadmap

- [ ] Aadhaar OTP authentication via DigiLocker API
- [ ] Real Tamil Nadu govt API integrations
- [ ] Push notifications for grievance updates & scheme payments
- [ ] Tamil language UI support (i18n)
- [ ] Offline document caching
- [ ] Biometric login
- [ ] LangChain RAG with TN govt scheme documents vector store
- [ ] Web version with Next.js (shared business logic)

---

## Contributing

Built with ❤️ for Tamil Nadu by a TVK member-developer.
This is a civic tech initiative — not an official government application.

**Contact:** tksubhashraj14@gmail.com
**LinkedIn:** linkedin.com/in/tksubhashraj
