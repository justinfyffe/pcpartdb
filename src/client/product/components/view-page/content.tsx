import { compileContent } from '@client/shared/content';
import React from 'react';

export enum ContentKey {
  BestPerformance = 'BEST_PERFORMANCE',
  BestValue = 'BEST_VALUE',
  Recent = 'RECENT',
  Released = 'RELEASED',
}

export const introSentence1 = compileContent(
  {
    key: [ContentKey.Recent, ContentKey.Released],
    variants: [
      {
        deps: ['productName', 'marketSegment', 'company', 'releaseDate'],
        component: (props) => (
          <>
            The {props.productName} is a {props.marketSegment} {props.company}{' '}
            GPU that recently launched during {props.releaseDate}.
          </>
        ),
      },
      {
        deps: ['productName', 'company', 'releaseDate'],
        component: (props) => (
          <>
            The {props.productName} is a {props.company} GPU that recently
            launched during {props.releaseDate}.
          </>
        ),
      },
    ],
  },
  {
    key: [ContentKey.Released],
    variants: [
      {
        deps: ['productName', 'marketSegment', 'company', 'releaseDate'],
        component: (props) => (
          <>
            The {props.productName} is a {props.marketSegment} {props.company}{' '}
            GPU that launched during {props.releaseDate}.
          </>
        ),
      },
    ],
  },
  {
    variants: [
      {
        deps: ['productName', 'marketSegment', 'company', 'releaseDate'],
        component: (props) => (
          <>
            The {props.productName} is a {props.marketSegment} {props.company}{' '}
            GPU with a release date of {props.releaseDate}.
          </>
        ),
      },
      {
        deps: ['productName', 'company', 'releaseDate'],
        component: (props) => (
          <>
            The {props.productName} by {props.company} has a release date of{' '}
            {props.releaseDate}.
          </>
        ),
      },
      {
        deps: ['productName', 'company'],
        component: (props) => (
          <>
            The {props.productName} is a GPU by {props.company}.
          </>
        ),
      },
    ],
  },
);

/*export const introSentence1: Content = [
  {
    tags: [ContentTag.Recent, ContentTag.Released],
    deps: [
      'productName',
      'marketSegmentUrl',
      'marketSegment',
      'company',
      'releaseDate',
    ],
    text: (props) => (
      <>
        The {props.productName} is a <a href={props.marketSegmentUrl}>{props.marketSegment}</a>
        <strong>{props.company}</strong> GPU that recently launched during
        {props.releaseDate}.
      </>
    )
    texts: [
      () => (
        <>
          The {productName} is a <a href={marketSegmentUrl}>{marketSegment}</a>{' '}
          <strong>{company}</strong> GPU that recently launched during
          {releaseDate}.
        </>
      ),
      <>
        The #productName# is a <a href="#marketSegmentUrl#">#marketSegment#</a>{' '}
        <strong>#company#</strong> GPU that recently launched during
        #releaseDate#.
      </>,
      `
      The {{productName}} is a {{company}} GPU that recently launched during {{releaseDate}}.
      `,
    ],
  },
  {
    tags: [ContentTag.Released],
    texts: [
      `
      The {{productName}} is a {{marketSegment}} {{company}} GPU that launched during {{releaseDate}}.
      `,
    ],
  },
  {
    texts: [
      `
      The {{productName}} is a {{marketSegment}} {{company}} GPU with a release date of {{releaseDate}}.
      `,
      `
      The {{productName}} by {{company}} has a release date of {{releaseDate}}.
      `,
      `
      The {{productName}} is a GPU by {{company}}.
      `,
    ],
  },
];
export const introSentence2: Content = [
  {
    texts: [
      `
      It is targeted towards the {{budgetSegment}} PC market with a MSRP of {{msrp}}.
      `,
    ],
  },
];

export const performanceSentence1: Content = [
  {
    tags: [ContentTag.BestPerformance],
    texts: [
      `
      The {{productName}} is the best performing GPU in our database.
      `,
    ],
  },
  {
    tags: [],
    texts: [
      `
      The {{productName}} is the {{rank}} most performant GPU in our database.
      `,
    ],
  },
];

export const performanceSentence2: Content = [
  {
    tags: [ContentTag.BestPerformance],
    texts: [
      `
      It is approximately {{percentage}} better performing than the next best GPU, the {{otherProductName}}.
      `,
    ],
  },
  {
    tags: [],
    texts: [
      `
      It is approximately {{percentage}} as strong as the best performing GPU
      that we are tracking, the {{otherProductName}}.
      `,
    ],
  },
];

export const performanceSentence3: Content = [
  {
    tags: [ContentTag.BestValue],
    texts: [
      `
      It also has the best value compared to the other GPUs.
      `,
    ],
  },
  {
    tags: [],
    texts: [
      `
      It is also {{percentage}} stronger than the GPU with the best value, the {{otherProductName}}.
      `,
    ],
  },
];

export const performanceSentence4: Content = [
  {
    tags: [ContentTag.BestPerformance],
    texts: [
      `
      This graphics card is the strongest card among the {{totalProducts}} GPUs that also launched
      in {{launchDate}}.
      `,
    ],
  },
  {
    tags: [],
    texts: [
      `
      This graphics card is the {{releaseDateRank}} strongest card among the {{totalProducts}} GPUs
      that also launched in {{launchDate}}.
      `,
    ],
  },
];

export const performanceSentence5: Content = [
  {
    tags: [],
    texts: [
      `
      Additionally, it is the {{companyRank}} most powerful {{company}} GPU, and {{architectureRank}}
      in the {{architecture}} architecture family.
      `,
    ],
  },
];
*/
