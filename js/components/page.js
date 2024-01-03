import Input from './input.js';
import { setCaretToEnd } from '../functions/caretHelpers.js';
import random from '../functions/random.js';

const initialInput = {
  id: random(),
  html: '',
  tag: 'p',
  placeholder: 'Type / for blocks, @ to link docs or people',
};
