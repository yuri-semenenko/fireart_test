import { useId, useLayoutEffect, useRef, useState, useCallback } from "react";
import type { DropdownProps, Option } from "./types";
import { useOutsideClick } from "../../hooks/useOutsideClick";
import clsx from "clsx";
import Chevron from "../../assets/icons/chevron.svg?react";

import cls from "./Dropdown.module.scss";

const OPTION_HEIGHT = 34;

/**
 * A customizable dropdown component with keyboard navigation and accessibility features.
 *
 * @param props - The component props
 * @param props.options - Array of options to display in the dropdown
 * @param props.value - Currently selected option ID
 * @param props.onChange - Callback function triggered when selection changes
 * @param props.placeholder - Text to display when no option is selected
 * @param props.ariaLabel - Accessible label for the dropdown
 * @param props.className - Additional CSS class names
 * @param props.maxVisibleItems - Maximum number of visible items before scrolling (default: 7)
 * @param props.width - Width of the dropdown (default: "100%")
 * @param props.disabled - Whether the dropdown is disabled (default: false)
 * @param props.renderOption - Custom render function for dropdown options
 */
const Dropdown = ({
  options,
  value,
  onChange,
  placeholder = "Select an option",
  ariaLabel,
  className,
  maxVisibleItems = 7,
  width = "100%",
  disabled = false,
  renderOption,
}: DropdownProps) => {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const selected = value && options.find((o) => o.id === value);

  const rootRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useOutsideClick(rootRef, () => setOpen(false));

  useLayoutEffect(() => {
    if (!open) return;
    const idx = Math.max(
      0,
      options.findIndex((o) => o.id === value)
    );
    setActiveIndex(idx === -1 ? 0 : idx);

    listRef.current?.focus();
    const el = listRef.current?.children.item(idx) as HTMLElement | null;
    el?.scrollIntoView({ block: "nearest" });
  }, [open, options, value]);

  const listboxId = useId();
  const buttonId = useId();

  const handleSelect = (id: Option["id"]) => {
    if (id === value) {
      setOpen(false);
      buttonRef.current?.focus();
      return;
    }
    onChange(id);
    setOpen(false);
    buttonRef.current?.focus();
  };

  const handleKeyDownList = useCallback(
    (e: React.KeyboardEvent) => {
      switch (e.key) {
        case "Escape":
          e.preventDefault();
          setOpen(false);
          buttonRef.current?.focus();
          break;
        case "Tab":
          setOpen(false);
          break;
        case "ArrowDown":
          e.preventDefault();
          setActiveIndex((prev) => Math.min(options.length - 1, prev + 1));
          break;
        case "ArrowUp":
          e.preventDefault();
          setActiveIndex((prev) => Math.max(0, prev - 1));
          break;
        case "Enter":
        case " ":
          e.preventDefault();
          const opt = options[activeIndex];
          if (opt && !opt.disabled) handleSelect(opt.id);
          break;
      }
    },
    [options, activeIndex, handleSelect]
  );

  return (
    <div ref={rootRef} className={clsx(cls.dropdown, open && cls.open, className)} style={{ width }}>
      <button
        ref={buttonRef}
        id={buttonId}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        aria-label={ariaLabel}
        disabled={disabled}
        className={cls.trigger}
        onClick={() => !disabled && setOpen((o) => !o)}
      >
        <span className={selected ? cls.value : cls.placeholder}>{selected ? selected.label : placeholder}</span>
        <span className={cls.chevron}>
          <Chevron />
        </span>
      </button>

      {open && (
        <ul
          id={listboxId}
          role="listbox"
          aria-labelledby={buttonId}
          ref={listRef}
          tabIndex={-1}
          className={cls.listbox}
          style={{ "--max-height": `${OPTION_HEIGHT * maxVisibleItems}px` } as React.CSSProperties}
          onKeyDown={handleKeyDownList}
        >
          {options.map((opt, idx) => {
            const isSelected = opt.id === value;
            const isActive = idx === activeIndex;

            return (
              <li
                key={opt.id}
                role="option"
                aria-selected={isSelected}
                aria-disabled={opt.disabled}
                className={clsx(
                  cls.option,
                  isSelected && cls.selected,
                  isActive && cls.active,
                  opt.disabled && cls.disabled
                )}
                onMouseEnter={() => setActiveIndex(idx)}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => !opt.disabled && handleSelect(opt.id)}
              >
                {renderOption ? renderOption(opt, isSelected, isActive) : opt.label}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default Dropdown;
