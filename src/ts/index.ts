import './assets';

import axios from 'axios';
import { debounce } from 'lodash';

import Autocomplete from './autocomplete/autocomplete';
import Search from './search/search';
import Table from './table/table';

import getPackageInfo, { PackageInfo } from './collector/collector';

const table = new Table({
  selector: '#table',
});

const autocomplete = new Autocomplete({
  selector: '#autocomplete',
  onSelectedChanged: async items => {
    const packages: PackageInfo[] = [];

    for (let i = 0; i < items.length; i++) {
      const packageInfo = await getPackageInfo(items[i]);

      packages.push(packageInfo);
    }

    search.focus();

    table.setItems(packages);
  },
});

const search = new Search({
  selector: '#search-field',
  onKeyUp: debounce(event => {
    if (event.keyCode === 27) {
      return;
    }

    if (event.keyCode === 13) {
      search.focus();
    }

    const query = event.target.value;

    if (query.length < 2) {
      return autocomplete.close();
    }

    if (!autocomplete.isOpened) {
      autocomplete.open();
    }

    axios.get('https://api.npms.io/v2/search/suggestions?q=' + query).then(response => {
      autocomplete.setItems(autocomplete.formatDataFromNpms(response.data));
    });
  }, 250),
  onFocus: (event: any) => {
    const query = event.target.value;

    if (query.length < 2) {
      return;
    }

    autocomplete.open();
  },
});

document.addEventListener('keyup', event => {
  if (event.keyCode !== 27) {
    return;
  }

  autocomplete.close();
});
