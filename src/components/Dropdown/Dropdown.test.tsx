import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeAll } from "vitest";
import Dropdown from "./Dropdown";
import type { Option } from "./types";

const OPTIONS_COUNT = 12;
const options: Option[] = Array.from({ length: OPTIONS_COUNT }, (_, i) => ({
  id: i + 1,
  label: `Option ${i + 1}`,
}));

describe("Dropdown", () => {
  beforeAll(() => {
    Element.prototype.scrollIntoView = vi.fn();
  });

  it("renders with placeholder", () => {
    render(<Dropdown options={options} value={null} onChange={() => {}} placeholder="Select one" />);
    expect(screen.getByText("Select one")).toBeInTheDocument();
  });

  it("opens dropdown on click", async () => {
    render(<Dropdown options={options} value={null} onChange={() => {}} />);
    const trigger = screen.getByRole("button");
    await userEvent.click(trigger);
    expect(screen.getByRole("listbox")).toBeInTheDocument();
  });

  it("displays options when open", async () => {
    render(<Dropdown options={options} value={null} onChange={() => {}} />);
    const trigger = screen.getByRole("button");
    await userEvent.click(trigger);
    for (const option of options) {
      expect(screen.getByText(option.label)).toBeInTheDocument();
    }
  });

  it("selects an option on click", async () => {
    const handleChange = vi.fn();
    render(<Dropdown options={options} value={null} onChange={handleChange} />);
    const trigger = screen.getByRole("button");
    await userEvent.click(trigger);
    const option2 = screen.getByText("Option 2");
    await userEvent.click(option2);
    expect(handleChange).toHaveBeenCalledWith(2);
  });

  it("does not call onChange when same value is selected again", async () => {
    const handleChange = vi.fn();
    render(<Dropdown options={options} value={1} onChange={handleChange} />);
    const trigger = screen.getByRole("button");
    await userEvent.click(trigger);
    const listbox = screen.getByRole("listbox");
    const sameOption = within(listbox).getByText("Option 1");
    await userEvent.click(sameOption);
    expect(handleChange).not.toHaveBeenCalled();
  });

  it("closes dropdown after selection", async () => {
    render(<Dropdown options={options} value={null} onChange={() => {}} />);
    const trigger = screen.getByRole("button");
    await userEvent.click(trigger);
    const option1 = screen.getByText("Option 1");
    await userEvent.click(option1);
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("does not select disabled option", async () => {
    const handleChange = vi.fn();
    const opts = options.map((o) => (o.id === 3 ? { ...o, disabled: true } : o));
    render(<Dropdown options={opts} value={null} onChange={handleChange} />);
    const trigger = screen.getByRole("button");
    await userEvent.click(trigger);
    const disabledOption = screen.getByText("Option 3");
    await userEvent.click(disabledOption);
    expect(handleChange).not.toHaveBeenCalled();
    expect(screen.getByRole("listbox")).toBeInTheDocument();
  });

  it("navigates with arrow keys and selects with Enter", async () => {
    const handleChange = vi.fn();
    render(<Dropdown options={options} value={null} onChange={handleChange} />);
    const trigger = screen.getByRole("button");
    await userEvent.click(trigger);

    const listbox = screen.getByRole("listbox");
    listbox.focus();

    await userEvent.keyboard("{ArrowDown}");
    await userEvent.keyboard("{ArrowDown}");
    await userEvent.keyboard("{Enter}");

    expect(handleChange).toHaveBeenCalledWith(3);
  });

  it("closes with Escape key", async () => {
    render(<Dropdown options={options} value={null} onChange={() => {}} />);
    const trigger = screen.getByRole("button");
    await userEvent.click(trigger);
    const listbox = screen.getByRole("listbox");
    listbox.focus();
    await userEvent.keyboard("{Escape}");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("closes with Tab key", async () => {
    render(<Dropdown options={options} value={null} onChange={() => {}} />);
    const trigger = screen.getByRole("button");
    await userEvent.click(trigger);
    const listbox = screen.getByRole("listbox");
    listbox.focus();
    await userEvent.keyboard("{Tab}");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("does not open when disabled", async () => {
    render(<Dropdown options={options} value={null} onChange={() => {}} disabled />);
    const trigger = screen.getByRole("button");
    await userEvent.click(trigger);
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("shows selected value", () => {
    render(<Dropdown options={options} value={1} onChange={() => {}} />);
    expect(screen.getByText("Option 1")).toBeInTheDocument();
  });

  it("renders custom option via renderOption prop", async () => {
    const renderOption = (opt: Option) => <span data-testid={`opt-${opt.id}`}>{opt.label.toUpperCase()}</span>;
    render(<Dropdown options={options} value={null} onChange={() => {}} renderOption={renderOption} />);
    const trigger = screen.getByRole("button");
    await userEvent.click(trigger);
    expect(screen.getByTestId("opt-1")).toHaveTextContent("OPTION 1");
  });
});
