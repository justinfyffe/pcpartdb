export interface AutomationStatus {
  enabled: boolean;

  pendingCpuSources?: number;
  pendingGpuChipsetSources?: number;
  pendingGpuRetailModelSources?: number;

  pendingCpuUpdates?: number;
  pendingGpuChipsetUpdates?: number;
  pendingGpuRetailModelUpdates?: number;
}
