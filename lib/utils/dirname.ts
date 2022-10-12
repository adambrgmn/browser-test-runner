import * as url from 'url';

export function dirname(metaUrl: string) {
  return url.fileURLToPath(new URL('.', metaUrl));
}

export function filename(metaUrl: string) {
  return url.fileURLToPath(metaUrl);
}
