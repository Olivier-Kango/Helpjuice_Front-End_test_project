class Input {
  constructor(props) {
    this.onChangeHandler = this.onChangeHandler.bind(this);
    this.onKeyDownHandler = this.onKeyDownHandler.bind(this);
    this.onKeyUpHandler = this.onKeyUpHandler.bind(this);
    this.openSelectMenuHandler = this.openSelectMenuHandler.bind(this);
    this.closeSelectMenuHandler = this.closeSelectMenuHandler.bind(this);
    this.tagSelectionHandler = this.tagSelectionHandler.bind(this);

    this.contentEditable = document.createElement('div');
    this.contentEditable.classList.add('Input');
    this.contentEditable.setAttribute('contenteditable', true);

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
}