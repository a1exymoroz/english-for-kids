import './ResultsComponents.style.scss';
import { CardComponent } from '../game/card/CardComponent';

export class ResultsComponent {
  constructor(data) {
    this.data = data;
    this.titles = this.data.map((element) => element.section);
    this.wrapperNode = null;
    this.tableNode = null;
    this.rootNode = null;
    this.result = JSON.parse(localStorage.getItem('english-results')) || {};
  }

  buildResults(rootNode) {
    this.rootNode = rootNode;
    this.wrapperNode = document.createElement('div');
    this.wrapperNode.classList.add('result__block');
    this.rootNode.append(this.wrapperNode);

    const repeatWordsButton = document.createElement('button');
    repeatWordsButton.classList.add('result__button');
    repeatWordsButton.innerHTML = 'Repeat difficult words &#128074;';
    repeatWordsButton.disabled = !this.getRepeatDifficultWords().length;
    this.wrapperNode.append(repeatWordsButton);

    const resetButton = document.createElement('button');
    resetButton.classList.add('result__button');
    resetButton.innerHTML = 'Reset &#10071;';
    this.wrapperNode.append(resetButton);

    this.tableNode = document.createElement('div');
    this.wrapperNode.append(this.tableNode);
    this.buildTable();

    resetButton.addEventListener('click', (event) => {
      event.stopPropagation();
      repeatWordsButton.disabled = true;
      this.resetTable();
    });
    repeatWordsButton.addEventListener('click', (event) => this.repeatDifficultWords(event));
  }

  resetTable() {
    this.result = {};
    localStorage.setItem('english-results', JSON.stringify(this.result));

    this.tableNode.remove();
    this.tableNode = document.createElement('div');
    this.wrapperNode.append(this.tableNode);
    this.buildTable();
  }

  repeatDifficultWords() {
    event.stopPropagation();

    const repeatWords = this.getRepeatDifficultWords();

    this.buildRepeatWorlds(repeatWords);
  }

  getRepeatDifficultWords() {
    return this.data
      .reduce((acu, cur) => {
        cur.items.forEach((item) => {
          const success = this.getWordResult(`${cur.section}.${item.word}.correct`) || 0;
          const wrong = this.getWordResult(`${cur.section}.${item.word}.wrong`) || 0;

          acu.push({
            section: cur.section,
            item,
            percentWrong: this.getWrongPercent(success, wrong),
          });
        });

        return acu;
      }, [])
      .filter((element) => element.percentWrong)
      .sort((a, b) => b.percentWrong - a.percentWrong)
      .splice(0, 8);
  }

  buildRepeatWorlds(repeatWords) {
    this.wrapperNode.remove();
    this.wrapperNode = document.createElement('div');
    this.rootNode.append(this.wrapperNode);
    this.wrapperNode.classList.add('cards__block');
    repeatWords.forEach((element, index) => {
      const card = new CardComponent(element.item, false, index, element.section);

      card.setResult = (section, word, type) => {
        this.setWordResult(section, word, type);
      };
      this.wrapperNode.append(card.cardNode);
    });
  }

  buildTable() {
    this.tableNode.classList.add('table__content');
    const table = document.createElement('table');
    this.tableNode.append(table);
    table.border = '1';
    this.buildHeaderTable(table);
    this.buildBodyTable(table);
    this.setSortEvent();
  }

  buildHeaderTable(table) {
    const tr = document.createElement('tr');
    ['Category', 'Word', 'Translate', '&#9997;', '&#9989;', '&#10060;', '&#10060;%'].forEach(
      (element) => {
        const th = document.createElement('th');
        th.title = 'Sort';
        th.innerHTML = element;
        th.classList.add(...['result__table-items', 'result__table-items_header']);
        tr.append(th);
      },
    );
    table.append(tr);
  }

  setSortEvent() {
    const getCellValue = (tr, idx) => tr.children[idx].innerText || tr.children[idx].textContent;

    const comparer = (idx, asc) => (a, b) => ((v1, v2) => (v1 !== '' && v2 !== '' && !isNaN(v1) && !isNaN(v2)
      ? v1 - v2
      : v1.toString().localeCompare(v2)))(
      getCellValue(asc ? a : b, idx),
      getCellValue(asc ? b : a, idx),
    );

    // do the work...
    document.querySelectorAll('th').forEach((th) => th.addEventListener('click', (event) => {
      event.stopPropagation();
      const table = th.closest('table');
      Array.from(table.querySelectorAll('tr:nth-child(n+2)'))
        .sort(comparer(Array.from(th.parentNode.children).indexOf(th), (this.asc = !this.asc)))
        .forEach((tr) => table.appendChild(tr));
    }));
  }

  buildBodyTable(table) {
    this.data.forEach((category) => {
      category.items.forEach((categoryItem) => {
        const resultTr = document.createElement('tr');

        const tableCategory = document.createElement('td');
        tableCategory.classList.add('result__table-items');
        tableCategory.textContent = category.section;
        resultTr.append(tableCategory);

        const tableWord = document.createElement('td');
        tableWord.classList.add('result__table-items');
        tableWord.textContent = categoryItem.word;
        resultTr.append(tableWord);

        const tableTranslate = document.createElement('td');
        tableTranslate.classList.add('result__table-items');
        tableTranslate.textContent = categoryItem.translation;
        resultTr.append(tableTranslate);

        const tableTrain = document.createElement('td');
        tableTrain.classList.add('result__table-items');
        const strObjTrain = `${category.section}.${categoryItem.word}.train`;
        const trainResult = this.getWordResult(strObjTrain) || 0;
        tableTrain.textContent = trainResult;
        resultTr.append(tableTrain);

        const tableSuccess = document.createElement('td');
        tableSuccess.classList.add('result__table-items');
        const strObjSuccess = `${category.section}.${categoryItem.word}.correct`;
        const successResult = this.getWordResult(strObjSuccess) || 0;
        tableSuccess.textContent = successResult;
        resultTr.append(tableSuccess);

        const tableWrong = document.createElement('td');
        tableWrong.classList.add('result__table-items');
        const strObjWrong = `${category.section}.${categoryItem.word}.wrong`;
        const wrongResult = this.getWordResult(strObjWrong) || 0;
        tableWrong.textContent = wrongResult;
        resultTr.append(tableWrong);

        const tableWrongPercent = document.createElement('td');
        tableWrongPercent.classList.add('result__table-items');
        const wrongPercentResult = this.getWrongPercent(successResult, wrongResult);
        tableWrongPercent.textContent = wrongPercentResult;
        resultTr.append(tableWrongPercent);

        table.append(resultTr);
      });
    });
  }

  getWrongPercent(success, wrong) {
    if (!wrong) {
      return 0;
    }

    return Math.floor((wrong / (success + wrong)) * 100);
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
