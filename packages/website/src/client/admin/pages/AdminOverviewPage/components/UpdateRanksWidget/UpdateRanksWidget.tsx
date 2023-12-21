import { AutomationActionType } from '@pcpartdb/shared';
import { automationService } from 'packages/website/src/client/automation/services/automationService';
import { PrimaryButton } from 'packages/website/src/client/shared/components/Button/PrimaryButton';
import {
  Card,
  CardContent,
  CardTitle,
} from 'packages/website/src/client/shared/components/Card/Card';
import { ConfirmDialog } from 'packages/website/src/client/shared/components/Dialog/ConfirmDialog';
import { showDialog } from 'packages/website/src/client/shared/components/Dialog/dialog';
import React, { useCallback } from 'react';

export interface UpdateRanksWidgetProps {}

export const UpdateRanksWidget = (_props: UpdateRanksWidgetProps) => {
  const handleUpdate = useCallback(() => {
    const confirm = async () => {
      await automationService.createAction({
        type: AutomationActionType.UpdateRanks,
        description: 'Update ranks',
      });
    };

    showDialog(
      <ConfirmDialog
        label="Are you sure you want to update product ranks?"
        onConfirm={confirm}
        className="w-120"
      />,
    );
  }, []);

  return (
    <Card className="flex-1">
      <CardTitle className="whitespace-nowrap">Update Product Ranks</CardTitle>
      <CardContent>
        <PrimaryButton type="button" onClick={handleUpdate}>
          Add to Queue
        </PrimaryButton>
      </CardContent>
    </Card>
  );
};
