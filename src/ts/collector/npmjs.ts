import axios, { AxiosResponse } from 'axios';
import { AutocompleteItem } from '../autocomplete/autocomplete';

export interface NpmJsApiInfo {
  downloads: number;
  package: string;
  start: string;
  end: string;
}

export interface NpmJsInfo {
  weeklyDownloads: number;
}

async function getWeeklyDownloads(packageName: string): Promise<number> {
  const info = await axios.get<any, AxiosResponse<NpmJsApiInfo>>(
    `https://api.npmjs.org/downloads/point/last-week/${packageName}`,
  );

  return info.data.downloads;
}

export default async function(item: AutocompleteItem): Promise<NpmJsInfo> {
  return {
    weeklyDownloads: await getWeeklyDownloads(item.name),
  };
}
