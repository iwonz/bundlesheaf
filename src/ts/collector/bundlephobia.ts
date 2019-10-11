import axios, { AxiosResponse } from 'axios';
import { AutocompleteItem } from '../autocomplete/autocomplete';

export interface BundlePhobiaApiInfo {
  dependencyCount: number;
  dependencySizes: BundlePhobiaApiInfoDependencySize[];
  description: string;
  gzip: number;
  hasJSModule: boolean;
  hasJSNext: boolean;
  hasSideEffects: boolean;
  ignoredMissingDependencies: string[];
  name: string;
  repository: string;
  scoped: boolean;
  size: number;
  version: string;
}

export interface BundlePhobiaApiInfoDependencySize {
  approximateSize: number;
  name: string;
}

export interface BundlePhobiaInfo {
  minified: number;
  gzipped: number;
}

export default async function(item: AutocompleteItem): Promise<BundlePhobiaInfo> {
  const info = await axios.get<any, AxiosResponse<BundlePhobiaApiInfo>>(
    'https://bundlephobia.com/api/size?package=' + item.name,
  );

  return {
    minified: info.data.size,
    gzipped: info.data.gzip,
  };
}
