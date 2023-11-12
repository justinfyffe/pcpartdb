import { PrimaryButton } from 'packages/website/src/client/shared/components/Button/PrimaryButton';
import {
  Card,
  CardContent,
  CardTitle,
} from 'packages/website/src/client/shared/components/Card/Card';
import { ConfirmDialog } from 'packages/website/src/client/shared/components/Dialog/ConfirmDialog';
import { showDialog } from 'packages/website/src/client/shared/components/Dialog/dialog';
import { websiteService } from 'packages/website/src/client/website/websiteService';
import React, { useCallback, useState } from 'react';

export interface CacheWidgetProps {
  cacheSize: number;
  cacheItems: number;
}

export const CacheWidget = (props: CacheWidgetProps) => {
  const [cacheSize, setCacheSize] = useState(
    () => props.cacheSize / 1_000 / 1_000,
  );
  const [cacheItems, setCacheItems] = useState(() => props.cacheItems);

  const handleClearCache = useCallback(() => {
    const confirm = async () => {
      const response = await websiteService.clearCache();
      setCacheSize(response.cacheSize / 1_000 / 1_000);
      setCacheItems(response.cacheItems);
    };

    showDialog(
      <ConfirmDialog
        label="Are you sure you want to clear the cache?"
        onConfirm={confirm}
        className="w-120"
      />,
    );
  }, []);

  return (
    <Card className="flex-1">
      <CardTitle>Cache</CardTitle>
      <CardContent>
        <div className="text-lg">
          Size:{' '}
          {cacheSize.toLocaleString(undefined, { maximumFractionDigits: 2 })} MB
        </div>
        <div className="text-lg">
          Items: {cacheItems.toLocaleString(undefined)}
        </div>
        <PrimaryButton type="button" onClick={handleClearCache}>
          Clear Cache
        </PrimaryButton>
      </CardContent>
    </Card>
  );
};
