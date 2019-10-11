import axios, { AxiosResponse } from 'axios';
import { get, isEmpty, tail, split, defaultTo } from 'lodash';
import { AutocompleteItem } from '../autocomplete/autocomplete';

const GITHUB_MAGIC_ACCEPT_HEADER = 'application/vnd.github.squirrel-girl-preview';

export interface GitHubApiInfo {
  stargazers_count: number;
  license: GitHubApiInfoLicense;
  open_issues: number;
  created_at: string;
}

export interface GitHubApiInfoLicense {
  key: string;
  name: string;
  url: string;
}

export interface GitHubInfo {
  stars: number;
  issues: GitHubInfoIssues;
  license: GitHubInfoLicence;
  createdAt: string;
}

export interface GitHubInfoIssues {
  opened: number;
  closed: number;
}

export interface GitHubInfoLicence {
  name: string;
  url: string;
}

function getReposByRepository(repository: string) {
  return tail(split(repository, 'github.com/'));
}

async function getClosedIssues(repository: string): Promise<number> {
  const repos = getReposByRepository(repository);

  const info = await axios.get(`https://api.github.com/repos/${repos}/issues?state=closed`, {
    headers: {
      Accept: ['application/json', 'application/vnd.github+json', GITHUB_MAGIC_ACCEPT_HEADER].join(
        ',',
      ),
    },
  });

  return defaultTo(get(info, 'data.total_count'), 0);
}

export default async function(item: AutocompleteItem): Promise<GitHubInfo> {
  const repository = get(item, 'links.repository');

  if (isEmpty(repository)) {
    return null;
  }

  const repos = getReposByRepository(repository);

  const info = await axios.get<any, AxiosResponse<GitHubApiInfo>>(
    `https://api.github.com/repos/${repos}`,
  );

  return {
    stars: info.data.stargazers_count,
    issues: {
      opened: info.data.open_issues,
      closed: await getClosedIssues(repository),
    },
    license: {
      name: info.data.license.name,
      url: info.data.license.url,
    },
    createdAt: info.data.created_at,
  };
}
