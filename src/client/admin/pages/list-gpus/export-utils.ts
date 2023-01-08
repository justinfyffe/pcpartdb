import { ExportPartsResponse } from '@shared/part';

export function downloadExportFile(result: ExportPartsResponse) {
  const { file, recommendedFileName } = result;
  const link = document.createElement('a');
  link.href = `/admin/download/${file}`;
  link.download = recommendedFileName;
  const child = document.body.appendChild(link);
  link.click();
  document.body.removeChild(child);
}
