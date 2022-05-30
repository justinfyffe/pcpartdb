import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  Method,
} from 'axios';

export class ApiClient {
  constructor(private axios: AxiosInstance, private baseUrl: string) {}

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
      const response = await this.axios.request<T>({
        ...config,
        method,
        url: `${this.baseUrl}/api/${path}`,
        data,
        withCredentials: true,
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

export const apiClient = new ApiClient(axios, process.env.WEBSITE_URL || '');
