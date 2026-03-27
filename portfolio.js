const MS_PER_DAY = 1000 * 60 * 60 * 24;

function getDaysLeftUntilAge(birthDate, targetAge = 100) {
  const today = new Date();
  const targetDate = new Date(birthDate);
  targetDate.setFullYear(birthDate.getFullYear() + targetAge);

  return Math.max(0, Math.ceil((targetDate - today) / MS_PER_DAY));
}

function getDaysCoding(startDate) {
  const today = new Date();
  return Math.max(0, Math.floor((today - startDate) / MS_PER_DAY));
}


const birthday = new Date(1985, 10, 6);
const codeStart = new Date(2025, 6, 1);

const daysLeft = getDaysLeftUntilAge(birthday, 100);
const daysCoding = getDaysCoding(codeStart);


document.getElementById("days-left").textContent = daysLeft.toLocaleString();
document.getElementById("days-coding").textContent = daysCoding;

function initRevealOnScroll() {
    const elements = document.querySelectorAll('.fade-up');
  
    elements.forEach(el => el.classList.add('animate'));
  
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, {
      threshold: 0.15
    });
  
    elements.forEach((el) => observer.observe(el));
  }