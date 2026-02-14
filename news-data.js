window.newsData = [
{ date: "2026-02-03", category: "メンテナンス", title: "システムメンテナンスについて", folder: "2026-02-03-システムメンテナンスについて", pinned: false, isFinished: false },
{ date: "2026-02-04", category: "メンテナンス", title: "【緊急】システムメンテナンスについて", folder: "2026-02-04-【緊急】システムメンテナンスについて", pinned: true, isFinished: false },
{ date: "2026-02-09", category: "重要", title: "WorldNowサービス終了のお知らせ", folder: "2026-02-09-WorldNow サービス終了のお知らせ", pinned: false, isFinished: false }
];

function displayNews(filter = 'すべて', keyword = '') {
    const list = document.getElementById('newsList');
    const totalCountEl = document.getElementById('totalCount');
    if (!list) return;

    const today = new Date();
    list.innerHTML = '';

    const sortedData = [...window.newsData].sort((a, b) => {
        const aPriority = (a.category === '重要' || a.pinned);
        const bPriority = (b.category === '重要' || b.pinned);
        if (aPriority !== bPriority) return aPriority ? -1 : 1;
        return new Date(b.date) - new Date(a.date);
    });

    const filteredData = sortedData.filter(item => {
        const matchCat = (filter === 'すべて' || item.category === filter);
        const matchKey = item.title.toLowerCase().includes(keyword.toLowerCase());
        return matchCat && matchKey;
    });

    filteredData.forEach(item => {
        const postDate = new Date(item.date);
        const diffDays = (today - postDate) / (1000 * 60 * 60 * 24);
        
        const li = document.createElement('li');
        li.className = 'news-item';

        if (item.isFinished) li.classList.add('is-finished');
        if (item.pinned) li.classList.add('is-pinned');

        let catClass = 'other';
        if (item.category === 'メンテナンス') catClass = 'maintenance';
        if (item.category === '重要') catClass = 'important';

        const newBadge = (diffDays >= 0 && diffDays < 3) ? '<span class="new-badge">NEW</span>' : '';

        li.innerHTML = `
    <a href="../information/${item.folder}/">
        <span class="date">${item.date}</span>
        <span class="category ${catClass}">${item.category}</span>
        <span class="title">${item.title}</span>
        ${newBadge}
    </a>`;
        list.appendChild(li);
    });

    if (totalCountEl) totalCountEl.innerText = filteredData.length;
}

function filterCategory(cat) {

    document.querySelectorAll('.cat-btn').forEach(btn => {
        btn.classList.toggle('active', btn.innerText === cat);
    });
    

    const keyword = document.getElementById('searchInput')?.value || '';
    displayNews(cat, keyword);
}


document.addEventListener('DOMContentLoaded', () => {

    displayNews();

    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');


    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const activeBtn = document.querySelector('.cat-btn.active');
            const currentCat = activeBtn ? activeBtn.innerText : 'すべて';
            displayNews(currentCat, e.target.value);
        });
    }


    if (searchButton) {
        searchButton.addEventListener('click', () => {
            const activeBtn = document.querySelector('.cat-btn.active');
            const currentCat = activeBtn ? activeBtn.innerText : 'すべて';
            displayNews(currentCat, searchInput.value);
        });
    }
});
