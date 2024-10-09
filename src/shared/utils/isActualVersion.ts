import axios from 'axios';

import { version } from '../../../package.json';

export const isActualVersion = async () => {
  const actualVersion = await (await axios.get('/manifest.json')).data.version;

  return version === actualVersion;
};
