export function getHomePath() {
  return '/';
}

export function getListGpusPath(slug?: string) {
  return `/gpus/list/${slug ?? ''}`;
}

export function getViewGpuPath(slug?: string) {
  return `/gpus/view/${slug}`;
}

export function getCompareGpusPath(slug?: string) {
  return `/gpus/compare/${slug}`;
}
