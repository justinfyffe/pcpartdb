import {
  InformationCircleIcon,
  PlusCircleIcon,
} from '@heroicons/react/outline';
import { NextPageContext } from 'next';
import React from 'react';
import { Button, ButtonVariant } from '../../../web/shared/components/button';
import { Card } from '../../../web/shared/components/card';
import { Image } from '../../../web/shared/components/image';
import { Input } from '../../../web/shared/components/input';
import {
  Table,
  TBody,
  Td,
  THead,
  Tr,
} from '../../../web/shared/components/table';
import { WebsiteLayout } from '../../../web/shared/layouts/website';
import { classNames } from '../../../web/shared/ui/ui.utils';

interface ViewGpuPageProps {}

const ViewGpuPage = (_props: ViewGpuPageProps) => {
  return (
    <WebsiteLayout className="flex flex-wrap gap-6 lg:gap-8 text-slate-700 justify-center">
      <div className="flex flex-wrap w-full items-center justify-start gap-3">
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
            <li>NVIDIA GeForce RTX 3090 vs NVIDIA GeForce RTX 3080</li>
          </ul>
        </div>

        <h1 className="text-3xl font-medium mb-3">
          NVIDIA GeForce RTX 3090 vs NVIDIA GeForce RTX 3080
        </h1>

        <section className={classNames('w-full')}>
          <div className={classNames('gap-4 flex justify-center')}>
            <div
              className={classNames(
                'flex flex-1 gap-6 items-stretch justify-center',
              )}
            >
              <Input
                placeholder="Graphics Card..."
                value="NVIDIA GeForce RTX 3090"
                className={classNames('flex-1')}
              />

              <div
                className={classNames(
                  'self-center font-medium text-center text-slate-700',
                )}
              >
                VS
              </div>

              <Input
                placeholder="Graphics Card..."
                value="NVIDIA GeForce RTX 3080"
                className={classNames('flex-1')}
              />

              <Button
                variant={ButtonVariant.Default}
                className={classNames('h-full')}
              >
                <PlusCircleIcon className={classNames('h-6 mx-auto')} />
              </Button>
            </div>

            <Button variant={ButtonVariant.Primary} className={classNames()}>
              Compare
            </Button>
          </div>
        </section>
      </div>

      <main className="flex-1 flex flex-col gap-6">
        <section className="flex flex-wrap justify-start gap-6 lg:gap-8">
          <div className="flex flex-col gap-3 flex-1 min-w-[300px]">
            <h2 className="self-start text-2xl font-medium">
              NVIDIA GeForce RTX 3090
            </h2>
            <div className="flex flex-col flex-wrap gap-6 mx-auto items-center justify-center w-full max-w-[300px] lg:max-w-full">
              <div className="bg-gray-50 border border-gray-200 flex items-center justify-center rounded aspect-square h-full w-full max-h-[350px] lg:max-h-full">
                <Image
                  className="w-auto h-auto mx-auto"
                  src="https://www.nvidia.com/content/dam/en-zz/Solutions/geforce/ampere/rtx-3090/geforce-rtx-3090-shop-630-d@2x.png"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 flex-1 min-w-[300px]">
            <h2 className="self-start text-2xl font-medium">
              NVIDIA GeForce RTX 3080
            </h2>
            <div className="flex flex-col flex-wrap gap-6 mx-auto items-center justify-center w-full max-w-[300px] lg:max-w-full">
              <div className="bg-gray-50 border border-gray-200 flex items-center justify-center rounded aspect-square h-full w-full max-h-[350px] lg:max-h-full">
                <Image
                  className="w-auto h-auto mx-auto"
                  src="https://www.nvidia.com/content/dam/en-zz/Solutions/geforce/ampere/rtx-3090/geforce-rtx-3090-shop-630-d@2x.png"
                />
              </div>
            </div>
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

            <Table className="mb-0">
              <THead>
                <Tr>
                  <Td className="min-w-[200px]">GPU</Td>
                  <Td className="min-w-[80px]">GeForce RTX 3090</Td>
                  <Td className="min-w-[80px]">GeForce RTX 3080</Td>
                </Tr>
              </THead>
              <TBody>
                <Tr>
                  <Td>Performance Rating</Td>
                  <Td>82.23</Td>
                  <Td>72.23</Td>
                </Tr>
                <Tr>
                  <Td>Value for Money</Td>
                  <Td>58.32</Td>
                  <Td>48.32</Td>
                </Tr>
                <Tr>
                  <Td>Company</Td>
                  <Td>NVIDIA</Td>
                  <Td>NVIDIA</Td>
                </Tr>
                <Tr>
                  <Td>Generation</Td>
                  <Td>GeForce 30</Td>
                  <Td>GeForce 30</Td>
                </Tr>
                <Tr>
                  <Td>Market Segment</Td>
                  <Td>Desktop</Td>
                  <Td>Desktop</Td>
                </Tr>
                <Tr>
                  <Td>Launch Price</Td>
                  <Td>$1,499</Td>
                  <Td>$999</Td>
                </Tr>
                <Tr>
                  <Td>Release Date</Td>
                  <Td>Q4 2022</Td>
                  <Td>Q3 2022</Td>
                </Tr>
                <Tr>
                  <Td>Production Status</Td>
                  <Td>Active</Td>
                  <Td>Active</Td>
                </Tr>
              </TBody>
            </Table>
          </Card>

          <Card>
            <h2 className="text-2xl font-medium mb-6">Technical Specs</h2>

            <h3 className="text-xl font-medium mb-3">Processor</h3>

            <p className={classNames('text-gray-400 mb-4')}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>

            <Table className="mb-0">
              <THead>
                <Tr>
                  <Td className="min-w-[200px]">GPU</Td>
                  <Td className="min-w-[80px]">GeForce RTX 3090</Td>
                  <Td className="min-w-[80px]">GeForce RTX 3080</Td>
                </Tr>
              </THead>
              <TBody>
                <Tr>
                  <Td>GPU Name</Td>
                  <Td>GA102</Td>
                  <Td>GA102</Td>
                </Tr>
                <Tr>
                  <Td>Architecture</Td>
                  <Td>Ampere</Td>
                  <Td>Ampere</Td>
                </Tr>
                <Tr>
                  <Td>Foundry</Td>
                  <Td>Samsung</Td>
                  <Td>Samsung</Td>
                </Tr>
                <Tr>
                  <Td>Process Size</Td>
                  <Td>8nm</Td>
                  <Td>8nm</Td>
                </Tr>
                <Tr>
                  <Td>Transistors</Td>
                  <Td>28,300 million</Td>
                  <Td>28,300 million</Td>
                </Tr>
                <Tr>
                  <Td>Die Size</Td>
                  <Td>628</Td>
                  <Td>628</Td>
                </Tr>
              </TBody>
            </Table>

            <h3 className="text-xl font-medium mb-3">
              Board Compatibility &amp; Dimensions
            </h3>

            <p className={classNames('text-gray-400 mb-4')}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>

            <Table className="mb-0">
              <THead>
                <Tr>
                  <Td className="min-w-[200px]">GPU</Td>
                  <Td className="min-w-[80px]">GeForce RTX 3090</Td>
                  <Td className="min-w-[80px]">GeForce RTX 3080</Td>
                </Tr>
              </THead>
              <TBody>
                <Tr>
                  <Td>Slot Width</Td>
                  <Td>Triple-slot</Td>
                  <Td>Double-slot</Td>
                </Tr>
                <Tr>
                  <Td>Length</Td>
                  <Td>336mm</Td>
                  <Td>336mm</Td>
                </Tr>
                <Tr>
                  <Td>Width</Td>
                  <Td>140mm</Td>
                  <Td>140mm</Td>
                </Tr>
                <Tr>
                  <Td>Height</Td>
                  <Td>61mm</Td>
                  <Td>41mm</Td>
                </Tr>
                <Tr>
                  <Td>Weight</Td>
                  <Td>2.92 kg</Td>
                  <Td>2.92 kg</Td>
                </Tr>
                <Tr>
                  <Td>Bus Interface</Td>
                  <Td>PCIe 4.0 x16</Td>
                  <Td>PCIe 4.0 x16</Td>
                </Tr>
                <Tr>
                  <Td>TDP</Td>
                  <Td>350 W</Td>
                  <Td>350 W</Td>
                </Tr>
                <Tr>
                  <Td>Suggested PSU</Td>
                  <Td>750 W</Td>
                  <Td>750 W</Td>
                </Tr>
                <Tr>
                  <Td>Power Connectors</Td>
                  <Td>1x 12-pin</Td>
                  <Td>1x 12-pin</Td>
                </Tr>
              </TBody>
            </Table>

            <h3 className="text-xl font-medium mb-3">
              Cores &amp; Clock Speeds
            </h3>

            <p className={classNames('text-gray-400 mb-4')}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>

            <Table className="mb-0">
              <THead>
                <Tr>
                  <Td className="min-w-[200px]">GPU</Td>
                  <Td className="min-w-[80px]">GeForce RTX 3090</Td>
                  <Td className="min-w-[80px]">GeForce RTX 3080</Td>
                </Tr>
              </THead>
              <TBody>
                <Tr>
                  <Td>CUDA Cores</Td>
                  <Td>9,704</Td>
                  <Td>9,704</Td>
                </Tr>
                <Tr>
                  <Td>TMUs</Td>
                  <Td>328</Td>
                  <Td>328</Td>
                </Tr>
                <Tr>
                  <Td>ROPs</Td>
                  <Td>112</Td>
                  <Td>112</Td>
                </Tr>
                <Tr>
                  <Td>Tensor Cores</Td>
                  <Td>576</Td>
                  <Td>576</Td>
                </Tr>
                <Tr>
                  <Td>RT Cores</Td>
                  <Td>72</Td>
                  <Td>72</Td>
                </Tr>
                <Tr>
                  <Td>Base Clock</Td>
                  <Td>1,440 MHz</Td>
                  <Td>1,440 MHz</Td>
                </Tr>
                <Tr>
                  <Td>Boost Clock</Td>
                  <Td>1,845 MHz</Td>
                  <Td>1,845 MHz</Td>
                </Tr>
                <Tr>
                  <Td>L1 Cache</Td>
                  <Td>128 KB</Td>
                  <Td>128 KB</Td>
                </Tr>
                <Tr>
                  <Td>L2 Cache</Td>
                  <Td>6 MB</Td>
                  <Td>6 MB</Td>
                </Tr>
              </TBody>
            </Table>

            <h3 className="text-xl font-medium mb-3">
              Theoretical Performance
            </h3>

            <p className={classNames('text-gray-400 mb-4')}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>

            <Table className="mb-0">
              <THead>
                <Tr>
                  <Td className="min-w-[200px]">GPU</Td>
                  <Td className="min-w-[80px]">GeForce RTX 3090</Td>
                  <Td className="min-w-[80px]">GeForce RTX 3080</Td>
                </Tr>
              </THead>
              <TBody>
                <Tr>
                  <Td>Pixel Rate</Td>
                  <Td>189.8 GPixel/s</Td>
                  <Td>189.8 GPixel/s</Td>
                </Tr>
                <Tr>
                  <Td>Texture Rate</Td>
                  <Td>556.0 GTexel/s</Td>
                  <Td>556.0 GTexel/s</Td>
                </Tr>
                <Tr>
                  <Td>FP32 Performance</Td>
                  <Td>35.58 TFLOPS</Td>
                  <Td>35.58 TFLOPS</Td>
                </Tr>
                <Tr>
                  <Td>FP64 Performance</Td>
                  <Td>556.0 GFLOPS</Td>
                  <Td>556.0 GFLOPS</Td>
                </Tr>
              </TBody>
            </Table>

            <h3 className="text-xl font-medium mb-3">Memory</h3>

            <p className={classNames('text-gray-400 mb-4')}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>

            <Table className="mb-0">
              <THead>
                <Tr>
                  <Td className="min-w-[200px]">GPU</Td>
                  <Td className="min-w-[80px]">GeForce RTX 3090</Td>
                  <Td className="min-w-[80px]">GeForce RTX 3080</Td>
                </Tr>
              </THead>
              <TBody>
                <Tr>
                  <Td>Memory Size</Td>
                  <Td>24 GB GDDR6X</Td>
                  <Td>24 GB GDDR6X</Td>
                </Tr>
                <Tr>
                  <Td>Memory Clock</Td>
                  <Td>9,750 MHz</Td>
                  <Td>9,750 MHz</Td>
                </Tr>
                <Tr>
                  <Td>Memory Interface</Td>
                  <Td>384-bit</Td>
                  <Td>384-bit</Td>
                </Tr>
                <Tr>
                  <Td>Memory Bandwidth</Td>
                  <Td>936 GB/s</Td>
                  <Td>936 GB/s</Td>
                </Tr>
              </TBody>
            </Table>

            <h3 className="text-xl font-medium mb-3">Display Connectivity</h3>

            <p className={classNames('text-gray-400 mb-4')}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>

            <Table className="mb-0">
              <THead>
                <Tr>
                  <Td className="min-w-[200px]">GPU</Td>
                  <Td className="min-w-[80px]">GeForce RTX 3090</Td>
                  <Td className="min-w-[80px]">GeForce RTX 3080</Td>
                </Tr>
              </THead>
              <TBody>
                <Tr>
                  <Td>Max Resolution</Td>
                  <Td>7680x4320</Td>
                  <Td>7680x4320</Td>
                </Tr>
                <Tr>
                  <Td>Display Ports</Td>
                  <Td>3x 1.4a</Td>
                  <Td>3x 1.4a</Td>
                </Tr>
                <Tr>
                  <Td>HDMI Ports</Td>
                  <Td>2x 2.1, 1x 2.0</Td>
                  <Td>2x 2.1, 1x 2.0</Td>
                </Tr>
                <Tr>
                  <Td>USB-C</Td>
                  <Td>No</Td>
                  <Td>No</Td>
                </Tr>
                <Tr>
                  <Td>Dual Link DVI</Td>
                  <Td>No</Td>
                  <Td>No</Td>
                </Tr>
                <Tr>
                  <Td>Single Link DVI</Td>
                  <Td>No</Td>
                  <Td>No</Td>
                </Tr>
                <Tr>
                  <Td>VGA</Td>
                  <Td>No</Td>
                  <Td>No</Td>
                </Tr>
              </TBody>
            </Table>

            <h3 className="text-xl font-medium mb-3">API Support</h3>

            <p className={classNames('text-gray-400 mb-4')}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>

            <Table className="mb-0">
              <THead>
                <Tr>
                  <Td className="min-w-[200px]">GPU</Td>
                  <Td className="min-w-[80px]">GeForce RTX 3090</Td>
                  <Td className="min-w-[80px]">GeForce RTX 3080</Td>
                </Tr>
              </THead>
              <TBody>
                <Tr>
                  <Td>DirextX</Td>
                  <Td>12</Td>
                  <Td>12</Td>
                </Tr>
                <Tr>
                  <Td>G-Sync / FreeSync</Td>
                  <Td>Yes</Td>
                  <Td>Yes</Td>
                </Tr>
                <Tr>
                  <Td>SLI / Crossfire</Td>
                  <Td>No</Td>
                  <Td>No</Td>
                </Tr>
                <Tr>
                  <Td>VR Ready</Td>
                  <Td>Yes</Td>
                  <Td>Yes</Td>
                </Tr>
                <Tr>
                  <Td>OpenCL</Td>
                  <Td>2.0</Td>
                  <Td>2.0</Td>
                </Tr>
                <Tr>
                  <Td>OpenGL</Td>
                  <Td>4.6</Td>
                  <Td>4.6</Td>
                </Tr>
                <Tr>
                  <Td>Shader Model</Td>
                  <Td>6.5</Td>
                  <Td>6.5</Td>
                </Tr>
              </TBody>
            </Table>
          </Card>

          <Card>
            <h2 className="text-2xl font-medium mb-3">Benchmarks</h2>

            <p className={classNames('text-gray-400 mb-4')}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>

            <Table className="mb-0">
              <THead>
                <Tr>
                  <Td className="min-w-[200px]">GPU</Td>
                  <Td className="min-w-[80px]">GeForce RTX 3090</Td>
                  <Td className="min-w-[80px]">GeForce RTX 3080</Td>
                </Tr>
              </THead>
              <TBody>
                <Tr>
                  <Td>Performance Rating</Td>
                  <Td>82.23</Td>
                  <Td>72.23</Td>
                </Tr>
                <Tr>
                  <Td>Value for Money</Td>
                  <Td>58.32</Td>
                  <Td>48.32</Td>
                </Tr>
                <Tr>
                  <Td>Passmark</Td>
                  <Td>26479</Td>
                  <Td>26479</Td>
                </Tr>
                <Tr>
                  <Td>3DMark Time Spy</Td>
                  <Td>19931</Td>
                  <Td>19931</Td>
                </Tr>
                <Tr>
                  <Td>GeekBench 5 CUDA</Td>
                  <Td>238123</Td>
                  <Td>238123</Td>
                </Tr>
                <Tr>
                  <Td>GeekBench 5 OpenCL</Td>
                  <Td>204921</Td>
                  <Td>204921</Td>
                </Tr>
                <Tr>
                  <Td>GeekBench 5 Vulkan</Td>
                  <Td>138637</Td>
                  <Td>138637</Td>
                </Tr>
              </TBody>
            </Table>
          </Card>

          <Card>
            <h2 className="text-2xl font-medium mb-3">Reviews</h2>

            <p className={classNames('text-gray-400 mb-4')}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>

            <Table className="mb-0">
              <THead>
                <Tr>
                  <Td className="min-w-[200px]">GPU</Td>
                  <Td className="min-w-[80px]">GeForce RTX 3090</Td>
                  <Td className="min-w-[80px]">GeForce RTX 3080</Td>
                </Tr>
              </THead>
              <TBody>
                <Tr>
                  <Td>
                    <a href="#" className="text-indigo-500">
                      Average Rating
                    </a>
                  </Td>
                  <Td>4.0 / 5</Td>
                  <Td>4.0 / 5</Td>
                </Tr>
                <Tr>
                  <Td>
                    <a href="#" className="text-indigo-500">
                      Amazon
                    </a>
                  </Td>
                  <Td>4.6 / 5</Td>
                  <Td>4.6 / 5</Td>
                </Tr>
                <Tr>
                  <Td>
                    <a href="#" className="text-indigo-500">
                      TechRadar
                    </a>
                  </Td>
                  <Td>4.0 / 5</Td>
                  <Td>4.0 / 5</Td>
                </Tr>
                <Tr>
                  <Td>
                    <a href="#" className="text-indigo-500">
                      Tom&apos;s Hardware
                    </a>
                  </Td>
                  <Td>4.0 / 5</Td>
                  <Td>4.0 / 5</Td>
                </Tr>
                <Tr>
                  <Td>
                    <a href="#" className="text-indigo-500">
                      TechSpot
                    </a>
                  </Td>
                  <Td>3.5 / 5</Td>
                  <Td>3.5 / 5</Td>
                </Tr>
                <Tr>
                  <Td>
                    <a href="#" className="text-indigo-500">
                      PC Gamer
                    </a>
                  </Td>
                  <Td>3.5 / 5</Td>
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
