import useAppStore from "../store/appStore";
import { Typography } from "@mui/material";

function ExtensionsInfo() {
  const appState = useAppStore();
  const extensionsResult = appState.extensionsResult;
  if (extensionsResult.data) {
    return (
      <div style={{ display: "flex", gap: 5 }}>
        {extensionsResult.data.map((extension, extIndex) => {
          const id = `extensions.${extIndex}`;
          return (
            <Typography
              key={id}
              style={{ padding: 4 }}
              fontSize="small"
            >{`${extension.name}/${extension.version}`}</Typography>
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
