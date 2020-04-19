import './style.scss';
import { NavigationComponent } from './components/navigation/NavigationComponent';
import { GameComponent } from './components/game/GameComponent';
import { cards } from './assets/cards/cards';
import toggle from './toggle.html';
import { ResultsComponent } from './components/results/ResultsComponents';

class App {
  constructor(data) {
    this.data = data;
    this.game = null;
    this.navigation = null;
    this.results = null;
    this.isGameMode = JSON.parse(localStorage.getItem('english-game-mode')) || false;
    this.indexLink = JSON.parse(localStorage.getItem('english-link')) || 0;
    this.sectionTitles = [];
    this.isInGame = false;
    this.wrapperNode = null;
    this.mainNode = null;
    this.allTitles = [];
    this.buildApp();
  }

  buildApp() {
    this.sectionTitles = this.data.map((element) => element.section);
    this.allTitles = ['Main page', ...this.sectionTitles, 'Results'];
    this.navigation = new NavigationComponent(this.allTitles, this.indexLink);
    this.results = new ResultsComponent(this.data);
    this.mainNode = document.createElement('div');
    this.mainNode.classList.add('main__block');
    document.body.append(this.mainNode);

    if (this.sectionTitles.includes(this.allTitles[this.indexLink])) {
      this.isInGame = true;
      this.buildGame();
    } else if (this.allTitles[this.indexLink] === 'Main page') {
      this.isInGame = false;
      this.buildMainPage();
    } else if (this.allTitles[this.indexLink] === 'Results') {
      this.isInGame = false;
      this.buildResultsPage();
    }

    this.navigation.changeLink = (word) => {
      this.changeLinkOnMainPage(word);
    };
  }

  buildMainPage() {
    this.wrapperNode = document.createElement('div');
    this.mainNode.append(this.wrapperNode);
    this.appendToggle(this.wrapperNode);
    this.appendMainPageLinks(this.wrapperNode);
  }

  buildGame() {
    this.wrapperNode = document.createElement('div');
    this.mainNode.append(this.wrapperNode);
    this.appendToggle(this.wrapperNode);
    this.game = new GameComponent(
      this.wrapperNode,
      this.data[this.indexLink - 1].items,
      this.isGameMode,
      this.data[this.indexLink - 1].section,
      this.results,
    );

    this.game.setResult = (section, word, type) => {
      this.results.setWordResult(section, word, type);
    };
  }

  buildResultsPage() {
    this.wrapperNode = document.createElement('div');
    this.mainNode.append(this.wrapperNode);
    this.results.buildResults(this.wrapperNode);
  }

  resetGame() {
    this.isInGame = true;
    this.wrapperNode.remove();
    this.buildGame();
  }

  resetMainPage() {
    this.isInGame = false;
    this.wrapperNode.remove();
    this.buildMainPage();
  }

  resetResultsPage() {
    this.isInGame = false;
    this.wrapperNode.remove();
    this.buildResultsPage();
  }

  changeLinkOnMainPage(word) {
    const index = this.allTitles.findIndex((element) => element === word);
    if (index === this.indexLink) {
      if (this.allTitles[index] === 'Results') {
        this.resetResultsPage();
      }
      return;
    }
    this.setLink(index);
    this.navigation.setActiveLink(word);

    if (this.allTitles[index] === 'Main page') {
      this.resetMainPage();
      return;
    }
    if (this.allTitles[index] === 'Results') {
      this.resetResultsPage();
      return;
    }

    this.resetGame();
  }

  setLink(index) {
    this.indexLink = index;
    localStorage.setItem('english-link', index);
  }

  appendMainPageLinks(node) {
    const titlesBlock = document.createElement('div');
    titlesBlock.classList.add('main__page_links');

    this.data.forEach((element) => {
      const a = document.createElement('a');
      a.classList.add('main-card');
      if (!this.isGameMode) {
        a.classList.add('green');
      }
      a.href = '#';

      const img = document.createElement('img');
      img.src = element.items[0].image;
      a.append(img);
      a.innerHTML += `${element.section}`;
      titlesBlock.append(a);
      a.addEventListener('click', (event) => {
        event.stopPropagation();
        this.changeLinkOnMainPage(element.section);
        titlesBlock.remove();
      });
    });
    node.append(titlesBlock);
  }

  appendToggle(node) {
    const toggleBlock = document.createElement('div');
    toggleBlock.classList.add('toggle__game');
    toggleBlock.innerHTML = toggle;

    node.append(toggleBlock);
    const toggleGame = document.querySelector('.switch-input');
    toggleGame.checked = !this.isGameMode;
    toggleGame.addEventListener('change', (event) => this.onToggleGame(event));
  }

  onToggleGame(event) {
    event.stopPropagation();
    this.setGameMode(!event.target.checked);
    if (this.isInGame) {
      this.resetGame();
    } else {
      this.resetMainPage();
    }
  }

  setGameMode(isGameMode) {
    this.isGameMode = isGameMode;
    localStorage.setItem('english-game-mode', isGameMode);
  }
}

new App(cards);
