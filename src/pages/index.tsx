import 'reflect-metadata';
import { DesktopComputerIcon } from '@heroicons/react/outline';
import classNames from 'classnames';
import { NextPageContext } from 'next';
import React from 'react';
import { Button, ButtonStyle } from '../web/shared/components/button';
import {
  Card,
  CardActions,
  CardContent,
  CardImage,
  CardTitle,
} from '../web/shared/components/card';
import { Input } from '../web/shared/components/input';
import { SectionHeader } from '../web/shared/components/section-header';
import { WebsiteLayout } from '../web/shared/layouts/website';

interface HomePageProps {}

const HomePage = (_props: HomePageProps) => {
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
              'gap-4 flex flex-col items-center justify-center p-16',
            )}
          >
            <Input />
            <div>VS</div>
            <Input />
            <Button
              style={ButtonStyle.Primary}
              className={classNames('w-full')}
            >
              Compare
            </Button>
          </Card>
          <aside className={classNames()}>Side</aside>
        </section>

        <section className={classNames('my-4')}>
          <SectionHeader>
            <DesktopComputerIcon
              className={classNames('inline-block h-6 w-6 mr-2 mb-1')}
            />
            <h2 className={classNames('inline-block')}>Which GPU is Better?</h2>
          </SectionHeader>

          <div
            className={classNames(
              'flex flex-wrap justify-center md:justify-start mx-[-16px]',
            )}
          >
            <Card
              className={classNames('flex-1 mx-4 mb-6 max-w-sm min-w-[280px]')}
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
              className={classNames('flex-1 mx-4 mb-6 max-w-sm min-w-[280px]')}
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
              className={classNames('flex-1 mx-4 mb-6 max-w-sm min-w-[280px]')}
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
        </section>

        <section className={classNames('my-4')}>
          <SectionHeader>
            <DesktopComputerIcon
              className={classNames('inline-block h-6 w-6 mr-2 mb-1')}
            />
            <h2 className={classNames('inline-block')}>Which CPU is Better?</h2>
          </SectionHeader>

          <div
            className={classNames(
              'flex flex-wrap justify-center md:justify-start mx-[-16px]',
            )}
          >
            <Card
              className={classNames('flex-1 mx-4 mb-6 max-w-sm min-w-[280px]')}
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
              className={classNames('flex-1 mx-4 mb-6 max-w-sm min-w-[280px]')}
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
              className={classNames('flex-1 mx-4 mb-6 max-w-sm min-w-[280px]')}
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
        </section>

        <section className={classNames('my-4')}>
          <SectionHeader>
            <DesktopComputerIcon
              className={classNames('inline-block h-6 w-6 mr-2 mb-1')}
            />
            <h2 className={classNames('inline-block')}>PC Builds</h2>
          </SectionHeader>

          <div
            className={classNames(
              'flex flex-wrap justify-center md:justify-start mx-[-16px]',
            )}
          >
            <Card
              className={classNames('flex-1 mx-4 mb-6 max-w-sm min-w-[280px]')}
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
              className={classNames('flex-1 mx-4 mb-6 max-w-sm min-w-[280px]')}
            >
              <CardImage src="https://preview.redd.it/8siyqldph2x21.jpg?auto=webp&s=eeaa2cdf9c4e01746f4f46cc08c66e5eff77c630"></CardImage>

              <CardTitle as="h3">
                June 2022: Excellent AMD Gaming Build
              </CardTitle>

              <CardContent>Is the 3070 better bang for your buck?</CardContent>

              <CardActions>
                <Button style={ButtonStyle.Primary}>View Build</Button>
              </CardActions>
            </Card>

            <Card
              className={classNames('flex-1 mx-4 mb-6 max-w-sm min-w-[280px]')}
            >
              <CardImage src="https://preview.redd.it/8siyqldph2x21.jpg?auto=webp&s=eeaa2cdf9c4e01746f4f46cc08c66e5eff77c630"></CardImage>

              <CardTitle as="h3">June 2022: Budget AMD Gaming Build</CardTitle>

              <CardContent>Is the 3070 better bang for your buck?</CardContent>

              <CardActions>
                <Button style={ButtonStyle.Primary}>View Build</Button>
              </CardActions>
            </Card>
          </div>
        </section>
      </main>
    </WebsiteLayout>
  );
};

HomePage.getInitialProps = async (_ctx: NextPageContext) => {
  return {};
};

export default HomePage;
