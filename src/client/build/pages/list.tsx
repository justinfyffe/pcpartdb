import 'reflect-metadata';
import {
  Button,
  ButtonVariant,
  Card,
  CardActions,
  CardContent,
  CardImage,
  CardTitle,
  SectionHeader,
} from '@client/shared/components';
import { WebsiteLayout } from '@client/shared/layouts';
import { classNames } from '@client/shared/ui';
import { DesktopComputerIcon } from '@heroicons/react/outline';
import { NextPageContext } from 'next';
import React from 'react';

interface ListBuildsPageProps {}

export const ListBuildsPage = (_props: ListBuildsPageProps) => {
  return (
    <WebsiteLayout>
      <section className={classNames('my-4')}>
        <SectionHeader>
          <DesktopComputerIcon
            className={classNames('inline-block h-6 w-6 mr-2 mb-1')}
          />
          <h2 className={classNames('inline-block')}>Featured Builds</h2>
        </SectionHeader>

        <div className={classNames('flex flex-wrap justify-center mx-[-16px]')}>
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

            <CardTitle as="h3">RTX 3070 vs RTX 3060</CardTitle>

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

            <CardTitle as="h3">RTX 3070 vs RTX 3060</CardTitle>

            <CardContent>Is the 3070 better bang for your buck?</CardContent>

            <CardActions>
              <Button variant={ButtonVariant.Primary}>Compare</Button>
            </CardActions>
          </Card>
        </div>

        <ul className={classNames('list-none text-right font-medium')}>
          <li className={classNames('inline-block mx-4')}>
            <a href="#" className={classNames('text-indigo-500')}>
              All Featured Builds
            </a>
          </li>
        </ul>
      </section>

      <section className={classNames('my-4')}>
        <SectionHeader>
          <DesktopComputerIcon
            className={classNames('inline-block h-6 w-6 mr-2 mb-1')}
          />
          <h2 className={classNames('inline-block')}>Gaming Builds</h2>
        </SectionHeader>

        <div className={classNames('flex flex-wrap justify-center mx-[-16px]')}>
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

            <CardTitle as="h3">RTX 3070 vs RTX 3060</CardTitle>

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

            <CardTitle as="h3">RTX 3070 vs RTX 3060</CardTitle>

            <CardContent>Is the 3070 better bang for your buck?</CardContent>

            <CardActions>
              <Button variant={ButtonVariant.Primary}>Compare</Button>
            </CardActions>
          </Card>
        </div>

        <ul className={classNames('list-none text-right font-medium')}>
          <li className={classNames('inline-block mx-4')}>
            <a href="#" className={classNames('text-indigo-500')}>
              All Gaming Builds
            </a>
          </li>
        </ul>
      </section>

      <section className={classNames('my-4')}>
        <SectionHeader>
          <DesktopComputerIcon
            className={classNames('inline-block h-6 w-6 mr-2 mb-1')}
          />
          <h2 className={classNames('inline-block')}>Crypto Mining Builds</h2>
        </SectionHeader>

        <div className={classNames('flex flex-wrap justify-center mx-[-16px]')}>
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

            <CardTitle as="h3">RTX 3070 vs RTX 3060</CardTitle>

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

            <CardTitle as="h3">RTX 3070 vs RTX 3060</CardTitle>

            <CardContent>Is the 3070 better bang for your buck?</CardContent>

            <CardActions>
              <Button variant={ButtonVariant.Primary}>Compare</Button>
            </CardActions>
          </Card>
        </div>

        <ul className={classNames('list-none text-right font-medium')}>
          <li className={classNames('inline-block mx-4')}>
            <a href="#" className={classNames('text-indigo-500')}>
              All Crypto Mining Builds
            </a>
          </li>
        </ul>
      </section>

      <section className={classNames('my-4')}>
        <SectionHeader>
          <DesktopComputerIcon
            className={classNames('inline-block h-6 w-6 mr-2 mb-1')}
          />
          <h2 className={classNames('inline-block')}>Office Builds</h2>
        </SectionHeader>

        <div className={classNames('flex flex-wrap justify-center mx-[-16px]')}>
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

            <CardTitle as="h3">RTX 3070 vs RTX 3060</CardTitle>

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

            <CardTitle as="h3">RTX 3070 vs RTX 3060</CardTitle>

            <CardContent>Is the 3070 better bang for your buck?</CardContent>

            <CardActions>
              <Button variant={ButtonVariant.Primary}>Compare</Button>
            </CardActions>
          </Card>
        </div>

        <ul className={classNames('list-none text-right font-medium')}>
          <li className={classNames('inline-block mx-4')}>
            <a href="#" className={classNames('text-indigo-500')}>
              All Office Builds
            </a>
          </li>
        </ul>
      </section>
    </WebsiteLayout>
  );
};

ListBuildsPage.getInitialProps = async (_ctx: NextPageContext) => {
  return {};
};
