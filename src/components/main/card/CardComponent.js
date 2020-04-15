import './CardComponent.style.scss';
import rotate from '../../../assets/rotate.svg';

export class CardComponent {
  constructor(data) {
    this.data = data;
    this.cardNode = null;
    this.buildCard();
    this.setEvents();
    this.activeCard = false;
  }

  get getCardNode() {
    return this.cardNode;
  }

  buildCard() {
    this.cardNode = document.createElement('div');
    this.cardNode.classList.add('cards__item');
    const front = this.buildContent('front', this.data.word);
    this.cardNode.append(front);

    const back = this.buildContent('back', this.data.translation);
    this.cardNode.append(back);

    const rotateBlock = document.createElement('img');
    rotateBlock.classList.add('rotate');
    rotateBlock.src = rotate;
    this.cardNode.append(rotateBlock);
  }

  buildContent(className, text) {
    const block = document.createElement('div');
    block.style.backgroundImage = `url(./${this.data.image})`;
    block.classList.add(className);

    const textBlock = document.createElement('div');
    textBlock.classList.add('card-header');
    textBlock.textContent = text;
    block.append(textBlock);
    return block;
  }

  setEvents() {
    this.cardNode.addEventListener('click', (event) => this.onRotateCard(event));

    this.cardNode.addEventListener('mouseleave', (event) => this.onMouseLeaveCard(event));
  }

  onRotateCard(event) {
    event.stopPropagation();
    if (event.target.classList.contains('rotate')) {
      this.cardNode.classList.add('cards__item_active');
      this.activeCard = true;
    }
    if (!this.activeCard) {
      new Audio(this.data.audioSrc).play();
    }
  }

  onMouseLeaveCard(event) {
    event.stopPropagation();
    this.cardNode.classList.remove('cards__item_active');
    this.activeCard = false;
  }

  // TODO: watch this
  resetCard() {
    this.cardNode.removeEventListener('click', (event) => this.onRotateCard(event));
    this.cardNode.removeEventListener('mouseleave', (event) => this.onMouseLeaveCard(event));
    this.cardNode.remove();
  }
}
