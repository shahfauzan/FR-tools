# FR SHAH QuickPanel

**Build. Control. Customize.**

> Developed and engineered by **FR SHAH**.

An open-source Android quick-access toolbox designed for Android 10 through Android 16 (calibrated for the **Moto G75 5G**). It provides instant access to device utilities, screen tools, floating controllers, and a persistent local Room database Smart Clipboard without navigating through multiple applications.

---

## 📱 Features

- **Floating QuickPanel**: Draggable `TYPE_APPLICATION_OVERLAY` button with customizable opacity, size, long-press shortcuts, and position persistence.
- **Swipe-Accessible Edge Panel**: Left/right edge drawer handle with 1-tap clipboard access, quick action shortcuts, and adjustable panel dimensions.
- **Smart Clipboard Manager**:
  - Independent persistent Room database history (`@Entity clipboard_entries`).
  - DJB2 content hashing for instantaneous deduplication.
  - Automatic classification (URLs, Emails, Phone Numbers, Code Snippets, Plain Text).
  - Configurable history capacity (100, 250, 500, or 1000 items) preserving pinned entries.
  - Automatic retention cleanup (1h, 24h, 7d, 30d, Never) protecting pinned items.
  - Android 10+ foreground gating & Android 13+ visual privacy chip overlay.
  - Sensitive credential filter (OTPs, API keys, passwords, PAN numbers).
- **Screenshot Tools**: Viewport and MediaProjection capture workflows saved to `Pictures/FR SHAH QuickPanel/` with history, sharing, and preview.
- **Screen Recorder**: Foreground service (`FOREGROUND_SERVICE_MEDIA_PROJECTION`) capturing display streams to `Movies/FR SHAH QuickPanel/` with audio synchronization and status indicator.
- **Flashlight & Torch**: Hardware `CameraManager.setTorchMode()` with Strobe rate control and SOS distress signals.
- **Volume & Brightness**: Media & ring volume sliders, app window brightness, and `WRITE_SETTINGS` system brightness authorization.
- **Calculator**: Controlled arithmetic expression evaluator without `eval()`, memory registers, and calculation history.
- **Quick Notes**: Offline Room database notes scratchpad with full-text search and pin protection.
- **Stopwatch**: Precision `SystemClock.elapsedRealtime()` stopwatch with millisecond lap tracking and delta comparisons.
- **QR & Barcode Scanner**: CameraX on-demand scanner with safe URL confirmation prompts.
- **App Shortcuts**: Launcher shortcuts adhering to Android 11+ package visibility declarations.
- **Customization Engine**: Reorder tool cards, customize grid columns (2, 3, or 4), adjust panel transparency, and choose monochrome grey/black accent tones.

---

## 🎨 Visual Identity

- **Design Philosophy**: Minimal, industrial, and human-crafted.
- **Color System**: Carbon Black, Graphite Grey, Titanium, and Silver accents. **Zero purple gradients or saturated purple hues**.

---

## 🏗 Architecture & Tech Stack

- **Language**: Kotlin 2.0+
- **UI Framework**: Jetpack Compose (Material 3)
- **Architecture**: Model-View-ViewModel (MVVM) with Unidirectional Data Flow (UDF)
- **Dependency Injection**: Dagger Hilt
- **Persistence**: Room Database (SQLite) & DataStore Preferences
- **Camera & Barcode**: CameraX & ML Kit Barcode Scanning
- **Build System**: Gradle Kotlin DSL (`build.gradle.kts`)
- **Min SDK**: API 29 (Android 10)
- **Target SDK**: API 35 / 36 (Android 15 & Android 16)

---

## 🔒 Permissions & Security

| Permission | Feature | Policy & Justification |
| :--- | :--- | :--- |
| `SYSTEM_ALERT_WINDOW` | Floating QuickPanel | Explicitly requested to display overlay button above apps |
| `CAMERA` | Flashlight & QR Scanner | Requested on-demand only when torch or scanner is active |
| `FOREGROUND_SERVICE_MEDIA_PROJECTION` | Screen Recording | Explicit user consent dialog before screen capture starts |
| `POST_NOTIFICATIONS` | Privacy & Controls | Android 13+ notification channel for recording and clipboard |
| `WRITE_SETTINGS` | System Brightness | Optional special app access; window brightness works without it |

---

## 🚀 Building & Running

```bash
# Clone the repository
git clone https://github.com/shahfauzan/fr-shah-quickpanel.git
cd fr-shah-quickpanel

# Build Debug APK using Gradle wrapper
./gradlew assembleDebug

# Run unit tests
./gradlew testDebugUnitTest
```

---

## 📄 License

Licensed under the Apache License, Version 2.0. Copyright © 2026 **FR SHAH**.
