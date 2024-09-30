import useAppStore from "../store/appStore";

function ExtensionsInfo() {
  const appState = useAppStore();
  const extensionModelsResult = appState.extensionModelsResult;
  if (extensionModelsResult.data) {
    return (
      <div style={{ display: "flex", gap: 5 }}>
        {extensionModelsResult.data.map((extension, extIndex) => {
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
  } else if (extensionModelsResult.error) {
    return <div>Error: {extensionModelsResult.error.message}</div>;
  } else if (extensionModelsResult.status === "pending") {
    return <div>{`Loading extensions...`}</div>;
  }
  return null;
}

export default ExtensionsInfo;
