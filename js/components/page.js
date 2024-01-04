import Input from './input.js';
import { setCaretToEnd } from '../functions/caretHelpers.js';
import random from '../functions/random.js';

const initialInput = {
  id: random(),
  html: '',
  tag: 'p',
  placeholder: 'Type / for blocks, @ to link docs or people',
};

class EditablePage {
  constructor() {
    this.updatePageHandler = this.updatePageHandler.bind(this);
    this.addInputHandler = this.addInputHandler.bind(this);
    this.deleteInputHandler = this.deleteInputHandler.bind(this);
    this.state = { inputs: [initialInput] };
  }

  updatePageHandler(updatedInput) {
    const { inputs } = this.state;
    const index = inputs.map((b) => b.id).indexOf(updatedInput.id);
    switch (updatedInput.tag) {
      case 'h1':
        updatedInput.placeholder = 'Heading 1';
        break;
      case 'p':
        updatedInput.placeholder = 'Type / for blocks, @ to link docs or people';
        break;
      default:
        updatedInput.placeholder = '';
    }

    const updatedInputs = [...inputs];
    updatedInputs[index] = {
      ...updatedInputs[index],
      tag: updatedInput.tag,
      html: updatedInput.html,
      placeholder: updatedInput.placeholder,
    };
    this.state.inputs = updatedInputs;
  }

  addInputHandler(currentInput) {
    const newInput = { id: random(), html: '', tag: 'p' };
    const { inputs } = this.state;
    const index = inputs.map((b) => b.id).indexOf(currentInput.id);
    const updatedInputs = [...inputs];
    updatedInputs.splice(index + 1, 0, newInput);
    this.state.inputs = updatedInputs;
    currentInput.ref.nextElementSibling.focus();
  }

  deleteInputHandler(currentInput) {
    // Only delete the Input if there is a preceding one
    const previousInput = currentInput.ref.previousElementSibling;
    if (previousInput) {
      const { inputs } = this.state;
      const index = inputs.map((b) => b.id).indexOf(currentInput.id);
      const updatedInputs = [...inputs];
      updatedInputs.splice(index, 1);
      this.state.inputs = updatedInputs;
      setCaretToEnd(previousInput);
      previousInput.focus();
    }
  }

  render() {
    const { inputs } = this.state;
    const pageDiv = document.createElement('div');
    pageDiv.classList.add('Page');

    inputs.forEach((input) => {
      const inputElement = new Input({
        id: input.id,
        tag: input.tag,
        html: input.html,
        placeholder: input.placeholder,
        updatePage: this.updatePageHandler,
        addInput: this.addInputHandler,
        deleteInput: this.deleteInputHandler,
      });
      pageDiv.appendChild(inputElement.render());
    });

    return pageDiv;
  }
}

export default EditablePage;
