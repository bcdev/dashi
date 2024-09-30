import useAppStore from "../store/appStore";

function ExtensionsInfo() {
  const appState = useAppStore();
  const extensionsResult = appState.extensionsResult;
  if (extensionsResult.data) {
    return (
      <div style={{ display: "flex", gap: 5 }}>
        {extensionsResult.data.map((extension, extIndex) => {
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
  } else if (extensionsResult.error) {
    return <div>Error: {extensionsResult.error.message}</div>;
  } else if (extensionsResult.status === "pending") {
    return <div>{`Loading extensions...`}</div>;
  }
  return null;
}

export default ExtensionsInfo;
