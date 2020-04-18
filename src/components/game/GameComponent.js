import './GameComponent.style.scss';
import { CardComponent } from './card/CardComponent';
import correctAudio from '../../assets/cards/audio/correct.mp3';
import errorAudio from '../../assets/cards/audio/error.mp3';

export class GameComponent {
  constructor(rootNode, data, isGameMode, section) {
    this.rootNode = rootNode;
    this.cards = [];
    this.data = data;
    this.gameAudio = [];
    this.indexOfGameAudio = null;
    this.gameNode = null;
    this.startGameNode = null;
    this.startsNode = null;
    this.isGameStart = false;
    this.isGameMode = isGameMode;
    this.errors = 0;
    this.changeLink = () => {};
    this.buildGame();
    this.resultsCallback = () => {};
    this.gameSection = section;
  }

  buildGame() {
    if (this.isGameMode) {
      this.gameBuild();
      this.setGameEvents();
    } else {
      this.trainBuild();
    }
  }

  trainBuild() {
    this.gameNode = document.createElement('div');
    this.buildCards();
    this.rootNode.append(this.gameNode);
  }

  gameBuild() {
    this.gameNode = document.createElement('div');

    this.startGameNode = document.createElement('button');
    this.startGameNode.classList.add('cards__startButton');
    this.startGameNode.textContent = 'Start';
    this.gameNode.append(this.startGameNode);

    this.startsNode = document.createElement('div');
    this.startsNode.classList.add('cards__stars');
    this.gameNode.append(this.startsNode);

    this.buildCards();
    this.rootNode.append(this.gameNode);
  }

  buildCards() {
    const cards = document.createElement('div');
    cards.classList.add('cards__block');
    this.data.forEach((element, index) => {
      const card = new CardComponent(element, this.isGameMode, index);
      card.onGameCardClick = (word) => {
        if (!this.isGameStart) {
          return;
        }
        if (this.checkWord(word)) {
          card.cardSuccessClicked();
        }
      };
      cards.append(card.cardNode);
      this.cards.push(card);
    });
    this.gameNode.append(cards);
  }

  setGameEvents() {
    this.startGameNode.addEventListener('click', (event) => this.onStartGame(event));
  }

  onStartGame(event) {
    event.stopPropagation();
    if (!this.isGameStart) {
      event.currentTarget.textContent = 'Repeat';
      this.shuffleAudio();
      this.isGameStart = true;
    }
    this.playAudio();
  }

  checkWord(word) {
    let isSameAudio = false;
    if (word === this.gameAudio[this.indexOfGameAudio].word) {
      this.resultsCallback(this.gameSection, this.gameAudio[this.indexOfGameAudio].word, 'correct');

      isSameAudio = true;

      new Audio(correctAudio).play();
      if (this.indexOfGameAudio === this.gameAudio.length - 1) {
        this.gameEnd();
        return isSameAudio;
      }
      this.indexOfGameAudio += 1;
      setTimeout(() => {
        this.playAudio();
      }, 1000);
    } else {
      this.resultsCallback(this.gameSection, this.gameAudio[this.indexOfGameAudio].word, 'wrong');
      this.errors += 1;
      new Audio(errorAudio).play();
    }

    this.addStar(isSameAudio);
    return isSameAudio;
  }

  addStar(isSameAudio) {
    const star = document.createElement('div');
    star.classList.add(isSameAudio ? 'star-succes' : 'star-error');
    this.startsNode.append(star);
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

  gameEnd() {
    const modal = document.createElement('div');
    modal.classList.add('cards__end-game');
    const span = document.createElement('span');
    span.textContent = this.errors ? `${this.errors} errors` : 'Success';
    modal.append(span);
    this.rootNode.append(modal);
    this.rootNode.classList.add('body-modal');
    modal.addEventListener('click', (event) => {
      event.stopPropagation();
      modal.remove();
      this.rootNode.classList.remove('body-modal');
      this.resetGameData();
    });
  }

  resetGameData() {
    this.cards.forEach((card) => {
      card.gameEnd();
    });
    this.isGameStart = false;
    this.startGameNode.textContent = 'Start';
    this.startsNode.innerHTML = '';
    this.errors = 0;
  }
}
