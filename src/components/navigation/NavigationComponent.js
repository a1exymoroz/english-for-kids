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
    document.querySelector('.navbar-toggler').addEventListener('click', (event) => {
      event.stopPropagation();
      const target = event.currentTarget;
      target.classList.toggle('collapsed');
      const isExpanded = target.getAttribute('aria-expanded');
      target.setAttribute('aria-expanded', isExpanded === 'false' ? 'true' : 'false');
      document.querySelector('.navbar-collapse').classList.toggle('show');
    });

    const listItem = document.querySelectorAll('.nav-link');
    document.querySelector('.navbar-nav').addEventListener('click', (event) => {
      event.stopPropagation();

      if (event.target.classList.contains('nav-link')) {
        let linkIndex = 0;
        listItem.forEach((element, index) => {
          element.classList.remove('active');
          if (element === event.target) {
            linkIndex = index;
          }
        });

        event.target.classList.add('active');

        this.changeLink(linkIndex);
      }
    });
  }
}
