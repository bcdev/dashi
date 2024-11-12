import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

import { useAppStore } from "@/demo/store";

function ControlBar() {
  const { datasets, selectedDatasetId, setSelectedDatasetId } = useAppStore();

  return (
    <div>
      <FormControl variant="filled" size="small" style={{ minWidth: 180 }}>
        <InputLabel id="dataset">Dataset (App State)</InputLabel>
        <Select
          labelId="dataset"
          value={selectedDatasetId}
          onChange={(event) =>
            void setSelectedDatasetId(event.target.value || null)
          }
        >
          {datasets.map(({ id, title }) => (
            <MenuItem key={id} value={id}>
              {title}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}

export default ControlBar;
