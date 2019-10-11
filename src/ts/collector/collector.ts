import getBundlePhobiaInfo, { BundlePhobiaInfo } from './bundlephobia';
import getGitHubInfo, { GitHubInfo } from './github';
import getNpmJsInfo, { NpmJsInfo } from './npmjs';
import { AutocompleteItem } from '../autocomplete/autocomplete';

export interface PackageInfo {
  name: string;
  bundlePhobia: BundlePhobiaInfo;
  github: GitHubInfo;
  npmJs: NpmJsInfo;
  stackOverflowQuestions: number;
}

export default async function(item: AutocompleteItem): Promise<PackageInfo> {
  return {
    name: item.name,
    bundlePhobia: await getBundlePhobiaInfo(item),
    github: await getGitHubInfo(item),
    npmJs: await getNpmJsInfo(item),
    stackOverflowQuestions: 5,
  };
}
