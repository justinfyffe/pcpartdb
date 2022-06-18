import {
  CalendarIcon,
  ChipIcon,
  ClockIcon,
  CurrencyDollarIcon,
  InformationCircleIcon,
  PlusCircleIcon,
  SearchIcon,
  ShoppingCartIcon,
  StarIcon,
  TableIcon,
} from '@heroicons/react/outline';
import { NextPageContext } from 'next';
import React from 'react';
import { Button, ButtonVariant } from '../../../web/shared/components/button';
import { Card } from '../../../web/shared/components/card';
import { Image } from '../../../web/shared/components/image';
import { Input } from '../../../web/shared/components/input';
import { Table, TBody, Td, Tr } from '../../../web/shared/components/table';
import { WebsiteLayout } from '../../../web/shared/layouts/website';
import { classNames } from '../../../web/shared/ui/ui.utils';

interface ViewGpuPageProps {}

const ViewGpuPage = (_props: ViewGpuPageProps) => {
  return (
    <WebsiteLayout className="flex flex-wrap gap-6 lg:gap-8 text-slate-700 justify-center">
      <div className="flex flex-wrap w-full items-center justify-between gap-2">
        <div className="w-full">
          <ul className="flex gap-3 text-sm">
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

        <h1 className="text-3xl font-medium">
          <span className="text-2xl font-normal mr-2">NVIDIA</span>
          <span>GeForce RTX 3090</span>
        </h1>

        <div className="flex w-full max-w-[500px] gap-4">
          <Input placeholder="Search GPUs..." className="flex-1" />
          <Button variant={ButtonVariant.Primary}>
            <SearchIcon className="w-[20px]" />
          </Button>
        </div>
      </div>

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
            <ul className={classNames('flex flex-col gap-3 lg:gap-4')}>
              <li
                className={classNames(
                  'bg-slate-200 flex items-center justify-center px-4 py-2 rounded shadow',
                )}
              >
                <div className={classNames('flex-1 flex gap-2 items-center')}>
                  <div className="mr-1">
                    <ShoppingCartIcon className="w-[20px] lg:w-[30px]"></ShoppingCartIcon>
                  </div>

                  <div
                    className={classNames('font-medium text-xl lg:text-2xl')}
                  >
                    Shop
                  </div>
                </div>

                <Button
                  variant={ButtonVariant.Primary}
                  className={classNames(
                    'self-stretch lg:text-lg text-right py-[4px]',
                  )}
                >
                  Buy
                </Button>
              </li>

              <li
                className={classNames(
                  'bg-slate-200 flex items-center justify-center px-4 py-2 rounded shadow',
                )}
              >
                <div className={classNames('flex-1 flex gap-2 items-center')}>
                  <div className="mr-1">
                    <CalendarIcon className="w-[20px] lg:w-[30px]"></CalendarIcon>
                  </div>

                  <div
                    className={classNames('font-medium text-xl lg:text-2xl')}
                  >
                    Release Date
                  </div>
                </div>

                <div
                  className={classNames(
                    'text-md lg:text-lg text-slate-600 text-right',
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
                    'text-md lg:text-lg text-slate-600 text-right',
                  )}
                >
                  9704 CUDA Cores
                </div>
              </li>

              <li
                className={classNames(
                  'bg-slate-200 flex items-center justify-center px-4 py-2 rounded shadow',
                )}
              >
                <div className={classNames('flex-1 flex gap-2 items-center')}>
                  <div className="mr-1">
                    <ClockIcon className="w-[20px] lg:w-[30px]"></ClockIcon>
                  </div>

                  <div
                    className={classNames('font-medium text-xl lg:text-2xl')}
                  >
                    Clock
                  </div>
                </div>

                <div
                  className={classNames(
                    'text-md lg:text-lg text-slate-600 text-right',
                  )}
                >
                  1440 MHz / 1845 MHz
                </div>
              </li>

              <li
                className={classNames(
                  'bg-slate-200 flex items-center justify-center px-4 py-2 rounded shadow',
                )}
              >
                <div className={classNames('flex-1 flex gap-2 items-center')}>
                  <div className="mr-1">
                    <TableIcon className="w-[20px] lg:w-[30px]"></TableIcon>
                  </div>

                  <div
                    className={classNames('font-medium text-xl lg:text-2xl')}
                  >
                    Memory
                  </div>
                </div>

                <div
                  className={classNames(
                    'text-md lg:text-lg text-slate-600 text-right',
                  )}
                >
                  24 GB GDDR6X
                </div>
              </li>

              <li
                className={classNames(
                  'bg-slate-200 flex items-center justify-center px-4 py-2 rounded shadow',
                )}
              >
                <div className={classNames('flex-1 flex gap-2 items-center')}>
                  <div className="mr-1">
                    <StarIcon className="w-[20px] lg:w-[30px]"></StarIcon>
                  </div>

                  <div
                    className={classNames('font-medium text-xl lg:text-2xl')}
                  >
                    Performance Rating
                  </div>
                </div>

                <div
                  className={classNames(
                    'text-md lg:text-lg text-slate-600 text-right',
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
                <div className={classNames('flex-1 flex gap-2 items-center')}>
                  <div className="mr-1">
                    <CurrencyDollarIcon className="w-[20px] lg:w-[30px]"></CurrencyDollarIcon>
                  </div>

                  <div
                    className={classNames('font-medium text-xl lg:text-2xl')}
                  >
                    Value for Money
                  </div>
                </div>

                <div
                  className={classNames(
                    'text-md lg:text-lg text-slate-600 text-right',
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
                  <Tr>
                    <Td>Weight</Td>
                    <Td>2.92 kg</Td>
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

            <div className="flex flex-wrap items-start mb-3">
              <Table className="flex-1 mb-0">
                <TBody>
                  <Tr>
                    <Td className="min-w-[100px]">CUDA Cores</Td>
                    <Td className="min-w-[80px]">9,704</Td>
                  </Tr>
                  <Tr>
                    <Td>TMUs</Td>
                    <Td>328</Td>
                  </Tr>
                  <Tr>
                    <Td>ROPs</Td>
                    <Td>112</Td>
                  </Tr>
                  <Tr>
                    <Td>Tensor Cores</Td>
                    <Td>576</Td>
                  </Tr>
                  <Tr>
                    <Td>RT Cores</Td>
                    <Td>72</Td>
                  </Tr>
                </TBody>
              </Table>

              <Table className="flex-1 mb-0">
                <TBody>
                  <Tr>
                    <Td className="min-w-[100px]">Base Clock</Td>
                    <Td className="min-w-[80px]">1,440 MHz</Td>
                  </Tr>
                  <Tr>
                    <Td>Boost Clock</Td>
                    <Td>1,845 MHz</Td>
                  </Tr>
                  <Tr>
                    <Td>L1 Cache</Td>
                    <Td>128 KB</Td>
                  </Tr>
                  <Tr>
                    <Td>L2 Cache</Td>
                    <Td>6 MB</Td>
                  </Tr>
                </TBody>
              </Table>
            </div>

            <h3 className="text-xl font-medium mb-3">
              Theoretical Performance
            </h3>

            <p className={classNames('text-gray-400 mb-4')}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>

            <div className="flex flex-wrap items-start mb-3">
              <Table className="flex-1 mb-0">
                <TBody>
                  <Tr>
                    <Td className="min-w-[100px]">Pixel Rate</Td>
                    <Td className="min-w-[80px]">189.8 GPixel/s</Td>
                  </Tr>
                  <Tr>
                    <Td>Texture Rate</Td>
                    <Td>556.0 GTexel/s</Td>
                  </Tr>
                </TBody>
              </Table>

              <Table className="flex-1 mb-0">
                <TBody>
                  <Tr>
                    <Td className="min-w-[100px]">FP32 Performance</Td>
                    <Td className="min-w-[80px]">35.58 TFLOPS</Td>
                  </Tr>
                  <Tr>
                    <Td>FP64 Performance</Td>
                    <Td>556.0 GFLOPS</Td>
                  </Tr>
                </TBody>
              </Table>
            </div>

            <h3 className="text-xl font-medium mb-3">Memory</h3>

            <p className={classNames('text-gray-400 mb-4')}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>

            <div className="flex flex-wrap items-start mb-3">
              <Table className="flex-1 mb-0">
                <TBody>
                  <Tr>
                    <Td className="min-w-[100px]">Memory Size</Td>
                    <Td className="min-w-[80px]">24 GB GDDR6X</Td>
                  </Tr>
                  <Tr>
                    <Td>Memory Clock</Td>
                    <Td>9,750 MHz</Td>
                  </Tr>
                </TBody>
              </Table>

              <Table className="flex-1 mb-0">
                <TBody>
                  <Tr>
                    <Td className="min-w-[100px]">Memory Interface</Td>
                    <Td className="min-w-[80px]">384-bit</Td>
                  </Tr>
                  <Tr>
                    <Td>Memory Bandwidth</Td>
                    <Td>936 GB/s</Td>
                  </Tr>
                </TBody>
              </Table>
            </div>

            <h3 className="text-xl font-medium mb-3">Display Connectivity</h3>

            <p className={classNames('text-gray-400 mb-4')}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>

            <div className="flex flex-wrap items-start mb-3">
              <Table className="flex-1 mb-0">
                <TBody>
                  <Tr>
                    <Td className="min-w-[100px]">Max Resolution</Td>
                    <Td className="min-w-[80px]">7680x4320</Td>
                  </Tr>
                  <Tr>
                    <Td>Display Ports</Td>
                    <Td>3x 1.4a</Td>
                  </Tr>
                  <Tr>
                    <Td>HDMI Ports</Td>
                    <Td>2x 2.1, 1x 2.0</Td>
                  </Tr>
                  <Tr>
                    <Td className="min-w-[100px]">USB-C</Td>
                    <Td className="min-w-[80px]">No</Td>
                  </Tr>
                </TBody>
              </Table>

              <Table className="flex-1 mb-0">
                <TBody>
                  <Tr>
                    <Td>Dual Link DVI</Td>
                    <Td>No</Td>
                  </Tr>
                  <Tr>
                    <Td>Single Link DVI</Td>
                    <Td>No</Td>
                  </Tr>
                  <Tr>
                    <Td>VGA</Td>
                    <Td>No</Td>
                  </Tr>
                </TBody>
              </Table>
            </div>

            <h3 className="text-xl font-medium mb-3">API Support</h3>

            <p className={classNames('text-gray-400 mb-4')}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>

            <div className="flex flex-wrap items-start mb-3">
              <Table className="flex-1 mb-0">
                <TBody>
                  <Tr>
                    <Td className="min-w-[100px]">DirextX</Td>
                    <Td className="min-w-[80px]">12</Td>
                  </Tr>
                  <Tr>
                    <Td>G-Sync / FreeSync</Td>
                    <Td>Yes</Td>
                  </Tr>
                  <Tr>
                    <Td>SLI / Crossfire</Td>
                    <Td>No</Td>
                  </Tr>
                  <Tr>
                    <Td>VR Ready</Td>
                    <Td>Yes</Td>
                  </Tr>
                </TBody>
              </Table>

              <Table className="flex-1 mb-0">
                <TBody>
                  <Tr>
                    <Td className="min-w-[100px]">OpenCL</Td>
                    <Td className="min-w-[80px]">2.0</Td>
                  </Tr>
                  <Tr>
                    <Td>OpenGL</Td>
                    <Td>4.6</Td>
                  </Tr>
                  <Tr>
                    <Td>Shader Model</Td>
                    <Td>6.5</Td>
                  </Tr>
                </TBody>
              </Table>
            </div>
          </Card>

          <Card>
            <h2 className="text-2xl font-medium mb-3">Benchmarks</h2>

            <p className={classNames('text-gray-400 mb-4')}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>

            <div className="flex flex-wrap items-start mb-3">
              <Table className="flex-1 mb-0">
                <TBody>
                  <Tr>
                    <Td className="min-w-[100px]">Performance Rating</Td>
                    <Td className="min-w-[80px]">82.23</Td>
                  </Tr>
                  <Tr>
                    <Td>Value for Money</Td>
                    <Td>58.32</Td>
                  </Tr>
                  <Tr>
                    <Td>Passmark</Td>
                    <Td>26479</Td>
                  </Tr>
                  <Tr>
                    <Td>3DMark Time Spy</Td>
                    <Td>19931</Td>
                  </Tr>
                </TBody>
              </Table>

              <Table className="flex-1 mb-0">
                <TBody>
                  <Tr>
                    <Td className="min-w-[100px]">GeekBench 5 CUDA</Td>
                    <Td className="min-w-[80px]">238123</Td>
                  </Tr>
                  <Tr>
                    <Td>GeekBench 5 OpenCL</Td>
                    <Td>204921</Td>
                  </Tr>
                  <Tr>
                    <Td>GeekBench 5 Vulkan</Td>
                    <Td>138637</Td>
                  </Tr>
                </TBody>
              </Table>
            </div>
          </Card>

          <Card>
            <h2 className="text-2xl font-medium mb-3">Reviews</h2>

            <p className={classNames('text-gray-400 mb-4')}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>

            <Table className="mb-0">
              <TBody>
                <Tr>
                  <Td className="min-w-[100px]">
                    <a href="#" className="text-indigo-500">
                      Average Rating
                    </a>
                  </Td>
                  <Td className="min-w-[80px]">4.0 / 5</Td>
                </Tr>
                <Tr>
                  <Td>
                    <a href="#" className="text-indigo-500">
                      Amazon
                    </a>
                  </Td>
                  <Td>4.6 / 5</Td>
                </Tr>
                <Tr>
                  <Td>
                    <a href="#" className="text-indigo-500">
                      TechRadar
                    </a>
                  </Td>
                  <Td>4.0 / 5</Td>
                </Tr>
                <Tr>
                  <Td>
                    <a href="#" className="text-indigo-500">
                      Tom&apos;s Hardware
                    </a>
                  </Td>
                  <Td>4.0 / 5</Td>
                </Tr>
                <Tr>
                  <Td>
                    <a href="#" className="text-indigo-500">
                      TechSpot
                    </a>
                  </Td>
                  <Td>3.5 / 5</Td>
                </Tr>
                <Tr>
                  <Td>
                    <a href="#" className="text-indigo-500">
                      PC Gamer
                    </a>
                  </Td>
                  <Td>3.5 / 5</Td>
                </Tr>
              </TBody>
            </Table>
          </Card>
        </section>
      </main>

      <aside className="w-[300px] flex flex-col gap-6">
        <section>
          <div className="flex flex-col gap-3">
            <header className="flex text-lg font-medium w-full">
              Notify me of stock updates{' '}
              <InformationCircleIcon className="ml-2 w-[20px]" />
            </header>

            <div className="flex gap-3">
              <Input placeholder="Email address..." />
              <Button variant={ButtonVariant.Primary} className="px-3 py-2">
                Save
              </Button>
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <header className="text-lg font-medium">Popular GPUs</header>

          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3 px-2 py-3 border rounded text-sm">
              <Image
                className="w-auto h-auto mx-auto max-h-[60px] max-w-[60px]"
                src="https://www.nvidia.com/content/dam/en-zz/Solutions/geforce/ampere/rtx-3090/geforce-rtx-3090-shop-630-d@2x.png"
              />
              <div className="flex-1">
                <a href="#" className="text-indigo-500">
                  NVIDIA GeForce RTX 3080
                </a>
              </div>
            </div>

            <div className="flex items-center gap-3 border px-2 py-3 rounded text-sm">
              <Image
                className="w-auto h-auto mx-auto max-h-[60px] max-w-[60px]"
                src="https://www.nvidia.com/content/dam/en-zz/Solutions/geforce/ampere/rtx-3090/geforce-rtx-3090-shop-630-d@2x.png"
              />
              <div className="flex-1">
                <a href="#" className="text-indigo-500">
                  NVIDIA GeForce RTX 3070
                </a>
              </div>
            </div>

            <div className="flex items-center gap-3 border px-2 py-3 rounded text-sm">
              <Image
                className="w-auto h-auto mx-auto max-h-[60px] max-w-[60px]"
                src="https://www.nvidia.com/content/dam/en-zz/Solutions/geforce/ampere/rtx-3090/geforce-rtx-3090-shop-630-d@2x.png"
              />
              <div className="flex-1">
                <a href="#" className="text-indigo-500">
                  NVIDIA GeForce RTX 3060
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <header className="text-lg font-medium">Popular Comparisons</header>

          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3 border px-2 py-3 rounded text-sm">
              <Image
                className="w-auto h-auto mx-auto max-h-[60px] max-w-[60px]"
                src="https://www.nvidia.com/content/dam/en-zz/Solutions/geforce/ampere/rtx-3090/geforce-rtx-3090-shop-630-d@2x.png"
              />
              <div className="flex-1">
                <a href="#" className="text-indigo-500">
                  NVIDIA GeForce RTX 3080 vs NVIDIA GeForce RTX 3070
                </a>
              </div>
            </div>

            <div className="flex items-center gap-3 border px-2 py-3 rounded text-sm">
              <Image
                className="w-auto h-auto mx-auto max-h-[60px] max-w-[60px]"
                src="https://www.nvidia.com/content/dam/en-zz/Solutions/geforce/ampere/rtx-3090/geforce-rtx-3090-shop-630-d@2x.png"
              />
              <div className="flex-1">
                <a href="#" className="text-indigo-500">
                  NVIDIA GeForce RTX 3070 vs NVIDIA GeForce RTX 3060
                </a>
              </div>
            </div>

            <div className="flex items-center gap-3 border px-2 py-3 rounded text-sm">
              <Image
                className="w-auto h-auto mx-auto max-h-[60px] max-w-[60px]"
                src="https://www.nvidia.com/content/dam/en-zz/Solutions/geforce/ampere/rtx-3090/geforce-rtx-3090-shop-630-d@2x.png"
              />
              <div className="flex-1">
                <a href="#" className="text-indigo-500">
                  NVIDIA GeForce RTX 3090 vs NVIDIA GeForce RTX 3070
                </a>
              </div>
            </div>
          </div>
        </section>
      </aside>
    </WebsiteLayout>
  );
};

ViewGpuPage.getInitialProps = async (_ctx: NextPageContext) => {
  return {};
};

export default ViewGpuPage;
