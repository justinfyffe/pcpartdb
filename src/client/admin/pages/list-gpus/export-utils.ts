import { ExportPartResult } from '@shared/part';

export function downloadExportFile(result: ExportPartResult) {
  const { file, recommendedFileName } = result;
  const link = document.createElement('a');
  link.href = `/admin/export/${file}`;
  link.download = recommendedFileName;
  const child = document.body.appendChild(link);
  link.click();
  document.body.removeChild(child);
}
