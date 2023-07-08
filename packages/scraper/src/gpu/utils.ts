export function sanitizeGpuSourceName(name: string) {
  let sanitized = name.toLowerCase();

  if (sanitized.includes('laptop gpu')) {
    sanitized = sanitized.replace('laptop gpu', 'mobile');
  }

  if (sanitized.includes('(mobile)')) {
    sanitized = sanitized.replace('(mobile)', 'mobile');
  }

  if (sanitized.includes('with max-q design')) {
    sanitized = sanitized.replace('with max-q design', 'max-q');
  }

  if (sanitized.includes(' / nforce')) {
    sanitized = sanitized.replace(' / nforce', ' + nforce');
  } else if (sanitized.includes('nforce')) {
    sanitized = sanitized.replace('nforce', ' + nforce');
  }

  if (sanitized.includes('firepro 3d')) {
    sanitized = sanitized.replace('firepro 3d', 'firepro');
  }

  if (sanitized.includes(' dvi')) {
    sanitized = sanitized.replace(' dvi', '').trim();
  }

  if (sanitized.includes(' pcie')) {
    sanitized = sanitized.replace(' pcie', '').trim();
  }

  if (sanitized.includes(' pci')) {
    sanitized = sanitized.replace(' pci', '').trim();
  }

  if (sanitized.includes(' oem')) {
    sanitized = sanitized.replace(' oem', '').trim();
  }

  if (sanitized.includes(' multi-view')) {
    sanitized = sanitized.replace(' multi-view', '').trim();
  }

  if (sanitized.includes(' 20pipes')) {
    sanitized = sanitized.replace(' 20pipes', '').trim();
  }

  if (sanitized.includes(' 24pipes')) {
    sanitized = sanitized.replace(' 24pipes', '').trim();
  }

  if (sanitized.includes(' agp')) {
    sanitized = sanitized.replace(' agp', '').trim();
  }

  sanitized = sanitized
    .split(' ')
    .filter((word) => word.trim().length > 0)
    .join(' ');

  return sanitized.trim();
}
