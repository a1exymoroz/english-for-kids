import './GameComponent.style.scss';
import { CardComponent } from './card/CardComponent';
import toggle from './toggle.html';
import correctAudio from '../../assets/cards/audio/correct.mp3';
import errorAudio from '../../assets/cards/audio/error.mp3';

export class GameComponent {
  constructor() {
    this.cards = [];
    this.data = [];
    this.gameAudio = [];
    this.indexOfGameAudio = null;
    this.gameNode = null;
    this.startGameNode = null;
    this.isGameStart = false;
    this.changeGameMode = () => {};
  }

  buildGame(data, isGameMode) {
    this.data = data;

    if (isGameMode) {
      this.gameBuild(data, isGameMode);
      this.setGameEvents(isGameMode);
    } else {
      this.trainBuild(data, isGameMode);
      this.setTrainEvents(isGameMode);
    }
  }

  trainBuild(data, isGameMode) {
    this.gameNode = document.createElement('div');
    const toggleBlock = document.createElement('div');
    toggleBlock.classList.add('toggle__game');
    toggleBlock.innerHTML = toggle;
    this.gameNode.append(toggleBlock);

    this.buildCards(data, isGameMode);
    document.body.append(this.gameNode);
  }

  gameBuild(data, isGameMode) {
    this.gameNode = document.createElement('div');
    const toggleBlock = document.createElement('div');
    toggleBlock.classList.add('toggle__game');
    toggleBlock.innerHTML = toggle;
    this.gameNode.append(toggleBlock);

    this.startGameNode = document.createElement('button');
    this.startGameNode.textContent = 'Start';
    this.gameNode.append(this.startGameNode);

    this.buildCards(data, isGameMode);
    document.body.append(this.gameNode);
  }

  buildCards(data, isGameMode) {
    const cards = document.createElement('div');
    cards.classList.add('cards__block');
    data.forEach((element, index) => {
      const card = new CardComponent(element, isGameMode, index);
      card.onGameCardClick = (word) => {
        if (this.checkWord(word)) {
          card.cardSuccessClicked();
        }
      };
      cards.append(card.cardNode);
      this.cards.push(card);
    });
    this.gameNode.append(cards);
  }

  setGameEvents(isGameMode) {
    this.setTrainEvents(isGameMode);
    this.startGameNode.addEventListener('click', (event) => this.onStartGame(event));
  }

  setTrainEvents(isGameMode) {
    this.toggleGame = document.querySelector('.custom-control-input');
    this.toggleGame.checked = isGameMode;
    this.toggleGame.addEventListener('change', (event) => this.onToggleGame(event));
  }

  onToggleGame(event) {
    this.changeGameMode(event.target.checked);
  }

  onStartGame(event) {
    event.stopPropagation();
    if (this.isGameStart) {
      this.playAudio();
    } else {
      event.currentTarget.textContent = 'Repeat';
      this.shuffleAudio();
      this.playAudio();

      this.isGameStart = true;
    }
  }

  checkWord(word) {
    let isSameAudio = false;
    if (word === this.gameAudio[this.indexOfGameAudio].word) {
      isSameAudio = true;
      this.indexOfGameAudio += 1;
      new Audio(correctAudio).play();
      setTimeout(() => {
        this.playAudio();
      }, 1000);
      return isSameAudio;
    }
    new Audio(errorAudio).play();
    return isSameAudio;
  }

  playAudio() {
    new Audio(this.gameAudio[this.indexOfGameAudio].audioSrc).play();
  }

  shuffleAudio() {
    this.gameAudio = [...this.data];
    for (let i = this.gameAudio.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.gameAudio[i], this.gameAudio[j]] = [this.gameAudio[j], this.gameAudio[i]];
    }
    this.indexOfGameAudio = 0;
  }

  resetCards() {
    this.toggleGame.removeEventListener('change', (event) => this.onToggleGame(event));
    this.startGameNode.removeEventListener('click', (event) => this.onStartGame(event));
    this.cards.forEach((card) => {
      card.resetCard();
    });
    this.cards = [];
    this.gameNode.remove();
  }
}
