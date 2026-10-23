import { appConfig } from '../config/appConfig.js';

export const getClientConfig = (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      apiBaseUrl: appConfig.apiBaseUrl
    }
  });
};
