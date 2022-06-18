import { ChipIcon } from '@heroicons/react/outline';
import { NextPageContext } from 'next';
import React from 'react';
import { Card } from '../../../web/shared/components/card';
import { Image } from '../../../web/shared/components/image';
import { Table, TBody, Td, Tr } from '../../../web/shared/components/table';
import { WebsiteLayout } from '../../../web/shared/layouts/website';
import { classNames } from '../../../web/shared/ui/ui.utils';

interface ViewGpuPageProps {}

const ViewGpuPage = (_props: ViewGpuPageProps) => {
  // TODO: add sidebar to layout
  return (
    <WebsiteLayout className="flex flex-wrap gap-6 lg:gap-8 text-slate-700 justify-center">
      <div className="w-full">
        <ul className="flex gap-3">
          <li className="text-indigo-500">
            <a href="#">Finest PC</a>
          </li>
          <li>&bull;</li>
          <li className="text-indigo-500">
            <a href="#">GPUs</a>
          </li>
          <li>&bull;</li>
          <li>NVIDIA GeForce RTX 3090</li>
        </ul>
      </div>

      <h1 className="text-3xl font-medium w-full">
        <span className="text-2xl font-normal mr-2">NVIDIA</span>
        <span>GeForce RTX 3090</span>
      </h1>

      <main className="flex-1 flex flex-col gap-6">
        <section className="flex flex-wrap justify-start gap-6 lg:gap-8">
          <div className="flex-1 min-w-[300px]">
            <div className="flex flex-col flex-wrap gap-6 mb-6 mx-auto items-center justify-center w-full max-w-[300px] lg:max-w-full">
              <div className="bg-gray-50 border border-gray-200 flex items-center justify-center rounded aspect-square h-full w-full max-h-[350px] lg:max-h-full">
                <Image
                  className="w-auto h-auto mx-auto"
                  src="https://www.nvidia.com/content/dam/en-zz/Solutions/geforce/ampere/rtx-3090/geforce-rtx-3090-shop-630-d@2x.png"
                />
              </div>

              <div className="flex flex-wrap w-full gap-6">
                <div className="bg-gray-50 border border-gray-200 h-20 w-20 flex items-center">
                  <Image
                    className="rounded w-auto h-auto mx-auto"
                    src="https://www.nvidia.com/content/dam/en-zz/Solutions/geforce/ampere/rtx-3090/geforce-rtx-3090-shop-630-d@2x.png"
                  />
                </div>

                <div className="bg-gray-50 border border-gray-200 h-20 w-20 flex items-center">
                  <Image
                    className="bg-gray-50 rounded w-auto h-auto mx-auto"
                    src="https://www.nvidia.com/content/dam/en-zz/Solutions/geforce/ampere/rtx-3090/geforce-rtx-3090-shop-630-d@2x.png"
                  />
                </div>

                <div className="bg-gray-50 border border-gray-200 h-20 w-20 flex items-center">
                  <Image
                    className="bg-gray-50 rounded w-auto h-auto mx-auto"
                    src="https://www.nvidia.com/content/dam/en-zz/Solutions/geforce/ampere/rtx-3090/geforce-rtx-3090-shop-630-d@2x.png"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1">
            <ul className={classNames('flex flex-col gap-3')}>
              <li
                className={classNames(
                  'bg-slate-200 flex items-center justify-center px-4 py-1 rounded shadow',
                )}
              >
                <div className={classNames('flex-1 flex gap-2 items-center')}>
                  <div className="mr-1">
                    <ChipIcon className="w-[20px] lg:w-[30px]"></ChipIcon>
                  </div>

                  <div
                    className={classNames('font-medium text-xl lg:text-2xl')}
                  >
                    Release Date
                  </div>
                </div>

                <div
                  className={classNames(
                    'text-md lg:text-lg text-slate-600 p-2 text-right',
                  )}
                >
                  Q4 2022
                </div>
              </li>

              <li
                className={classNames(
                  'bg-slate-200 flex items-center justify-center px-4 py-1 rounded shadow',
                )}
              >
                <div className={classNames('flex-1 flex gap-2 items-center')}>
                  <div className="mr-1">
                    <ChipIcon className="w-[20px] lg:w-[30px]"></ChipIcon>
                  </div>

                  <div
                    className={classNames('font-medium text-xl lg:text-2xl')}
                  >
                    Cores
                  </div>
                </div>

                <div
                  className={classNames(
                    'text-md lg:text-lg text-slate-600 p-2 text-right',
                  )}
                >
                  9704 CUDA Cores
                </div>
              </li>

              <li
                className={classNames(
                  'bg-slate-200 flex items-center justify-center px-4 py-1 rounded shadow',
                )}
              >
                <div className={classNames('flex-1 flex gap-2 items-center')}>
                  <div className="mr-1">
                    <ChipIcon className="w-[20px] lg:w-[30px]"></ChipIcon>
                  </div>

                  <div
                    className={classNames('font-medium text-xl lg:text-2xl')}
                  >
                    Clock
                  </div>
                </div>

                <div
                  className={classNames(
                    'text-md lg:text-lg text-slate-600 p-2 text-right',
                  )}
                >
                  1440 MHz / 1845 MHz
                </div>
              </li>

              <li
                className={classNames(
                  'bg-slate-200 flex items-center justify-center px-4 py-1 rounded shadow',
                )}
              >
                <div className={classNames('flex-1 flex gap-2 items-center')}>
                  <div className="mr-1">
                    <ChipIcon className="w-[20px] lg:w-[30px]"></ChipIcon>
                  </div>

                  <div
                    className={classNames('font-medium text-xl lg:text-2xl')}
                  >
                    Memory
                  </div>
                </div>

                <div
                  className={classNames(
                    'text-md lg:text-lg text-slate-600 p-2 text-right',
                  )}
                >
                  24 GB GDDR6X
                </div>
              </li>

              <li
                className={classNames(
                  'bg-slate-200 flex items-center justify-center px-4 py-1 rounded shadow',
                )}
              >
                <div className={classNames('flex-1 flex gap-2 items-center')}>
                  <div className="mr-1">
                    <ChipIcon className="w-[20px] lg:w-[30px]"></ChipIcon>
                  </div>

                  <div
                    className={classNames('font-medium text-xl lg:text-2xl')}
                  >
                    Performance Rating
                  </div>
                </div>

                <div
                  className={classNames(
                    'text-md lg:text-lg text-slate-600 p-2 text-right',
                  )}
                >
                  82.23
                </div>
              </li>

              <li
                className={classNames(
                  'bg-slate-200 flex items-center justify-center px-4 py-1 rounded shadow',
                )}
              >
                <div className={classNames('flex-1 flex gap-2 items-center')}>
                  <div className="mr-1">
                    <ChipIcon className="w-[20px] lg:w-[30px]"></ChipIcon>
                  </div>

                  <div
                    className={classNames('font-medium text-xl lg:text-2xl')}
                  >
                    Value for Money
                  </div>
                </div>

                <div
                  className={classNames(
                    'text-md lg:text-lg text-slate-600 p-2 text-right',
                  )}
                >
                  58.32
                </div>
              </li>
            </ul>
          </div>
        </section>

        <section>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. A
            iaculis at erat pellentesque adipiscing commodo elit at. Maecenas
            sed enim ut sem viverra. Elementum sagittis vitae et leo duis ut
            diam. In mollis nunc sed id semper risus in hendrerit. Eget sit amet
            tellus cras adipiscing enim. Sit amet consectetur adipiscing elit.
            Interdum velit euismod in pellentesque massa.
          </p>
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
                <TBody>
                  <Tr>
                    <Td className="min-w-[200px]">Performance Rating</Td>
                    <Td className="min-w-[80px]">82.23</Td>
                  </Tr>
                  <Tr>
                    <Td>Value for Money</Td>
                    <Td>58.32</Td>
                  </Tr>
                  <Tr>
                    <Td>Company</Td>
                    <Td>NVIDIA</Td>
                  </Tr>
                  <Tr>
                    <Td>Generation</Td>
                    <Td>GeForce 30</Td>
                  </Tr>
                </TBody>
              </Table>

              <Table className="flex-1 mb-0">
                <TBody>
                  <Tr>
                    <Td className="min-w-[200px]">Market Segment</Td>
                    <Td className="min-w-[80px]">Desktop</Td>
                  </Tr>
                  <Tr>
                    <Td>Launch Price</Td>
                    <Td>$1,499</Td>
                  </Tr>
                  <Tr>
                    <Td>Release Date</Td>
                    <Td>Q4 2022</Td>
                  </Tr>
                  <Tr>
                    <Td>Production Status</Td>
                    <Td>Active</Td>
                  </Tr>
                </TBody>
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
                <TBody>
                  <Tr>
                    <Td className="min-w-[100px]">GPU Name</Td>
                    <Td className="min-w-[80px]">GA102</Td>
                  </Tr>
                  <Tr>
                    <Td>Architecture</Td>
                    <Td>Ampere</Td>
                  </Tr>
                  <Tr>
                    <Td>Foundry</Td>
                    <Td>Samsung</Td>
                  </Tr>
                </TBody>
              </Table>

              <Table className="flex-1 mb-0">
                <TBody>
                  <Tr>
                    <Td className="min-w-[100px]">Process Size</Td>
                    <Td className="min-w-[80px]">8nm</Td>
                  </Tr>
                  <Tr>
                    <Td>Transistors</Td>
                    <Td>28,300 million</Td>
                  </Tr>
                  <Tr>
                    <Td>Die Size</Td>
                    <Td>628</Td>
                  </Tr>
                </TBody>
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
                <TBody>
                  <Tr>
                    <Td>Slot Width</Td>
                    <Td>Triple-slot</Td>
                  </Tr>
                  <Tr>
                    <Td className="min-w-[100px]">Length</Td>
                    <Td className="min-w-[80px]">336mm</Td>
                  </Tr>
                  <Tr>
                    <Td>Width</Td>
                    <Td>140mm</Td>
                  </Tr>
                  <Tr>
                    <Td>Height</Td>
                    <Td>61mm</Td>
                  </Tr>
                </TBody>
              </Table>

              <Table className="flex-1 mb-0">
                <TBody>
                  <Tr>
                    <Td className="min-w-[100px]">Bus Interface</Td>
                    <Td className="min-w-[80px]">PCIe 4.0 x16</Td>
                  </Tr>
                  <Tr>
                    <Td>TDP</Td>
                    <Td>350 W</Td>
                  </Tr>
                  <Tr>
                    <Td>Suggested PSU</Td>
                    <Td>750 W</Td>
                  </Tr>
                  <Tr>
                    <Td className="min-w-[100px]">Power Connectors</Td>
                    <Td className="min-w-[80px]">1x 12-pin</Td>
                  </Tr>
                </TBody>
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

      <aside className="border w-[300px]">
        <section>
          <header className="text-xl font-medium">Popular GPUs</header>

          <div className="flex flex-wrap">GPUs here</div>
        </section>
      </aside>
    </WebsiteLayout>
  );
};

ViewGpuPage.getInitialProps = async (_ctx: NextPageContext) => {
  return {};
};

export default ViewGpuPage;
