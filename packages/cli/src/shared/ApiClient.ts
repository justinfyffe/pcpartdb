import { joinUrlParts } from '@pcpartdb/shared';
import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  Method,
} from 'axios';
import { sleep } from './process';

const FIVE_SECONDS_MS = 1000 * 5;

interface ApiClientOptions {
  axios?: AxiosInstance;
  baseUrl: string;
  apiKey: string;

  retryDelay?: number;
}

interface ApiRequestOptions {
  retries?: number;
}

export class ApiClient {
  private axios: AxiosInstance;
  private baseUrl: string;
  private apiKey: string;
  private retryDelay: number;

  constructor(options: ApiClientOptions) {
    this.axios = options.axios || axios;
    this.baseUrl = options.baseUrl;
    this.apiKey = options.apiKey;
    this.retryDelay = options.retryDelay || FIVE_SECONDS_MS;
  }

  async get<T = unknown>(
    path: string,
    options?: ApiRequestOptions,
    config?: AxiosRequestConfig,
  ) {
    return await this.request<T>('GET', path, undefined, options, config);
  }

  async post<T = unknown>(
    path: string,
    data: unknown,
    options?: ApiRequestOptions,
    config?: AxiosRequestConfig,
  ) {
    return await this.request<T>('POST', path, data, options, config);
  }

  async put<T = unknown>(
    path: string,
    data: unknown,
    options?: ApiRequestOptions,
    config?: AxiosRequestConfig,
  ) {
    return await this.request<T>('PUT', path, data, options, config);
  }

  async delete<T = unknown>(
    path: string,
    data?: unknown,
    options?: ApiRequestOptions,
    config?: AxiosRequestConfig,
  ) {
    return await this.request<T>('DELETE', path, data, options, config);
  }

  private async request<T = unknown>(
    method: Method,
    path: string,
    data?: unknown,
    options?: ApiRequestOptions,
    config?: AxiosRequestConfig,
  ) {
    const retries = Math.max(options?.retries || 0, 0);
    for (let i = 0; i < retries + 1; ++i) {
      try {
        const url = joinUrlParts(this.baseUrl, 'api', path);
        const response = await this.axios.request<T>({
          ...config,
          method,
          url,
          data,
          headers: {
            authorization: `Bearer ${this.apiKey}`,
          },
        });
        return response?.data;
      } catch (err) {
        if (i < retries) {
          console.error(
            `Request failed. Retrying (up to ${retries} retries) after a short delay of ${this.retryDelay} ms.`,
          );
          await sleep(this.retryDelay);
        } else {
          if (err instanceof AxiosError) {
            console.error(err.response?.data);
            throw err.response?.data;
          } else {
            throw err;
          }
        }
      }
    }

    return null;
  }
}
