/* ============================================
   SPORT ROULETTE — Main Application Logic
   ============================================ */

// ─── Sports Database ─────────────────────────
const SPORTS_DB = [
    { name: "Присідання", emoji: "🦵", category: "lower", description: "Базова вправа для ніг та сідниць. Тримай спину рівно!", reps: { easy: "10-15 разів", medium: "20-25 разів", hard: "30-40 разів" }, calories: "~15 ккал" },
    { name: "Віджимання", emoji: "💪", category: "upper", description: "Зміцнює груди, плечі та трицепс. Віджимайся від підлоги або колін.", reps: { easy: "5-10 разів", medium: "15-20 разів", hard: "25-35 разів" }, calories: "~20 ккал" },
    { name: "Планка", emoji: "🧱", category: "core", description: "Статична вправа на всі м'язи кору. Тримай тіло рівно!", reps: { easy: "30 сек", medium: "1 хв", hard: "2 хв" }, calories: "~10 ккал" },
    { name: "Скручування", emoji: "🔥", category: "core", description: "Качаємо прес! Не тягни себе за шию.", reps: { easy: "15 разів", medium: "25 разів", hard: "40 разів" }, calories: "~15 ккал" },
    { name: "Берпі", emoji: "🥵", category: "full", description: "Супер кардіо на все тіло! Стрибок - планка - віджимання.", reps: { easy: "5 разів", medium: "10-15 разів", hard: "20-25 разів" }, calories: "~30 ккал" },
    { name: "Стрибки Джекі", emoji: "⭐", category: "cardio", description: "Стрибки з розведенням рук і ніг (Jumping Jacks).", reps: { easy: "30 сек", medium: "1 хв", hard: "2 хв" }, calories: "~15 ккал" },
    { name: "Випади", emoji: "🚶", category: "lower", description: "По черзі роби кроки вперед, згинаючи ноги під 90 градусів.", reps: { easy: "по 10 на ногу", medium: "по 15 на ногу", hard: "по 20 на ногу" }, calories: "~20 ккал" },
    { name: "Місток", emoji: "🌉", category: "core", description: "Сідничний місток з положення лежачи.", reps: { easy: "15 разів", medium: "25 разів", hard: "40 разів" }, calories: "~10 ккал" },
    { name: "Звор. віджим.", emoji: "🪑", category: "upper", description: "Віджимання на трицепс від стільця або дивана.", reps: { easy: "10 разів", medium: "15 разів", hard: "20 разів" }, calories: "~15 ккал" },
    { name: "Скелелаз", emoji: "⛰️", category: "cardio", description: "У планці почергово підтягуй коліна до грудей.", reps: { easy: "30 сек", medium: "45 сек", hard: "1 хв" }, calories: "~20 ккал" },
    { name: "Розтяжка", emoji: "🧘", category: "stretch", description: "Поза дитини або кішка-корова для розслаблення спини.", reps: { easy: "1 хв", medium: "2 хв", hard: "3 хв" }, calories: "~5 ккал" },
    { name: "Стільчик", emoji: "🧱", category: "lower", description: "Статика біля стіни. Тримай кут в колінах 90 градусів!", reps: { easy: "30 сек", medium: "1 хв", hard: "1.5 хв" }, calories: "~15 ккал" },
    { name: "Нахили", emoji: "🤸", category: "stretch", description: "Плавні нахили вперед до ніг з прямою спиною.", reps: { easy: "10 разів", medium: "15 разів", hard: "20 разів" }, calories: "~5 ккал" },
    { name: "Велосипед", emoji: "🚴", category: "core", description: "Скручування лежачи з почерговим підтягуванням колін ліктями.", reps: { easy: "20 разів", medium: "40 разів", hard: "60 разів" }, calories: "~15 ккал" },
    { name: "Махи руками", emoji: "🦅", category: "upper", description: "Кругові махи руками для розминки плечового пояса.", reps: { easy: "30 сек", medium: "1 хв", hard: "2 хв" }, calories: "~10 ккал" },
    { name: "Високі коліна", emoji: "🏃", category: "cardio", description: "Біг на місці з високим підніманням колін.", reps: { easy: "30 сек", medium: "1 хв", hard: "2 хв" }, calories: "~25 ккал" }
];

// Color palette for wheel segments
const SEGMENT_COLORS = [
    '#6c5ce7', '#a855f7', '#ec4899', '#f43f5e',
    '#f97316', '#eab308', '#84cc16', '#22c55e',
    '#14b8a6', '#06b6d4', '#3b82f6', '#8b5cf6',
    '#d946ef', '#f472b6', '#fb923c', '#facc15',
];

// ─── State ────────────────────────────────────
let currentSports = [];
let isSpinning = false;
let currentRotation = 0;
let history = [];
let soundEnabled = true;

// ─── Audio Context ────────────────────────────
let audioCtx = null;

function getAudioCtx() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioCtx;
}

function playTickSound() {
    if (!soundEnabled) return;
    try {
        const ctx = getAudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800 + Math.random() * 400, ctx.currentTime);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
        osc.start();
        osc.stop(ctx.currentTime + 0.05);
    } catch (e) { /* silent */ }
}

function playWinSound() {
    if (!soundEnabled) return;
    try {
        const ctx = getAudioCtx();
        const notes = [523, 659, 784, 1047]; // C5, E5, G5, C6
        notes.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.12);
            gain.gain.setValueAtTime(0.12, ctx.currentTime + i * 0.12);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.12 + 0.3);
            osc.start(ctx.currentTime + i * 0.12);
            osc.stop(ctx.currentTime + i * 0.12 + 0.3);
        });
    } catch (e) { /* silent */ }
}

// ─── DOM Elements ─────────────────────────────
const canvas = document.getElementById('wheelCanvas');
const ctx = canvas.getContext('2d');
const spinBtn = document.getElementById('spinBtn');
const spinCenterBtn = document.getElementById('spinCenterBtn');
const resultCard = document.getElementById('resultCard');
const resultEmoji = document.getElementById('resultEmoji');
const resultTitle = document.getElementById('resultTitle');
const resultDescription = document.getElementById('resultDescription');
const resultDetails = document.getElementById('resultDetails');
const historyList = document.getElementById('historyList');
const categorySelect = document.getElementById('categorySelect');
const settingsToggle = document.getElementById('settingsToggle');
const settingsPanel = document.getElementById('settingsPanel');
const settingsClose = document.getElementById('settingsClose');
const soundToggle = document.getElementById('soundToggle');
const confettiCanvas = document.getElementById('confettiCanvas');
const confettiCtx = confettiCanvas.getContext('2d');
const ledRing = document.getElementById('ledRing');
const wheelPointer = document.querySelector('.wheel-pointer');

// --- Timer & Stats Elements ---
const exerciseTimer = document.getElementById('exerciseTimer');
const timerDisplay = document.getElementById('timerDisplay');
const timerCircle = document.getElementById('timerCircle');
const timerStartBtn = document.getElementById('timerStartBtn');
const timerDoneBtn = document.getElementById('timerDoneBtn');
const timerSkipBtn = document.getElementById('timerSkipBtn');

const sessionTimeEl = document.getElementById('sessionTime');
const exerciseCountEl = document.getElementById('exerciseCount');
const streakCountEl = document.getElementById('streakCount');
const energyBarEl = document.getElementById('energyBar');

// Stats state
let sessionStartTime = null;
let sessionTimerInterval = null;
let exerciseCount = 0;
let streakCount = 0;
let energyLevel = 0;
let xp = 0;
let unlockedAchievements = [];
let customExercises = [];

// New DOM Elements
const rankDisplay = document.getElementById('rankDisplay');
const xpDisplay = document.getElementById('xpDisplay');
const customExerciseModal = document.getElementById('customExerciseModal');
const achievementsModal = document.getElementById('achievementsModal');
const statsModal = document.getElementById('statsModal');
const addExerciseBtn = document.getElementById('addExerciseBtn');
const showAchievementsBtn = document.getElementById('showAchievementsBtn');
const showStatsBtn = document.getElementById('showStatsBtn');
const ceCancelBtn = document.getElementById('ceCancelBtn');
const ceSaveBtn = document.getElementById('ceSaveBtn');
const achievementsCloseBtn = document.getElementById('achievementsCloseBtn');
const statsCloseBtn = document.getElementById('statsCloseBtn');
const achievementsGrid = document.getElementById('achievementsGrid');
const toastContainer = document.getElementById('toastContainer');
const musicToggleBtn = document.getElementById('musicToggleBtn');
const resetSessionBtn = document.getElementById('resetSessionBtn');
const customMusicBtn = document.getElementById('customMusicBtn');
const customMusicInput = document.getElementById('customMusicInput');
const scLinkInput = document.getElementById('scLinkInput');
const scApplyBtn = document.getElementById('scApplyBtn');
const scPrevBtn = document.getElementById('scPrevBtn');
const scNextBtn = document.getElementById('scNextBtn');
const scTitle = document.getElementById('scTitle');
const scArtist = document.getElementById('scArtist');
const scArtwork = document.getElementById('scArtwork');
const scProgressBar = document.getElementById('scProgressBar');
const scPlayerToggle = document.getElementById('scPlayerToggle');
const scPlayerBar = document.getElementById('scPlayerBar');

// Multi-Source Player DOM Elements
const themeToggle = document.getElementById('themeToggle');
const ytPlaylistsPanel = document.getElementById('ytPlaylistsPanel');
const musicUrlRow = document.getElementById('musicUrlRow');
const musicUrlInput = document.getElementById('musicUrlInput');
const musicUrlApply = document.getElementById('musicUrlApply');
const mp3Panel = document.getElementById('mp3Panel');
const mp3PickBtn = document.getElementById('mp3PickBtn');
const mp3Filename = document.getElementById('mp3Filename');
const volumeSlider = document.getElementById('volumeSlider');
const sourceTabs = document.querySelectorAll('.source-tab');
const playlistChips = document.querySelectorAll('.playlist-chip[data-yt-id]');

// Playlist Tracks Selection DOM Elements
const toggleTracksBtn = document.getElementById('toggleTracksBtn');
const playlistTracksSection = document.getElementById('playlistTracksSection');
const playlistTracksList = document.getElementById('playlistTracksList');
const tracksCount = document.getElementById('tracksCount');
const closeTracksBtn = document.getElementById('closeTracksBtn');

// Google Auth & Cloud Sync DOM Elements
const loginBtn = document.getElementById('loginBtn');
const userProfile = document.getElementById('userProfile');
const userAvatar = document.getElementById('userAvatar');
const userName = document.getElementById('userName');
const cloudStatus = document.getElementById('cloudStatus');
const logoutBtn = document.getElementById('logoutBtn');
const userPlaylistsSection = document.getElementById('userPlaylistsSection');
const userPlaylistsList = document.getElementById('userPlaylistsList');
const refreshPlaylistsBtn = document.getElementById('refreshPlaylistsBtn');

let isMusicPlaying = false;
let isLightTheme = false;
let activityChart = null;

// Audio State
let activeAudioType = 'yt'; // 'yt' or 'mp3'
let ytPlayer = null;
let isYtReady = false;
let ytProgressInterval = null;
let currentPlaylistId = 'PLgzTt0k8mXzEk586SfEBRW0VisiKznOlR';
let currentPlaylistTracks = [];

// Firebase & Cloud State
let currentUser = null;
let db = null;
let googleAccessToken = null;

// ─── Audio Helpers ────────────────────────────
function playBackgroundMusic() {
    if (activeAudioType === 'yt' && ytPlayer && isYtReady) {
        ytPlayer.playVideo();
        musicToggleBtn.textContent = '⏸';
        isMusicPlaying = true;
    } else if (activeAudioType === 'mp3' && bgMusic.src) {
        bgMusic.play().then(() => {
            musicToggleBtn.textContent = '⏸';
            isMusicPlaying = true;
        }).catch(e => console.log('Audio play blocked:', e));
    }
}

function pauseBackgroundMusic() {
    if (activeAudioType === 'yt' && ytPlayer && isYtReady) {
        ytPlayer.pauseVideo();
    } else if (activeAudioType === 'mp3') {
        bgMusic.pause();
    }
    musicToggleBtn.textContent = '▶';
    isMusicPlaying = false;
}

function stopOtherAudio(exceptType) {
    if (exceptType !== 'yt' && ytPlayer && isYtReady) {
        try { ytPlayer.pauseVideo(); } catch (e) {}
    }
    if (exceptType !== 'mp3' && bgMusic) {
        try { bgMusic.pause(); } catch (e) {}
    }
}

function setPlayerVolume(val) {
    if (ytPlayer && isYtReady) {
        try { ytPlayer.setVolume(val); } catch(e) {}
    }
    if (bgMusic) {
        bgMusic.volume = val / 100;
    }
}

function escapeHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

async function loadPlaylistTracks(playlistId) {
    if (!playlistTracksList) return;
    currentPlaylistId = playlistId;
    playlistTracksList.innerHTML = '<div class="tracks-loading">⏳ Завантаження треків...</div>';
    if (tracksCount) tracksCount.textContent = '...';

    let items = [];
    const apiKey = (window.firebaseConfig && window.firebaseConfig.apiKey) || '';
    const token = googleAccessToken || sessionStorage.getItem('yt_access_token') || localStorage.getItem('yt_access_token');

    let url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}&maxResults=50`;
    if (apiKey) url += `&key=${apiKey}`;

    const headers = {};
    if (token) headers['Authorization'] = 'Bearer ' + token;

    try {
        const res = await fetch(url, { headers });
        const data = await res.json();
        if (data.items && data.items.length) {
            items = data.items.map((it, idx) => ({
                index: idx,
                id: it.snippet.resourceId ? it.snippet.resourceId.videoId : '',
                title: it.snippet.title || `Трек #${idx + 1}`,
                channel: it.snippet.videoOwnerChannelTitle || ''
            }));
        }
    } catch (e) {
        console.log('Error fetching playlist tracks via API:', e);
    }

    // Fallback: Check ytPlayer.getPlaylist()
    if (!items.length && ytPlayer && typeof ytPlayer.getPlaylist === 'function') {
        const pl = ytPlayer.getPlaylist();
        if (Array.isArray(pl) && pl.length) {
            items = pl.map((vid, idx) => ({
                index: idx,
                id: vid,
                title: `Трек #${idx + 1}`,
                channel: ''
            }));
        }
    }

    // Fallback preset tracks for default playlist
    if (!items.length && playlistId === 'PLgzTt0k8mXzEk586SfEBRW0VisiKznOlR') {
        const defaultNames = [
            'Workout Motivation Mix - Power & Energy',
            'Bass Boosted Training Beat',
            'High Energy Workout Music',
            'Cardio Motivation Track',
            'Fitness Rhythm Beats'
        ];
        items = defaultNames.map((t, idx) => ({
            index: idx,
            id: '',
            title: t,
            channel: 'Gym Music'
        }));
    }

    currentPlaylistTracks = items;
    renderPlaylistTracks(items);
}

function renderPlaylistTracks(items) {
    if (!playlistTracksList) return;
    if (!items || !items.length) {
        playlistTracksList.innerHTML = '<div class="tracks-empty">Немає треків або плейлист ще завантажується</div>';
        if (tracksCount) tracksCount.textContent = '0';
        return;
    }

    if (tracksCount) tracksCount.textContent = items.length;

    const currentIndex = (ytPlayer && typeof ytPlayer.getPlaylistIndex === 'function')
        ? ytPlayer.getPlaylistIndex()
        : 0;

    playlistTracksList.innerHTML = items.map((track, idx) => {
        const isActive = idx === currentIndex;
        return `
            <button class="track-row ${isActive ? 'active' : ''}" data-index="${idx}" title="${escapeHtml(track.title)}">
                <span class="track-row-num">${idx + 1}</span>
                <span class="track-row-title">${escapeHtml(track.title)}</span>
                <span class="track-row-status">▶</span>
            </button>
        `;
    }).join('');

    playlistTracksList.querySelectorAll('.track-row').forEach(row => {
        row.addEventListener('click', () => {
            const idx = parseInt(row.dataset.index, 10);
            if (ytPlayer && isYtReady) {
                ytPlayer.playVideoAt(idx);
                musicToggleBtn.textContent = '⏸';
                isMusicPlaying = true;
                highlightActiveTrack(idx);
                const title = row.querySelector('.track-row-title') ? row.querySelector('.track-row-title').textContent : '';
                showToast('▶️', 'Трек увімкнено', title);
            }
        });
    });

    scrollToActiveTrack();
}

function highlightActiveTrack(activeIndex) {
    if (!playlistTracksList) return;
    const rows = playlistTracksList.querySelectorAll('.track-row');
    rows.forEach((r, idx) => {
        if (idx === activeIndex) {
            r.classList.add('active');
        } else {
            r.classList.remove('active');
        }
    });
    scrollToActiveTrack();
}

function scrollToActiveTrack() {
    if (!playlistTracksList) return;
    const activeEl = playlistTracksList.querySelector('.track-row.active');
    if (activeEl) {
        activeEl.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
}

function updateYtTrackInfo() {
    if (!ytPlayer || !isYtReady) return;
    try {
        const data = ytPlayer.getVideoData();
        if (data && data.title) {
            scTitle.textContent = data.title;
            scArtist.textContent = data.author || 'YouTube';
            if (data.video_id) {
                scArtwork.innerHTML = `<img src="https://img.youtube.com/vi/${data.video_id}/hqdefault.jpg" alt="">`;
            } else {
                scArtwork.innerHTML = '▶';
            }
        }
        if (typeof ytPlayer.getPlaylistIndex === 'function') {
            const curIdx = ytPlayer.getPlaylistIndex();
            if (curIdx >= 0) {
                highlightActiveTrack(curIdx);
                if (currentPlaylistTracks[curIdx] && currentPlaylistTracks[curIdx].title.startsWith('Трек #')) {
                    if (data && data.title) {
                        currentPlaylistTracks[curIdx].title = data.title;
                        const row = playlistTracksList ? playlistTracksList.querySelector(`.track-row[data-index="${curIdx}"] .track-row-title`) : null;
                        if (row) row.textContent = data.title;
                    }
                }
            }
        }
    } catch (e) {
        console.log('Error getting YT track info:', e);
    }
}

function startYtProgress() {
    clearInterval(ytProgressInterval);
    ytProgressInterval = setInterval(() => {
        if (ytPlayer && isYtReady && isMusicPlaying) {
            try {
                const current = ytPlayer.getCurrentTime() || 0;
                const total = ytPlayer.getDuration() || 1;
                const percent = Math.min(100, (current / total) * 100);
                scProgressBar.style.width = percent + '%';
            } catch (e) {}
        }
    }, 1000);
}

function stopYtProgress() {
    clearInterval(ytProgressInterval);
}

// Exercise timer state
let exerciseTimerInterval = null;
let currentExerciseDuration = 0;
let currentExerciseTimeLeft = 0;

// ─── YouTube Iframe API Initialization ─────────
window.onYouTubeIframeAPIReady = function() {
    initYouTubePlayer();
};

function initYouTubePlayer() {
    if (ytPlayer || typeof YT === 'undefined' || !YT.Player) return;
    ytPlayer = new YT.Player('yt-player', {
        host: 'https://www.youtube-nocookie.com',
        height: '200',
        width: '200',
        playerVars: {
            listType: 'playlist',
            list: 'PLgzTt0k8mXzEk586SfEBRW0VisiKznOlR',
            autoplay: 0,
            controls: 0,
            disablekb: 1,
            fs: 0,
            rel: 0
        },
        events: {
            'onReady': () => {
                isYtReady = true;
                if (volumeSlider) {
                    try { ytPlayer.setVolume(parseInt(volumeSlider.value)); } catch(e) {}
                }
                loadPlaylistTracks(currentPlaylistId);
                setTimeout(updateYtTrackInfo, 1200);
            },
            'onStateChange': (event) => {
                if (typeof YT !== 'undefined' && event.data === YT.PlayerState.PLAYING) {
                    musicToggleBtn.textContent = '⏸';
                    isMusicPlaying = true;
                    updateYtTrackInfo();
                    startYtProgress();
                } else if (typeof YT !== 'undefined' && (event.data === YT.PlayerState.PAUSED || event.data === YT.PlayerState.ENDED)) {
                    musicToggleBtn.textContent = '▶';
                    isMusicPlaying = false;
                    stopYtProgress();
                }
            },
            'onError': (event) => {
                console.log('YT error code:', event.data);
                showToast('⚠️', 'YouTube', 'Не вдалося завантажити цей трек.');
            }
        }
    });
}

// ─── Initialize ───────────────────────────────
function init() {
    loadData();
    initFirebase();
    
    // Init YouTube if API is already loaded
    if (window.YT && window.YT.Player) {
        initYouTubePlayer();
    }
    
    createParticles();
    createLEDs();
    loadSports('all');
    drawWheel();
    setupEventListeners();
    resizeConfettiCanvas();
    updateStatsUI();
}

// ─── Background Particles ─────────────────────
function createParticles() {
    const container = document.getElementById('bgParticles');
    const isMobile = window.innerWidth <= 480;
    const count = isMobile ? 0 : 25;
    for (let i = 0; i < count; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        p.style.left = Math.random() * 100 + '%';
        p.style.animationDuration = (8 + Math.random() * 15) + 's';
        p.style.animationDelay = Math.random() * 10 + 's';
        p.style.width = (2 + Math.random() * 3) + 'px';
        p.style.height = p.style.width;
        p.style.opacity = 0.2 + Math.random() * 0.4;
        container.appendChild(p);
    }
}

// ─── LED Ring ─────────────────────────────────
const LED_COUNT = 36;
let ledDots = [];

function createLEDs() {
    ledRing.innerHTML = '';
    ledDots = [];
    const radius = 215; // Slightly bigger than wheel
    for (let i = 0; i < LED_COUNT; i++) {
        const angle = (i / LED_COUNT) * Math.PI * 2 - Math.PI / 2;
        const dot = document.createElement('div');
        dot.className = 'led-dot';
        dot.style.left = (50 + Math.cos(angle) * (radius / 218 * 50)) + '%';
        dot.style.top = (50 + Math.sin(angle) * (radius / 218 * 50)) + '%';
        dot.style.transform = 'translate(-50%, -50%)';
        ledRing.appendChild(dot);
        ledDots.push(dot);
    }
}

function animateLEDs(speed) {
    // Speed: 0 = idle, higher = faster
    const time = Date.now();
    const step = Math.floor(time / Math.max(50, 300 - speed * 3)) % LED_COUNT;
    ledDots.forEach((dot, i) => {
        const dist = (i - step + LED_COUNT) % LED_COUNT;
        dot.classList.toggle('active', dist < 3);
    });
}

function idleLEDs() {
    ledDots.forEach((dot, i) => {
        dot.classList.remove('active');
    });
}

// ─── Load Sports by Category ─────────────────
function loadSports(category) {
    if (category === 'all') {
        currentSports = [...SPORTS_DB];
    } else {
        currentSports = SPORTS_DB.filter(s => s.category === category);
    }
    // Shuffle
    for (let i = currentSports.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [currentSports[i], currentSports[j]] = [currentSports[j], currentSports[i]];
    }
    // Limit to reasonable wheel size
    if (currentSports.length > 16) {
        currentSports = currentSports.slice(0, 16);
    }
    if (currentSports.length < 4) {
        // Pad with random from all
        const others = SPORTS_DB.filter(s => !currentSports.includes(s));
        while (currentSports.length < 4 && others.length) {
            currentSports.push(others.splice(Math.floor(Math.random() * others.length), 1)[0]);
        }
    }
    currentRotation = 0;
    wheelCacheCanvas = null; // invalidate cache so wheel redraws with new sports
    canvas.style.transform = `rotate(0rad)`;
    drawWheel();
}

// ─── Draw Wheel (Cached for Performance) ──────
let wheelCacheCanvas = null;
let wheelCacheDpr = 1;
const WHEEL_DISPLAY_SIZE = 500;

// Build the wheel image once onto an offscreen canvas (no rotation baked in)
function buildWheelCache() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2); // cap at 2x for mobile perf
    wheelCacheDpr = dpr;

    wheelCacheCanvas = document.createElement('canvas');
    wheelCacheCanvas.width = WHEEL_DISPLAY_SIZE * dpr;
    wheelCacheCanvas.height = WHEEL_DISPLAY_SIZE * dpr;
    const c = wheelCacheCanvas.getContext('2d');
    c.setTransform(dpr, 0, 0, dpr, 0, 0);

    const centerX = WHEEL_DISPLAY_SIZE / 2;
    const centerY = WHEEL_DISPLAY_SIZE / 2;
    const radius = WHEEL_DISPLAY_SIZE / 2 - 15;
    const segments = currentSports.length;
    const anglePerSegment = (2 * Math.PI) / segments;

    // Outer ring
    c.beginPath();
    c.arc(centerX, centerY, radius + 8, 0, Math.PI * 2);
    c.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    c.lineWidth = 3;
    c.stroke();

    // Segments
    for (let i = 0; i < segments; i++) {
        const startAngle = i * anglePerSegment - Math.PI / 2;
        const endAngle = startAngle + anglePerSegment;
        const midAngle = startAngle + anglePerSegment / 2;
        const color = SEGMENT_COLORS[i % SEGMENT_COLORS.length];

        // Fill
        c.beginPath();
        c.moveTo(centerX, centerY);
        c.arc(centerX, centerY, radius, startAngle, endAngle);
        c.closePath();
        const grad = c.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
        grad.addColorStop(0, lightenColor(color, 30));
        grad.addColorStop(0.7, color);
        grad.addColorStop(1, darkenColor(color, 20));
        c.fillStyle = grad;
        c.fill();

        // Border
        c.beginPath();
        c.moveTo(centerX, centerY);
        c.arc(centerX, centerY, radius, startAngle, endAngle);
        c.closePath();
        c.strokeStyle = 'rgba(0, 0, 0, 0.3)';
        c.lineWidth = 1.5;
        c.stroke();

        // Emoji
        c.save();
        c.translate(centerX, centerY);
        c.rotate(midAngle);
        const emojiDist = radius * 0.72;
        c.font = `${Math.min(34, 450 / segments)}px sans-serif`;
        c.textAlign = 'center';
        c.textBaseline = 'middle';
        c.fillText(currentSports[i].emoji, emojiDist, 0);

        // Name
        const textDist = radius * 0.48;
        c.font = `700 ${Math.min(18, 280 / segments)}px Outfit, sans-serif`;
        c.fillStyle = 'white';
        c.textAlign = 'center';
        c.textBaseline = 'middle';
        c.shadowColor = 'rgba(0,0,0,0.5)';
        c.shadowBlur = 4;
        const name = currentSports[i].name;
        c.fillText(name.length > 12 ? name.substring(0, 11) + '…' : name, textDist, 0);
        c.restore();
    }

    // Hub
    const hubGrad = c.createRadialGradient(centerX, centerY, 0, centerX, centerY, 50);
    hubGrad.addColorStop(0, '#2a2a5a');
    hubGrad.addColorStop(1, '#1a1a3a');
    c.beginPath();
    c.arc(centerX, centerY, 42, 0, Math.PI * 2);
    c.fillStyle = hubGrad;
    c.fill();
    c.strokeStyle = 'rgba(108, 92, 231, 0.4)';
    c.lineWidth = 2;
    c.stroke();
}

// Render the cached wheel bitmap onto the visible canvas once
function drawWheel() {
    if (!wheelCacheCanvas) buildWheelCache();

    const dpr = wheelCacheDpr;
    // Set canvas buffer size only once (avoid reallocating every frame)
    const neededW = WHEEL_DISPLAY_SIZE * dpr;
    if (canvas.width !== neededW || canvas.height !== neededW) {
        canvas.width = neededW;
        canvas.height = neededW;
    }

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(wheelCacheCanvas, 0, 0);
}

// ─── Color Helpers ────────────────────────────
function lightenColor(hex, percent) {
    const num = parseInt(hex.replace('#', ''), 16);
    const r = Math.min(255, (num >> 16) + percent);
    const g = Math.min(255, ((num >> 8) & 0x00FF) + percent);
    const b = Math.min(255, (num & 0x0000FF) + percent);
    return `rgb(${r}, ${g}, ${b})`;
}

function darkenColor(hex, percent) {
    const num = parseInt(hex.replace('#', ''), 16);
    const r = Math.max(0, (num >> 16) - percent);
    const g = Math.max(0, ((num >> 8) & 0x00FF) - percent);
    const b = Math.max(0, (num & 0x0000FF) - percent);
    return `rgb(${r}, ${g}, ${b})`;
}

// ─── Spin Logic ───────────────────────────────
function spin() {
    if (isSpinning) return;
    isSpinning = true;

    spinBtn.disabled = true;
    spinCenterBtn.disabled = true;
    canvas.classList.add('spinning');
    resultCard.classList.remove('winner');
    wheelPointer.classList.add('active');

    const segments = currentSports.length;
    const anglePerSegment = (2 * Math.PI) / segments;

    // Random winner
    const winnerIndex = Math.floor(Math.random() * segments);

    // Calculate target rotation
    // The pointer is at the top (12 o'clock), we draw starting at -PI/2
    // We need the winning segment's center to be at the top
    const winnerMidAngle = winnerIndex * anglePerSegment + anglePerSegment / 2;
    // target rotation so winnerMidAngle ends at top (= 0 position since we offset by -PI/2)
    const targetAngle = -winnerMidAngle;

    // Add extra full rotations for drama
    const extraRotations = (5 + Math.floor(Math.random() * 5)) * Math.PI * 2;
    const totalRotation = extraRotations + targetAngle - currentRotation;

    // Animation
    const duration = 4000 + Math.random() * 2000; // 4-6 seconds
    const startTime = performance.now();
    const startRotation = currentRotation;

    let lastTickAngle = startRotation;

    function animate(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        const newRotation = startRotation + totalRotation * eased;

        currentRotation = newRotation;
        canvas.style.transform = `rotate(${newRotation}rad)`;

        // Tick sound on segment boundaries
        const angleDiff = Math.abs(newRotation - lastTickAngle);
        if (angleDiff > anglePerSegment * 0.8) {
            playTickSound();
            lastTickAngle = newRotation;
        }

        // LED animation (skip on mobile to prevent layout thrashing)
        if (window.innerWidth > 480) {
            const speed = (1 - progress) * 100;
            animateLEDs(speed);
        }

        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            // Done!
            isSpinning = false;
            spinBtn.disabled = false;
            spinCenterBtn.disabled = false;
            canvas.classList.remove('spinning');
            wheelPointer.classList.remove('active');
            idleLEDs();

            showResult(currentSports[winnerIndex]);
            addToHistory(currentSports[winnerIndex]);
            playWinSound();
            launchConfetti();
        }
    }

    requestAnimationFrame(animate);
}

// ─── Show Result ──────────────────────────────
function showResult(sport) {
    const diffSelect = document.getElementById('difficultySelect');
    const diffLevel = diffSelect ? diffSelect.value : 'easy';
    const diffTextMap = { 'easy': 'Легко 😊', 'medium': 'Середньо 💪', 'hard': 'Важко 🔥' };
    
    resultEmoji.textContent = sport.emoji;
    resultTitle.textContent = sport.name;
    resultDescription.textContent = sport.description;

    const repsText = sport.reps ? sport.reps[diffLevel] : '';
    const diffText = diffTextMap[diffLevel] || 'Легко';

    resultDetails.innerHTML = `
        <span class="detail-badge">📊 ${diffText}</span>
        <span class="detail-badge">⏱️ ${repsText}</span>
        <span class="detail-badge">🔥 ${sport.calories || '~10 ккал'}</span>
    `;

    resultCard.classList.add('winner');

    // Parse timer
    setupExerciseTimer(repsText);

    // Start session timer if first spin
    if (!sessionStartTime) {
        sessionStartTime = new Date();
        sessionTimerInterval = setInterval(updateSessionTime, 1000);
    }

    // Scroll result into view on mobile
    if (window.innerWidth < 768) {
        setTimeout(() => {
            resultCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 300);
    }
}

// ─── Timer & Stats Logic ──────────────────────
function setupExerciseTimer(repsText) {
    clearInterval(exerciseTimerInterval);
    exerciseTimer.style.display = 'none';
    timerStartBtn.style.display = 'inline-block';
    timerDoneBtn.style.display = 'none';
    timerCircle.style.strokeDashoffset = 0;

    let durationInSeconds = 0;
    if (repsText.includes('хв') || repsText.includes('сек')) {
        let text = repsText.trim();
        if (text.includes('хв')) {
            const mins = parseFloat(text);
            durationInSeconds = mins * 60;
        } else if (text.includes('сек')) {
            const secs = parseInt(text);
            durationInSeconds = secs;
        }
    }

    if (durationInSeconds > 0) {
        currentExerciseDuration = durationInSeconds;
        currentExerciseTimeLeft = durationInSeconds;
        updateTimerDisplay(currentExerciseTimeLeft);
        exerciseTimer.style.display = 'flex';
    } else {
        // For reps-based exercises, just show "Done" immediately
        exerciseTimer.style.display = 'flex';
        timerStartBtn.style.display = 'none';
        timerDoneBtn.style.display = 'inline-block';
        timerDisplay.textContent = repsText;
        timerCircle.style.strokeDashoffset = 0;
    }
}

function updateTimerDisplay(seconds) {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    timerDisplay.textContent = `${m}:${s}`;
}

// ─── Timer Logic ──────────────────────────────
function startExerciseTimer() {
    timerStartBtn.style.display = 'none';
    timerDoneBtn.style.display = 'inline-block';
    
    // Auto-play music if not playing
    if (!isMusicPlaying) {
        playBackgroundMusic();
    }

    exerciseTimerInterval = setInterval(() => {
        currentExerciseTimeLeft--;
        updateTimerDisplay(currentExerciseTimeLeft);
        
        const totalOffset = 339.292;
        const progress = currentExerciseTimeLeft / currentExerciseDuration;
        timerCircle.style.strokeDashoffset = totalOffset - (totalOffset * progress);

        if (currentExerciseTimeLeft <= 0) {
            clearInterval(exerciseTimerInterval);
            timerDoneBtn.style.display = 'inline-block';
            playWinSound(); // Sound when timer ends
        }
    }, 1000);
}

function completeExercise() {
    clearInterval(exerciseTimerInterval);
    exerciseTimer.style.display = 'none';
    resultCard.classList.remove('winner');
    
    exerciseCount++;
    streakCount++;
    xp += 10;
    energyLevel = Math.min(100, energyLevel + 10);
    
    updateStatsUI();
    checkAchievements();
    saveData();
    
    launchConfetti();
}

function skipExercise() {
    clearInterval(exerciseTimerInterval);
    exerciseTimer.style.display = 'none';
    resultCard.classList.remove('winner');
    
    streakCount = 0; // break the streak
    streakCountEl.textContent = streakCount;
}

function updateSessionTime() {
    if (!sessionStartTime) return;
    const diff = Math.floor((new Date() - sessionStartTime) / 1000);
    const m = Math.floor(diff / 60).toString().padStart(2, '0');
    const s = (diff % 60).toString().padStart(2, '0');
    sessionTimeEl.textContent = `${m}:${s}`;
}

// ─── History ──────────────────────────────────
function addToHistory(sport) {
    history.unshift({
        sport,
        time: new Date()
    });

    // Keep last 20
    if (history.length > 20) history.pop();

    renderHistory();
    saveData();
}

function renderHistory() {
    if (history.length === 0) {
        historyList.innerHTML = '<p class="history-empty">Поки що пусто... Крутни колесо!</p>';
        return;
    }

    historyList.innerHTML = history.map((item, i) => {
        const timeStr = item.time.toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' });
        return `
            <div class="history-item" style="animation-delay: ${i * 0.05}s">
                <span class="history-num">${history.length - i}</span>
                <span class="history-sport-emoji">${item.sport.emoji}</span>
                <span class="history-sport-name">${item.sport.name}</span>
                <span class="history-time">${timeStr}</span>
            </div>
        `;
    }).join('');
}

// ─── Gamification & Storage ───────────────────
const ACHIEVEMENTS_DB = [
    { id: 'first_blood', icon: '🩸', title: 'Перша кров', desc: 'Виконай своє перше тренування', condition: () => exerciseCount >= 1 },
    { id: 'streak_5', icon: '🔥', title: 'Втягнувся', desc: 'Зроби серію з 5 вправ', condition: () => streakCount >= 5 },
    { id: 'energy_max', icon: '🔋', title: 'Заряджений', desc: 'Набери 100% енергії', condition: () => energyLevel >= 100 },
    { id: 'veteran', icon: '👑', title: 'Ветеран', desc: 'Зроби 50 вправ загалом', condition: () => exerciseCount >= 50 },
    { id: 'custom_ex', icon: '🛠️', title: 'Творець', desc: 'Додай власну вправу', condition: () => customExercises.length > 0 }
];

function saveData() {
    const data = {
        exerciseCount, xp, streakCount, energyLevel, unlockedAchievements, customExercises, history, isLightTheme
    };
    localStorage.setItem('sport_roulette_state', JSON.stringify(data));

    // Cloud sync with Firebase Firestore
    if (currentUser && db && typeof firebase !== 'undefined') {
        if (cloudStatus) cloudStatus.classList.add('syncing');
        db.collection('users').doc(currentUser.uid).set({
            exerciseCount,
            xp,
            streakCount,
            energyLevel,
            unlockedAchievements,
            customExercises,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        }, { merge: true }).then(() => {
            if (cloudStatus) cloudStatus.classList.remove('syncing');
        }).catch(err => {
            console.log('Firebase sync error:', err);
            if (cloudStatus) cloudStatus.classList.remove('syncing');
        });
    }
}

function loadData() {
    const saved = localStorage.getItem('sport_roulette_state');
    if (saved) {
        try {
            const data = JSON.parse(saved);
            exerciseCount = data.exerciseCount || 0;
            xp = data.xp || 0;
            streakCount = data.streakCount || 0;
            energyLevel = data.energyLevel || 0;
            unlockedAchievements = data.unlockedAchievements || [];
            customExercises = data.customExercises || [];
            isLightTheme = !!data.isLightTheme;
            
            history = (data.history || []).map(h => ({ ...h, time: new Date(h.time) }));
            
            if (customExercises.length > 0) {
                SPORTS_DB.push(...customExercises);
            }
        } catch(e) { console.error('Error loading data', e); }
    }
    
    // Apply theme
    if (isLightTheme) {
        document.body.classList.add('light-theme');
        if (themeToggle) themeToggle.checked = true;
    }
}

// ─── Firebase Auth & Cloud Sync ───────────────
function initFirebase() {
    if (typeof firebase === 'undefined' || !window.isFirebaseConfigured || !window.isFirebaseConfigured()) {
        console.log('Firebase не налаштовано або офлайн режим. Дані зберігаються в localStorage.');
        return;
    }

    try {
        if (!firebase.apps.length) {
            firebase.initializeApp(window.firebaseConfig);
        }
        db = firebase.firestore();

        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                currentUser = user;
                showUserLoggedIn(user);
                loadCloudData(user.uid);
                loadUserYouTubePlaylists();
            } else {
                currentUser = null;
                googleAccessToken = null;
                showUserLoggedOut();
            }
        });
    } catch (err) {
        console.error('Помилка ініціалізації Firebase:', err);
    }
}

function signInWithGoogle() {
    if (typeof firebase === 'undefined' || !window.isFirebaseConfigured || !window.isFirebaseConfigured()) {
        alert('Для хмарної синхронізації та входу додайте налаштування у файл firebase-config.js (інструкція всередині файлу)!');
        return;
    }

    const provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope('https://www.googleapis.com/auth/youtube.readonly');

    firebase.auth().signInWithPopup(provider).then(result => {
        const credential = result.credential || (firebase.auth.GoogleAuthProvider ? firebase.auth.GoogleAuthProvider.credentialFromResult(result) : null);
        const token = (credential && credential.accessToken) ? credential.accessToken : (result.credential ? result.credential.accessToken : null);
        
        if (token) {
            googleAccessToken = token;
            sessionStorage.setItem('yt_access_token', token);
            localStorage.setItem('yt_access_token', token);
            loadUserYouTubePlaylists();
        }
        showToast('👋', 'Ласкаво просимо!', result.user.displayName || 'Успішний вхід');
    }).catch(error => {
        console.error('Login error:', error);
        if (error.code !== 'auth/popup-closed-by-user') {
            showToast('❌', 'Помилка входу', error.message);
        }
    });
}

function signOutGoogle() {
    if (typeof firebase !== 'undefined' && firebase.auth) {
        firebase.auth().signOut().then(() => {
            sessionStorage.removeItem('yt_access_token');
            localStorage.removeItem('yt_access_token');
            googleAccessToken = null;
            if (userPlaylistsSection) userPlaylistsSection.style.display = 'none';
            showToast('👋', 'Вихід', 'Ви вийшли з акаунта');
        });
    }
}

function showUserLoggedIn(user) {
    if (loginBtn) loginBtn.style.display = 'none';
    if (userProfile) {
        userProfile.style.display = 'flex';
        if (userName) userName.textContent = user.displayName ? user.displayName.split(' ')[0] : 'Атлет';
        if (userAvatar) userAvatar.src = user.photoURL || 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">👤</text></svg>';
    }
}

function showUserLoggedOut() {
    if (loginBtn) loginBtn.style.display = 'flex';
    if (userProfile) userProfile.style.display = 'none';
    if (userPlaylistsSection) userPlaylistsSection.style.display = 'none';
}

function loadCloudData(uid) {
    if (!db) return;
    db.collection('users').doc(uid).get().then(doc => {
        if (doc.exists) {
            const data = doc.data();
            exerciseCount = data.exerciseCount || exerciseCount;
            xp = data.xp || xp;
            streakCount = data.streakCount || streakCount;
            energyLevel = data.energyLevel || energyLevel;
            unlockedAchievements = data.unlockedAchievements || unlockedAchievements;
            
            if (data.customExercises && data.customExercises.length) {
                customExercises = data.customExercises;
                customExercises.forEach(ce => {
                    if (!SPORTS_DB.some(s => s.name === ce.name)) SPORTS_DB.push(ce);
                });
            }
            updateStatsUI();
            showToast('☁️', 'Синхронізовано', 'Прогрес завантажено з хмари!');
        } else {
            // New user on Firebase - upload existing local data
            saveData();
        }
    }).catch(err => {
        console.error('Помилка завантаження з Firestore:', err);
    });
}

function loadUserYouTubePlaylists() {
    if (!googleAccessToken) {
        googleAccessToken = sessionStorage.getItem('yt_access_token') || localStorage.getItem('yt_access_token');
    }
    if (!googleAccessToken) return;

    fetch('https://www.googleapis.com/youtube/v3/playlists?part=snippet&mine=true&maxResults=50', {
        headers: {
            'Authorization': 'Bearer ' + googleAccessToken
        }
    }).then(res => res.json()).then(data => {
        if (data.items && data.items.length) {
            renderUserPlaylists(data.items);
            showToast('🎧', 'YouTube Music', `Завантажено ${data.items.length} ваших плейлистів!`);
        } else if (data.error) {
            console.warn('YouTube API Response:', data.error);
            if (data.error.code === 403 && data.error.message && data.error.message.includes('YouTube Data API v3')) {
                showToast('⚠️', 'YouTube API', 'Потрібно увімкнути YouTube Data API v3 в Google Cloud Console');
            }
        }
    }).catch(err => console.log('YouTube playlists fetch error:', err));
}

function renderUserPlaylists(items) {
    if (!userPlaylistsList || !userPlaylistsSection) return;
    userPlaylistsSection.style.display = 'block';
    userPlaylistsList.innerHTML = items.map(item => `
        <button class="user-playlist-chip" data-yt-id="${item.id}" title="${item.snippet.title}">
            🎵 ${item.snippet.title}
        </button>
    `).join('');

    userPlaylistsList.querySelectorAll('.user-playlist-chip').forEach(btn => {
        btn.addEventListener('click', () => {
            userPlaylistsList.querySelectorAll('.user-playlist-chip').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const ytId = btn.dataset.ytId;
            activeAudioType = 'yt';
            stopOtherAudio('yt');
            sourceTabs.forEach(t => t.classList.toggle('active', t.dataset.source === 'yt'));
            loadPlaylistTracks(ytId);

            if (ytPlayer && isYtReady) {
                ytPlayer.loadPlaylist({ list: ytId, listType: 'playlist' });
                musicToggleBtn.textContent = '⏸';
                isMusicPlaying = true;
                showToast('🎧', 'Ваш плейлист', btn.title);
            }
        });
    });
}

function updateStatsUI() {
    exerciseCountEl.textContent = exerciseCount;
    streakCountEl.textContent = streakCount;
    xpDisplay.textContent = xp;
    energyBarEl.style.width = `${energyLevel}%`;
    
    let rank = 'Новачок';
    if (xp >= 300) rank = '🦾 Кіборг';
    else if (xp >= 150) rank = '💪 Атлет';
    else if (xp >= 50) rank = '🏃 Любитель';
    else rank = '🌱 Новачок';
    
    rankDisplay.textContent = rank;
}

function checkAchievements() {
    ACHIEVEMENTS_DB.forEach(ach => {
        if (!unlockedAchievements.includes(ach.id) && ach.condition()) {
            unlockedAchievements.push(ach.id);
            showToast(ach.icon, 'Досягнення відкрито!', ach.title);
            saveData();
        }
    });
}

function showToast(icon, title, desc) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
        <div class="toast-icon">${icon}</div>
        <div class="toast-text">
            <h4>${title}</h4>
            <p>${desc}</p>
        </div>
    `;
    toastContainer.appendChild(toast);
    setTimeout(() => {
        if(toast.parentElement) toast.remove();
    }, 4500);
}

function renderAchievements() {
    achievementsGrid.innerHTML = ACHIEVEMENTS_DB.map(ach => {
        const isUnlocked = unlockedAchievements.includes(ach.id);
        return `
            <div class="achievement-badge ${isUnlocked ? 'unlocked' : 'locked'}">
                <div class="ach-icon">${ach.icon}</div>
                <div class="ach-title">${ach.title}</div>
                <div class="ach-desc">${ach.desc}</div>
            </div>
        `;
    }).join('');
}

function renderStatsChart() {
    const today = new Date();
    today.setHours(0,0,0,0);
    
    const labels = [];
    const dataPoints = [];
    
    for (let i = 6; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        
        const label = d.toLocaleDateString('uk-UA', { day: 'numeric', month: 'short' });
        labels.push(label);
        
        const count = history.filter(h => {
            const hDate = new Date(h.time);
            hDate.setHours(0,0,0,0);
            return hDate.getTime() === d.getTime();
        }).length;
        
        dataPoints.push(count);
    }
    
    if (activityChart) {
        activityChart.destroy();
    }

    const activityChartCanvas = document.getElementById('activityChart');
    if (!activityChartCanvas) return;
    const activityChartCtx = activityChartCanvas.getContext('2d');
    
    activityChart = new Chart(activityChartCtx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Виконано вправ',
                data: dataPoints,
                backgroundColor: isLightTheme ? '#6c5ce7' : '#34d399',
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { stepSize: 1, color: isLightTheme ? '#475569' : '#8888aa' },
                    grid: { color: isLightTheme ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.05)' }
                },
                x: {
                    ticks: { color: isLightTheme ? '#475569' : '#8888aa' },
                    grid: { display: false }
                }
            },
            plugins: {
                legend: {
                    labels: { color: isLightTheme ? '#1e293b' : '#e8e8ff' }
                }
            }
        }
    });
}

// ─── Confetti ─────────────────────────────────
function resizeConfettiCanvas() {
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
}

function launchConfetti() {
    // Skip confetti on mobile (canvas is hidden via CSS) for performance
    if (window.innerWidth <= 480) return;

    const pieces = [];
    const colors = ['#6c5ce7', '#a855f7', '#ec4899', '#fbbf24', '#34d399', '#3b82f6', '#f43f5e', '#fb923c'];
    const count = window.innerWidth <= 768 ? 50 : 120;

    for (let i = 0; i < count; i++) {
        pieces.push({
            x: confettiCanvas.width / 2 + (Math.random() - 0.5) * 200,
            y: confettiCanvas.height / 2,
            vx: (Math.random() - 0.5) * 20,
            vy: -Math.random() * 18 - 5,
            color: colors[Math.floor(Math.random() * colors.length)],
            size: 4 + Math.random() * 6,
            rotation: Math.random() * 360,
            rotationSpeed: (Math.random() - 0.5) * 15,
            gravity: 0.4 + Math.random() * 0.2,
            opacity: 1,
            shape: Math.random() > 0.5 ? 'rect' : 'circle'
        });
    }

    let frame = 0;
    const maxFrames = 180;

    function drawConfetti() {
        confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

        pieces.forEach(p => {
            p.x += p.vx;
            p.vy += p.gravity;
            p.y += p.vy;
            p.vx *= 0.98;
            p.rotation += p.rotationSpeed;
            p.opacity = Math.max(0, 1 - frame / maxFrames);

            confettiCtx.save();
            confettiCtx.translate(p.x, p.y);
            confettiCtx.rotate(p.rotation * Math.PI / 180);
            confettiCtx.globalAlpha = p.opacity;
            confettiCtx.fillStyle = p.color;

            if (p.shape === 'rect') {
                confettiCtx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
            } else {
                confettiCtx.beginPath();
                confettiCtx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
                confettiCtx.fill();
            }

            confettiCtx.restore();
        });

        frame++;
        if (frame < maxFrames) {
            requestAnimationFrame(drawConfetti);
        } else {
            confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
        }
    }

    requestAnimationFrame(drawConfetti);
}

// ─── Event Listeners ──────────────────────────
function setupEventListeners() {
    spinBtn.addEventListener('click', spin);
    spinCenterBtn.addEventListener('click', spin);

    // Keyboard
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space' || e.key === 'Enter') {
            e.preventDefault();
            spin();
        }
    });

    // Category
    categorySelect.addEventListener('change', (e) => {
        if (!isSpinning) {
            loadSports(e.target.value);
        }
    });

    // Settings
    settingsToggle.addEventListener('click', () => {
        settingsPanel.classList.toggle('open');
    });

    settingsClose.addEventListener('click', () => {
        settingsPanel.classList.remove('open');
    });

    // Close settings on outside click
    document.addEventListener('click', (e) => {
        if (settingsPanel.classList.contains('open') &&
            !settingsPanel.contains(e.target) &&
            !settingsToggle.contains(e.target)) {
            settingsPanel.classList.remove('open');
        }
    });

    // Sound
    soundToggle.addEventListener('change', (e) => {
        soundEnabled = e.target.checked;
    });

    // Resize
    window.addEventListener('resize', () => {
        resizeConfettiCanvas();
    });

    // Timer listeners
    timerStartBtn.addEventListener('click', startExerciseTimer);
    timerDoneBtn.addEventListener('click', completeExercise);
    timerSkipBtn.addEventListener('click', skipExercise);
    
    // Modals
    addExerciseBtn.addEventListener('click', () => {
        settingsPanel.classList.remove('open');
        customExerciseModal.style.display = 'flex';
    });
    ceCancelBtn.addEventListener('click', () => {
        customExerciseModal.style.display = 'none';
    });
    
    showAchievementsBtn.addEventListener('click', () => {
        settingsPanel.classList.remove('open');
        renderAchievements();
        achievementsModal.style.display = 'flex';
    });
    achievementsCloseBtn.addEventListener('click', () => {
        achievementsModal.style.display = 'none';
    });

    showStatsBtn.addEventListener('click', () => {
        renderStatsChart();
        statsModal.style.display = 'flex';
    });
    statsCloseBtn.addEventListener('click', () => {
        statsModal.style.display = 'none';
    });
    
    // Music Toggle
    musicToggleBtn.addEventListener('click', () => {
        if (isMusicPlaying) {
            pauseBackgroundMusic();
        } else {
            playBackgroundMusic();
        }
    });
    
    // SC Player Toggle (expand/collapse)
    scPlayerToggle.addEventListener('click', () => {
        scPlayerBar.classList.toggle('open');
    });
    
    // Music Prev / Next
    scPrevBtn.addEventListener('click', () => {
        if (activeAudioType === 'yt' && isYtReady && ytPlayer) {
            ytPlayer.previousVideo();
        }
    });

    scNextBtn.addEventListener('click', () => {
        if (activeAudioType === 'yt' && isYtReady && ytPlayer) {
            ytPlayer.nextVideo();
        }
    });

    // Toggle Playlist Tracks Drawer
    if (toggleTracksBtn && playlistTracksSection) {
        toggleTracksBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isHidden = playlistTracksSection.style.display === 'none' || !playlistTracksSection.style.display;
            playlistTracksSection.style.display = isHidden ? 'block' : 'none';
            toggleTracksBtn.classList.toggle('active', isHidden);
            if (isHidden) {
                if (!scPlayerBar.classList.contains('open')) {
                    scPlayerBar.classList.add('open');
                }
                if (!currentPlaylistTracks.length) {
                    loadPlaylistTracks(currentPlaylistId);
                } else {
                    scrollToActiveTrack();
                }
            }
        });
    }

    if (closeTracksBtn && playlistTracksSection) {
        closeTracksBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            playlistTracksSection.style.display = 'none';
            if (toggleTracksBtn) toggleTracksBtn.classList.remove('active');
        });
    }

    // Volume Slider
    if (volumeSlider) {
        volumeSlider.addEventListener('input', (e) => {
            setPlayerVolume(parseInt(e.target.value));
        });
    }

    // Source Tabs (YouTube / MP3)
    sourceTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            sourceTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            const source = tab.dataset.source;
            activeAudioType = source;
            stopOtherAudio(source);

            if (source === 'yt') {
                if (ytPlaylistsPanel) ytPlaylistsPanel.style.display = 'flex';
                if (musicUrlRow) musicUrlRow.style.display = 'flex';
                if (mp3Panel) mp3Panel.style.display = 'none';
                if (musicUrlInput) musicUrlInput.placeholder = 'YouTube посилання (плейлист або відео)...';
                scArtist.textContent = 'YouTube Music';
            } else if (source === 'mp3') {
                if (ytPlaylistsPanel) ytPlaylistsPanel.style.display = 'none';
                if (musicUrlRow) musicUrlRow.style.display = 'none';
                if (mp3Panel) mp3Panel.style.display = 'flex';
                scArtist.textContent = 'Локальний файл';
            }
        });
    });

    // YouTube Playlist Chips
    playlistChips.forEach(chip => {
        chip.addEventListener('click', () => {
            playlistChips.forEach(c => c.classList.remove('active'));
            chip.classList.add('active');

            activeAudioType = 'yt';
            stopOtherAudio('yt');
            sourceTabs.forEach(t => t.classList.toggle('active', t.dataset.source === 'yt'));
            if (ytPlaylistsPanel) ytPlaylistsPanel.style.display = 'flex';
            if (mp3Panel) mp3Panel.style.display = 'none';

            const ytId = chip.dataset.ytId;
            loadPlaylistTracks(ytId);
            if (ytPlayer && isYtReady) {
                ytPlayer.loadPlaylist({ list: ytId, listType: 'playlist' });
                musicToggleBtn.textContent = '⏸';
                isMusicPlaying = true;
                showToast('🏋️', 'YouTube плейлист', chip.textContent.trim());
            } else {
                showToast('⏳', 'YouTube', 'Завантажуємо плеєр...');
            }
        });
    });

    // Custom URL handler (YouTube)
    function handleCustomUrl() {
        if (!musicUrlInput) return;
        const link = musicUrlInput.value.trim();
        if (!link) return;

        if (link.includes('youtube.com') || link.includes('youtu.be')) {
            let listId = null;
            let videoId = null;
            try {
                const urlObj = new URL(link);
                listId = urlObj.searchParams.get('list');
                videoId = urlObj.searchParams.get('v');
                if (!videoId && link.includes('youtu.be/')) {
                    videoId = urlObj.pathname.slice(1);
                }
            } catch (e) {}

            activeAudioType = 'yt';
            stopOtherAudio('yt');
            sourceTabs.forEach(t => t.classList.toggle('active', t.dataset.source === 'yt'));
            if (ytPlaylistsPanel) ytPlaylistsPanel.style.display = 'flex';
            if (mp3Panel) mp3Panel.style.display = 'none';

            if (ytPlayer && isYtReady) {
                if (listId) {
                    loadPlaylistTracks(listId);
                    ytPlayer.loadPlaylist({ list: listId, listType: 'playlist' });
                    showToast('▶️', 'YouTube', 'Завантажено плейлист!');
                } else if (videoId) {
                    currentPlaylistTracks = [{ index: 0, id: videoId, title: 'Користувацьке відео' }];
                    renderPlaylistTracks(currentPlaylistTracks);
                    ytPlayer.loadVideoById(videoId);
                    showToast('▶️', 'YouTube', 'Завантажено трек!');
                } else {
                    showToast('⚠️', 'YouTube', 'Не вдалося розпізнати відео чи плейлист');
                }
                musicToggleBtn.textContent = '⏸';
                isMusicPlaying = true;
            } else {
                showToast('⏳', 'YouTube', 'Плеєр ще завантажується...');
            }
        } else {
            alert('Будь ласка, введіть посилання на YouTube.');
        }

        musicUrlInput.value = '';
    }

    if (musicUrlApply) {
        musicUrlApply.addEventListener('click', handleCustomUrl);
    }
    if (musicUrlInput) {
        musicUrlInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                handleCustomUrl();
            }
        });
    }

    // MP3 Pick Button in player
    if (mp3PickBtn) {
        mp3PickBtn.addEventListener('click', () => {
            customMusicInput.click();
        });
    }

    // Progress bar seeking
    const progressBarWrap = document.querySelector('.sc-player-progress');
    if (progressBarWrap) {
        progressBarWrap.addEventListener('click', (e) => {
            const rect = progressBarWrap.getBoundingClientRect();
            const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
            if (activeAudioType === 'yt' && ytPlayer && isYtReady) {
                const dur = ytPlayer.getDuration() || 0;
                if (dur > 0) ytPlayer.seekTo(dur * ratio, true);
            } else if (activeAudioType === 'mp3' && bgMusic.duration) {
                bgMusic.currentTime = bgMusic.duration * ratio;
            }
        });
    }

    // Theme Toggle
    if (themeToggle) {
        themeToggle.addEventListener('change', (e) => {
            isLightTheme = e.target.checked;
            if (isLightTheme) {
                document.body.classList.add('light-theme');
            } else {
                document.body.classList.remove('light-theme');
            }
            saveData();
        });
    }
    
    // Custom Music Upload
    if (customMusicBtn) {
        customMusicBtn.addEventListener('click', () => {
            customMusicInput.click();
        });
    }
    
    customMusicInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const fileURL = URL.createObjectURL(file);
            bgMusic.src = fileURL;
            activeAudioType = 'mp3';
            stopOtherAudio('mp3');
            
            const shortName = file.name.length > 20 ? file.name.substring(0, 17) + '...' : file.name;
            if (customMusicBtn) customMusicBtn.textContent = '🎵 ' + shortName;
            if (mp3Filename) mp3Filename.textContent = file.name;
            scTitle.textContent = file.name;
            scArtist.textContent = 'Локальний файл';
            scArtwork.innerHTML = '📂';
            
            showToast('🎵', 'Новий трек!', 'Завантажено: ' + file.name);
            playBackgroundMusic();
        }
    });
    
    // Settings panel YouTube Link Apply
    if (scApplyBtn) {
        scApplyBtn.addEventListener('click', () => {
            const link = scLinkInput.value.trim();
            if (!link) return;
            
            if (!link.includes('youtube.com') && !link.includes('youtu.be')) {
                alert('Будь ласка, введіть коректне посилання на YouTube.');
                return;
            }
            
            activeAudioType = 'yt';
            stopOtherAudio('yt');
            
            let listId = null;
            let videoId = null;
            try {
                const urlObj = new URL(link);
                listId = urlObj.searchParams.get('list');
                videoId = urlObj.searchParams.get('v');
                if (!videoId && link.includes('youtu.be/')) {
                    videoId = urlObj.pathname.slice(1);
                }
            } catch (e) {}

            if (ytPlayer && isYtReady) {
                if (listId) {
                    loadPlaylistTracks(listId);
                    ytPlayer.loadPlaylist({ list: listId, listType: 'playlist' });
                    showToast('▶️', 'YouTube', 'Завантажено плейлист!');
                } else if (videoId) {
                    currentPlaylistTracks = [{ index: 0, id: videoId, title: 'Користувацьке відео' }];
                    renderPlaylistTracks(currentPlaylistTracks);
                    ytPlayer.loadVideoById(videoId);
                    showToast('▶️', 'YouTube', 'Завантажено трек!');
                }
                musicToggleBtn.textContent = '⏸';
                isMusicPlaying = true;
            }
            
            scLinkInput.value = '';
        });
    }
    
    // Reset Everything
    resetSessionBtn.addEventListener('click', () => {
        if (confirm('Ви впевнені, що хочете видалити ВЕСЬ прогрес (XP, досягнення, історію та власні вправи)? Цю дію неможливо скасувати.')) {
            localStorage.removeItem('sport_roulette_state');
            location.reload();
        }
    });
    
    // Save Custom Exercise
    ceSaveBtn.addEventListener('click', () => {
        const name = document.getElementById('ceName').value.trim();
        const emoji = document.getElementById('ceEmoji').value.trim();
        const category = document.getElementById('ceCategory').value;
        const desc = document.getElementById('ceDesc').value.trim();
        
        const rE = document.getElementById('ceRepsEasy').value.trim() || '10';
        const rM = document.getElementById('ceRepsMedium').value.trim() || '20';
        const rH = document.getElementById('ceRepsHard').value.trim() || '30';
        
        if (!name || !emoji) {
            alert('Будь ласка, введіть назву та емодзі!');
            return;
        }
        
        const newEx = {
            name, emoji, category, description: desc,
            reps: { easy: rE, medium: rM, hard: rH },
            calories: '~15 ккал'
        };
        
        customExercises.push(newEx);
        SPORTS_DB.push(newEx);
        saveData();
        checkAchievements();
        
        customExerciseModal.style.display = 'none';
        
        // Reset form
        document.getElementById('ceName').value = '';
        document.getElementById('ceEmoji').value = '';
        document.getElementById('ceDesc').value = '';
        document.getElementById('ceRepsEasy').value = '';
        document.getElementById('ceRepsMedium').value = '';
        document.getElementById('ceRepsHard').value = '';
        
        showToast('✅', 'Готово!', `Вправу "${name}" додано!`);
        
        // Reload current category to show on wheel
        loadSports(categorySelect.value);
    });

    // Google Auth & Cloud Sync Buttons
    if (loginBtn) {
        loginBtn.addEventListener('click', signInWithGoogle);
    }
    if (logoutBtn) {
        logoutBtn.addEventListener('click', signOutGoogle);
    }
    if (refreshPlaylistsBtn) {
        refreshPlaylistsBtn.addEventListener('click', () => {
            loadUserYouTubePlaylists();
            showToast('🔄', 'Оновлення', 'Оновлюємо ваші плейлисти...');
        });
    }
}

// ─── Start ────────────────────────────────────
document.addEventListener('DOMContentLoaded', init);
