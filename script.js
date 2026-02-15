function updateStatus() {
    const statusEl = document.getElementById('status-message');
    if (!statusEl) return;

    const now = new Date();
    const month = now.getMonth() + 1;
    const date = now.getDate();
    const day = now.getDay();
    const hour = now.getHours();

    const manualClosed = false; 
    const holidays = ["2/11", "2/23", "3/20", "4/29", "5/4", "5/5", "5/6", "7/20", "8/11", "9/21", "9/22", "9/23", "10/12", "11/3", "11/23"];
    const todayStr = `${month}/${date}`;

    const isHoliday = holidays.includes(todayStr);
    const isWeekend = (day === 0 || day === 6);
    const isOffHours = (hour < 10 || hour >= 17);

    if (manualClosed || isHoliday || isWeekend || isOffHours) {
        statusEl.textContent = "土日祝・夜間は返信休止";
        statusEl.className = "status-badge status-closed";
    } else {
        statusEl.textContent = "返信対応時間中";
        statusEl.className = "status-badge status-open";
    }
}
updateStatus();


const scrollTopBtn = document.getElementById('js-scroll-top');

window.addEventListener('scroll', () => {
  if (window.scrollY > 100) {
    scrollTopBtn.classList.add('is-show');
  } else {
    scrollTopBtn.classList.remove('is-show');
  }
});

scrollTopBtn.addEventListener('click', (e) => {
  e.preventDefault();
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});
