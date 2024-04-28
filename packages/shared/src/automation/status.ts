export interface AutomationStatus {
  enabled: boolean;

  pendingCpuSources?: number;
  pendingGpuSources?: number;

  pendingCpuUpdates?: number;
  pendingGpuUpdates?: number;
}
