/**
 * FR SHAH QuickPanel · Build. Control. Customize.
 * Android Studio Kotlin & Open Source Repository Deliverables Viewer
 * DEVELOPER CREDIT: MADE BY FR SHAH
 */

import React, { useState } from 'react';
import { 
  X, 
  Code2, 
  Download, 
  Copy, 
  Check, 
  FolderGit2, 
  FileCode, 
  Layers, 
  Terminal,
  Cpu 
} from 'lucide-react';

interface AndroidSourceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ANDROID_FILES: { id: string; filename: string; language: string; content: string }[] = [
  {
    id: 'floating_service',
    filename: 'FloatingPanelService.kt',
    language: 'kotlin',
    content: `package com.frshah.quickpanel.service

import android.app.Service
import android.content.Intent
import android.graphics.PixelFormat
import android.os.Build
import android.os.IBinder
import android.view.Gravity
import android.view.MotionEvent
import android.view.View
import android.view.WindowManager
import androidx.compose.ui.platform.ComposeView
import androidx.lifecycle.LifecycleService
import androidx.lifecycle.setViewTreeLifecycleOwner
import androidx.savedstate.setViewTreeSavedStateRegistryOwner
import com.frshah.quickpanel.ui.floating.FloatingBubbleView
import dagger.hilt.android.AndroidEntryPoint

/**
 * FR SHAH QuickPanel
 * Floating Overlay WindowManager Service
 * DEVELOPER CREDIT: MADE BY FR SHAH
 */
@AndroidEntryPoint
class FloatingPanelService : LifecycleService() {

    private lateinit var windowManager: WindowManager
    private var floatingView: View? = null
    private lateinit var layoutParams: WindowManager.LayoutParams

    override fun onCreate() {
        super.onCreate()
        windowManager = getSystemService(WINDOW_SERVICE) as WindowManager
        initFloatingOverlay()
    }

    private fun initFloatingOverlay() {
        val layoutFlag = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY
        } else {
            @Suppress("DEPRECATION")
            WindowManager.LayoutParams.TYPE_PHONE
        }

        layoutParams = WindowManager.LayoutParams(
            WindowManager.LayoutParams.WRAP_CONTENT,
            WindowManager.LayoutParams.WRAP_CONTENT,
            layoutFlag,
            WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE or
                    WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS,
            PixelFormat.TRANSLUCENT
        ).apply {
            gravity = Gravity.TOP or Gravity.START
            x = 80
            y = 240
        }

        val composeView = ComposeView(this).apply {
            setViewTreeLifecycleOwner(this@FloatingPanelService)
            setViewTreeSavedStateRegistryOwner(this@FloatingPanelService)
            setContent {
                FloatingBubbleView(
                    onTap = { expandQuickPanel() },
                    onLongPress = { triggerQuickAction() }
                )
            }
        }

        // Draggable gesture detection
        composeView.setOnTouchListener(object : View.OnTouchListener {
            private var initialX = 0
            private var initialY = 0
            private var initialTouchX = 0f
            private var initialTouchY = 0f

            override fun onTouch(v: View, event: MotionEvent): Boolean {
                when (event.action) {
                    MotionEvent.ACTION_DOWN -> {
                        initialX = layoutParams.x
                        initialY = layoutParams.y
                        initialTouchX = event.rawX
                        initialTouchY = event.rawY
                        return false // Allow click detection
                    }
                    MotionEvent.ACTION_MOVE -> {
                        layoutParams.x = initialX + (event.rawX - initialTouchX).toInt()
                        layoutParams.y = initialY + (event.rawY - initialTouchY).toInt()
                        windowManager.updateViewLayout(floatingView, layoutParams)
                        return true
                    }
                }
                return false
            }
        })

        floatingView = composeView
        windowManager.addView(floatingView, layoutParams)
    }

    private fun expandQuickPanel() {
        // Broadcast expand event to Edge/Dashboard
    }

    private fun triggerQuickAction() {
        // Quick clipboard or flashlight toggle
    }

    override fun onDestroy() {
        super.onDestroy()
        floatingView?.let { windowManager.removeView(it) }
    }
}`
  },
  {
    id: 'recorder_service',
    filename: 'ScreenRecordingService.kt',
    language: 'kotlin',
    content: `package com.frshah.quickpanel.service

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.Service
import android.content.Intent
import android.content.pm.ServiceInfo
import android.media.MediaRecorder
import android.media.projection.MediaProjection
import android.os.Build
import android.os.IBinder
import androidx.core.app.NotificationCompat
import com.frshah.quickpanel.R

/**
 * FR SHAH QuickPanel
 * Foreground Service for Android 14+ MediaProjection Screen Capture
 * DEVELOPER CREDIT: MADE BY FR SHAH
 */
class ScreenRecordingService : Service() {

    private var mediaRecorder: MediaRecorder? = null
    private var mediaProjection: MediaProjection? = null

    companion object {
        const val CHANNEL_ID = "fr_shah_recorder_channel"
        const val NOTIFICATION_ID = 2026
        const val ACTION_START = "ACTION_START"
        const val ACTION_STOP = "ACTION_STOP"
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        when (intent?.action) {
            ACTION_START -> startRecordingForeground()
            ACTION_STOP -> stopRecording()
        }
        return START_NOT_STICKY
    }

    private fun startRecordingForeground() {
        createNotificationChannel()
        val notification = createNotification()

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            val serviceType = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.UPSIDE_DOWN_CAKE) {
                ServiceInfo.FOREGROUND_SERVICE_TYPE_MEDIA_PROJECTION
            } else {
                ServiceInfo.FOREGROUND_SERVICE_TYPE_MEDIA_PROJECTION
            }
            startForeground(NOTIFICATION_ID, notification, serviceType)
        } else {
            startForeground(NOTIFICATION_ID, notification)
        }
    }

    private fun stopRecording() {
        mediaRecorder?.stop()
        mediaRecorder?.release()
        mediaRecorder = null
        stopForeground(STOP_FOREGROUND_REMOVE)
        stopSelf()
    }

    private fun createNotification(): Notification {
        return NotificationCompat.Builder(this, CHANNEL_ID)
            .setContentTitle("FR SHAH QuickPanel · Screen Recording")
            .setContentText("Capturing display stream to Movies/FR SHAH QuickPanel/")
            .setSmallIcon(R.drawable.ic_recorder)
            .setOngoing(true)
            .build()
    }

    private fun createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                CHANNEL_ID,
                "Screen Recorder Service",
                NotificationManager.IMPORTANCE_LOW
            )
            val manager = getSystemService(NotificationManager::class.java)
            manager.createNotificationChannel(channel)
        }
    }

    override fun onBind(intent: Intent?): IBinder? = null
}`
  },
  {
    id: 'room_dao',
    filename: 'ClipboardDao.kt',
    language: 'kotlin',
    content: `package com.frshah.quickpanel.data.local.dao

import androidx.room.*
import com.frshah.quickpanel.data.local.entity.ClipboardEntryEntity
import kotlinx.coroutines.flow.Flow

/**
 * FR SHAH Room Database DAO
 * Indexed local storage for Smart Clipboard Manager
 * DEVELOPER CREDIT: MADE BY FR SHAH
 */
@Dao
interface ClipboardDao {

    @Query("SELECT * FROM clipboard_entries ORDER BY isPinned DESC, createdAt DESC")
    fun getAllEntries(): Flow<List<ClipboardEntryEntity>>

    @Query("SELECT * FROM clipboard_entries WHERE contentHash = :hash LIMIT 1")
    suspend fun getEntryByHash(hash: String): ClipboardEntryEntity?

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertOrUpdate(entry: ClipboardEntryEntity): Long

    @Query("DELETE FROM clipboard_entries WHERE id = :id")
    suspend fun deleteById(id: String): Int

    @Query("DELETE FROM clipboard_entries WHERE isPinned = 0 AND createdAt < :threshold")
    suspend fun cleanupExpired(threshold: Long): Int

    @Query("DELETE FROM clipboard_entries WHERE isPinned = 0")
    suspend fun purgeNonPinned(): Int
}`
  },
  {
    id: 'gradle',
    filename: 'build.gradle.kts',
    language: 'kotlin',
    content: `plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
    alias(libs.plugins.kotlin.compose)
    alias(libs.plugins.hilt.android)
    alias(libs.plugins.ksp)
}

android {
    namespace = "com.frshah.quickpanel"
    compileSdk = 35

    defaultConfig {
        applicationId = "com.frshah.quickpanel"
        minSdk = 29
        targetSdk = 35
        versionCode = 1
        versionName = "1.0.0"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
    }

    buildTypes {
        release {
            isMinifyEnabled = true
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }

    kotlinOptions {
        jvmTarget = "17"
    }

    buildFeatures {
        compose = true
    }
}

dependencies {
    implementation(platform(libs.androidx.compose.bom))
    implementation(libs.androidx.compose.ui)
    implementation(libs.androidx.compose.material3)
    implementation(libs.androidx.datastore.preferences)
    implementation(libs.androidx.room.runtime)
    implementation(libs.androidx.room.ktx)
    ksp(libs.androidx.room.compiler)
    implementation(libs.hilt.android)
    ksp(libs.hilt.compiler)
    implementation(libs.androidx.camera.camera2)
    implementation(libs.androidx.camera.lifecycle)
    implementation(libs.androidx.camera.view)
}`
  },
  {
    id: 'manifest',
    filename: 'AndroidManifest.xml',
    language: 'xml',
    content: `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android">

    <!-- FR SHAH QuickPanel Permissions -->
    <uses-permission android:name="android.permission.SYSTEM_ALERT_WINDOW" />
    <uses-permission android:name="android.permission.CAMERA" />
    <uses-permission android:name="android.permission.RECORD_AUDIO" />
    <uses-permission android:name="android.permission.POST_NOTIFICATIONS" />
    <uses-permission android:name="android.permission.FOREGROUND_SERVICE" />
    <uses-permission android:name="android.permission.FOREGROUND_SERVICE_MEDIA_PROJECTION" />
    <uses-permission android:name="android.permission.WRITE_SETTINGS" />

    <!-- Package Visibility Queries for App Shortcuts -->
    <queries>
        <intent>
            <action android:name="android.intent.action.MAIN" />
            <category android:name="android.intent.category.LAUNCHER" />
        </intent>
    </queries>

    <application
        android:name=".QuickPanelApp"
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="FR SHAH QuickPanel"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/Theme.FRSHAHQuickPanel">

        <activity
            android:name=".MainActivity"
            android:exported="true">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>

        <service
            android:name=".service.FloatingPanelService"
            android:enabled="true"
            android:exported="false" />

        <service
            android:name=".service.ScreenRecordingService"
            android:enabled="true"
            android:exported="false"
            android:foregroundServiceType="mediaProjection" />

    </application>
</manifest>`
  },
  {
    id: 'readme',
    filename: 'README.md',
    language: 'markdown',
    content: `# FR SHAH QuickPanel
**Build. Control. Customize.**

> Developed with precision by **FR SHAH**.

An open-source Android quick-access toolbox designed for Android 10 through Android 16 (optimally calibrated for the **Moto G75 5G**).

## Features
- **Floating QuickPanel**: Draggable \`TYPE_APPLICATION_OVERLAY\` button with custom size, opacity, and touch physics.
- **Edge Panel**: Swipe-accessible drawer with customizable width and left/right positioning.
- **Smart Clipboard Manager**: Local Room DB persistent history, duplicate hash detection, capacity limits (100-1000 clips), and privacy filters.
- **Screenshot Tools**: Viewport and MediaProjection capture to \`Pictures/FR SHAH QuickPanel/\`.
- **Screen Recording**: Android 14+ \`FOREGROUND_SERVICE_MEDIA_PROJECTION\` compliant display recorder.
- **Flashlight**: Hardware CameraManager \`setTorchMode()\` with Strobe and SOS emergency signals.
- **Volume & Display**: Media & Ring volume sliders, window brightness, and \`WRITE_SETTINGS\` authorization.
- **Calculator**: Controlled arithmetic engine with calculation history and memory registers.
- **Quick Notes**: Offline Room database scratchpad with full-text search.
- **Stopwatch**: High-precision \`SystemClock.elapsedRealtime()\` timer with lap tracking.
- **QR Scanner**: CameraX on-demand scanner with safe URL confirmation prompts.
- **App Shortcuts**: Safe package visibility queries for launching favorite apps.

## Architecture & Tech Stack
- **Kotlin 2.0+** & **Jetpack Compose** (Material 3).
- **Architecture**: MVVM with unidirectional data flow (UDF).
- **Dependency Injection**: Dagger Hilt.
- **Persistence**: Room Database (SQLite) & DataStore Preferences.
- **Design System**: Industrial Black & Grey monochrome palette.

## License
Licensed under Apache 2.0. Copyright © 2026 FR SHAH.`
  },
  {
    id: 'ci',
    filename: '.github/workflows/android-ci.yml',
    language: 'yaml',
    content: `name: FR SHAH QuickPanel Android CI

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
    - name: Checkout Repository
      uses: actions/checkout@v4

    - name: Set up JDK 17
      uses: actions/setup-java@v4
      with:
        java-version: '17'
        distribution: 'temurin'
        cache: gradle

    - name: Grant Execute Permission for Gradlew
      run: chmod +x gradlew

    - name: Run Unit Tests
      run: ./gradlew testDebugUnitTest

    - name: Run Android Lint
      run: ./gradlew lintDebug

    - name: Build Debug APK
      run: ./gradlew assembleDebug

    - name: Upload Debug APK Artifact
      uses: actions/upload-artifact@v4
      with:
        name: FR_SHAH_QuickPanel_Debug_APK
        path: app/build/outputs/apk/debug/app-debug.apk`
  }
];

export const AndroidSourceModal: React.FC<AndroidSourceModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [selectedFileId, setSelectedFileId] = useState(ANDROID_FILES[0].id);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const activeFile = ANDROID_FILES.find((f) => f.id === selectedFileId) || ANDROID_FILES[0];

  const handleCopyCode = () => {
    navigator.clipboard.writeText(activeFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadFile = () => {
    const blob = new Blob([activeFile.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = activeFile.filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-4xl max-h-[92vh] flex flex-col rounded-3xl bg-zinc-900 border border-zinc-800 shadow-2xl overflow-hidden animate-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-zinc-800 text-zinc-200">
              <FolderGit2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-zinc-100">
                Android Kotlin Studio Project & GitHub Deliverables
              </h2>
              <p className="text-xs text-zinc-400">
                fr-shah-quickpanel · Jetpack Compose, Room, MVVM · MADE BY FR SHAH
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-white rounded-xl hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Split: File Tree on Left, Code Preview on Right */}
        <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
          {/* File Explorer Sidebar */}
          <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-zinc-800 p-3 bg-zinc-950/60 overflow-y-auto space-y-1">
            <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider px-2 py-1">
              Project Source Files
            </div>
            {ANDROID_FILES.map((file) => (
              <button
                key={file.id}
                onClick={() => setSelectedFileId(file.id)}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-mono transition-all flex items-center gap-2 ${
                  selectedFileId === file.id
                    ? 'bg-zinc-800 text-zinc-100 font-bold border border-zinc-700'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
                }`}
              >
                <FileCode className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                <span className="truncate">{file.filename}</span>
              </button>
            ))}
          </div>

          {/* Code Viewer Panel */}
          <div className="flex-1 flex flex-col min-w-0 bg-zinc-950">
            {/* Viewer Toolbar */}
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-zinc-800 bg-zinc-900/60 text-xs">
              <div className="flex items-center gap-2 font-mono text-zinc-300 font-semibold truncate">
                <span className="text-zinc-500">app/src/</span>
                <span>{activeFile.filename}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyCode}
                  className="px-3 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
                <button
                  onClick={handleDownloadFile}
                  className="px-3 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </button>
              </div>
            </div>

            {/* Code Content */}
            <div className="flex-1 p-4 overflow-auto font-mono text-xs text-zinc-300 leading-relaxed selection:bg-zinc-700">
              <pre className="whitespace-pre">{activeFile.content}</pre>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-zinc-800 bg-zinc-950/80 text-xs text-zinc-400 font-mono">
          <span>Gradle Kotlin DSL · Target SDK 35 (Android 15 & 16)</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-zinc-100 text-zinc-950 font-bold hover:bg-white text-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
