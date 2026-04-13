package com.vettritn

import android.os.Bundle
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate

/**
 * Vettri TN — MainActivity
 *
 * Starts with SplashTheme (TVK Red background) and switches to
 * AppTheme once React Native has loaded. This gives a smooth
 * native-level launch screen matching TVK branding.
 *
 * To use react-native-splash-screen:
 *   1. npm install react-native-splash-screen
 *   2. npx pod-install (iOS)
 *   3. Uncomment SplashScreen lines below
 *   4. Call SplashScreen.hide() in your JS SplashScreen component
 */
class MainActivity : ReactActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        // ── Apply TVK Splash Theme before React Native loads ──────────────
        setTheme(R.style.SplashTheme)

        super.onCreate(savedInstanceState)

        // ── If using react-native-splash-screen, add: ─────────────────────
        // org.devio.rn.splashscreen.SplashScreen.show(this)
        // ─────────────────────────────────────────────────────────────────

        // Switch to main app theme after splash
        setTheme(R.style.AppTheme)
    }

    /**
     * Returns the name of the main component registered in JS.
     * Must match AppRegistry.registerComponent() call in index.js.
     */
    override fun getMainComponentName(): String = "VettriTN"

    override fun createReactActivityDelegate(): ReactActivityDelegate =
        DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)
}
