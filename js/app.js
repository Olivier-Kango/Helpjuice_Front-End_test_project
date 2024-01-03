import EditablePage from './components/page.js';

const editablePage = new EditablePage();
const appContainer = document.getElementById('app');

appContainer.appendChild(editablePage.render());
