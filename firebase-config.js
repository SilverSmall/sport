// ============================================
// Google Firebase & Cloud Sync Configuration
// ============================================
// Інструкція для підключення бази даних:
// 1. Відкрийте https://console.firebase.google.com/
// 2. Натисніть "Створити проєкт" (наприклад, "fitness-roulette")
// 3. У меню зліва оберіть:
//    - "Authentication" -> "Sign-in method" -> увімкніть "Google"
//    - "Firestore Database" -> "Створити базу даних" -> режим "Test mode" (або правила для зареєстрованих)
// 4. На головній сторінці проєкту натисніть іконку Web (</>) і зареєструйте додаток
// 5. Скопіюйте отриманий об'єкт сюди:

window.firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Перевірка чи налаштовано конфіг
window.isFirebaseConfigured = function() {
    return window.firebaseConfig && 
           window.firebaseConfig.apiKey && 
           window.firebaseConfig.apiKey !== "YOUR_API_KEY" &&
           window.firebaseConfig.projectId !== "YOUR_PROJECT_ID";
};
