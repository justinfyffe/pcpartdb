import { PlusCircleIcon } from '@heroicons/react/outline';
import { NextPageContext } from 'next';
import React from 'react';
import { Button, ButtonVariant } from '../../web/shared/components/button';
import { Card } from '../../web/shared/components/card';
import { Input } from '../../web/shared/components/input';
import { WebsiteLayout } from '../../web/shared/layouts/website';
import { classNames } from '../../web/shared/ui/ui.utils';

interface GpuPageProps {}

const GpuPage = (_props: GpuPageProps) => {
  return (
    <WebsiteLayout>
      <main>
        <section className={classNames('mb-6')}>
          <Card
            className={classNames(
              'gap-4 flex flex-col justify-center px-16 py-8',
            )}
          >
            <h1 className={classNames('font-medium text-3xl text-slate-700')}>
              Compare GPUs
            </h1>

            <div
              className={classNames(
                'flex flex-1 flex-col gap-6 items-center justify-center',
              )}
            >
              <div
                className={classNames(
                  'grid grid-cols-[minmax(200px,_1fr)_auto] lg:grid-cols-[repeat(2,_1fr_auto)] lg:grid-flow-col gap-6 items-center justify-center w-full',
                )}
              >
                <Input
                  placeholder="Graphics Card..."
                  className={classNames()}
                />

                <div
                  className={classNames(
                    'font-medium text-center text-md text-slate-700',
                  )}
                >
                  VS
                </div>

                <Input
                  placeholder="Graphics Card..."
                  className={classNames()}
                />

                <Button
                  variant={ButtonVariant.None}
                  className={classNames('h-full px-2')}
                >
                  <PlusCircleIcon className={classNames('h-6 mx-auto')} />
                </Button>
              </div>

              <Button
                variant={ButtonVariant.Primary}
                className={classNames('block min-w-full')}
              >
                Compare
              </Button>
            </div>
          </Card>
        </section>

        <section
          className={classNames('grid grid-cols-2 grid-rows-[auto_auto] gap-6')}
        >
          <Card>
            <h2
              className={classNames('font-medium mb-3 text-2xl text-slate-700')}
            >
              Best Gaming GPUs by Performance
            </h2>

            <p className={classNames('text-gray-400 mb-4')}>
              Sorted by highest performance benchmarks
            </p>

            <ul className={classNames('flex flex-col gap-6 mb-4')}>
              <li
                className={classNames(
                  'bg-slate-200 flex items-center justify-center px-4 py-2 rounded shadow',
                )}
              >
                <div
                  className={classNames(
                    'flex items-center justify-center h-full mr-5 text-2xl font-medium',
                  )}
                >
                  #1
                </div>
                <div className={classNames('flex-1')}>
                  <div className={classNames('mb-1 font-medium text-lg')}>
                    NVIDIA RTX 3700
                  </div>
                  <div className={classNames('text-sm')}>Price: $234.99</div>
                </div>
                <div
                  className={classNames(
                    'bg-[#3f51b5] border rounded flex items-center justify-center text-xl text-slate-100 w-[80px] h-full',
                  )}
                >
                  100.0
                </div>
              </li>

              <li
                className={classNames(
                  'bg-slate-200 flex items-center justify-center px-4 py-2 rounded shadow',
                )}
              >
                <div
                  className={classNames(
                    'flex items-center justify-center h-full mr-5 text-2xl font-medium',
                  )}
                >
                  #2
                </div>
                <div className={classNames('flex-1')}>
                  <div className={classNames('mb-1 font-medium text-lg')}>
                    NVIDIA RTX 3600
                  </div>
                  <div className={classNames('text-sm')}>Price: $234.99</div>
                </div>
                <div
                  className={classNames(
                    'bg-[#3f51b5] border rounded flex items-center justify-center text-xl text-slate-100 w-[80px] h-full',
                  )}
                >
                  93.34
                </div>
              </li>

              <li
                className={classNames(
                  'bg-slate-200 flex items-center justify-center px-4 py-2 rounded shadow',
                )}
              >
                <div
                  className={classNames(
                    'flex items-center justify-center h-full mr-5 text-2xl font-medium',
                  )}
                >
                  #3
                </div>
                <div className={classNames('flex-1')}>
                  <div className={classNames('mb-1 font-medium text-lg')}>
                    NVIDIA RTX 2800
                  </div>
                  <div className={classNames('text-sm')}>Price: $234.99</div>
                </div>
                <div
                  className={classNames(
                    'bg-[#3f51b5] border rounded flex items-center justify-center text-xl text-slate-100 w-[80px] h-full',
                  )}
                >
                  92.23
                </div>
              </li>

              <li
                className={classNames(
                  'bg-slate-200 flex items-center justify-center px-4 py-2 rounded shadow',
                )}
              >
                <div
                  className={classNames(
                    'flex items-center justify-center h-full mr-5 text-2xl font-medium',
                  )}
                >
                  #4
                </div>
                <div className={classNames('flex-1')}>
                  <div className={classNames('mb-1 font-medium text-lg')}>
                    NVIDIA RTX 2700
                  </div>
                  <div className={classNames('text-sm')}>Price: $234.99</div>
                </div>
                <div
                  className={classNames(
                    'bg-[#3f51b5] border rounded flex items-center justify-center text-xl text-slate-100 w-[80px] h-full',
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
                <div
                  className={classNames(
                    'flex items-center justify-center h-full mr-5 text-2xl font-medium',
                  )}
                >
                  #5
                </div>
                <div className={classNames('flex-1')}>
                  <div className={classNames('mb-1 font-medium text-lg')}>
                    NVIDIA RTX 2600
                  </div>
                  <div className={classNames('text-sm')}>Price: $234.99</div>
                </div>
                <div
                  className={classNames(
                    'bg-[#3f51b5] border rounded flex items-center justify-center text-xl text-slate-100 w-[80px] h-full',
                  )}
                >
                  81.23
                </div>
              </li>
            </ul>

            <div className={classNames('self-end')}>
              <a href="#" className={classNames('text-indigo-400')}>
                View all GPUs by performance
              </a>
            </div>
          </Card>

          <Card>
            <h2
              className={classNames('font-medium mb-3 text-2xl text-slate-700')}
            >
              Best Gaming GPUs by Value
            </h2>

            <p className={classNames('text-gray-400 mb-4')}>
              Sorted by performance benchmark per dollar
            </p>

            <ul className={classNames('flex flex-col gap-6 mb-4')}>
              <li
                className={classNames(
                  'bg-slate-200 flex items-center justify-center px-4 py-2 rounded shadow',
                )}
              >
                <div
                  className={classNames(
                    'flex items-center justify-center h-full mr-5 text-2xl font-medium',
                  )}
                >
                  #1
                </div>
                <div className={classNames('flex-1')}>
                  <div className={classNames('mb-1 font-medium text-lg')}>
                    NVIDIA RTX 3700
                  </div>
                  <div className={classNames('text-sm')}>Price: $234.99</div>
                </div>
                <div
                  className={classNames(
                    'bg-[#3f51b5] border rounded flex items-center justify-center text-xl text-slate-100 w-[80px] h-full',
                  )}
                >
                  100.0
                </div>
              </li>

              <li
                className={classNames(
                  'bg-slate-200 flex items-center justify-center px-4 py-2 rounded shadow',
                )}
              >
                <div
                  className={classNames(
                    'flex items-center justify-center h-full mr-5 text-2xl font-medium',
                  )}
                >
                  #2
                </div>
                <div className={classNames('flex-1')}>
                  <div className={classNames('mb-1 font-medium text-lg')}>
                    NVIDIA RTX 3600
                  </div>
                  <div className={classNames('text-sm')}>Price: $234.99</div>
                </div>
                <div
                  className={classNames(
                    'bg-[#3f51b5] border rounded flex items-center justify-center text-xl text-slate-100 w-[80px] h-full',
                  )}
                >
                  93.34
                </div>
              </li>

              <li
                className={classNames(
                  'bg-slate-200 flex items-center justify-center px-4 py-2 rounded shadow',
                )}
              >
                <div
                  className={classNames(
                    'flex items-center justify-center h-full mr-5 text-2xl font-medium',
                  )}
                >
                  #3
                </div>
                <div className={classNames('flex-1')}>
                  <div className={classNames('mb-1 font-medium text-lg')}>
                    NVIDIA RTX 2800
                  </div>
                  <div className={classNames('text-sm')}>Price: $234.99</div>
                </div>
                <div
                  className={classNames(
                    'bg-[#3f51b5] border rounded flex items-center justify-center text-xl text-slate-100 w-[80px] h-full',
                  )}
                >
                  92.23
                </div>
              </li>

              <li
                className={classNames(
                  'bg-slate-200 flex items-center justify-center px-4 py-2 rounded shadow',
                )}
              >
                <div
                  className={classNames(
                    'flex items-center justify-center h-full mr-5 text-2xl font-medium',
                  )}
                >
                  #4
                </div>
                <div className={classNames('flex-1')}>
                  <div className={classNames('mb-1 font-medium text-lg')}>
                    NVIDIA RTX 2700
                  </div>
                  <div className={classNames('text-sm')}>Price: $234.99</div>
                </div>
                <div
                  className={classNames(
                    'bg-[#3f51b5] border rounded flex items-center justify-center text-xl text-slate-100 w-[80px] h-full',
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
                <div
                  className={classNames(
                    'flex items-center justify-center h-full mr-5 text-2xl font-medium',
                  )}
                >
                  #5
                </div>
                <div className={classNames('flex-1')}>
                  <div className={classNames('mb-1 font-medium text-lg')}>
                    NVIDIA RTX 2600
                  </div>
                  <div className={classNames('text-sm')}>Price: $234.99</div>
                </div>
                <div
                  className={classNames(
                    'bg-[#3f51b5] border rounded flex items-center justify-center text-xl text-slate-100 w-[80px] h-full',
                  )}
                >
                  81.23
                </div>
              </li>
            </ul>

            <div className={classNames('self-end')}>
              <a href="#" className={classNames('text-indigo-400')}>
                View all GPUs by performance per dollar
              </a>
            </div>
          </Card>

          <Card>
            <h2
              className={classNames('font-medium mb-3 text-2xl text-slate-700')}
            >
              Best Crypto Mining GPUs by Performance
            </h2>

            <p className={classNames('text-gray-400 mb-4')}>
              Sorted by highest hashing rates.
            </p>

            <ul className={classNames('flex flex-col gap-6 mb-4')}>
              <li
                className={classNames(
                  'bg-slate-200 flex items-center justify-center px-4 py-2 rounded shadow',
                )}
              >
                <div
                  className={classNames(
                    'flex items-center justify-center h-full mr-5 text-2xl font-medium',
                  )}
                >
                  #1
                </div>
                <div className={classNames('flex-1')}>
                  <div className={classNames('mb-1 font-medium text-lg')}>
                    NVIDIA RTX 3700
                  </div>
                  <div className={classNames('text-sm')}>Price: $234.99</div>
                </div>
                <div
                  className={classNames(
                    'bg-[#3f51b5] border rounded flex items-center justify-center text-xl text-slate-100 w-[80px] h-full',
                  )}
                >
                  100.0
                </div>
              </li>

              <li
                className={classNames(
                  'bg-slate-200 flex items-center justify-center px-4 py-2 rounded shadow',
                )}
              >
                <div
                  className={classNames(
                    'flex items-center justify-center h-full mr-5 text-2xl font-medium',
                  )}
                >
                  #2
                </div>
                <div className={classNames('flex-1')}>
                  <div className={classNames('mb-1 font-medium text-lg')}>
                    NVIDIA RTX 3600
                  </div>
                  <div className={classNames('text-sm')}>Price: $234.99</div>
                </div>
                <div
                  className={classNames(
                    'bg-[#3f51b5] border rounded flex items-center justify-center text-xl text-slate-100 w-[80px] h-full',
                  )}
                >
                  93.34
                </div>
              </li>

              <li
                className={classNames(
                  'bg-slate-200 flex items-center justify-center px-4 py-2 rounded shadow',
                )}
              >
                <div
                  className={classNames(
                    'flex items-center justify-center h-full mr-5 text-2xl font-medium',
                  )}
                >
                  #3
                </div>
                <div className={classNames('flex-1')}>
                  <div className={classNames('mb-1 font-medium text-lg')}>
                    NVIDIA RTX 2800
                  </div>
                  <div className={classNames('text-sm')}>Price: $234.99</div>
                </div>
                <div
                  className={classNames(
                    'bg-[#3f51b5] border rounded flex items-center justify-center text-xl text-slate-100 w-[80px] h-full',
                  )}
                >
                  92.23
                </div>
              </li>

              <li
                className={classNames(
                  'bg-slate-200 flex items-center justify-center px-4 py-2 rounded shadow',
                )}
              >
                <div
                  className={classNames(
                    'flex items-center justify-center h-full mr-5 text-2xl font-medium',
                  )}
                >
                  #4
                </div>
                <div className={classNames('flex-1')}>
                  <div className={classNames('mb-1 font-medium text-lg')}>
                    NVIDIA RTX 2700
                  </div>
                  <div className={classNames('text-sm')}>Price: $234.99</div>
                </div>
                <div
                  className={classNames(
                    'bg-[#3f51b5] border rounded flex items-center justify-center text-xl text-slate-100 w-[80px] h-full',
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
                <div
                  className={classNames(
                    'flex items-center justify-center h-full mr-5 text-2xl font-medium',
                  )}
                >
                  #5
                </div>
                <div className={classNames('flex-1')}>
                  <div className={classNames('mb-1 font-medium text-lg')}>
                    NVIDIA RTX 2600
                  </div>
                  <div className={classNames('text-sm')}>Price: $234.99</div>
                </div>
                <div
                  className={classNames(
                    'bg-[#3f51b5] border rounded flex items-center justify-center text-xl text-slate-100 w-[80px] h-full',
                  )}
                >
                  81.23
                </div>
              </li>
            </ul>

            <div className={classNames('self-end')}>
              <a href="#" className={classNames('text-indigo-400')}>
                View all GPUs by hash rate
              </a>
            </div>
          </Card>

          <Card>
            <h2
              className={classNames('font-medium mb-3 text-2xl text-slate-700')}
            >
              Best Crypto Mining GPUs by Value
            </h2>

            <p className={classNames('text-gray-400 mb-4')}>
              Sorted by hash rate per dollar
            </p>

            <ul className={classNames('flex flex-col gap-6 mb-4')}>
              <li
                className={classNames(
                  'bg-slate-200 flex items-center justify-center px-4 py-2 rounded shadow',
                )}
              >
                <div
                  className={classNames(
                    'flex items-center justify-center h-full mr-5 text-2xl font-medium',
                  )}
                >
                  #1
                </div>
                <div className={classNames('flex-1')}>
                  <div className={classNames('mb-1 font-medium text-lg')}>
                    NVIDIA RTX 3700
                  </div>
                  <div className={classNames('text-sm')}>Price: $234.99</div>
                </div>
                <div
                  className={classNames(
                    'bg-[#3f51b5] border rounded flex items-center justify-center text-xl text-slate-100 w-[80px] h-full',
                  )}
                >
                  100.0
                </div>
              </li>

              <li
                className={classNames(
                  'bg-slate-200 flex items-center justify-center px-4 py-2 rounded shadow',
                )}
              >
                <div
                  className={classNames(
                    'flex items-center justify-center h-full mr-5 text-2xl font-medium',
                  )}
                >
                  #2
                </div>
                <div className={classNames('flex-1')}>
                  <div className={classNames('mb-1 font-medium text-lg')}>
                    NVIDIA RTX 3600
                  </div>
                  <div className={classNames('text-sm')}>Price: $234.99</div>
                </div>
                <div
                  className={classNames(
                    'bg-[#3f51b5] border rounded flex items-center justify-center text-xl text-slate-100 w-[80px] h-full',
                  )}
                >
                  93.34
                </div>
              </li>

              <li
                className={classNames(
                  'bg-slate-200 flex items-center justify-center px-4 py-2 rounded shadow',
                )}
              >
                <div
                  className={classNames(
                    'flex items-center justify-center h-full mr-5 text-2xl font-medium',
                  )}
                >
                  #3
                </div>
                <div className={classNames('flex-1')}>
                  <div className={classNames('mb-1 font-medium text-lg')}>
                    NVIDIA RTX 2800
                  </div>
                  <div className={classNames('text-sm')}>Price: $234.99</div>
                </div>
                <div
                  className={classNames(
                    'bg-[#3f51b5] border rounded flex items-center justify-center text-xl text-slate-100 w-[80px] h-full',
                  )}
                >
                  92.23
                </div>
              </li>

              <li
                className={classNames(
                  'bg-slate-200 flex items-center justify-center px-4 py-2 rounded shadow',
                )}
              >
                <div
                  className={classNames(
                    'flex items-center justify-center h-full mr-5 text-2xl font-medium',
                  )}
                >
                  #4
                </div>
                <div className={classNames('flex-1')}>
                  <div className={classNames('mb-1 font-medium text-lg')}>
                    NVIDIA RTX 2700
                  </div>
                  <div className={classNames('text-sm')}>Price: $234.99</div>
                </div>
                <div
                  className={classNames(
                    'bg-[#3f51b5] border rounded flex items-center justify-center text-xl text-slate-100 w-[80px] h-full',
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
                <div
                  className={classNames(
                    'flex items-center justify-center h-full mr-5 text-2xl font-medium',
                  )}
                >
                  #5
                </div>
                <div className={classNames('flex-1')}>
                  <div className={classNames('mb-1 font-medium text-lg')}>
                    NVIDIA RTX 2600
                  </div>
                  <div className={classNames('text-sm')}>Price: $234.99</div>
                </div>
                <div
                  className={classNames(
                    'bg-[#3f51b5] border rounded flex items-center justify-center text-xl text-slate-100 w-[80px] h-full',
                  )}
                >
                  81.23
                </div>
              </li>
            </ul>

            <div className={classNames('self-end')}>
              <a href="#" className={classNames('text-indigo-400')}>
                View all GPUs by hash rate per dollar
              </a>
            </div>
          </Card>
        </section>
      </main>
    </WebsiteLayout>
  );
};

GpuPage.getInitialProps = async (_ctx: NextPageContext) => {
  return {};
};

export default GpuPage;
