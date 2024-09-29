import ExtensionsInfo from "./ExtensionInfo.tsx";
import PanelsControl from "./PanelsControl.tsx";
import PanelsRow from "./PanelsRow.tsx";
import { initAppStore } from "./appStore.ts";

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
