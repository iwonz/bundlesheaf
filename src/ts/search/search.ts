export interface SearchConfig {
  selector: string;
  onFocus?: Function;
  onBlur?: Function;
  onKeyUp?: Function;
}

export default class Search {
  config: SearchConfig;

  element: HTMLInputElement;

  constructor(config: SearchConfig) {
    this.config = config;

    this.element = document.querySelector(this.config.selector) as HTMLInputElement;

    this.addListeners();
  }

  focus() {
    this.element.dispatchEvent(new Event('focus'));
  }

  addListeners() {
    this.element.addEventListener('click', (event: any) => {
      event.stopPropagation();
    });

    if (this.config.onKeyUp) {
      this.element.addEventListener('keyup', event => {
        this.config.onKeyUp(event);
      });
    }

    if (this.config.onFocus) {
      this.element.addEventListener('focus', event => {
        this.config.onFocus(event);
      });
    }

    if (this.config.onBlur) {
      this.element.addEventListener('blur', event => {
        this.config.onBlur(event);
      });
    }
  }
}
