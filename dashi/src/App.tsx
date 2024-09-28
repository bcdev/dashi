import { CSSProperties, ReactElement, useEffect, useState } from "react";
import {
  fetchContributions,
  fetchExtensions,
  fetchLayoutComponent,
} from "./api/api.ts";
import { ContributionModel, Extension } from "./model/extension.ts";
import { FetchState, fetchState, useFetchState } from "./api/useFetch.ts";
import { ComponentModel, PropertyChangeEvent } from "./model/component.ts";
import DashiComponent from "./components/DashiComponent.tsx";

const contribPoint = "panels";
const panelContainerStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  width: 400,
  height: 300,
  padding: 5,
  border: "1px gray solid",
};

interface ContribState {
  componentVisible?: boolean;
  componentModelState?: FetchState<ComponentModel>;
}

function App() {
  const extensionsState = useFetchState<Extension[]>(fetchExtensions, []);
  const contributionsState = useFetchState<ContributionModel[]>(
    fetchContributions,
    contribPoint,
  );

  const contributions = contributionsState?.data;

  const [contribStates, setContribStates] = useState<ContribState[]>();

  useEffect(() => {
    if (contributions) {
      if (!contribStates) {
        setContribStates(contributions.map(() => ({})));
      } else {
        contribStates.forEach((contribState, contribIndex) => {
          if (
            contribState.componentVisible &&
            contribState.componentModelState === undefined
          ) {
            setContribStates(
              updateContribState(contribStates, contribIndex, {
                componentModelState: {},
              }),
            );
            fetchState(
              fetchLayoutComponent,
              contribPoint,
              contribIndex,
              [],
            ).then(
              (componentModelState) =>
                void setContribStates(
                  updateContribState(contribStates, contribIndex, {
                    componentModelState,
                  }),
                ),
            );
          }
        });
      }
    }
  }, [contributions, contribStates]);

  console.log("contribStates", contribStates);

  let extensionsElement: ReactElement;
  if (extensionsState?.data) {
    extensionsElement = (
      <div style={{ display: "flex", gap: 5 }}>
        {extensionsState.data.map((extension, extIndex) => {
          const id = `extensions.${extIndex}`;
          return (
            <span
              key={id}
              style={{ padding: 5 }}
            >{`${extension.name}/${extension.version}`}</span>
          );
        })}
      </div>
    );
  } else if (extensionsState?.error) {
    extensionsElement = <div>Error: {extensionsState.error.message}</div>;
  } else if (extensionsState?.loading) {
    extensionsElement = <div>{`Loading extensions...`}</div>;
  }

  let contribSelector: ReactElement;
  if (contributions && contribStates) {
    contribSelector = (
      <div style={{ padding: 5 }}>
        {contribStates.map((panelState, panelIndex) => {
          const id = `${contribPoint}.${panelIndex}`;
          return (
            <div key={id}>
              <input
                id={id}
                type="checkbox"
                checked={panelState.componentVisible}
                value={panelIndex}
                onChange={(e) => {
                  setContribStates(
                    updateContribState(contribStates, panelIndex, {
                      componentVisible: Boolean(e.currentTarget.checked),
                    }),
                  );
                }}
              />
              <label htmlFor={id}>{contributions[panelIndex].name}</label>
            </div>
          );
        })}
      </div>
    );
  } else if (contributionsState?.error) {
    contribSelector = <div>Error: {contributionsState.error.message}</div>;
  } else if (contributionsState?.loading) {
    contribSelector = <div>{`Loading ${contribPoint}...`}</div>;
  }

  const panelElements: ReactElement[] = [];
  (contribStates || []).map((panelState, panelIndex) => {
    if (panelState.componentVisible) {
      const componentModelState = panelState.componentModelState;
      let panelElement: ReactElement | null = null;
      if (componentModelState?.data) {
        const handlePropertyChange = (e: PropertyChangeEvent) => {
          console.log("propertyChange:", e);
        };
        panelElement = (
          <DashiComponent
            {...componentModelState.data}
            onPropertyChange={handlePropertyChange}
          />
        );
      } else if (componentModelState?.error) {
        panelElement = <span>Error: {componentModelState.error.message}</span>;
      } else if (componentModelState?.loading) {
        panelElement = <span>Loading contribution...</span>;
      }
      panelElements.push(
        <div key={`${contribPoint}.${panelIndex}`} style={panelContainerStyle}>
          {panelElement}
        </div>,
      );
    }
  });

  return (
    <>
      <h2>Dashi Demo</h2>
      {extensionsElement}
      {contribSelector}
      <div style={{ display: "flex", gap: 5 }}>{panelElements}</div>
    </>
  );
}

export default App;

function updateContribState(
  contribStates: ContribState[] | undefined,
  contribIndex: number,
  contribState: Partial<ContribState>,
) {
  if (contribStates) {
    return [
      ...contribStates.slice(0, contribIndex),
      { ...contribStates[contribIndex], ...contribState },
      ...contribStates.slice(contribIndex + 1),
    ];
  }
}
