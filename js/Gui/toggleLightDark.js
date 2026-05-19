function toggleTheme() {
	const body = document.body;
	const icon = document.getElementById('theme-icon');
	const button = document.querySelector('.theme-toggle span:last-child');
  
	if (body.classList.contains('light-theme')) {
		body.classList.remove('light-theme');
		icon.textContent = '☀️';
		button.textContent = 'Light Mode';
		localStorage.setItem('theme', 'dark');
	} else {
		body.classList.add('light-theme');
		icon.textContent = '🌙';
		button.textContent = 'Dark Mode';
		localStorage.setItem('theme', 'light');
	}

}