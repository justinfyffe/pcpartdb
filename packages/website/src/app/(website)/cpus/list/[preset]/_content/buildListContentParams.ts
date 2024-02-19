import {
  BenchmarkKey,
  formatCompanyName,
  formatMarketSegment,
  ListCpusQuery,
  ListOrder,
} from '@pcpartdb/shared';
import { ContentParams } from 'packages/website/src/app/_common/content/types';

export interface ListCpusContentParams {
  bestOrWorstTitle?: string;
  newestOrOldestTitle?: string;
  company?: string;
  marketSegment?: string;
  filtersList?: string;
  preferredBenchmark?: BenchmarkKey;
}

export function buildListContentParams(query: ListCpusQuery) {
  return {
    company: getCompanyParam(query),
    marketSegment: getMarketSegmentParam(query),
    filtersList: getFiltersListParam(query),
    ...getOrderedParams(query),
  } as ListCpusContentParams as ContentParams;
}

function getOrderedParams(query: ListCpusQuery) {
  let bestOrWorstTitle: string;
  let newestOrOldestTitle: string;

  const sort = query.orderBy?.order || ListOrder.Desc;
  if (sort === ListOrder.Asc) {
    bestOrWorstTitle = 'Worst';
    newestOrOldestTitle = 'Oldest';
  } else if (sort === ListOrder.Desc) {
    bestOrWorstTitle = 'Best';
    newestOrOldestTitle = 'Newest';
  }

  return {
    bestOrWorstTitle,
    newestOrOldestTitle,
  } as ListCpusContentParams;
}

function getCompanyParam(query: ListCpusQuery) {
  const companies = query.filter?.company;
  if (companies == null || companies.length === 0) {
    return null;
  }

  const formatted = companies
    .map((company) => formatCompanyName(company))
    .sort();

  if (formatted.length > 2) {
    const last = formatted[formatted.length - 1];
    const allButLast = formatted.slice(0, formatted.length - 1);
    return `${allButLast.join(', ')}, and ${last}`;
  } else {
    return formatted.join(' and ');
  }
}

function getMarketSegmentParam(query: ListCpusQuery) {
  const segments = query.filter?.segment;
  if (segments == null || segments.length === 0) {
    return null;
  }

  if (segments.length === 1) {
    return formatMarketSegment(segments[0])?.toLowerCase();
  }

  return null;
}

function getFiltersListParam(query: ListCpusQuery) {
  if (query.filter == null) {
    return null;
  }

  const companies =
    query.filter?.company
      ?.map((company) => formatCompanyName(company))
      .sort() || [];
  const segments =
    query.filter?.segment
      ?.map((segment) => formatMarketSegment(segment)?.toLowerCase())
      .sort() || [];

  const filters = [...companies, ...segments];
  if (filters.length === 0) {
    return null;
  }

  if (filters.length > 2) {
    const last = filters[filters.length - 1];
    const allButLast = filters.slice(0, filters.length - 1);
    return `${allButLast.join(', ')}, and ${last}`;
  } else {
    return filters.join(' and ');
  }
}
