import { ChevronDownIcon, XIcon } from '@heroicons/react/outline';
import React, {
  ChangeEvent,
  Children,
  FunctionComponent,
  MouseEvent,
  PropsWithChildren,
  ReactElement,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { classNames } from '../../ui/ui.utils';
import { Checkbox } from '../checkbox';

export type SelectValue = string | number | ReadonlyArray<string | number>;

interface SelectProps {
  name?: string;
  direction?: 'top' | 'bottom';
  placeholder?: string;
  multiple?: boolean;
  clearable?: boolean;

  value?: SelectValue;
  onChange?: (value: SelectValue) => void;

  children?: React.ReactNode;
}

interface SelectOptionProps {
  label: string;
  value: string | number;

  children?: React.ReactNode;
}

export const Select: FunctionComponent<SelectProps> = (props) => {
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
  const options = getOptions(children);

  const [isOpen, setOpen] = useState(false);
  const [selected, setSelected] = useState<SelectValue>(value);

  useEffect(() => {
    document.addEventListener('click', () => {
      setOpen(false);
    });

    window.addEventListener('resize', () => {
      setOpen(false);
    });
  }, []);

  const handleShowOptions = useCallback((event: MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    event.nativeEvent.stopImmediatePropagation();
    setOpen(true);
  }, []);

  const handleClear = useCallback(
    (event: MouseEvent) => {
      event.preventDefault();
      event.stopPropagation();
      event.nativeEvent.stopImmediatePropagation();
      setSelected(null);
      onChange(null);
    },
    [onChange],
  );

  const handleOptionClick = useCallback(
    (event: MouseEvent, option: SelectOptionProps) => {
      if (multiple) {
        event.stopPropagation();
        event.nativeEvent.stopImmediatePropagation();
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
        value={(selected as any) || ''}
        onChange={handleSelectChange}
      >
        {options.map((option, i) => (
          <option key={i} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <div
        className="pointer border m-0 p-3 rounded text-sm w-full shadow min-h-[46px]"
        onClick={handleShowOptions}
      >
        {getSelectedText(options, selected) || placeholder}
        {clearable && selected != null && (
          <div
            className="items-center rounded-r-md flex font-medium h-[calc(100%_-_2px)] m-[1px] p-[0_16px] absolute right-0 top-0 hover:bg-[#fafafa]"
            onClick={handleClear}
          >
            <XIcon className="w-[16px]" />
          </div>
        )}
        {(!clearable || selected == null) && (
          <div className="items-center rounded-r-md flex font-medium h-[calc(100%_-_2px)] m-[1px] p-[0_16px] absolute right-0 top-0">
            <ChevronDownIcon className="w-[16px]" />
          </div>
        )}
      </div>

      <div
        className={classNames(
          'absolute bg-white border-[1px_solid_#ccc] shadow left-0 right-0 z-1',
          direction === 'top' ? 'bottom-[100%]' : 'top-[100%]',
          isOpen ? 'block' : 'hidden',
        )}
      >
        {options.map((option, i) => (
          <div
            key={i}
            onClick={(ev) => handleOptionClick(ev, option)}
            className={classNames(
              'items-center pointer flex p-[8px_16px]',
              !isSelected(selected, option) ? 'hover:bg-[#fafafa]' : '',
              !multiple && isSelected(selected, option)
                ? 'bg-[#3f51b5] text-[#ececec]'
                : '',
            )}
          >
            {multiple && (
              <Checkbox
                className="h-[16px] mr-[16px] w-[16px]"
                checked={isSelected(selected, option)}
                readOnly
              />
            )}
            {option.children}
          </div>
        ))}
      </div>
    </div>
  );
};

export const SelectOption: FunctionComponent<SelectOptionProps> = () => {
  return null;
};

function getOptions(children: React.ReactNode) {
  return Children.map(
    children as ReactElement,
    (child: ReactElement<PropsWithChildren<SelectOptionProps>>) => child.props,
  );
}

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
