import './ResultsComponents.style.scss';

export class ResultsComponent {
  constructor(data) {
    this.data = data;
    this.titles = this.data.map((element) => element.section);
    this.wrapperNode = null;
    this.result = JSON.parse(localStorage.getItem('english-results')) || {};
  }

  buildResults(rootNode) {
    this.wrapperNode = document.createElement('div');
    rootNode.append(this.wrapperNode);
    this.buildLinkTabs();
    this.buildPaneTabs();
  }

  buildLinkTabs() {
    const navTabs = document.createElement('ul');
    this.wrapperNode.append(navTabs);
    navTabs.classList.add(...['nav', 'nav-tabs']);

    this.titles.forEach((element, index) => {
      const li = document.createElement('li');
      li.classList.add('nav-item');
      const a = document.createElement('a');
      a.classList.add('nav-link');
      a.href = `#${element}`;
      a.textContent = element;

      if (index === 0) {
        a.classList.add('active');
      }
      li.append(a);
      navTabs.append(li);
    });

    navTabs.addEventListener('click', (event) => {
      event.stopPropagation();

      if (event.target.classList.contains('nav-link')) {
        const word = event.target.textContent;
        this.setActiveLink(event.target.textContent);
        this.setActiveTab(word);
      }
    });
  }

  buildPaneTabs() {
    const navPans = document.createElement('div');
    this.wrapperNode.append(navPans);
    navPans.classList.add('tab-content');

    this.titles.forEach((element, index) => {
      const content = document.createElement('div');
      content.classList.add(...['tab-pane', 'fade']);
      content.id = `${element}`;
      content.append(this.getTabContent(element));

      if (index === 0) {
        content.classList.add(...['active', 'show']);
      }
      navPans.append(content);
    });
  }

  getTabContent(dataKey) {
    const content = document.createElement('div');
    const table = document.createElement('table');
    content.append(table);
    table.border = '1';
    const tr = document.createElement('tr');
    table.append(tr);
    ['Word', '&#9989;', '&#10060;'].forEach((element) => {
      const th = document.createElement('th');
      th.innerHTML = element;
      th.classList.add('modal__table-items');
      tr.append(th);
    });
    const words = this.data
      .find((element) => element.section === dataKey)
      .items.map((element) => element.word);

    words.forEach((item) => {
      const resultTr = document.createElement('tr');
      const word = document.createElement('td');
      word.classList.add('modal__table-items');
      word.textContent = item;
      resultTr.append(word);

      const success = document.createElement('td');
      success.classList.add('modal__table-items');
      const strObjSuccess = `${dataKey}.${item}.correct`;
      const successResult = this.getWordResult(strObjSuccess);
      success.textContent = successResult || 0;
      resultTr.append(success);

      const wrong = document.createElement('td');
      wrong.classList.add('modal__table-items');
      const strObjWrong = `${dataKey}.${item}.wrong`;
      const wrongResult = this.getWordResult(strObjWrong);
      wrong.textContent = wrongResult || 0;
      resultTr.append(wrong);

      table.append(resultTr);
    });

    return content;
  }

  setActiveLink(word) {
    const links = document.querySelector('.nav-tabs').querySelectorAll('.nav-link');
    links.forEach((element) => {
      element.classList.remove('active');
    });
    links.forEach((element) => {
      if (element.textContent === word) {
        element.classList.add('active');
      }
    });
  }

  setActiveTab(word) {
    const tabPanes = document.querySelectorAll('.tab-pane');
    tabPanes.forEach((element) => {
      element.classList.remove('active');
      element.classList.remove('show');
    });
    tabPanes.forEach((element) => {
      if (element.id === word) {
        element.classList.add('active');
        element.classList.add('show');
      }
    });
  }

  setWordResult(section, word, type) {
    [section, word].reduce((acu, cur) => {
      if (!acu[cur]) {
        acu[cur] = {};
      }
      return acu[cur];
    }, this.result);

    this.result[section][word][type] = this.result[section][word][type]
      ? (this.result[section][word][type] += 1)
      : 1;

    localStorage.setItem('english-results', JSON.stringify(this.result));
  }

  getWordResult(strObj) {
    const array = strObj.split('.');
    return array.reduce((acu, cur) => (acu ? acu[cur] : acu), this.result);
  }
}

// var arr = string.split('.');
// return arr.reduce(function(pv, cv){
//   return (pv) ? pv[cv] : pv;
// }, this);
