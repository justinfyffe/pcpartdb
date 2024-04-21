'use client';

import { Table } from 'packages/website/src/app/_common/components/Table/Table';
import { TBody } from 'packages/website/src/app/_common/components/Table/TBody';
import { Td } from 'packages/website/src/app/_common/components/Table/Td';
import { Th } from 'packages/website/src/app/_common/components/Table/Th';
import { THead } from 'packages/website/src/app/_common/components/Table/THead';
import { Tr } from 'packages/website/src/app/_common/components/Table/Tr';
import { Tab } from 'packages/website/src/app/_common/components/Tabs/Tab';
import { Tabs } from 'packages/website/src/app/_common/components/Tabs/Tabs';
import { TabsVariant } from 'packages/website/src/app/_common/components/Tabs/types';
import { GameFpsCredit } from 'packages/website/src/app/_common/product/components/GameFpsCredit/GameFpsCredit';
import { classNames } from 'packages/website/src/app/_common/utils/classNames';
import React, { FunctionComponent, useMemo } from 'react';

interface GameFpsTablesProps {
  credit?: boolean;
  className?: string;
}

export const GameFpsTables: FunctionComponent<GameFpsTablesProps> = (props) => {
  return (
    <div className="flex flex-col">
      <Tabs tabClassName="p-1" variant={TabsVariant.Horizontal}>
        <GameFpsTab label="1080p - Low" name={'1080p - Low'} />
        <GameFpsTab label="1080p - Medium" name={'1080p - Medium'} />
        <GameFpsTab label="1080p - High" name={'1080p - High'} />
        <GameFpsTab label="1080p - Ultra" name={'1080p - Ultra'} />
        <GameFpsTab label="1440p" name={'1440p'} />
        <GameFpsTab label="2160p (4K)" name={'2160p (4K)'} />
      </Tabs>
      {!!props.credit && (
        <GameFpsCredit
          sourceName="Notebookcheck"
          sourceUrl="https://notebookcheck.net"
        />
      )}
    </div>
  );
};

interface GameFpsTabProps {
  label: string;
  name: string;
  className?: string;
}

const GameFpsTab: FunctionComponent<GameFpsTabProps> = (props) => {
  const { name, className } = props;

  return (
    <Tab label={name}>
      <Table border responsive className={classNames(className)}>
        <THead>
          <Tr>
            <Th className="w-[50%]">Game</Th>
            <Th className="w-[50%]">FPS</Th>
          </Tr>
        </THead>
        <TBody>
          <Tr>
            <Td>
              <div className="flex gap-4 items-center">
                <img
                  src="https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcS_dRuGJyepKPNqi8hiW21eGLSjuiCldZfPazo90UFwrkwfyb5wmCQlsA7v2YT9BIpV2qolPA"
                  className="w-12"
                />
                <div className="flex flex-col gap-0.5">
                  <span className="font-medium">GTA: Vice City</span>
                  <span className="text-dimmed text-sm">May 13 2023</span>
                </div>
              </div>
            </Td>
            <Td>
              <div className="flex flex-col gap-0.5">
                <span>234 FPS</span>
                <span>$1.26 CPF</span>
              </div>
            </Td>
          </Tr>
          <Tr>
            <Td>
              <div className="flex gap-4 items-center">
                <img
                  src="https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcS_dRuGJyepKPNqi8hiW21eGLSjuiCldZfPazo90UFwrkwfyb5wmCQlsA7v2YT9BIpV2qolPA"
                  className="w-12"
                />
                <div className="flex flex-col gap-0.5">
                  <span className="font-medium">GTA: Vice City</span>
                  <span className="text-dimmed text-sm">May 13 2023</span>
                </div>
              </div>
            </Td>
            <Td>234 fps</Td>
          </Tr>
          <Tr>
            <Td>
              <div className="flex gap-4 items-center">
                <img
                  src="https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcS_dRuGJyepKPNqi8hiW21eGLSjuiCldZfPazo90UFwrkwfyb5wmCQlsA7v2YT9BIpV2qolPA"
                  className="w-12"
                />
                <div className="flex flex-col gap-0.5">
                  <span className="font-medium">GTA: Vice City</span>
                  <span className="text-dimmed text-sm">May 13 2023</span>
                </div>
              </div>
            </Td>
            <Td>234 fps</Td>
          </Tr>
          <Tr>
            <Td>
              <div className="flex gap-4 items-center">
                <img
                  src="https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcS_dRuGJyepKPNqi8hiW21eGLSjuiCldZfPazo90UFwrkwfyb5wmCQlsA7v2YT9BIpV2qolPA"
                  className="w-12"
                />
                <div className="flex flex-col gap-0.5">
                  <span className="font-medium">GTA: Vice City</span>
                  <span className="text-dimmed text-sm">May 13 2023</span>
                </div>
              </div>
            </Td>
            <Td>234 fps</Td>
          </Tr>
          <Tr>
            <Td>
              <div className="flex gap-4 items-center">
                <img
                  src="https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcS_dRuGJyepKPNqi8hiW21eGLSjuiCldZfPazo90UFwrkwfyb5wmCQlsA7v2YT9BIpV2qolPA"
                  className="w-12"
                />
                <div className="flex flex-col gap-0.5">
                  <span className="font-medium">GTA: Vice City</span>
                  <span className="text-dimmed text-sm">May 13 2023</span>
                </div>
              </div>
            </Td>
            <Td>234 fps</Td>
          </Tr>
          <Tr>
            <Td>
              <div className="flex gap-4 items-center">
                <img
                  src="https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcS_dRuGJyepKPNqi8hiW21eGLSjuiCldZfPazo90UFwrkwfyb5wmCQlsA7v2YT9BIpV2qolPA"
                  className="w-12"
                />
                <div className="flex flex-col gap-0.5">
                  <span className="font-medium">GTA: Vice City</span>
                  <span className="text-dimmed text-sm">May 13 2023</span>
                </div>
              </div>
            </Td>
            <Td>234 fps</Td>
          </Tr>
          <Tr>
            <Td>
              <div className="flex gap-4 items-center">
                <img
                  src="https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcS_dRuGJyepKPNqi8hiW21eGLSjuiCldZfPazo90UFwrkwfyb5wmCQlsA7v2YT9BIpV2qolPA"
                  className="w-12"
                />
                <div className="flex flex-col gap-0.5">
                  <span className="font-medium">GTA: Vice City</span>
                  <span className="text-dimmed text-sm">May 13 2023</span>
                </div>
              </div>
            </Td>
            <Td>234 fps</Td>
          </Tr>
          <Tr>
            <Td colSpan={2} className="p-0">
              <div className="p-2 cursor-pointer text-center w-full font-semibold bg-white hover:bg-mouse-hover hover:underline">
                Show All Games
              </div>
            </Td>
          </Tr>
        </TBody>
      </Table>
    </Tab>
  );
};

// interface GameFpsTabProps {
//   label: string;
//   name: string;
//   className?: string;
// }

// const GameFpsTab: FunctionComponent<GameFpsTabProps> = (props) => {
//   const { name, className } = props;

//   return (
//     <Tab label={name}>
//       <Table border responsive className={classNames(className)}>
//         <THead>
//           <Tr>
//             <Th className="w-0">Game</Th>
//             <Th className="w-0">1080p - Low</Th>
//             <Th className="w-0">1080p - Medium</Th>
//             <Th className="w-0">1080p - High</Th>
//             <Th className="w-0">1080p - Ultra</Th>
//             <Th className="w-0">1440p</Th>
//             <Th className="w-0">2160p (4K)</Th>
//           </Tr>
//         </THead>
//         <TBody>
//           <Tr>
//             <Td>Helldivers 2</Td>
//             <Td>234 fps</Td>
//             <Td>200 fps</Td>
//             <Td>190 fps</Td>
//             <Td>180 fps</Td>
//             <Td>96 fps</Td>
//             <Td>63 fps</Td>
//           </Tr>
//         </TBody>
//       </Table>
//     </Tab>
//   );
// };
