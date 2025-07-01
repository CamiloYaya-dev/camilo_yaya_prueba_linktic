const axios = require('axios');
const axiosRetry = require('axios-retry').default;
const logger = require('./logger');

const httpClient = axios.create();

axiosRetry(httpClient, {
  retries: 3,
  retryDelay: axiosRetry.exponentialDelay,
  retryCondition: axiosRetry.isRetryableError,
  onRetry: (retryCount, error, requestConfig) => {
    logger?.warn?.(`Retry attempt ${retryCount} for ${requestConfig.url}`);
  },
});

module.exports = httpClient;
