// ============================================
// Google Firebase & Cloud Sync Configuration
// ============================================

window.firebaseConfig = {
    apiKey: "AIzaSyAeiT3PpuliQ3eopra6srNk86uzUZFHKPE",
    authDomain: "sport-roulette.firebaseapp.com",
    projectId: "sport-roulette",
    storageBucket: "sport-roulette.firebasestorage.app",
    messagingSenderId: "25248209046",
    appId: "1:25248209046:web:0a2bdea2fc090c70aacab7",
    measurementId: "G-DXL51Q43D3"
};

// Перевірка чи налаштовано конфіг
window.isFirebaseConfigured = function() {
    return window.firebaseConfig && 
           window.firebaseConfig.apiKey && 
           window.firebaseConfig.apiKey !== "YOUR_API_KEY" &&
           window.firebaseConfig.projectId !== "YOUR_PROJECT_ID";
};
