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

export class ViewModelClient {
  constructor(private baseUrl: string) {}

  async get<T = unknown>(path: string, config?: RequestConfig) {
    return await this.request<T>('GET', path, undefined, config);
  }

  private async request<T = unknown>(
    method: string,
    path: string,
    data?: unknown | FormData,
    config?: RequestConfig,
  ) {
    try {
      this.addCommonHeaders(config);

      const url = joinUrlParts(this.baseUrl, 'api/view-models', path);
      let body;
      if (data != null) {
        if (data instanceof FormData) {
          body = data;
        } else {
          body = JSON.stringify(data);
        }
      }

      const response = await fetch(url, {
        ...config,
        method,
        body,
        credentials: 'include',
      });

      if (config?.normalizr) {
        const json = (await response.json()) as NormalizedData;
        if (isApiError(json)) {
          return json;
        }

        return denormalize(json.result, config.normalizr, json.entities) as T;
      } else {
        return (await response.json()) as T;
      }
    } catch (err) {
      console.error('Error calling view model', err);
      throw err;
    }
  }

  private addCommonHeaders(config?: RequestConfig) {
    if (config == null) {
      return;
    }

    config.headers = config.headers ?? {};

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

export const viewModelClient = new ViewModelClient(
  process.env.WEBSITE_URL || '',
);
