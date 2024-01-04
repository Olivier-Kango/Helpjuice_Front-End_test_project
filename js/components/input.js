import { getCaretCoordinates, setCaretToEnd } from '../functions/caretHelpers.js';
import SelectMenu from './menu.js';

class Input {
  constructor(props) {
    // Set props
    this.props = props;

    // Initial state
    this.state = {
      htmlBackup: null,
      html: '',
      tag: 'p',
      previousKey: '',
      selectMenuIsOpen: false,
      selectMenuPosition: {
        x: null,
        y: null,
      },
    };

    // Bind methods
    this.onChangeHandler = this.onChangeHandler.bind(this);
    this.onKeyDownHandler = this.onKeyDownHandler.bind(this);
    this.onKeyUpHandler = this.onKeyUpHandler.bind(this);
    this.openSelectMenuHandler = this.openSelectMenuHandler.bind(this);
    this.closeSelectMenuHandler = this.closeSelectMenuHandler.bind(this);
    this.tagSelectionHandler = this.tagSelectionHandler.bind(this);

    this.render();
  }

  setState(newState) {
    this.state = { ...this.state, ...newState };
    this.render();
  }

  componentDidMount() {
    const { html, tag } = this.props;
    this.setState({ html, tag });
    this.updatePage({ id: this.props.id, html, tag });
  }

  componentDidUpdate(prevState) {
    const { html, tag } = this.state;
    const htmlChanged = prevState.html !== html;
    const tagChanged = prevState.tag !== tag;

    if (htmlChanged || tagChanged) {
      const { updatePage, id } = this.props;
      updatePage({
        id,
        html,
        tag,
      });
    }
  }

  onChangeHandler() {
    const newHtml = document.querySelector('.Input').textContent;
    console.log('New HTML content:', newHtml);
    this.setState({ html: newHtml });
  }

  onKeyDownHandler(e) {
    console.log('Key pressed:', e.key);

    // Handling '/' key press
    if (e.key === '/') {
      const htmlBackup = document.querySelector('.Input').textContent;
      console.log('Backup HTML content:', htmlBackup);
      this.setState({ htmlBackup });
    }

    // Handling 'Enter' key press
    if (e.key === 'Enter') {
      const { previousKey, selectMenuIsOpen } = this.state;
      if (previousKey !== 'Shift' && !selectMenuIsOpen) {
        const { addInput, id } = this.props;
        e.preventDefault();
        addInput({
          id,
          ref: this.contentEditable,
        });
        console.log('Enter key pressed');
      }
    }

    const { html } = this.state;
    const { deleteInput, id } = this.props;

    // Handling 'Backspace' key press
    if (e.key === 'Backspace' && !html) {
      e.preventDefault();
      deleteInput({
        id,
        ref: this.contentEditable,
      });
      console.log('Backspace key pressed');
    }
    this.setState({ previousKey: e.key });
  }

  onKeyUpHandler(e) {
    if (e.key === '/') {
      this.openSelectMenuHandler();
    }
  }

  openSelectMenuHandler() {
    const { x, y } = getCaretCoordinates();
    this.setState({
      selectMenuIsOpen: true,
      selectMenuPosition: { x, y },
    });

    this.selectMenuInstance = new SelectMenu({
      onSelect: this.tagSelectionHandler.bind(this),
    });
    this.selectMenuInstance.render();
    document.body.appendChild(this.selectMenuInstance.selectMenu);

    document.addEventListener('click', this.closeSelectMenuHandler);
  }

  closeSelectMenuHandler() {
    this.setState({
      htmlBackup: null,
      selectMenuIsOpen: false,
      selectMenuPosition: { x: null, y: null },
    });

    this.selectMenuInstance.close();
    document.removeEventListener('click', this.closeSelectMenuHandler);
  }

  tagSelectionHandler(tag) {
    const { htmlBackup } = this.state;
    this.setState({ tag, html: htmlBackup }, () => {
      setCaretToEnd(this.contentEditable);
      this.closeSelectMenuHandler();
    });
  }

  render() {
    const {
      html,
      tag,
    } = this.state;
    const { placeholder } = this.props;

    // Create the contentEditable element
    this.contentEditable = document.createElement('div');
    this.contentEditable.classList.add('Input');
    this.contentEditable.setAttribute('contenteditable', true);
    this.contentEditable.setAttribute('placeholder', placeholder);
    this.contentEditable.textContent = html;
    this.contentEditable.dataset.tag = tag;
    console.log('test', html);

    // Event listeners setup
    this.contentEditable.addEventListener('input', this.onChangeHandler);
    this.contentEditable.addEventListener('keydown', this.onKeyDownHandler);
    this.contentEditable.addEventListener('keyup', this.onKeyUpHandler);

    const wrapperDiv = document.createElement('div');
    wrapperDiv.classList.add('InputWrapper');
    wrapperDiv.appendChild(this.contentEditable);

    return wrapperDiv;
  }
}

export default Input;
