import { ApiKey } from '@pcpartdb/shared';
import { PrimaryButton } from 'packages/website/src/client/shared/components/Button/PrimaryButton';
import {
  Card,
  CardContent,
  CardTitle,
} from 'packages/website/src/client/shared/components/Card/Card';
import { ConfirmDialog } from 'packages/website/src/client/shared/components/Dialog/ConfirmDialog';
import { showDialog } from 'packages/website/src/client/shared/components/Dialog/dialog';
import { TextInput } from 'packages/website/src/client/shared/components/Input/TextInput';
import { userService } from 'packages/website/src/client/user/services/userService';
import React, { useCallback, useState } from 'react';

export interface ApiKeyWidgetProps {
  apiKey: ApiKey;
}

export const ApiKeyWidget = (props: ApiKeyWidgetProps) => {
  const [apiKey, setApiKey] = useState(props.apiKey);

  const handleRefresh = useCallback(() => {
    const confirm = async () => {
      const key = await userService.refreshApiKey();
      setApiKey(key);
    };

    showDialog(
      <ConfirmDialog
        label="Are you sure you want to refresh your API key? Your existing key will stop working."
        onConfirm={confirm}
        className="w-120"
      />,
    );
  }, []);

  return (
    <Card className="flex-1">
      <CardTitle className="whitespace-nowrap">API Key</CardTitle>
      <CardContent>
        Your API Key:
        <div className="flex gap-4">
          <TextInput
            className="min-w-32"
            value={apiKey?.apiKey || ''}
            disabled
          />
          <PrimaryButton type="button" onClick={handleRefresh}>
            Refresh
          </PrimaryButton>
        </div>
      </CardContent>
    </Card>
  );
};
