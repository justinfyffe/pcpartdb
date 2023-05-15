import { SUPPORTED_GPU_COMPANIES } from '@pcpartdb/shared';

export function parseGpuName(fullGpuName: string) {
  const lcFullGpuName = fullGpuName.toLowerCase();
  for (const lcCompany of SUPPORTED_GPU_COMPANIES) {
    if (lcFullGpuName.startsWith(lcCompany)) {
      const company = fullGpuName.substring(0, lcCompany.length).trim();
      const name = fullGpuName.substring(lcCompany.length).trim();
      return { company, name };
    }
  }

  return { company: null, name: fullGpuName };
}
