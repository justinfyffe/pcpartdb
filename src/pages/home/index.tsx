import 'reflect-metadata';
import {
  ChipIcon,
  DesktopComputerIcon,
  PlusCircleIcon,
} from '@heroicons/react/outline';
import { NextPageContext } from 'next';
import React from 'react';
import { Button, ButtonStyle } from '../../web/shared/components/button';
import {
  Card,
  CardActions,
  CardContent,
  CardImage,
  CardTitle,
} from '../../web/shared/components/card';
import { Image } from '../../web/shared/components/image';
import { Input } from '../../web/shared/components/input';
import { SectionHeader } from '../../web/shared/components/section-header';
import { WebsiteLayout } from '../../web/shared/layouts/website';
import { classNames } from '../../web/shared/ui/ui.utils';

interface HomePageProps {}

export const HomePage = (_props: HomePageProps) => {
  return (
    <WebsiteLayout>
      <main>
        <section
          className={classNames(
            'grid grid-cols-1 sm:grid-cols-[1fr_300px] grid-rows-2 sm:grid-rows-1 gap-6',
          )}
        >
          <Card
            className={classNames(
              'gap-4 flex flex-col justify-center px-16 py-8',
            )}
          >
            <h1 className={classNames('font-medium text-3xl text-slate-700')}>
              Compare CPUs and GPUs
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
                  placeholder="Processor or Graphics Card..."
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
                  placeholder="Processor or Graphics Card..."
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

          <aside className={classNames()}>
            <Card
              className={classNames(
                'items-start flex flex-col flex-wrap gap-2 h-full justify-center',
              )}
            >
              <SectionHeader
                center
                lines={false}
                className={classNames('mb-0 text-slate-700')}
              >
                Featured Builds: June
              </SectionHeader>

              {/* TODO: make this into a slideshow of builds */}
              <div
                className={classNames(
                  'flex flex-col flex-1 justify-center w-full',
                )}
              >
                <a href="#">
                  <h2
                    className={classNames(
                      'font-medium mb-2 text-center text-indigo-500',
                    )}
                  >
                    Elite AMD Gaming Build
                  </h2>
                  <Image
                    src="https://preview.redd.it/8siyqldph2x21.jpg?auto=webp&s=eeaa2cdf9c4e01746f4f46cc08c66e5eff77c630"
                    className={classNames(
                      'h-auto w-auto max-h-32 max-w-full mx-auto mb-2 object-cover',
                    )}
                    width="360"
                    height="200"
                  />
                </a>

                <div className={classNames('text-center text-sm font-medium')}>
                  $2,389
                  <ChipIcon
                    className={classNames('inline-block h-4 w-4 mx-2')}
                  />
                  <a
                    href="#"
                    className={classNames('font-normal text-indigo-500')}
                  >
                    View Parts
                  </a>
                </div>
              </div>

              <footer className={classNames('self-center')}>
                <div className={classNames('text-xs text-center')}>
                  Check out more{' '}
                  <a href="#" className={classNames('text-indigo-500')}>
                    PC builds
                  </a>
                </div>
              </footer>
            </Card>
          </aside>
        </section>

        <section className={classNames('my-4')}>
          <SectionHeader>
            <DesktopComputerIcon
              className={classNames('inline-block h-6 w-6 mr-2 mb-1')}
            />
            <h2 className={classNames('inline-block')}>Which GPU is Better?</h2>
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

              <CardTitle as="h3">RTX 3070 vs RTX 3060</CardTitle>

              <CardContent>Is the 3070 better bang for your buck?</CardContent>

              <CardActions>
                <Button style={ButtonStyle.Primary}>Compare</Button>
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

              <CardTitle as="h3">RTX 3070 vs RTX 3060</CardTitle>

              <CardContent>Is the 3070 better bang for your buck?</CardContent>

              <CardActions>
                <Button style={ButtonStyle.Primary}>Compare</Button>
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

              <CardTitle as="h3">RTX 3070 vs RTX 3060</CardTitle>

              <CardContent>Is the 3070 better bang for your buck?</CardContent>

              <CardActions>
                <Button style={ButtonStyle.Primary}>Compare</Button>
              </CardActions>
            </Card>
          </div>

          <ul className={classNames('list-none text-center font-medium')}>
            <li className={classNames('inline-block mx-4')}>
              <a href="#" className={classNames('text-indigo-500')}>
                All GPUs
              </a>
            </li>
            <li className={classNames('inline-block mx-4')}>
              <a href="#" className={classNames('text-indigo-500')}>
                Nvidia GPUs
              </a>
            </li>
            <li className={classNames('inline-block mx-4')}>
              <a href="#" className={classNames('text-indigo-500')}>
                AMD GPUs
              </a>
            </li>
          </ul>
        </section>

        <section className={classNames('my-4')}>
          <SectionHeader>
            <DesktopComputerIcon
              className={classNames('inline-block h-6 w-6 mr-2 mb-1')}
            />
            <h2 className={classNames('inline-block')}>Which CPU is Better?</h2>
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
                <Button style={ButtonStyle.Primary}>Compare</Button>
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
                <Button style={ButtonStyle.Primary}>Compare</Button>
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
                <Button style={ButtonStyle.Primary}>Compare</Button>
              </CardActions>
            </Card>
          </div>

          <ul className={classNames('list-none text-center font-medium')}>
            <li className={classNames('inline-block mx-4')}>
              <a href="#" className={classNames('text-indigo-500')}>
                All CPUs
              </a>
            </li>
            <li className={classNames('inline-block mx-4')}>
              <a href="#" className={classNames('text-indigo-500')}>
                Intel CPUs
              </a>
            </li>
            <li className={classNames('inline-block mx-4')}>
              <a href="#" className={classNames('text-indigo-500')}>
                AMD CPUs
              </a>
            </li>
          </ul>
        </section>

        <section className={classNames('my-4')}>
          <SectionHeader>
            <DesktopComputerIcon
              className={classNames('inline-block h-6 w-6 mr-2 mb-1')}
            />
            <h2 className={classNames('inline-block')}>PC Builds</h2>
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

              <CardTitle as="h3">
                June 2022: Excellent Intel Gaming Build
              </CardTitle>

              <CardContent>Is the 3070 better bang for your buck?</CardContent>

              <CardActions>
                <Button style={ButtonStyle.Primary}>View Build</Button>
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

              <CardTitle as="h3">
                June 2022: Excellent AMD Gaming Build
              </CardTitle>

              <CardContent>Is the 3070 better bang for your buck?</CardContent>

              <CardActions>
                <Button style={ButtonStyle.Primary}>View Build</Button>
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

              <CardTitle as="h3">June 2022: Budget AMD Gaming Build</CardTitle>

              <CardContent>Is the 3070 better bang for your buck?</CardContent>

              <CardActions>
                <Button style={ButtonStyle.Primary}>View Build</Button>
              </CardActions>
            </Card>
          </div>

          <ul className={classNames('list-none text-center font-medium')}>
            <li className={classNames('inline-block mx-4')}>
              <a href="#" className={classNames('text-indigo-500')}>
                All PC Builds
              </a>
            </li>
            <li className={classNames('inline-block mx-4')}>
              <a href="#" className={classNames('text-indigo-500')}>
                Gaming PC Builds
              </a>
            </li>
            <li className={classNames('inline-block mx-4')}>
              <a href="#" className={classNames('text-indigo-500')}>
                Crypto Mining PC Builds
              </a>
            </li>
            <li className={classNames('inline-block mx-4')}>
              <a href="#" className={classNames('text-indigo-500')}>
                Office PC Builds
              </a>
            </li>
          </ul>
        </section>
      </main>
    </WebsiteLayout>
  );
};

HomePage.getInitialProps = async (_ctx: NextPageContext) => {
  return {};
};

export default HomePage;
