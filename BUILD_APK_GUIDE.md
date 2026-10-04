# 📱 How to Build & Download Your Android APK with GitHub

This repository is fully configured with **Capacitor Android** and an automated **GitHub Actions CI/CD Workflow** (`.github/workflows/build-apk.yml`) that automatically generates a ready-to-install `.apk` with your custom app icon!

---

## 🚀 Method 1: Automated 1-Click Build via GitHub Actions (Recommended)

1. **Push this repository to GitHub**:
   ```bash
   git add .
   git commit -m "Configure Android APK build with custom logo"
   git push origin main
   ```

2. **Go to the "Actions" Tab on GitHub**:
   - Open your GitHub repository in your browser.
   - Click on the **Actions** tab at the top.
   - You will see the **Build Android APK** workflow running automatically.
   - *(Optional)* You can also click **Run workflow** manually anytime!

3. **Download Your APK**:
   - Once the build workflow finishes (takes ~2 minutes), click on the completed run.
   - Scroll down to the **Artifacts** section at the bottom.
   - Click **`WhatsCraft-Android-APK`** to download your ready-to-install `.apk` file!
   - Transfer or open this `.apk` on your Android phone to install.

---

## 💻 Method 2: Local Build via Android Studio / Terminal

If you have Android Studio installed locally on your computer:

1. **Install Dependencies & Build Assets**:
   ```bash
   npm install
   npm run build
   npx cap sync android
   ```

2. **Open in Android Studio**:
   ```bash
   npx cap open android
   ```

3. In Android Studio:
   - Click **Build** > **Build Bundle(s) / APK(s)** > **Build APK(s)**.
   - Your `.apk` will be in `android/app/build/outputs/apk/debug/app-debug.apk`.

---

## ✨ Features Included in this Build
- **Exact Custom Logo**: Embedded into all Android launcher mipmap densities (`mdpi`, `hdpi`, `xhdpi`, `xxhdpi`, `xxxhdpi`).
- **Full Offline & Storage Support**: Full standalone webview with modern Android WebView bridge.
- **Auto-Sync**: Every web change syncs directly to the Android container.
