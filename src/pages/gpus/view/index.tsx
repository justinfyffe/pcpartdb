import { NextPageContext } from 'next';
import React from 'react';
import { Card } from '../../../web/shared/components/card';
import { Image } from '../../../web/shared/components/image';
import {
  Table,
  TableCell,
  TableRow,
} from '../../../web/shared/components/table';
import { WebsiteLayout } from '../../../web/shared/layouts/website';
import { classNames } from '../../../web/shared/ui/ui.utils';

interface ViewGpuPageProps {}

const ViewGpuPage = (_props: ViewGpuPageProps) => {
  // TODO: add sidebar to layout
  return (
    <WebsiteLayout>
      <main className="flex flex-col gap-6 text-slate-700">
        <section className="flex flex-wrap justify-center gap-6">
          <div className="flex-1 min-w-[200px]">
            <h1 className="text-3xl mb-4 font-medium flex flex-col">
              <span className="text-2xl font-normal">NVIDIA</span>
              <span>GeForce RTX 3090</span>
            </h1>

            <Image
              className="bg-gray-50 rounded mb-6 w-9/12 mx-auto"
              src="https://www.nvidia.com/content/dam/en-zz/Solutions/geforce/ampere/rtx-3090/geforce-rtx-3090-shop-630-d@2x.png"
            />

            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. A
              iaculis at erat pellentesque adipiscing commodo elit at. Maecenas
              sed enim ut sem viverra. Elementum sagittis vitae et leo duis ut
              diam. In mollis nunc sed id semper risus in hendrerit. Eget sit
              amet tellus cras adipiscing enim. Sit amet consectetur adipiscing
              elit. Interdum velit euismod in pellentesque massa.
            </p>
          </div>

          <Card className="flex-1 self-stretch">
            <ul className={classNames('flex flex-col gap-6')}>
              <li
                className={classNames(
                  'bg-slate-200 flex items-center justify-center px-4 py-2 rounded shadow',
                )}
              >
                <div className={classNames('flex-1 p-2')}>
                  <div className={classNames('font-medium text-2xl')}>
                    Release Date
                  </div>
                </div>
                <div
                  className={classNames(
                    'bg-[#3f51b5] border rounded flex items-center justify-center text-xl text-slate-100 w-[100px] h-full',
                  )}
                >
                  Q4 2022
                </div>
              </li>

              <li
                className={classNames(
                  'bg-slate-200 flex items-center justify-center px-4 py-2 rounded shadow',
                )}
              >
                <div className={classNames('flex-1 p-2')}>
                  <div className={classNames('font-medium text-2xl')}>
                    Current Price
                  </div>
                </div>
                <div
                  className={classNames(
                    'bg-[#3f51b5] border rounded flex items-center justify-center text-xl text-slate-100 w-[100px] h-full',
                  )}
                >
                  $499
                </div>
              </li>

              <li
                className={classNames(
                  'bg-slate-200 flex items-center justify-center px-4 py-2 rounded shadow',
                )}
              >
                <div className={classNames('flex-1 p-2')}>
                  <div className={classNames('font-medium text-2xl')}>
                    Games Supported
                  </div>
                </div>
                <div
                  className={classNames(
                    'bg-[#3f51b5] border rounded flex items-center justify-center text-xl text-slate-100 w-[100px] h-full',
                  )}
                >
                  100%
                </div>
              </li>

              <li
                className={classNames(
                  'bg-slate-200 flex items-center justify-center px-4 py-2 rounded shadow',
                )}
              >
                <div className={classNames('flex-1 p-2')}>
                  <div className={classNames('font-medium text-2xl')}>
                    Performance Rating
                  </div>
                </div>
                <div
                  className={classNames(
                    'bg-[#3f51b5] border rounded flex items-center justify-center text-xl text-slate-100 w-[100px] h-full',
                  )}
                >
                  82.23
                </div>
              </li>

              <li
                className={classNames(
                  'bg-slate-200 flex items-center justify-center px-4 py-2 rounded shadow',
                )}
              >
                <div className={classNames('flex-1 p-2')}>
                  <div className={classNames('font-medium text-2xl')}>
                    Value for Money
                  </div>
                </div>
                <div
                  className={classNames(
                    'bg-[#3f51b5] border rounded flex items-center justify-center text-xl text-slate-100 w-[100px] h-full',
                  )}
                >
                  58.32
                </div>
              </li>
            </ul>
          </Card>
        </section>

        <section className="flex flex-col gap-6">
          <Card>
            <h2 className="text-2xl font-medium mb-3">General Info</h2>

            <p className={classNames('text-gray-400 mb-4')}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>

            <div className="flex flex-wrap items-start">
              <Table className="flex-1 mb-0">
                <TableRow>
                  <TableCell className="min-w-[200px]">
                    Performance Rating
                  </TableCell>
                  <TableCell className="min-w-[80px]">82.23</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Value for Money</TableCell>
                  <TableCell>58.32</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Company</TableCell>
                  <TableCell>NVIDIA</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Generation</TableCell>
                  <TableCell>GeForce 30</TableCell>
                </TableRow>
              </Table>
              <Table className="flex-1 mb-0">
                <TableRow>
                  <TableCell className="min-w-[200px]">
                    Market Segment
                  </TableCell>
                  <TableCell className="min-w-[80px]">Desktop</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Launch Price</TableCell>
                  <TableCell>$1,499</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Release Date</TableCell>
                  <TableCell>Q4 2022</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Production Status</TableCell>
                  <TableCell>Active</TableCell>
                </TableRow>
              </Table>
            </div>
          </Card>

          <Card>
            <h2 className="text-2xl font-medium mb-6">Technical Specs</h2>

            <h3 className="text-xl font-medium mb-3">Processor</h3>

            <p className={classNames('text-gray-400 mb-4')}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>

            <div className="flex flex-wrap items-start mb-3">
              <Table className="flex-1 mb-0">
                <TableRow>
                  <TableCell className="min-w-[100px]">GPU Name</TableCell>
                  <TableCell className="min-w-[80px]">GA102</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Architecture</TableCell>
                  <TableCell>Ampere</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Foundry</TableCell>
                  <TableCell>Samsung</TableCell>
                </TableRow>
              </Table>
              <Table className="flex-1 mb-0">
                <TableRow>
                  <TableCell className="min-w-[100px]">Process Size</TableCell>
                  <TableCell className="min-w-[80px]">8nm</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Transistors</TableCell>
                  <TableCell>28,300 million</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Die Size</TableCell>
                  <TableCell>628</TableCell>
                </TableRow>
              </Table>
            </div>

            <h3 className="text-xl font-medium mb-3">
              Board Compatibility &amp; Dimensions
            </h3>

            <p className={classNames('text-gray-400 mb-4')}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>

            <div className="flex flex-wrap items-start mb-3">
              <Table className="flex-1 mb-0">
                <TableRow>
                  <TableCell>Slot Width</TableCell>
                  <TableCell>Triple-slot</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="min-w-[100px]">Length</TableCell>
                  <TableCell className="min-w-[80px]">336mm</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Width</TableCell>
                  <TableCell>140mm</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Height</TableCell>
                  <TableCell>61mm</TableCell>
                </TableRow>
              </Table>
              <Table className="flex-1 mb-0">
                <TableRow>
                  <TableCell className="min-w-[100px]">Bus Interface</TableCell>
                  <TableCell className="min-w-[80px]">PCIe 4.0 x16</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>TDP</TableCell>
                  <TableCell>350 W</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Suggested PSU</TableCell>
                  <TableCell>750 W</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="min-w-[100px]">
                    Power Connectors
                  </TableCell>
                  <TableCell className="min-w-[80px]">1x 12-pin</TableCell>
                </TableRow>
              </Table>
            </div>

            <h3 className="text-xl font-medium mb-3">
              Cores &amp; Clock Speeds
            </h3>

            <p className={classNames('text-gray-400 mb-4')}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>

            <h3 className="text-xl font-medium mb-3">Performance</h3>

            <p className={classNames('text-gray-400 mb-4')}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>

            <h3 className="text-xl font-medium mb-3">Memory</h3>

            <p className={classNames('text-gray-400 mb-4')}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>

            <h3 className="text-xl font-medium mb-3">API Support</h3>

            <p className={classNames('text-gray-400 mb-4')}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
          </Card>

          <Card>
            <h2 className="text-2xl font-medium mb-3">Benchmarks</h2>

            <p className={classNames('text-gray-400 mb-4')}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
          </Card>
        </section>
      </main>
    </WebsiteLayout>
  );
};

ViewGpuPage.getInitialProps = async (_ctx: NextPageContext) => {
  return {};
};

export default ViewGpuPage;
