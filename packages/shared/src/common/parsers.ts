import { SUPPORTED_CPU_COMPANIES, SUPPORTED_GPU_COMPANIES } from '../product';

export function parseNumber(value: string) {
  const parsedValue = Number(value?.replace(',', ''));
  return Number.isNaN(parsedValue) ? null : parsedValue;
}

export function parseProductName(fullName: string) {
  const companies = [...SUPPORTED_CPU_COMPANIES, ...SUPPORTED_GPU_COMPANIES];
  const lcFullName = fullName.toLowerCase();
  for (const lcCompany of companies) {
    if (lcFullName.startsWith(lcCompany)) {
      const company = fullName.substring(0, lcCompany.length).trim();
      const name = fullName.substring(lcCompany.length).trim();
      return { company, name };
    }
  }

  return { company: null, name: fullName };
}
