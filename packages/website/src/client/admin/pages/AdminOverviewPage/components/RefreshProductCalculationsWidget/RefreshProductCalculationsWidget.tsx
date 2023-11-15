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

export interface RefreshProductCalculationsWidgetProps {}

export const RefreshProductCalculationsWidget = (
  _props: RefreshProductCalculationsWidgetProps,
) => {
  const handleUpdate = useCallback(() => {
    const confirm = async () => {
      await automationService.createAction({
        type: AutomationActionType.UpdateProductCalculations,
        description: 'Update product calculations',
      });
    };

    showDialog(
      <ConfirmDialog
        label="Are you sure you want to update product calculations?"
        onConfirm={confirm}
        className="w-120"
      />,
    );
  }, []);

  return (
    <Card className="flex-1">
      <CardTitle>Update Product Calculations</CardTitle>
      <CardContent>
        <PrimaryButton type="button" onClick={handleUpdate}>
          Enqueue Update
        </PrimaryButton>
      </CardContent>
    </Card>
  );
};
