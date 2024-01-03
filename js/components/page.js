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
}
