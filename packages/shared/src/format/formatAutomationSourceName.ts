import { ProductSourceKey } from '../product';

export function formatAutomationSourceName(key: ProductSourceKey) {
  if (key === ProductSourceKey.NotebookCheck) {
    return 'Notebookcheck';
  } else if (key === ProductSourceKey.TechPowerUp) {
    return 'TechPowerUp';
  } else if (key === ProductSourceKey.PassMark) {
    return 'PassMark';
  } else if (key === ProductSourceKey.GeekBench) {
    return 'Geekbench';
  } else {
    throw new Error(`Invalid source key: ${key}`);
  }
}
