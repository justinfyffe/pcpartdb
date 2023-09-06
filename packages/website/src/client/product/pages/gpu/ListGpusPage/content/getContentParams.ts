import {
  formatGpuCompany,
  formatGpuMarketSegment,
  ListGpusOrder,
  ListGpusQuery,
} from '@pcpartdb/shared';
import { ContentParams } from 'packages/website/src/client/shared/content/types';

export interface ListGpusContentParams {
  bestOrWorstTitle?: string;
  newestOrOldestTitle?: string;
  company?: string;
  marketSegment?: string;
  filtersList?: string;
}

export function getContentParams(query: ListGpusQuery) {
  return {
    company: getCompanyParam(query),
    marketSegment: getMarketSegmentParam(query),
    filtersList: getFiltersListParam(query),
    ...getOrderedParams(query),
  } as ListGpusContentParams as ContentParams;
}

function getOrderedParams(query: ListGpusQuery) {
  let bestOrWorstTitle: string;
  let newestOrOldestTitle: string;

  const sort = query.orderBy?.order || ListGpusOrder.Desc;
  if (sort === ListGpusOrder.Asc) {
    bestOrWorstTitle = 'Worst';
    newestOrOldestTitle = 'Oldest';
  } else if (sort === ListGpusOrder.Desc) {
    bestOrWorstTitle = 'Best';
    newestOrOldestTitle = 'Newest';
  }

  return {
    bestOrWorstTitle,
    newestOrOldestTitle,
  } as ListGpusContentParams;
}

function getCompanyParam(query: ListGpusQuery) {
  const companies = query.filter?.company;
  if (companies == null || companies.length === 0) {
    return null;
  }

  const formatted = companies
    .map((company) => formatGpuCompany(company))
    .sort();

  if (formatted.length > 2) {
    const last = formatted[formatted.length - 1];
    const allButLast = formatted.slice(0, formatted.length - 1);
    return `${allButLast.join(', ')}, and ${last}`;
  } else {
    return formatted.join(' and ');
  }
}

function getMarketSegmentParam(query: ListGpusQuery) {
  const segments = query.filter?.segment;
  if (segments == null || segments.length === 0) {
    return null;
  }

  if (segments.length === 1) {
    return formatGpuMarketSegment(segments[0])?.toLowerCase();
  }

  return null;
}

function getFiltersListParam(query: ListGpusQuery) {
  if (query.filter == null) {
    return null;
  }

  const companies =
    query.filter?.company?.map((company) => formatGpuCompany(company)).sort() ||
    [];
  const segments =
    query.filter?.segment
      ?.map((segment) => formatGpuMarketSegment(segment)?.toLowerCase())
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
