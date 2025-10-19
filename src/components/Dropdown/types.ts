export interface Option {
  /** The unique identifier for the option */
  id: string | number | null;
  /** The display text for the option */
  label: string;
  /** Optional flag to disable the option */
  disabled?: boolean;
}

export interface DropdownProps {
  /** Array of options to display in the dropdown */
  options: Option[];
  /** Currently selected option ID */
  value: Option["id"];
  /** Callback function triggered when selection changes */
  onChange: (value: Option["id"]) => void;
  /** Text to display when no option is selected */
  placeholder?: string;
  /** Accessible label for the dropdown */
  ariaLabel?: string;
  /** Additional CSS class names */
  className?: string;
  /** Maximum number of visible items before scrolling (default: 7) */
  maxVisibleItems?: number;
  /** Width of the dropdown (default: "100%") */
  width?: string | number;
  /** Whether the dropdown is disabled (default: false) */
  disabled?: boolean;
  /** Custom render function for dropdown options */
  renderOption?: (opt: Option, selected: boolean, active: boolean) => React.ReactNode;
}
