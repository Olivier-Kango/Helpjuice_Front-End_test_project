const { matchSorter } = require('match-sorter');

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
    this.keyDownHandler = this.keyDownHandler.bind(this);
    this.state = {
      command: '',
      items: allowedTags,
      selectedItemIndex: 0,
    };
    this.close = this.close.bind(this);
    this.onSelect = props.onSelect;
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
    const items = matchSorter(allowedTags, command, { keys: ['tag'] });
    this.setState({ items });
  }

  keyDownHandler(e) {
    const { items, command, selectedItem } = this.state;
    const { onSelect } = this;

    let newSelectedItemIndex;
    switch (e.key) {
      case 'Enter':
        e.preventDefault();
        onSelect(items[selectedItem].tag);
        break;
      case 'Backspace':
        if (!command) this.close();
        this.setState({ command: command.slice(0, -1) });
        break;
      case 'ArrowUp':
        e.preventDefault();
        newSelectedItemIndex = selectedItem === 0 ? items.length - 1 : selectedItem - 1;
        break;
      case 'ArrowDown':
      case 'Tab':
        e.preventDefault();
        newSelectedItemIndex = (selectedItem + 1) % items.length;
        break;
      default:
        this.setState({ command: command + e.key });
        return;
    }

    this.setState({ selectedItem: newSelectedItemIndex });
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
export default SelectMenu;
