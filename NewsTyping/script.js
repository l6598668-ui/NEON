const wordDisplay = document.getElementById('word');
const inputField = document.getElementById('input-field');
const statusDisplay = document.getElementById('status');
const setupArea = document.getElementById('setup-area');
const gameArea = document.getElementById('game-area');
const detailArea = document.getElementById('detail-area');
const detailLink = document.getElementById('detail-link');
const nextBtn = document.getElementById('next-btn');
const newsListContainer = document.getElementById('news-list-container');
const startBtn = document.getElementById('start-btn');
const updateTimeDisplay = document.getElementById('update-time');
const modal = document.getElementById('myModal');
const helpBtn = document.querySelector('.help-btn');
const closeBtn = document.querySelector('.close-btn');

let newsData = [];
let currentIndex = 0;

helpBtn.addEventListener('click', () => {
    modal.showModal();
    document.body.style.overflow = 'hidden';
});


const closeModal = () => {
    modal.close();
    document.body.style.overflow = '';
};

closeBtn.addEventListener('click', closeModal);

modal.addEventListener('click', (e) => {
    const rect = modal.getBoundingClientRect();
    const isInDialog = (
        rect.top <= e.clientY &&
        e.clientY <= rect.top + rect.height &&
        rect.left <= e.clientX &&
        e.clientX <= rect.left + rect.width
    );
    if (!isInDialog) {
        closeModal();
    }
});

modal.addEventListener('cancel', () => {
    document.body.style.overflow = '';
});

async function init() {
    try {
        const res = await fetch('./news.txt?t=' + Date.now());
        if (!res.ok) throw new Error("news.txtが見つかりません");

        const text = await res.text();
        let lines = text.trim().split('\n').map(l => l.trim()).filter(l => l.length > 0);
        
        if (lines.length > 0 && lines[0].startsWith('最終更新')) {
            updateTimeDisplay.textContent = lines.shift();
        }

        newsData = [];
        for (let i = 0; i < lines.length; i += 2) {
            if (lines[i] && lines[i+1] && lines[i+1].startsWith('http')) {
                newsData.push({ title: lines[i], link: lines[i+1] });
            }
        }

        if (newsData.length > 0) {
            newsListContainer.innerHTML = newsData.map((item, i) => 
                `<div class="news-item">${i+1}. ${item.title}</div>`
            ).join('');
            startBtn.disabled = false;
        } else {
            newsListContainer.textContent = "表示できるニュースがありません。";
        }
    } catch (e) {
        newsListContainer.textContent = "読み込みエラーが発生しました。";
        console.error(e);
    }
}

startBtn.addEventListener('click', () => {
    setupArea.style.display = 'none';
    gameArea.style.display = 'block';
    updateDisplay();
});

function updateDisplay() {
    if (currentIndex < newsData.length) {
        wordDisplay.textContent = newsData[currentIndex].title;
        statusDisplay.textContent = `残り: ${newsData.length - currentIndex} 件`;
        inputField.value = '';
        inputField.disabled = false;
        inputField.style.display = 'block';
        detailArea.style.display = 'none';
        inputField.focus();
    } else {
        wordDisplay.textContent = "✨ 本日のニュース終了！ ✨";
        inputField.style.display = 'none';
        statusDisplay.textContent = "お疲れ様でした";
    }
}

inputField.addEventListener('input', () => {
    if (inputField.value === newsData[currentIndex].title) {
        inputField.disabled = true;
        detailLink.href = newsData[currentIndex].link;
        detailArea.style.display = 'block';
        nextBtn.focus();
    }
});

nextBtn.addEventListener('click', () => {
    currentIndex++;
    updateDisplay();
});

inputField.addEventListener('paste', (e) => e.preventDefault());

init();
