import template from './template.html';

export class NavigationBlock {
  constructor(titles) {
    document.body.innerHTML = template;
    this.titles = titles;

    this.buildNav();
    this.setEvents();
  }

  buildNav() {
    const nav = document.querySelector('#navbarColor01');
    const ul = document.createElement('ul');
    ul.classList.add(...['navbar-nav', 'mr-auto']);
    this.titles.forEach((element, index) => {
      const li = document.createElement('li');
      li.classList.add('navbar-nav');
      const a = document.createElement('a');
      a.classList.add('nav-link');
      a.href = '#';
      a.textContent = element;

      if (index === 0) {
        li.classList.add('active');
        const span = document.createElement('span');
        span.classList.add('sr-only');
        span.textContent = '(current)';
        a.append(span);
      }
      li.append(a);
      ul.append(li);
    });
    nav.append(ul);
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
  }
}
