import { map, find, forEach } from 'lodash';

export interface AutocompleteItem {
  name: string;
  description: string;
  highlight: string;
  links: Npms.PackageLinks;
}

declare module Npms {
  export interface Result {
    highlight: string;
    package: Package;
    score: Score;
    searchScore: number;
  }

  export interface Package {
    author: PackageAuthor;
    date: string;
    description: string;
    keywords: string[];
    links: PackageLinks;
    homepage: string;
    npm: string;
    repository: string;
    maintainers: PackageMaintainer[];
    name: string;
    publisher: PackagePublisher;
    scope: string;
    version: string;
  }

  export interface PackageAuthor {
    name: string;
    url: string;
  }

  export interface PackageLinks {
    bugs?: string;
    homepage?: string;
    npm?: string;
    repository?: string;
  }

  export interface PackageMaintainer {
    username: string;
    email: string;
  }

  export interface PackagePublisher {
    email: string;
    username: string;
  }

  export interface Score {
    final: number;
    detail: DetailScore;
  }

  export interface DetailScore {
    maintenance: number;
    popularity: number;
    quality: number;
  }
}

export interface AutocompleteConfig {
  selector: string;
  onSelectedChanged?: (items: AutocompleteItem[]) => void;
}

export default class Autocomplete {
  config: AutocompleteConfig;

  element: HTMLElement;
  itemsWrapper: HTMLElement;

  selected: AutocompleteItem[] = [];

  isOpened: boolean = false;

  onDocumentClickHandlerBounded = this.onDocumentClickHandler.bind(this);

  constructor(config: AutocompleteConfig) {
    this.config = config;

    this.element = document.querySelector(this.config.selector);
    this.itemsWrapper = this.element.querySelector('.autocomplete__items');
  }

  open() {
    document.addEventListener('click', this.onDocumentClickHandlerBounded);

    this.element.style.display = 'block';
    this.isOpened = true;
  }

  close() {
    document.removeEventListener('click', this.onDocumentClickHandlerBounded);

    this.element.style.display = 'none';
    this.isOpened = false;
  }

  onDocumentClickHandler() {
    this.close();
  }

  setItems(items: AutocompleteItem[]) {
    this.itemsWrapper.innerHTML = '';

    forEach(items, item => {
      const autocompleteItem = document.createElement('div');
      autocompleteItem.classList.add('autocomplete-item');

      autocompleteItem.innerHTML = `
        <div class="autocomplete-item__header">${item.highlight}</div>
        <div class="autocomplete-item__description">${item.description}</div>
      `;

      autocompleteItem.addEventListener('click', (event) => {
        event.stopPropagation();

        this.selectItem(item);
      });

      this.itemsWrapper.appendChild(autocompleteItem);
    });
  }

  selectItem(item: AutocompleteItem) {
    const isExist = find(this.selected, ['name', item.name]);

    if (isExist) {
      return;
    }

    this.selected.push(item);

    if (this.config.onSelectedChanged) {
      this.config.onSelectedChanged(this.selected);
    }
  }

  formatDataFromNpms(data: Npms.Result[]): AutocompleteItem[] {
    return map(data, result => {
      return {
        name: result.package.name,
        description: result.package.description,
        highlight: result.highlight,
        links: result.package.links,
      };
    });
  }
}
