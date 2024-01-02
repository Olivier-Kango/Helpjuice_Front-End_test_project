import { getCaretCoordinates, setCaretToEnd } from '../functions/caretHelpers.js';
import SelectMenu from './menu.js';

class Input {
  constructor(props) {
    // Set props
    this.props = props;

    // Binding methods to the instance
    this.onChangeHandler = this.onChangeHandler.bind(this);
    this.onKeyDownHandler = this.onKeyDownHandler.bind(this);
    this.onKeyUpHandler = this.onKeyUpHandler.bind(this);
    this.openSelectMenuHandler = this.openSelectMenuHandler.bind(this);
    this.closeSelectMenuHandler = this.closeSelectMenuHandler.bind(this);
    this.tagSelectionHandler = this.tagSelectionHandler.bind(this);

    // Creating contentEditable element
    this.contentEditable = document.createElement('div');
    this.contentEditable.classList.add('Input');
    this.contentEditable.setAttribute('contenteditable', true);

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
  }

  componentDidMount() {
    const { html, tag } = this.props;
    this.setState({ html, tag });
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

  onChangeHandler(e) {
    this.setState({ html: e.target.textContent });
  }

  onKeyDownHandler(e) {
    if (e.key === '/') {
      const { html } = this.state;
      this.setState({ htmlBackup: html });
    }
    if (e.key === 'Enter') {
      const { previousKey, selectMenuIsOpen } = this.state;
      if (previousKey !== 'Shift' && !selectMenuIsOpen) {
        const { addInput, id } = this.props;
        e.preventDefault();
        addInput({
          id,
          ref: this.contentEditable.current,
        });
      }
    }

    const { html } = this.state;
    const { deleteInput, id } = this.props;
    if (e.key === 'Backspace' && !html) {
      e.preventDefault();
      deleteInput({
        id,
        ref: this.contentEditable.current,
      });
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
    document.addEventListener('click', this.closeSelectMenuHandler);
  }

  closeSelectMenuHandler() {
    this.setState({
      htmlBackup: null,
      selectMenuIsOpen: false,
      selectMenuPosition: { x: null, y: null },
    });
    document.removeEventListener('click', this.closeSelectMenuHandler);
  }

  tagSelectionHandler(tag) {
    const { htmlBackup } = this.state;
    this.setState({ tag, html: htmlBackup }, () => {
      setCaretToEnd(this.contentEditable.current);
      this.closeSelectMenuHandler();
    });
  }

  render() {
    const {
      selectMenuIsOpen,
      selectMenuPosition,
      html,
      tag,
    } = this.state;
    const { placeholder } = this.props;

    let selectMenu = '';
    if (selectMenuIsOpen) {
      // Assuming SelectMenu is a function that creates the SelectMenu element
      const menu = new SelectMenu({
        position: selectMenuPosition,
        onSelect: this.tagSelectionHandler,
        close: this.closeSelectMenuHandler,
      });

      selectMenu = menu.render();
    }
    const contentEditable = document.createElement('div');
    contentEditable.classList.add('Input');
    contentEditable.setAttribute('contenteditable', true);
    contentEditable.setAttribute('placeholder', placeholder);
    contentEditable.textContent = html;
    contentEditable.dataset.tag = tag;

    contentEditable.addEventListener('input', this.onChangeHandler);
    contentEditable.addEventListener('keydown', this.onKeyDownHandler);
    contentEditable.addEventListener('keyup', this.onKeyUpHandler);

    return [selectMenu, contentEditable];
  }
}

export default Input;
