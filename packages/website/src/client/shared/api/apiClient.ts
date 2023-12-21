import {
  joinUrlParts,
  PREFERRED_CPU_BENCHMARK_HTTP_HEADER,
  PREFERRED_GPU_BENCHMARK_HTTP_HEADER,
} from '@pcpartdb/shared';
import axios, { AxiosError, AxiosInstance, Method } from 'axios';
import { RequestConfig } from './types';

export class ApiClient {
  constructor(private axios: AxiosInstance, private baseUrl: string) {}

  async get<T = unknown>(path: string, config?: RequestConfig) {
    return await this.request<T>('GET', path, undefined, config);
  }

  async post<T = unknown>(path: string, data: unknown, config?: RequestConfig) {
    return await this.request<T>('POST', path, data, config);
  }

  async put<T = unknown>(path: string, data: unknown, config?: RequestConfig) {
    return await this.request<T>('PUT', path, data, config);
  }

  async delete<T = unknown>(
    path: string,
    data?: unknown,
    config?: RequestConfig,
  ) {
    return await this.request<T>('DELETE', path, data, config);
  }

  private async request<T = unknown>(
    method: Method,
    path: string,
    data?: unknown,
    config?: RequestConfig,
  ) {
    try {
      this.addCommonHeaders(config);

      const url = joinUrlParts(this.baseUrl, 'api', path);
      const response = await this.axios.request<T>({
        ...config,
        method,
        url,
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

  private addCommonHeaders(config?: RequestConfig) {
    if (config == null) {
      return;
    }

    config.headers = config.headers ?? {};

    // Add cookie being passed through nextjs.
    if (
      config?.nextPageContext != null &&
      config.nextPageContext.req?.headers?.cookie
    ) {
      config.headers.cookie = config.nextPageContext.req.headers.cookie;
    }

    // Add preferred benchmarks custom headers.
    if (config?.preferredBenchmarks?.cpu) {
      config.headers[PREFERRED_CPU_BENCHMARK_HTTP_HEADER] =
        config.preferredBenchmarks.cpu;
    }
    if (config?.preferredBenchmarks?.gpu) {
      config.headers[PREFERRED_GPU_BENCHMARK_HTTP_HEADER] =
        config.preferredBenchmarks.gpu;
    }
  }
}

export const apiClient = new ApiClient(axios, process.env.WEBSITE_URL || '');
