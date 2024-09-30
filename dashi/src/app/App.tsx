import ExtensionsInfo from "./ExtensionInfo";
import PanelsControl from "./PanelsControl";
import PanelsRow from "./PanelsRow";
import { initAppStore } from "../actions/initAppStore";

initAppStore();

function App() {
  return (
    <>
      <div style={{ fontSize: 48, paddingBottom: 10 }}>Dashi Demo</div>
      <ExtensionsInfo />
      <PanelsControl />
      <PanelsRow />
    </>
  );
}

export default App;
