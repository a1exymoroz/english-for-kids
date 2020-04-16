import './style.scss';
import { NavigationComponent } from './components/navigation/NavigationComponent';
import { GameComponent } from './components/main/GameComponent';
import { cards } from './assets/cards/cards';

class App {
  constructor(data) {
    this.data = data;
    this.game = null;
    this.isGameMode = true;
    this.indexLink = 0;
    this.buildApp();
  }

  buildApp() {
    const titles = this.data.map((element) => element.section);
    const navigation = new NavigationComponent(titles);
    this.game = new GameComponent();
    this.buildMainBlock(this.indexLink);

    navigation.changeLink = (index) => {
      this.indexLink = index;
      this.reBuildMainBlock();
    };

    this.game.changeGameMode = (isGameMode) => {
      this.isGameMode = isGameMode;
      this.reBuildMainBlock();
    };
  }

  reBuildMainBlock() {
    this.game.resetCards();
    this.buildMainBlock();
  }

  buildMainBlock() {
    this.game.buildGame(this.data[this.indexLink].items, this.isGameMode);
  }
}

new App(cards);
