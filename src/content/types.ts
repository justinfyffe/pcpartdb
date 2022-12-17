export enum ContentTag {
  BestPerformance = 'BEST_PERFORMANCE',
  BestValue = 'BEST_VALUE',
  Recent = 'RECENT',
  Released = 'RELEASED',
}

export interface ContentUnit {
  /**
   * Tags for which content to use. Must match all tags to display this content.
   *
   * No tags is the fallback when no matches occur.
   */
  tags?: ContentTag[];

  /**
   * Text to display for the content. Text will be determined based on
   * which variables are provided at computation time.
   */
  text: string[];
}

export type ContentSentence = ContentUnit[];

export type ContentParagraph = ContentSentence[];

export type Content = ContentParagraph[];
