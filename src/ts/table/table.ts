import { forEach } from 'lodash';
import { PackageInfo } from '../collector/collector';

export interface TableConfig {
  selector: string;
}

export default class Table {
  config: TableConfig;

  element: HTMLElement;

  constructor(config: TableConfig) {
    this.config = config;

    this.element = document.querySelector(this.config.selector);
  }

  setItems(items: PackageInfo[]) {
    console.log('>>> table set info', items);

    this.element.innerHTML = `
      <div class="table__row table__row_header">
        <div class="table__th">Package</div>
        <div class="table__th">Created at</div>
        <div class="table__th">Minified (kB)</div>
        <div class="table__th">Minified + gzipped (kB)</div>
        <div class="table__th">Stars</div>
        <div class="table__th">Opened issues</div>
        <div class="table__th">Closed issues</div>
        <div class="table__th">Weekly downloads</div>
        <div class="table__th">StackOverflow questions</div>
        <div class="table__th">LICENSE</div>
      </div>
    `;

    forEach(items, (item: any) => {
      const tr = document.createElement('div');
      tr.classList.add('table__row');

      tr.innerHTML = `
        <div class="table__td">${item.name}</div>
        <div class="table__td">${item.github.createdAt}</div>
        <div class="table__td">${item.bundlePhobia.minified}</div>
        <div class="table__td">${item.bundlePhobia.gzipped}</div>
        <div class="table__td">${item.github.stars}</div>
        <div class="table__td">${item.github.issues.opened}</div>
        <div class="table__td">${item.github.issues.closed}</div>
        <div class="table__td">${item.npmJs.weeklyDownloads}</div>
        <div class="table__td">${item.stackOverflowQuestions}</div>
        <div class="table__td">${item.github.license.name}</div>
      `;

      this.element.appendChild(tr);
    });
  }
}
