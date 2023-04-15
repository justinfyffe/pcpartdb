import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  Method,
} from 'axios';

export class ViewModelsClient {
  constructor(private axios: AxiosInstance, private baseUrl: string) {}

  async get<T = unknown>(path: string, config?: AxiosRequestConfig) {
    try {
      const result = await this.request<T>('GET', path, undefined, config);
      return { props: result };
    } catch (error) {
      return { props: { error } };
    }
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
        url: `${this.baseUrl}/api/view-models/${path}`,
        data,
        withCredentials: true,
      });
      return response?.data;
    } catch (err) {
      if (err instanceof AxiosError) {
        throw err.response?.data;
      } else {
        throw err;
      }
    }
  }
}

export const viewModelsClient = new ViewModelsClient(
  axios,
  process.env.NEXT_PUBLIC_WEBSITE_URL || '',
);
