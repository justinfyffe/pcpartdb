'use client';

import React, { forwardRef } from 'react';
import { Input, InputProps } from './Input';

export const HiddenInput = forwardRef<HTMLInputElement, HiddenInputProps>(
  (props, ref) => {
    return <Input type="hidden" {...props} ref={ref} />;
  },
);
HiddenInput.displayName = 'HiddenInput';

export interface HiddenInputProps extends Omit<InputProps, 'type'> {}
