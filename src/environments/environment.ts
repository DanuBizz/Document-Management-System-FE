import { commonConfig } from '../config/config';

export const environment = {
  production: true,
  apiUrl: 'http://localhost:8080',
  ...commonConfig,
};
