# 🏠 Фітнес Рулетка (Fitness Roulette)

> Інтерактивний веб-додаток (PWA) для домашніх тренувань з колесом фортуни, гейміфікацією, мульти-плеєром (YouTube/SoundCloud/MP3) та хмарною синхронізацією через Firebase.

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=flat&logo=firebase&logoColor=black)
![PWA](https://img.shields.io/badge/PWA-5A0FC8?style=flat&logo=pwa&logoColor=white)

---

## ✨ Основні можливості

- 🎰 **Колесо рулетки вправ** — плавна анімація обертання, LED-підсвітка та звукові ефекти.
- ⏱️ **Вбудований таймер тренування** — круговий індикатор часу з автовідліком та звуковим сигналом завершення.
- 🎵 **Музичний центр для тренувань**:
  - **YouTube Music** — готові тренувальні плейлисти (Workout, EDM, Біг, Hip-Hop) або будь-яке власне посилання.
  - **SoundCloud** — підтримка треків та плейлистів.
  - **Локальний MP3** — відтворення аудіофайлів з вашого пристрою.
  - Повне керування: перемотування, наступний/попередній трек, регулювання гучності.
- 👤 **Google Авторизація & YouTube Playlists**:
  - Вхід в 1 клік через Google акаунт.
  - Автоматичне підтягування ваших власних плейлистів з YouTube Music.
- 🏆 **Гейміфікація та прогрес**:
  - Система рівнів (Ранги від «Новачка» до «Кіборга»), нарахування XP, лічильник серій (streak).
  - Шкала енергії та система нагород (досягнень).
  - Детальна статистика виконання вправ з графіком Chart.js за 7 днів.
- ☁️ **Хмарне збереження (Firebase Firestore)**:
  - Автоматична синхронізація між усіма пристроями.
  - Повна підтримка роботи офлайн (`localStorage` fallback).
- 📱 **PWA (Progressive Web App)**:
  - Можна встановити як додаток на телефон (Android/iOS) або ПК.
  - Service Worker для кешування ресурсів.

---

## 🚀 Як налаштувати та запустити

### 1. Локальний запуск
Просто відкрийте `index.html` у будь-якому сучасному браузері або скористайтеся розширенням типу Live Server у VS Code.

### 2. Підключення Google Firebase
1. Створіть безкоштовний проєкт на [console.firebase.google.com](https://console.firebase.google.com/).
2. Увімкніть **Authentication** (метод входу: Google).
3. Створіть базу **Cloud Firestore** у тестовому режимі.
4. Додайте веб-додаток (іконка `</>`) та вставте ваші ключі у файл `firebase-config.js`.

---

## 🌐 Публікація на GitHub Pages

1. Завантажте репозиторій на GitHub.
2. Перейдіть у вкладку **Settings** (Налаштування репозиторію) → **Pages**.
3. У полі **Source** оберіть гілку `main` і теку `/ (root)`.
4. Натисніть **Save**. Через 1-2 хвилини ваш сайт буде доступний за посиланням:
   `https://<ваш-логін>.github.io/<назва-репозиторію>/`

---

Розроблено з любов'ю до спорту та коду! 💪
