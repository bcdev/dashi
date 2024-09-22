import { JSX, useEffect, useState } from "react";
import "./App.css";
import DashiPlot from "./lib/DashiPlot.tsx";
import { EventHandler, PanelModel } from "./lib/types.ts";
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
  let panelComponent: JSX | undefined;
  if (result) {
    const { type, ...panelProps } = result;
    panelComponent = <DashiPanel {...panelProps} onEvent={handleEvent} />;
  } else if (error) {
    panelComponent = <div>Error: {error}</div>;
  } else {
    panelComponent = <div>Loading chart...</div>;
  }

  return (
    <>
      <h1>Plotly-React Demo</h1>
      {panelComponent}
    </>
  );
}

export default App;
