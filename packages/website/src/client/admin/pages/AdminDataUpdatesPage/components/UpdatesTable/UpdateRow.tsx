import { DataUpdate, DataUpdateStatus } from '@pcpartdb/shared';
import React, { FunctionComponent, useContext } from 'react';
import { DataUpdatesPageContext } from '../../context';
import { ApprovedUpdateRow } from './ApprovedUpdateRow';
import { PendingUpdateRow } from './PendingUpdateRow';
import { RejectedUpdateRow } from './RejectedUpdateRow';

interface UpdateRowProps {
  update: DataUpdate;
  onApprove?: (update: DataUpdate) => void;
  onReject?: (update: DataUpdate) => void;
}

export const UpdateRow: FunctionComponent<UpdateRowProps> = (props) => {
  const { status } = useContext(DataUpdatesPageContext);

  if (status === DataUpdateStatus.Pending) {
    return <PendingUpdateRow {...props} />;
  } else if (status === DataUpdateStatus.Approved) {
    return <ApprovedUpdateRow {...props} />;
  } else if (status === DataUpdateStatus.Rejected) {
    return <RejectedUpdateRow {...props} />;
  }

  return <></>;
};
