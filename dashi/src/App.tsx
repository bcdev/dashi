import { ReactElement, useEffect, useState } from "react";
import "./App.css";
import { PanelEventHandler, PanelModel, Panels } from "./lib/model.ts";
import { fetchPanels, fetchPanel, FetchResponse } from "./api.ts";
import DashiPanel from "./lib/DashiPanel.tsx";

function App() {
  const [panelsResponse, setPanelsResponse] = useState<FetchResponse<Panels>>(
    {},
  );

  const [panelResponses, setPanelResponses] = useState<
    Record<string, FetchResponse<PanelModel>>
  >({});

  const [panelVisibilities, setPanelVisibilities] = useState<
    Record<string, boolean>
  >({});

  useEffect(() => {
    fetchPanels().then(setPanelsResponse);
  }, []);

  useEffect(() => {
    Object.getOwnPropertyNames(panelVisibilities).forEach((panelId) => {
      const panelVisible = panelVisibilities[panelId];
      const panelResponse = panelResponses[panelId];
      if (panelVisible && !panelResponse) {
        fetchPanel(panelId).then((panelResponse) => {
          setPanelResponses({ ...panelResponses, [panelId]: panelResponse });
        });
      }
    });
  }, [panelVisibilities, panelResponses]);

  const handlePanelEvent: PanelEventHandler = (event) => {
    fetchPanel(event.panelId, event).then((result) => {
      setPanelResponses({ ...panelResponses, [event.panelId]: result });
    });
  };

  let panelSelector: ReactElement;
  if (panelsResponse.result) {
    const panelIds = panelsResponse.result.panels;
    panelSelector = (
      <div style={{ padding: 5 }}>
        {panelIds.map((panelId) => (
          <div key={panelId}>
            <input
              type="checkbox"
              checked={Boolean(panelVisibilities[panelId])}
              value={panelId}
              onChange={(e) => {
                setPanelVisibilities({
                  ...panelVisibilities,
                  [panelId]: e.currentTarget.checked,
                });
              }}
            />
            <label htmlFor={panelId}> {panelId} </label>
          </div>
        ))}
      </div>
    );
  } else if (panelsResponse.error) {
    panelSelector = <div>Error: {panelsResponse.error}</div>;
  } else {
    panelSelector = <div>Loading panels...</div>;
  }

  const panelComponents: ReactElement[] = [];
  Object.getOwnPropertyNames(panelVisibilities).forEach((panelId) => {
    const panelVisible = panelVisibilities[panelId];
    const panelResponse = panelResponses[panelId];
    let panelComponent: ReactElement;
    if (panelVisible && panelResponse) {
      if (panelResponse.result) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { type, ...panelProps } = panelResponse.result as PanelModel;
        panelComponent = (
          <DashiPanel
            key={panelId}
            panelId={panelId}
            width={500}
            height={300}
            {...panelProps}
            onEvent={handlePanelEvent}
          />
        );
      } else if (panelResponse.error) {
        panelComponent = <div>Error: {panelResponse.error}</div>;
      } else {
        panelComponent = <div>Loading chart...</div>;
      }
      panelComponents.push(panelComponent);
    }
  });

  return (
    <>
      <h2>Dashi Demo</h2>
      {panelSelector}
      <div style={{ display: "flex", gap: 5 }}>{panelComponents}</div>
    </>
  );
}

export default App;
