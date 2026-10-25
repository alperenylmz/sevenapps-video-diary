# Video Diary

Video Diary is a React Native (Expo) app for keeping short video memories. You pick a video from your device library, choose a 5-second segment, trim it on the device and save it with a name and an optional description. Saved clips are stored locally and can be browsed, played, edited and deleted.

## Features

- **Video import** – pick a video from the device library. Videos shorter than 5 seconds are rejected with a clear message.
- **5-second trimming** – drag a scrubber over the source timeline to choose the segment. The selected range loops as a muted preview, and the clip is trimmed natively with `expo-trim-video`.
- **Metadata** – every clip has a required name (max 60 characters) and an optional description (max 280 characters), validated with Zod.
- **Guided creation flow** – a three-step modal: select video, choose segment, add details.
- **Local persistence** – clip metadata is stored in SQLite and trimmed files are kept in the app's document directory, so everything survives app restarts.
- **Clip list with pagination** – the home screen lists clips newest first, loads 20 at a time with keyset pagination and shows generated thumbnails.
- **Playback and details** – the details screen plays the clip with native controls and shows its name, description, date and duration.
- **Editing** – name and description can be updated from the details screen.
- **Deletion** – clips can be deleted after confirmation, which removes both the database record and the video file.
- **Light and dark mode** – the UI follows the system appearance.

## Tech Stack

| Technology | Role |
| --- | --- |
| [Expo](https://expo.dev) SDK 57 / React Native 0.86 | App runtime and native tooling |
| TypeScript | Static typing across the codebase |
| Expo Router | File-based navigation (stack and modal screens) |
| Zustand | Clip list state, pagination and create/update/delete actions |
| TanStack Query | Clip creation mutation, single-clip lookup and thumbnail caching |
| expo-trim-video | Native 5-second video trimming |
| Expo Video | Playback, scrubbing preview and thumbnail generation |
| Expo SQLite | Persistent storage for clip metadata |
| Expo File System | Storing and deleting trimmed video files |
| Expo Image Picker | Selecting a source video from the library |
| NativeWind (Tailwind CSS) | Styling |
| Zod | Name and description validation |
| React Native Reanimated & Gesture Handler | Trim scrubber gesture and light list and form animations |

## Architecture

- **State management** – a Zustand store (`video-store.ts`) holds the loaded clips and pagination flags. Its actions write to SQLite first and then update in-memory state, so the UI always reflects what was persisted.
- **Async operations** – TanStack Query wraps the multi-step "trim, save file, insert row" flow as a mutation. If a step fails, the trimmed file is cleaned up. It also caches generated thumbnails and loads a single clip when it isn't already in the store.
- **SQLite persistence** – `src/db/database.ts` opens the database lazily, enables WAL and runs versioned migrations through `PRAGMA user_version`. `video-repository.ts` contains all SQL queries.
- **Pagination** – clips are ordered by `(created_at, id)` and fetched with a keyset cursor (`WHERE (created_at, id) < (?, ?)`), backed by a composite index. This keeps paging stable when new clips are added.
- **Video files** – trimmed clips are moved into `<documentDirectory>/videos/` under a generated file name. The database stores only the file name, and the full URI is resolved at runtime.
- **Trimming** – the crop step calculates a start time from the scrubber position, and `trimClip` calls `expo-trim-video` with `start` and `start + 5` seconds.
- **Navigation** – Expo Router stack with the home list (`/`), clip details (`/video/[id]`) and two modal screens: create (`/create`) and edit (`/edit-video`).

## Getting Started

### Requirements

- Node.js 20.19.4+ or 22.13+
- macOS with Xcode and an iOS Simulator
- CocoaPods

This project uses native modules (`expo-trim-video`) and `expo-dev-client`, so it **does not run in Expo Go**. You need a development build.

### Installation

```bash
git clone <repository-url>
cd sevenapps-video-diary
npm install
```

### Run on the iOS Simulator

```bash
npm run ios
```

This runs `expo run:ios`. It generates the native `ios` project, installs the pods, builds the development client, installs it on a simulator and starts Metro. The first build takes a few minutes.

After the development build is installed, you only need Metro for JavaScript changes:

```bash
npm start
```

Then open the installed **sevenapps-video-diary** app on the simulator. It connects to the running dev server.

> The native `ios` and `android` folders are generated and git-ignored. After changing `app.json` (for example the splash screen), regenerate them with `npx expo prebuild --clean` and rebuild with `npm run ios`.

### Android

```bash
npm run android
```

This requires Android Studio with an emulator or a connected device.

### Quality checks

```bash
npm run lint        # ESLint (expo lint)
npx tsc --noEmit    # TypeScript type check
```

## Project Structure

```
src/
├── app/                       # Expo Router screens
│   ├── _layout.tsx            # Root stack, providers, splash handling
│   ├── index.tsx              # Home: paginated clip list
│   ├── create.tsx             # Create clip modal (3 steps)
│   ├── edit-video.tsx         # Edit name/description modal
│   └── video/[id].tsx         # Clip details and playback
├── components/                # Shared UI (AppButton, VideoPlayer, splash overlay)
├── db/
│   └── database.ts            # SQLite connection and migrations
└── features/
    ├── create-video/          # Pick, crop and create-clip mutation
    ├── video-trim/            # expo-trim-video wrapper (5-second clips)
    └── videos/                # Store, repository, storage, schema, list/detail UI
assets/                        # App icon and splash images
```

## Case Study

This project was built as part of the SevenApps React Native case study. SevenApps branding is used only on the splash screen to present the case study.
