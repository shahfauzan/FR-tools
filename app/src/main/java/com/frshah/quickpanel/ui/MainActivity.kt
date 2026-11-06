package com.frshah.quickpanel.ui

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.ui.Modifier

/**
 * FR SHAH QuickPanel · Master Android Activity
 * Build. Control. Customize.
 * DEVELOPER CREDIT: MADE BY FR SHAH
 */
class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            MaterialTheme {
                Surface(modifier = Modifier.fillMaxSize()) {
                    Text("FR SHAH QuickPanel · Build. Control. Customize.")
                }
            }
        }
    }
}
