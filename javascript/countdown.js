let countdownInterval;

function countdownTimer() {
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');
    if (!hoursEl || !minutesEl || !secondsEl) return;

    const format = number => String(Math.max(0, number)).padStart(2, '0');

    const update = () => {
        const now = new Date();
        const nextDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
        const difference = Math.max(0, nextDay - now);

        hoursEl.textContent = format(Math.floor(difference / 3600000));
        minutesEl.textContent = format(Math.floor((difference % 3600000) / 60000));
        secondsEl.textContent = format(Math.floor((difference % 60000) / 1000));
    };

    update();
    clearInterval(countdownInterval);
    countdownInterval = setInterval(update, 1000);
}

document.addEventListener('DOMContentLoaded', countdownTimer);
