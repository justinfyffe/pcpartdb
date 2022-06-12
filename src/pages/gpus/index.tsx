import { PlusCircleIcon } from '@heroicons/react/outline';
import { NextPageContext } from 'next';
import React from 'react';
import { Button, ButtonStyle } from '../../web/shared/components/button';
import { Card } from '../../web/shared/components/card';
import { Input } from '../../web/shared/components/input';
import { WebsiteLayout } from '../../web/shared/layouts/website';
import { classNames } from '../../web/shared/ui/ui.utils';

interface GpuPageProps {}

const GpuPage = (_props: GpuPageProps) => {
  return (
    <WebsiteLayout>
      <main>
        <section>
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
                  style={ButtonStyle.None}
                  className={classNames('h-full px-2')}
                >
                  <PlusCircleIcon className={classNames('h-6 mx-auto')} />
                </Button>
              </div>

              <Button
                style={ButtonStyle.Primary}
                className={classNames('block min-w-full')}
              >
                Compare
              </Button>
            </div>
          </Card>
        </section>

        <section>Strongest Gaming GPUs</section>

        <section>Best Gaming GPUs by Value</section>

        <section>Best Budget GPUs</section>

        <section>Strongest Crypto Mining GPUs</section>
      </main>
    </WebsiteLayout>
  );
};

GpuPage.getInitialProps = async (_ctx: NextPageContext) => {
  return {};
};

export default GpuPage;
