import { DataUpdate } from '@pcpartdb/shared';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { Spinner } from '../../../../../../shared/components';
import { adminService } from '../../../../../adminService';
import { CpuDiffDialog, GpuDiffDialog } from '../../../../../components';

interface UpdateDialogProps {
  id: number;
}

export const UpdateDialog: FunctionComponent<UpdateDialogProps> = (props) => {
  const { id } = props;
  const [dataUpdate, setDataUpdate] = useState<DataUpdate>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchUpdate() {
      setLoading(true);
      const response = await adminService.getUpdate(id);
      setDataUpdate(response);
      setLoading(false);
    }
    fetchUpdate();
  }, [id]);

  if (loading) {
    <div className="bg-white flex flex-col gap-4 h-[80%] w-[80%] p-4 overflow-auto max-w-247 rounded shadow">
      <div className="flex flex-col items-center justify-center h-full w-full gap-6">
        <Spinner className="w-24 h-24 border-3" />
        <div className="flex flex-col gap-2">
          <h3 className="text-2xl text-center">Loading update.</h3>
          <div className="text-lg">This may take a moment.</div>
        </div>
      </div>
    </div>;
  } else if (dataUpdate?.cpuId != null) {
    return <CpuDiffDialog diff={dataUpdate.data} />;
  } else if (dataUpdate?.gpuId != null) {
    return <GpuDiffDialog diff={dataUpdate.data} />;
  }

  return <></>;
};
