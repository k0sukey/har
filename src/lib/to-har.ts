import { Har } from 'har-format';

const fs = window.require('fs');

export const toHar = async (path: string | null): Promise<Har | null> => {
  if (path === null) {
    return Promise.resolve(null);
  }

  try {
    const str = await fs.promises.readFile(path, 'utf8');
    return Promise.resolve(JSON.parse(str));
  } catch (e) {
    throw e;
  }
};
