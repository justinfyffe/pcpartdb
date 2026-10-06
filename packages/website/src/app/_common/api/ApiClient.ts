import {
  BenchmarkKey,
  isApiError,
  joinUrlParts,
  NormalizedData,
  PREFERRED_CPU_BENCHMARK_HTTP_HEADER,
  PREFERRED_GPU_BENCHMARK_HTTP_HEADER,
} from '@pcpartdb/shared';
import { denormalize, schema } from 'normalizr';

type RequestConfig = RequestInit & {
  normalizr?: schema.Object;
  preferredBenchmarks?: {
    cpu?: BenchmarkKey | string;
    gpu?: BenchmarkKey | string;
  };
};

export class ApiClient {
  constructor(private baseUrl: string) {}

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
    method: string,
    path: string,
    data?: unknown | FormData,
    config?: RequestConfig,
  ) {
    try {
      this.addCommonHeaders(config);

      const url = joinUrlParts(this.baseUrl, 'api', path);
      let body;
      let contentType;
      if (data != null) {
        if (data instanceof FormData) {
          body = data;
          contentType = 'multipart/form-data';
        } else {
          body = JSON.stringify(data);
          contentType = 'application/json';
        }
      }

      let headers = config?.headers ?? {};
      if (contentType != null) {
        headers = {
          ...headers,
          'Content-Type': contentType,
        };
      }

      const response = await fetch(url, {
        ...(config ?? {}),
        headers,
        method,
        body,
        credentials: 'include',
      });

      const text = await response.text();
      const responseValue = text.length > 0 ? (JSON.parse(text) as T) : null;

      if (!response.ok) {
        throw responseValue;
      }

      if (config?.normalizr) {
        const json = responseValue as NormalizedData;
        if (isApiError(json)) {
          return json;
        }

        return denormalize(json.result, config.normalizr, json.entities) as T;
      } else {
        return responseValue as T;
      }
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  private addCommonHeaders(config?: RequestConfig) {
    if (config == null) {
      return;
    }

    config.headers = config.headers ?? {};
    (config.headers as any)['User-Agent'] = 'pcpartdb-client';

    // Add preferred benchmarks custom headers.
    if (config?.preferredBenchmarks?.cpu) {
      (config.headers as any)[PREFERRED_CPU_BENCHMARK_HTTP_HEADER] =
        config.preferredBenchmarks.cpu;
    }
    if (config?.preferredBenchmarks?.gpu) {
      (config.headers as any)[PREFERRED_GPU_BENCHMARK_HTTP_HEADER] =
        config.preferredBenchmarks.gpu;
    }
  }
}

export const apiClient = new ApiClient(process.env.WEBSITE_URL || '');
