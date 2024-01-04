import EditablePage from './components/page.js';

document.addEventListener('DOMContentLoaded', () => {
  const editablePage = new EditablePage();
  const appContainer = document.getElementById('app');

  if (appContainer) {
    appContainer.appendChild(editablePage.render());
  } else {
    console.error("Element with ID 'app' not found.");
  }
});
