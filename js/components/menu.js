// allowedTags array
const allowedTags = [
  {
    id: 'page-title',
    tag: 'h1',
    label: 'Heading 1',
  },
  {
    id: 'paragraph',
    tag: 'p',
    label: 'Paragraph',
  },
];

class SelectMenu {
  constructor(props) {
    this.props = props;
    this.state = {
      command: '',
      items: allowedTags,
      selectedItem: 0,
    };
    this.keyDownHandler = this.keyDownHandler.bind(this);
    this.close = this.close.bind(this);

    this.render();
    this.addEventListeners();
  }

  addEventListeners() {
    document.addEventListener('keydown', this.keyDownHandler);
  }

  removeEventListeners() {
    document.removeEventListener('keydown', this.keyDownHandler);
  }

  close() {
    this.removeEventListeners();
  }

  updateItems(command) {
    const items = allowedTags.filter((tag) => tag.tag.includes(command));
    this.setState({ items });
  }

  keyDownHandler(e) {
    const { items, command, selectedItem } = this.state;
    const { onSelect } = this.props;

    let newSelectedItem;
    switch (e.key) {
      case 'Enter':
        e.preventDefault();
        onSelect(items[selectedItem].tag);
        break;
      case 'Backspace':
        if (!command) this.close();
        this.setState({ command: command.substring(0, command.length - 1) });
        break;
      case 'ArrowUp':
        e.preventDefault();
        newSelectedItem = selectedItem === 0 ? items.length - 1 : selectedItem - 1;
        break;
      case 'ArrowDown':
      case 'Tab':
        e.preventDefault();
        e.preventDefault();
        newSelectedItem = selectedItem === items.length - 1 ? 0 : selectedItem + 1;
        break;
      default:
        this.setState({ command: command + e.key });
        return;
    }

    this.setState({ selectedItem: newSelectedItem });
  }

  render() {
    const { items, selectedItem } = this.state;
    const { onSelect } = this.props;

    const selectMenu = document.createElement('div');
    selectMenu.classList.add('SelectMenu');

    const itemsContainer = document.createElement('div');
    itemsContainer.classList.add('Items');

    items.forEach((item, index) => {
      const isSelectedItem = index === selectedItem;

      const itemElement = document.createElement('div');
      itemElement.classList.add(isSelectedItem ? 'selectedItem' : null);

      itemElement.innerHTML = `<div>${item.label}</div>`;

      itemElement.addEventListener('click', () => onSelect(item.tag));
      itemElement.addEventListener('keydown', () => onSelect(item.tag));

      itemsContainer.appendChild(itemElement);
    });

    selectMenu.appendChild(itemsContainer);
    document.body.appendChild(selectMenu);
  }
}

const closeFunction = () => console.log('Close function called');
const onSelectFunction = (tag) => console.log(`Selected: ${tag}`);

const selectMenuInstance = new SelectMenu({
  close: closeFunction,
  onSelect: onSelectFunction,
});

selectMenuInstance.render();
