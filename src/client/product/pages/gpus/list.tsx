import { DesktopComputerIcon, PlusCircleIcon } from '@heroicons/react/outline';
import { NextPageContext } from 'next';
import React from 'react';
import { Button, ButtonVariant } from '../../../shared/components/button';
import {
  Card,
  CardActions,
  CardContent,
  CardImage,
  CardTitle,
} from '../../../shared/components/card';
import { TextInput } from '../../../shared/components/input';
import { SectionHeader } from '../../../shared/components/section-header';
import { WebsiteLayout } from '../../../shared/layouts/website';
import { classNames } from '../../../shared/ui/ui.utils';

interface ListGpusPageProps {}

export const ListGpusPage = (_props: ListGpusPageProps) => {
  return (
    <WebsiteLayout>
      <main>
        <section className={classNames('mb-6')}>
          <Card
            className={classNames(
              'gap-4 flex flex-col justify-center px-8 py-8',
            )}
          >
            <h1 className={classNames('font-medium text-3xl text-slate-700')}>
              Compare GPUs
            </h1>

            <div
              className={classNames(
                'flex flex-1 gap-6 items-stretch justify-center',
              )}
            >
              <TextInput
                placeholder="Graphics Card..."
                className={classNames('flex-1')}
              />

              <div
                className={classNames(
                  'self-center font-medium text-center text-slate-700',
                )}
              >
                VS
              </div>

              <TextInput
                placeholder="Graphics Card..."
                className={classNames('flex-1')}
              />

              <Button variant={ButtonVariant.Default} className={classNames()}>
                <PlusCircleIcon className={classNames('h-6 mx-auto')} />
              </Button>

              <Button variant={ButtonVariant.Primary} className={classNames()}>
                Compare
              </Button>
            </div>
          </Card>
        </section>

        <section
          className={classNames(
            'grid grid-cols-2 grid-rows-[auto_auto] gap-6 mb-8',
          )}
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

        <section className={classNames('my-4')}>
          <SectionHeader>
            <DesktopComputerIcon
              className={classNames('inline-block h-6 w-6 mr-2 mb-1')}
            />
            <h2 className={classNames('inline-block')}>Popular Comparisons</h2>
          </SectionHeader>

          <div
            className={classNames('flex flex-wrap justify-center mx-[-16px]')}
          >
            <Card
              className={classNames(
                'flex-1 mx-4 mb-6 max-w-[360px] min-w-[280px]',
              )}
            >
              <CardImage
                src="https://preview.redd.it/8siyqldph2x21.jpg?auto=webp&s=eeaa2cdf9c4e01746f4f46cc08c66e5eff77c630"
                width="360"
                height="200"
              ></CardImage>

              <CardTitle as="h3">Ryzen 9 5900X vs Core i7-12700KF</CardTitle>

              <CardContent>Is the 3070 better bang for your buck?</CardContent>

              <CardActions>
                <Button variant={ButtonVariant.Primary}>Compare</Button>
              </CardActions>
            </Card>

            <Card
              className={classNames(
                'flex-1 mx-4 mb-6 max-w-[360px] min-w-[280px]',
              )}
            >
              <CardImage
                src="https://preview.redd.it/8siyqldph2x21.jpg?auto=webp&s=eeaa2cdf9c4e01746f4f46cc08c66e5eff77c630"
                width="360"
                height="200"
              ></CardImage>

              <CardTitle as="h3">Ryzen 9 5900X vs Core i7-12700KF</CardTitle>

              <CardContent>Is the 3070 better bang for your buck?</CardContent>

              <CardActions>
                <Button variant={ButtonVariant.Primary}>Compare</Button>
              </CardActions>
            </Card>

            <Card
              className={classNames(
                'flex-1 mx-4 mb-6 max-w-[360px] min-w-[280px]',
              )}
            >
              <CardImage
                src="https://preview.redd.it/8siyqldph2x21.jpg?auto=webp&s=eeaa2cdf9c4e01746f4f46cc08c66e5eff77c630"
                width="360"
                height="200"
              ></CardImage>

              <CardTitle as="h3">Ryzen 9 5900X vs Core i7-12700KF</CardTitle>

              <CardContent>Is the 3070 better bang for your buck?</CardContent>

              <CardActions>
                <Button variant={ButtonVariant.Primary}>Compare</Button>
              </CardActions>
            </Card>
          </div>
        </section>
      </main>
    </WebsiteLayout>
  );
};

ListGpusPage.getInitialProps = async (_ctx: NextPageContext) => {
  return {};
};
