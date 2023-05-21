import { ChevronDownIcon, XMarkIcon } from '@heroicons/react/24/outline';
import React, {
  ChangeEvent,
  Children,
  forwardRef,
  MouseEvent,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { classNames } from '../../ui';
import { Checkbox } from '../Checkbox';
import { SelectOptionProps } from './SelectOption';

export type SelectValue = string | ReadonlyArray<string>;

interface SelectProps {
  name?: string;
  disabled?: boolean;
  direction?: 'top' | 'bottom';
  placeholder?: string;
  multiple?: boolean;
  clearable?: boolean;

  value?: SelectValue;
  onChange?: (value: SelectValue) => void;

  className?: string;
  children?:
    | React.ReactElement<SelectOptionProps>
    | React.ReactElement<SelectOptionProps>[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (props, ref) => {
    const {
      name,
      disabled,
      direction,
      placeholder,
      multiple,
      clearable,
      value,
      onChange,
      className,
      children,
    } = props;

    const [isOpen, setOpen] = useState(false);
    const [options, setOptions] = useState<{ label: string; value: string }[]>(
      [],
    );

    useEffect(() => {
      document.addEventListener('click', () => {
        setOpen(false);
      });

      window.addEventListener('resize', () => {
        setOpen(false);
      });
    }, []);

    useEffect(() => {
      setOptions(
        Children.map(children, ({ props: { label, value } }) => ({
          label,
          value,
        })),
      );
    }, [children]);

    const handleShowOptions = useCallback(
      (e: MouseEvent) => {
        if (disabled) {
          return;
        }

        e.preventDefault();
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
        setOpen(!isOpen);
      },
      [isOpen, disabled],
    );

    const handleClear = useCallback(
      (e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
        onChange(null);
        setOpen(false);
      },
      [onChange],
    );

    const handleOptionClick = useCallback(
      (e: MouseEvent, option: SelectOptionProps) => {
        if (multiple) {
          e.stopPropagation();
          e.nativeEvent.stopImmediatePropagation();
        }

        const newValue = multiple ? toggleOption(value, option) : option.value;
        onChange(newValue);
      },
      [multiple, onChange, value],
    );

    const handleSelectChange = useCallback(
      (event: ChangeEvent<HTMLSelectElement>) => {
        const value = event.target.value;
        onChange(value);
      },
      [onChange],
    );

    return (
      <div className={classNames('block relative w-full', className)}>
        <select
          disabled={disabled}
          name={name}
          className="sr-only"
          multiple={multiple}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          value={value || (multiple ? [] : '')}
          onChange={handleSelectChange}
          ref={ref}
        >
          {options.map((option, i) => (
            <option key={i} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <div
          className={classNames(
            'border-px m-0 p-3 rounded text-sm w-full shadow min-h-12.5',
            disabled ? 'bg-disabled-input' : 'pointer',
          )}
          onClick={handleShowOptions}
        >
          {getSelectedText(value, options) || (
            <span className="text-placeholder">{placeholder}</span>
          )}
          {clearable && value != null && (
            <div
              className="items-center rounded-r-md flex font-medium h-[calc(100%_-_2px)] m-px px-4 absolute right-0 top-0 hover:bg-[#fafafa]"
              onClick={handleClear}
            >
              <XMarkIcon className="w-4" />
            </div>
          )}
          {(!clearable || value == null) && (
            <div className="items-center rounded-r-md flex font-medium h-[calc(100%_-_2px)] m-px px-4 absolute right-0 top-0">
              <ChevronDownIcon className="w-4" />
            </div>
          )}
        </div>

        <div
          className={classNames(
            'absolute bg-white border-[1px_solid_#ccc] shadow left-0 right-0 z-10',
            direction === 'top' ? 'bottom-[100%]' : 'top-[100%]',
            isOpen ? 'block' : 'hidden',
          )}
        >
          {Children.map(children, (child, i) => (
            <div
              key={i}
              onClick={(ev) => handleOptionClick(ev, child.props)}
              className={classNames(
                'items-center pointer flex py-2 px-4',
                !isSelected(value, child.props) ? 'hover:bg-[#fafafa]' : '',
                !multiple && isSelected(value, child.props)
                  ? 'bg-[#3f51b5] text-[#ececec]'
                  : '',
              )}
            >
              {multiple && (
                <Checkbox
                  className="h-4 mr-4 w-4"
                  value={null}
                  checked={isSelected(value, child.props)}
                  readOnly
                />
              )}
              {child}
            </div>
          ))}
        </div>
      </div>
    );
  },
);
Select.displayName = 'Select';

function isSelected(selectedValues: SelectValue, option: SelectOptionProps) {
  return Array.isArray(selectedValues)
    ? selectedValues.includes(option.value)
    : selectedValues === option.value;
}

function getSelectedText(selected: SelectValue, options: SelectOptionProps[]) {
  return options
    .filter((option) => isSelected(selected, option))
    .map((option) => option.label)
    .join(', ');
}

function toggleOption(selected: SelectValue, option: SelectOptionProps) {
  if (isSelected(selected, option)) {
    return removeOptionFromSelected(selected, option);
  } else {
    return addOptionToSelected(selected, option);
  }
}

function addOptionToSelected(selected: SelectValue, option: SelectOptionProps) {
  return Array.isArray(selected) ? [...selected, option.value] : [option.value];
}

function removeOptionFromSelected(
  selected: SelectValue,
  option: SelectOptionProps,
) {
  if (!Array.isArray(selected)) {
    return selected;
  }

  const index = selected.indexOf(option.value);
  return index >= 0
    ? [...selected.slice(0, index), ...selected.slice(index + 1)]
    : selected;
}
