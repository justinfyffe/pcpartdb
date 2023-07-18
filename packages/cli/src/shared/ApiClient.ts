import { joinUrlParts } from '@pcpartdb/shared';
import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  Method,
} from 'axios';

interface ApiClientOptions {
  axios?: AxiosInstance;
  baseUrl: string;
  apiKey: string;
}

export class ApiClient {
  private axios: AxiosInstance;
  private baseUrl: string;
  private apiKey: string;

  constructor(options: ApiClientOptions) {
    this.axios = options.axios || axios;
    this.baseUrl = options.baseUrl;
    this.apiKey = options.apiKey;
  }

  async get<T = unknown>(path: string, config?: AxiosRequestConfig) {
    return await this.request<T>('GET', path, undefined, config);
  }

  async post<T = unknown>(
    path: string,
    data: unknown,
    config?: AxiosRequestConfig,
  ) {
    return await this.request<T>('POST', path, data, config);
  }

  async put<T = unknown>(
    path: string,
    data: unknown,
    config?: AxiosRequestConfig,
  ) {
    return await this.request<T>('PUT', path, data, config);
  }

  async delete<T = unknown>(
    path: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ) {
    return await this.request<T>('DELETE', path, data, config);
  }

  private async request<T = unknown>(
    method: Method,
    path: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ) {
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
      if (err instanceof AxiosError) {
        console.error(err.response?.data);
        throw err.response?.data;
      } else {
        throw err;
      }
    }
  }
}
