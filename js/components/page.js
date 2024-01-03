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
}
