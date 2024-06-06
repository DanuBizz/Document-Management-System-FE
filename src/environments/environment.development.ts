import { commonConfig } from '../config/config';

export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080',
  ...commonConfig,
};
