import './style.scss';
import { NavigationBlock } from './components/navigation';
import { cards } from './assets/cards/cards';
import { MainBlock } from './components/main';

class App {
  constructor(data) {
    this.data = data;
    this.buildApp();
  }

  buildApp() {
    const titles = this.data.map((element) => element.section);
    new NavigationBlock(titles);
    new MainBlock(this.data[0].items);
  }
}

new App(cards);
