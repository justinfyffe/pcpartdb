import { Content, ContentTag } from '@content/types';

export const introSentence1: Content = [
  {
    tags: [ContentTag.Recent, ContentTag.Released],
    text: [
      `
      The {{productName}} is a {{marketSegment}} {{company}} GPU that recently launched
      during {{releaseDate}}.
      `,
      `
      The {{productName}} is a {{company}} GPU that recently launched during {{releaseDate}}.
      `,
    ],
  },
  {
    tags: [ContentTag.Released],
    text: [
      `
      The {{productName}} is a {{marketSegment}} {{company}} GPU that launched during {{releaseDate}}.
      `,
    ],
  },
  {
    tags: [],
    text: [
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
    tags: [],
    text: [
      `
      It is targeted towards the {{budgetSegment}} PC market with a MSRP of {{msrp}}.
      `,
    ],
  },
];

export const performanceSentence1: Content = [
  {
    tags: [ContentTag.BestPerformance],
    text: [
      `
      The {{productName}} is the best performing GPU in our database.
      `,
    ],
  },
  {
    tags: [],
    text: [
      `
      The {{productName}} is the {{rank}} most performant GPU in our database.
      `,
    ],
  },
];

export const performanceSentence2: Content = [
  {
    tags: [ContentTag.BestPerformance],
    text: [
      `
      It is approximately {{percentage}} better performing than the next best GPU, the {{otherProductName}}.
      `,
    ],
  },
  {
    tags: [],
    text: [
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
    text: [
      `
      It also has the best value compared to the other GPUs.
      `,
    ],
  },
  {
    tags: [],
    text: [
      `
      It is also {{percentage}} stronger than the GPU with the best value, the {{otherProductName}}.
      `,
    ],
  },
];

export const performanceSentence4: Content = [
  {
    tags: [ContentTag.BestPerformance],
    text: [
      `
      This graphics card is the strongest card among the {{totalProducts}} GPUs that also launched
      in {{launchDate}}.
      `,
    ],
  },
  {
    tags: [],
    text: [
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
    text: [
      `
      Additionally, it is the {{companyRank}} most powerful {{company}} GPU, and {{architectureRank}}
      in the {{architecture}} architecture family.
      `,
    ],
  },
];
