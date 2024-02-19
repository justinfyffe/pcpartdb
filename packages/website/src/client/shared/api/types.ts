import { BenchmarkKey } from '@pcpartdb/shared';
import { AxiosRequestConfig } from 'axios';
import { NextPageContext } from 'next';

export interface RequestConfig extends AxiosRequestConfig {
  nextPageContext?: Partial<NextPageContext>;
  preferredBenchmarks?: {
    cpu?: BenchmarkKey | string;
    gpu?: BenchmarkKey | string;
  };
}
