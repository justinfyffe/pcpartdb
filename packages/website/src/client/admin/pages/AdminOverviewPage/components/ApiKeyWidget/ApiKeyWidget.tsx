import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { ApiKey } from '@pcpartdb/shared';
import { PrimaryButton } from 'packages/website/src/client/shared/components/Button/PrimaryButton';
import {
  Card,
  CardContent,
  CardTitle,
} from 'packages/website/src/client/shared/components/Card/Card';
import { ConfirmDialog } from 'packages/website/src/client/shared/components/Dialog/ConfirmDialog';
import { showDialog } from 'packages/website/src/client/shared/components/Dialog/dialog';
import { Input } from 'packages/website/src/client/shared/components/Input/Input';
import { userService } from 'packages/website/src/client/user/services/userService';
import React, { useCallback, useState } from 'react';

export interface ApiKeyWidgetProps {
  apiKey: ApiKey;
}

export const ApiKeyWidget = (props: ApiKeyWidgetProps) => {
  const [apiKey, setApiKey] = useState(props.apiKey);
  const [showKey, setShowKey] = useState(false);

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
          <Input
            className="min-w-32"
            type={showKey ? 'text' : 'password'}
            value={apiKey?.apiKey || ''}
            readOnly
            suffix={
              showKey ? (
                <EyeSlashIcon className="w-4" />
              ) : (
                <EyeIcon className="w-4" />
              )
            }
            onSuffixClick={() => setShowKey((s) => !s)}
          />
          <PrimaryButton type="button" onClick={handleRefresh}>
            Refresh
          </PrimaryButton>
        </div>
      </CardContent>
    </Card>
  );
};
