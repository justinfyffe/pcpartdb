import React, { FunctionComponent } from 'react';
import { classNames } from '../../utils/classNames';

export interface ProgressBarChartProps {
  value?: number;
  maxValue?: number;
  percent?: number;

  loading?: boolean;

  className?: string;
  foregroundClassName?: string;
  backgroundClassName?: string;
  overlayClassName?: string;

  children?: React.ReactNode;
}

export const ProgressBarChart: FunctionComponent<ProgressBarChartProps> = (
  props,
) => {
  const { value, maxValue, loading } = props;

  let percent: number;
  if (props.percent != null) {
    percent = props.percent;
  } else if (value != null && maxValue != null) {
    percent = (value / maxValue) * 100;
  }

  return (
    <div
      className={classNames(
        'relative h-10 w-full rounded shadow-md shadowed-text text-white',
        'ring-1 ring-[#999]',
        props.className,
      )}
    >
      <ProgressBarBackground
        className={classNames(
          loading ? 'bg-loading animate-pulse' : '',
          props.backgroundClassName,
        )}
      >
        {!loading && (
          <ProgressBarForeground
            percent={percent}
            className={props.foregroundClassName}
          />
        )}
      </ProgressBarBackground>

      {props.children != null && (
        <ProgressBarOverlay className={props.overlayClassName}>
          {props.children}
        </ProgressBarOverlay>
      )}
    </div>
  );
};

interface ProgressBarBackgroundProps {
  className?: string;
  children?: React.ReactNode;
}

const ProgressBarBackground = (props: ProgressBarBackgroundProps) => {
  return (
    <div
      className={classNames(
        'absolute top-0 bottom-0 left-0 right-0 bg-neutral rounded',
        props.className,
      )}
    >
      {props.children}
    </div>
  );
};

interface ProgressBarForegroundProps {
  percent?: number;
  className?: string;
}

const ProgressBarForeground = (props: ProgressBarForegroundProps) => {
  return (
    <div
      className={classNames('h-full bg-[#4c5c7c] rounded', props.className)}
      style={{ width: `${props.percent ?? 0}%` }}
    ></div>
  );
};

interface ProgressBarOverlayProps {
  className?: string;
  children?: React.ReactNode;
}

const ProgressBarOverlay = (props: ProgressBarOverlayProps) => {
  return (
    <div
      className={classNames(
        'absolute top-0 left-0 right-0 bottom-0',
        'flex items-center justify-between',
        'px-4',
        props.className,
      )}
    >
      {props.children}
    </div>
  );
};
