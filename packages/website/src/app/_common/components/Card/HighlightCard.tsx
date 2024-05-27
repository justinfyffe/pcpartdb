import React, { cloneElement, FunctionComponent } from 'react';
import { classNames } from '../../utils/classNames';
import { Card } from './Card';

export interface HighlightCardProps {
  as?: React.ElementType;
  className?: string;
  leftTitleClassName?: string;
  rightTitleClassName?: string;
  contentClassName?: string;

  icon?: React.ReactElement;
  leftTitle?: React.ReactNode | string;
  rightTitle?: React.ReactNode | string;

  children?: React.ReactNode;
}

export const HighlightCard: FunctionComponent<HighlightCardProps> = (props) => {
  const { icon, leftTitle, rightTitle } = props;

  return (
    <Card as={props.as} className={props.className}>
      {/* Title of Highlight */}
      {(leftTitle != null || rightTitle != null) && (
        <div className="flex flex-wrap items-center gap-2 justify-between">
          {/* Left title for highlight */}
          <div
            className={classNames(
              'flex-1 flex gap-2 items-center',
              props.leftTitleClassName,
            )}
          >
            {icon != null && (
              <div className="mr-1">
                {cloneElement(icon, { className: 'w-5' })}
              </div>
            )}

            {leftTitle != null && (
              <div className="font-medium text-lg">{leftTitle}</div>
            )}
          </div>

          {/* Right title for highlight */}
          {rightTitle != null && (
            <div
              className={classNames(
                'flex-1 text-content text-right',
                props.rightTitleClassName,
              )}
            >
              {rightTitle}
            </div>
          )}
        </div>
      )}

      {/* Children of Highlight */}
      {props.children != null && (
        <div
          className={classNames('flex-1 flex flex-col', props.contentClassName)}
        >
          {props.children}
        </div>
      )}
    </Card>
  );
};
