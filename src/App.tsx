import { useState } from "react";
import Dropdown from "./components/Dropdown/Dropdown";
import type { Option } from "./components/Dropdown/types";

import "./App.scss";

// constants, mock data, helper function for test purposes.
const OPTIONS_COUNT = 10;
const generatedOptions: Option[] = Array.from({ length: OPTIONS_COUNT }, (_, i) => ({
  id: i + 1,
  label: `Option ${i + 1}`,
}));
const INITIAL_SELECTED_ID: number | null = null;

const App = () => {
  const [dropDownValue, setDropDownValue] = useState<Option["id"] | null>(INITIAL_SELECTED_ID);

  return (
    <div style={{ maxWidth: 500 }}>
      <h1>Dropdown Menu</h1>
      <Dropdown options={generatedOptions} value={dropDownValue} onChange={(id) => setDropDownValue(id)} />
      <p>
        Selected: <strong>{dropDownValue ?? "nothing chosen"}</strong>
      </p>
    </div>
  );
};

export default App;
