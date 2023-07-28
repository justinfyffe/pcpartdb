import 'reflect-metadata';
import { InformationCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';
import {
  Button,
  ButtonVariant,
  Table,
  TBody,
  Td,
  Th,
  THead,
  Tr,
} from 'packages/website/src/client/shared/components';
import React from 'react';

interface QueueTabProps {}

export const QueueTab = (props: QueueTabProps) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <Button variant={ButtonVariant.Generic}>Refresh</Button>
      </div>

      <Table>
        <THead>
          <Tr>
            <Th>ID</Th>
            <Th>Type</Th>
            <Th>Entry</Th>
            <Th></Th>
          </Tr>
        </THead>
        <TBody>
          <Tr>
            <Td>1</Td>
            <Td>New CPU</Td>
            <Td>Intel i7-12345k</Td>
            <Td className="flex justify-end gap-2">
              <Button variant={ButtonVariant.Generic}>
                <InformationCircleIcon className="w-4" />
              </Button>
              <Button variant={ButtonVariant.Generic}>
                <XMarkIcon className="w-4" />
              </Button>
            </Td>
          </Tr>

          <Tr>
            <Td>2</Td>
            <Td>New GPU</Td>
            <Td>NVIDIA RTX 3070</Td>
            <Td className="flex justify-end gap-2">
              <Button variant={ButtonVariant.Generic}>
                <InformationCircleIcon className="w-4" />
              </Button>
              <Button variant={ButtonVariant.Generic}>
                <XMarkIcon className="w-4" />
              </Button>
            </Td>
          </Tr>

          <Tr>
            <Td>3</Td>
            <Td>Update GPU</Td>
            <Td>NVIDIA RTX 4070</Td>
            <Td className="flex justify-end gap-2">
              <Button variant={ButtonVariant.Generic}>
                <InformationCircleIcon className="w-4" />
              </Button>
              <Button variant={ButtonVariant.Generic}>
                <XMarkIcon className="w-4" />
              </Button>
            </Td>
          </Tr>

          <Tr>
            <Td>4</Td>
            <Td>New GPU</Td>
            <Td>Acer RTX 3070 (NVIDIA RTX 3070)</Td>
            <Td className="flex justify-end gap-2">
              <Button variant={ButtonVariant.Generic}>
                <InformationCircleIcon className="w-4" />
              </Button>
              <Button variant={ButtonVariant.Generic}>
                <XMarkIcon className="w-4" />
              </Button>
            </Td>
          </Tr>
        </TBody>
      </Table>
    </div>
  );
};
