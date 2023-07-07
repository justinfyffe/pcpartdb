export function sanitizeCpuName(name: string) {
  let sanitized = name.toLowerCase();

  if (sanitized.endsWith(' apu')) {
    sanitized = sanitized.substring(0, sanitized.length - 3).trim();
  }

  if (sanitized.indexOf('@') >= 0) {
    sanitized = sanitized.substring(0, sanitized.indexOf('@')).trim();
  }

  if (sanitized.includes('core2')) {
    sanitized = sanitized.replace('core2', 'core 2').trim();
  }

  if (sanitized.includes('dual-core mobile')) {
    sanitized = sanitized.replace('dual-core mobile', ' ').trim();
  }

  if (sanitized.includes('dual core mobile')) {
    sanitized = sanitized.replace('dual core mobile', ' ').trim();
  }

  if (sanitized.includes('dual-core')) {
    sanitized = sanitized.replace('dual-core', ' ').trim();
  }

  if (sanitized.includes('dual core')) {
    sanitized = sanitized.replace('dual core', ' ').trim();
  }

  if (sanitized.includes('quad-core')) {
    sanitized = sanitized.replace('quad-core', ' ').trim();
  }

  if (sanitized.includes('quad core')) {
    sanitized = sanitized.replace('quad core', ' ').trim();
  }

  if (sanitized.includes('six-core')) {
    sanitized = sanitized.replace('six-core', ' ').trim();
  }

  if (sanitized.includes('six core')) {
    sanitized = sanitized.replace('six core', ' ').trim();
  }

  if (sanitized.includes('eight-core')) {
    sanitized = sanitized.replace('eight-core', ' ').trim();
  }

  if (sanitized.includes('eight core')) {
    sanitized = sanitized.replace('eight core', ' ').trim();
  }

  sanitized = sanitized
    .split(' ')
    .filter((word) => word.trim().length > 0)
    .join(' ');

  return sanitized.trim();
}
