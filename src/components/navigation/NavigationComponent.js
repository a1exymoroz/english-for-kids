import template from './template.html';

export class NavigationComponent {
  constructor(titles, active = 0) {
    document.body.innerHTML = template;
    this.titles = titles;
    this.activeIndex = active;
    this.navListNode = null;

    this.buildNav();
    this.setEvents();
    this.changeLink = () => {};
  }

  buildNav() {
    const nav = document.querySelector('#navbarColor01');
    this.navListNode = document.createElement('ul');
    this.navListNode.classList.add(...['navbar-nav', 'mr-auto']);
    this.titles.forEach((element, index) => {
      const li = document.createElement('li');
      li.classList.add('nav-item');
      const a = document.createElement('a');
      a.classList.add('nav-link');
      a.href = '#';
      a.textContent = element;

      if (index === this.activeIndex) {
        a.classList.add('active');
      }
      li.append(a);
      this.navListNode.append(li);
    });
    nav.append(this.navListNode);
  }

  setEvents() {
    const toggler = document.querySelector('.navbar-toggler');

    const toggleNavber = () => {
      toggler.classList.toggle('collapsed');
      const isExpanded = toggler.getAttribute('aria-expanded');
      toggler.setAttribute('aria-expanded', isExpanded === 'false' ? 'true' : 'false');
      document.querySelector('.navbar-collapse').classList.toggle('show');
    };
    toggler.addEventListener('click', (event) => {
      event.stopPropagation();
      toggleNavber();
    });

    document.querySelector('.navbar-nav').addEventListener('click', (event) => {
      event.stopPropagation();

      if (event.target.classList.contains('nav-link')) {
        const word = event.target.textContent;
        this.setActiveLink(word);
        this.changeLink(word);

        // TODO: it is hardcoding
        if (document.body.offsetWidth < 992) {
          toggleNavber();
        }
      }
    });
  }

  setActiveLink(word) {
    const listItem = document.querySelectorAll('.nav-link');
    listItem.forEach((element) => {
      element.classList.remove('active');
    });
    listItem.forEach((element) => {
      if (element.textContent === word) {
        element.classList.add('active');
      }
    });
  }
}
