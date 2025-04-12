// Инициализация Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCdkaKd3uf_fm2ULjJ9VD9TQupc162RJ9Q",
    authDomain: "timer-5ec58.firebaseapp.com",
    databaseURL: "https://timer-5ec58-default-rtdb.firebaseio.com",
    projectId: "timer-5ec58",
    storageBucket: "timer-5ec58.firebasestorage.app",
    messagingSenderId: "673861036511",
    appId: "1:673861036511:web:01927d3fb4e86b6087fc6a",
    measurementId: "G-E7B85YRHKR"
};

firebase.initializeApp(firebaseConfig);
const database = firebase.database();


const RESET_PASSWORD = '232317';

// DOM элементы
const meetingDaysEl = document.getElementById('meeting-days');
const meetingHoursEl = document.getElementById('meeting-hours');
const meetingMinutesEl = document.getElementById('meeting-minutes');
const meetingSecondsEl = document.getElementById('meeting-seconds');

const argumentsDaysEl = document.getElementById('arguments-days');
const argumentsHoursEl = document.getElementById('arguments-hours');
const argumentsMinutesEl = document.getElementById('arguments-minutes');
const argumentsSecondsEl = document.getElementById('arguments-seconds');

const loveDaysEl = document.getElementById('love-days');
const loveHoursEl = document.getElementById('love-hours');
const loveMinutesEl = document.getElementById('love-minutes');
const loveSecondsEl = document.getElementById('love-seconds');
const endRelationshipBtn = document.getElementById('end-relationship');
const breakupOverlay = document.getElementById('breakup-overlay');

const resetButton = document.getElementById('reset-button');
const passwordModal = document.getElementById('password-modal');
const passwordInput = document.getElementById('password-input');
const passwordError = document.getElementById('password-error');
const submitButton = document.getElementById('submit-button');
const cancelButton = document.getElementById('cancel-button');

// Глобальные переменные
let meetingDate = null;
let lastArgumentDate = null;
let relationshipStartDate = null;

// Загрузка данных из Firebase
function loadDatesFromFirebase() {
    database.ref().once('value').then(snapshot => {
        const data = snapshot.val();
        if (data) {
            meetingDate = new Date(data.meetingDate);
            lastArgumentDate = new Date(data.lastArgumentDate);
            relationshipStartDate = new Date(data.relationshipStartDate); // новая дата!
            updateTimers();
            updateLoveTimer();
        }
    });
}

// Сброс таймера ссор
function updateArgumentDateInFirebase(newDate) {
    database.ref().update({
        lastArgumentDate: newDate.toISOString()
    }).then(() => {
        lastArgumentDate = newDate;
        updateTimers();
    });
}

// Обновление таймеров
function updateTimers() {
    const now = new Date();
    if (meetingDate) updateTimer(meetingDate, now, meetingDaysEl, meetingHoursEl, meetingMinutesEl, meetingSecondsEl);
    if (lastArgumentDate) updateTimer(lastArgumentDate, now, argumentsDaysEl, argumentsHoursEl, argumentsMinutesEl, argumentsSecondsEl);
}

// Обновление таймера отношений
function updateLoveTimer() {
    const now = new Date();
    if (relationshipStartDate) updateTimer(relationshipStartDate, now, loveDaysEl, loveHoursEl, loveMinutesEl, loveSecondsEl);
}

// Универсальная функция обновления
function updateTimer(startDate, endDate, daysEl, hoursEl, minutesEl, secondsEl) {
    const diff = endDate.getTime() - startDate.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    daysEl.textContent = days;
    hoursEl.textContent = hours;
    minutesEl.textContent = minutes;
    secondsEl.textContent = seconds;
}

// Модальное окно
resetButton.addEventListener('click', () => {
    passwordModal.style.display = 'flex';
    passwordInput.value = '';
    passwordError.style.display = 'none';
    passwordInput.focus();
});

submitButton.addEventListener('click', () => {
    if (passwordInput.value === RESET_PASSWORD) {
        const now = new Date();
        updateArgumentDateInFirebase(now);
        passwordModal.style.display = 'none';
    } else {
        passwordError.style.display = 'block';
    }
});

cancelButton.addEventListener('click', () => {
    passwordModal.style.display = 'none';
});

passwordModal.addEventListener('click', (event) => {
    if (event.target === passwordModal) {
        passwordModal.style.display = 'none';
    }
});

passwordInput.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
        submitButton.click();
    }
});

// Завершить отношения
endRelationshipBtn.addEventListener('click', () => {
    breakupOverlay.style.display = 'flex';
});

// Таймеры
setInterval(updateTimers, 1000);
setInterval(updateLoveTimer, 1000);

// Старт
loadDatesFromFirebase();
