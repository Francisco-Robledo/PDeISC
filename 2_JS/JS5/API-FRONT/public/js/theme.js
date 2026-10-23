const storageKey = 'alumnos-client-theme';

export const initTheme = (button) => {
  const savedTheme = localStorage.getItem(storageKey) || 'light';
  document.documentElement.setAttribute('data-bs-theme', savedTheme);
  button.textContent = savedTheme === 'dark' ? '☀' : '☾';

  button.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-bs-theme');
    const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-bs-theme', nextTheme);
    localStorage.setItem(storageKey, nextTheme);
    button.textContent = nextTheme === 'dark' ? '☀' : '☾';
  });
};
