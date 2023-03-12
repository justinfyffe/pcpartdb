export function generateGpuSlug(name: string, company: string) {
  const slugParts = [];
  if (company != null) {
    const companyParts = company.split(' ').map((value) => value.toLowerCase());
    slugParts.push(...companyParts);
  }
  if (name != null) {
    const nameParts = name.split(' ').map((value) => value.toLowerCase());
    slugParts.push(...nameParts);
  }

  return slugParts.join('-');
}
