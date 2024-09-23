import { ReactElement, useEffect, useState } from "react";
import "./App.css";
import { EventHandler, PanelModel } from "./lib/model.ts";
import { fetchPanelInit, fetchPanelUpdate, FetchResponse } from "./api.ts";
import DashiPanel from "./lib/DashiPanel.tsx";

function App() {
  const [panelModelResponse, setPanelModelResponse] = useState<
    FetchResponse<PanelModel>
  >({});

  useEffect(() => {
    fetchPanelInit().then(
      (panelModelResponse) => void setPanelModelResponse(panelModelResponse),
    );
  }, []);

  const handleEvent: EventHandler = (event) => {
    fetchPanelUpdate(event).then(
      (panelModelResponse) => void setPanelModelResponse(panelModelResponse),
    );
  };

  console.info("panelModelResponse:", panelModelResponse);

  const { result, error } = panelModelResponse;
  let panelComponent: ReactElement | undefined;
  if (result) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { type, ...panelProps } = result;
    panelComponent = (
      <DashiPanel
        width={500}
        height={300}
        {...panelProps}
        onEvent={handleEvent}
      />
    );
  } else if (error) {
    panelComponent = <div>Error: {error}</div>;
  } else {
    panelComponent = <div>Loading chart...</div>;
  }

  return (
    <>
      <h2>Dashi Demo</h2>
      {panelComponent}
    </>
  );
}

export default App;
