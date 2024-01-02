import Input from './components/input.js';

const inputInstance = new Input({
  html: '<p>Hello World!</p>',
  tag: 'p',
  id: 'inputId123',
  placeholder: 'Your placeholder text',
});

console.log(inputInstance);