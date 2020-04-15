import './style.scss';
import { NavigationComponent } from './components/navigation/NavigationComponent';
import { GameComponent } from './components/main/GameComponent';
import { cards } from './assets/cards/cards';

class App {
  constructor(data) {
    this.data = data;
    this.game = null;
    this.buildApp();
  }

  buildApp() {
    const titles = this.data.map((element) => element.section);
    const navigation = new NavigationComponent(titles);
    this.game = new GameComponent();
    this.buildMainBlock(0);

    navigation.changeLink = (index) => {
      this.game.resetCards();
      this.buildMainBlock(index);
    };
  }

  buildMainBlock(index) {
    this.game.buildCards(this.data[index].items);
  }
}

new App(cards);
