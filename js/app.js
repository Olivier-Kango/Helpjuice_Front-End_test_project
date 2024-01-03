import Input from './components/input.js';
// import EditablePage from './components/page.js';

// const editablePage = new EditablePage();
// const appContainer = document.getElementById('app');

// appContainer.appendChild(editablePage.render());

// Your testing code goes here
const inputContainer = document.getElementById('inputContainer');

// Create an instance of Input
const input = new Input({
  id: 'uniqueId', // Provide a unique ID
  html: '', // Initial HTML content
  tag: 'p', // Initial tag
  placeholder: 'Enter text here Olk', // Placeholder text
  addInput: () => {}, // Function to add input
  deleteInput: () => {}, // Function to delete input
  updatePage: (data) => {
    // Logique pour mettre à jour la page avec les données fournies (data)
    console.log('Update page with:', data);
  }, // Function to update page
});

// Render the Input component
inputContainer.appendChild(input.render());
