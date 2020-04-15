import './GameComponent.style.scss';
import { CardComponent } from './card/CardComponent';

export class GameComponent {
  constructor() {
    this.cards = [];
  }

  buildCards(data) {
    const cards = document.createElement('div');
    cards.classList.add('cards__block');
    data.forEach((element) => {
      const card = new CardComponent(element);
      cards.append(card.cardNode);
      this.cards.push(card);
    });
    document.body.append(cards);
  }

  resetCards() {
    this.cards.forEach((card) => {
      card.resetCard();
    });
    this.cards = [];
  }
}
