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
import { Checkbox } from '../checkbox';
import { SelectOptionProps } from './select-option';

export type SelectValue = string | ReadonlyArray<string>;

interface SelectProps {
  name?: string;
  direction?: 'top' | 'bottom';
  placeholder?: string;
  multiple?: boolean;
  clearable?: boolean;

  value?: SelectValue;
  onChange?: (value: SelectValue) => void;

  children?:
    | React.ReactElement<SelectOptionProps>
    | React.ReactElement<SelectOptionProps>[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (props, ref) => {
    const {
      name,
      direction,
      placeholder,
      multiple,
      clearable,
      value,
      onChange,
      children,
    } = props;

    const [isOpen, setOpen] = useState(false);
    const [selected, setSelected] = useState<SelectValue>(value);
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

    const handleShowOptions = useCallback((e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      e.nativeEvent.stopImmediatePropagation();
      setOpen(true);
    }, []);

    const handleClear = useCallback(
      (e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
        setSelected(null);
        onChange(null);
      },
      [onChange],
    );

    const handleOptionClick = useCallback(
      (e: MouseEvent, option: SelectOptionProps) => {
        if (multiple) {
          e.stopPropagation();
          e.nativeEvent.stopImmediatePropagation();
        }

        const value = multiple ? toggleOption(selected, option) : option.value;
        setSelected(value);
        onChange(value);
      },
      [multiple, onChange, selected],
    );

    const handleSelectChange = useCallback(
      (event: ChangeEvent<HTMLSelectElement>) => {
        const value = event.target.value;
        setSelected(value != '' ? value : null);
        onChange(value);
      },
      [onChange],
    );
    return (
      <div className="block relative">
        <select
          name={name}
          className="sr-only"
          multiple={multiple}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          value={selected || ''}
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
          className="pointer border-px m-0 p-3 rounded text-sm w-full shadow min-h-11.5"
          onClick={handleShowOptions}
        >
          {getSelectedText(options, selected) || placeholder}
          {clearable && selected != null && (
            <div
              className="items-center rounded-r-md flex font-medium h-[calc(100%_-_2px)] m-px px-4 absolute right-0 top-0 hover:bg-[#fafafa]"
              onClick={handleClear}
            >
              <XMarkIcon className="w-4" />
            </div>
          )}
          {(!clearable || selected == null) && (
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
                !isSelected(selected, child.props) ? 'hover:bg-[#fafafa]' : '',
                !multiple && isSelected(selected, child.props)
                  ? 'bg-[#3f51b5] text-[#ececec]'
                  : '',
              )}
            >
              {multiple && (
                <Checkbox
                  className="h-4 mr-4 w-4"
                  checked={isSelected(selected, child.props)}
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

function getSelectedText(options: SelectOptionProps[], selected: SelectValue) {
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
