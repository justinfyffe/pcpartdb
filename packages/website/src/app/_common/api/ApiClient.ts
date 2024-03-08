import { isApiError, joinUrlParts } from '@pcpartdb/shared';

export class ApiClient {
  constructor(private baseUrl: string) {}

  async get<T = unknown>(path: string, config?: RequestInit) {
    return await this.request<T>('GET', path, undefined, config);
  }

  async post<T = unknown>(path: string, data: unknown, config?: RequestInit) {
    return await this.request<T>('POST', path, data, config);
  }

  async put<T = unknown>(path: string, data: unknown, config?: RequestInit) {
    return await this.request<T>('PUT', path, data, config);
  }

  async delete<T = unknown>(
    path: string,
    data?: unknown,
    config?: RequestInit,
  ) {
    return await this.request<T>('DELETE', path, data, config);
  }

  private async request<T = unknown>(
    method: string,
    path: string,
    data?: unknown | FormData,
    config?: RequestInit,
  ) {
    try {
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

      return responseValue;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
}

export const apiClient = new ApiClient(process.env.WEBSITE_URL || '');
