function toggleTheme() {
  const body = document.body;
  const icon = document.getElementById('theme-icon');
  const button = document.querySelector('.theme-toggle span:last-child');
  let isLight = null;
  
  if (body.classList.contains('light-theme')) {
    body.classList.remove('light-theme');
    icon.textContent = '☀️';
    button.textContent = 'Light Mode';
    localStorage.setItem('theme', 'dark');
	isLight = false;
  } else {
    body.classList.add('light-theme');
    icon.textContent = '🌙';
    button.textContent = 'Dark Mode';
    localStorage.setItem('theme', 'light');
	isLight = true;
  }
}
