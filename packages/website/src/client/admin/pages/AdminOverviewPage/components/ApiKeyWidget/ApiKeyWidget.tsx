import { ApiKey } from '@pcpartdb/shared';
import {
  Button,
  ButtonVariant,
  Card,
  CardContent,
  CardTitle,
  ConfirmDialog,
  showDialog,
  TextInput,
} from 'packages/website/src/client/shared/components';
import { userService } from 'packages/website/src/client/user';
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
    <Card>
      <CardTitle>API Key</CardTitle>
      <CardContent>
        Your API Key:
        <div className="flex gap-4">
          <TextInput value={apiKey?.apiKey || ''} disabled />
          <Button
            type="button"
            variant={ButtonVariant.Primary}
            onClick={handleRefresh}
          >
            Refresh
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
