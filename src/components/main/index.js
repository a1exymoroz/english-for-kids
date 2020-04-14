import './style.scss';

export class MainBlock {
  constructor(data) {
    this.data = data;
    this.buildCards();
  }

  buildCards() {
    const cards = document.createElement('div');
    cards.classList.add('cards__block');
    this.data.forEach((element) => {
      const card = document.createElement('div');
      card.classList.add(...['card', 'mb-3', 'cards__item']);

      const header = document.createElement('h3');
      header.classList.add('card-header');
      header.textContent = element.word;
      card.append(header);

      const img = document.createElement('img');
      img.src = element.image;

      card.append(img);
      cards.append(card);
    });
    document.body.append(cards);
  }
}
