import { automationService } from 'packages/website/src/client/automation/services/automationService';
import { DangerButton } from 'packages/website/src/client/shared/components/Button/DangerButton';
import { SuccessButton } from 'packages/website/src/client/shared/components/Button/SuccessButton';
import { AutomationStatusContext } from 'packages/website/src/client/shared/layouts/admin/AutomationStatusContext';
import React, { useCallback, useContext } from 'react';

interface EnableDisableToggleProps {}

export const EnableDisableToggle = (_props: EnableDisableToggleProps) => {
  const automationStatusContext = useContext(AutomationStatusContext);
  const automationStatus = automationStatusContext.status;

  // Callbacks

  const handleEnable = useCallback(async () => {
    await automationService.updateStatus({ enabled: true });
    await automationStatusContext.refreshStatus();
  }, [automationStatusContext]);

  const handleDisable = useCallback(async () => {
    await automationService.updateStatus({ enabled: false });
    await automationStatusContext.refreshStatus();
  }, [automationStatusContext]);

  // Render

  if (automationStatus == null) {
    return <></>;
  }

  return (
    <div className="flex gap-4 items-center ml-auto">
      <span>Status: {automationStatus.enabled ? 'Enabled' : 'Disabled'}</span>
      {automationStatus.enabled && (
        <DangerButton onClick={handleDisable}>Disable</DangerButton>
      )}
      {!automationStatus.enabled && (
        <SuccessButton onClick={handleEnable}>Enable</SuccessButton>
      )}
    </div>
  );
};
