import type { Plugin } from "@/index";
import { Box } from "./Box";
import { Button } from "./Button";
import { Checkbox } from "./Checkbox";
import { CircularProgress } from "./CircularProgress";
import { IconButton } from "./IconButton";
import { LinearProgress } from "./LinearProgress";
import { RadioGroup } from "./RadioGroup";
import { Select } from "./Select";
import { Switch } from "./Switch";
import { Tabs } from "./Tabs";
import { Typography } from "./Typography";
import { Slider } from "./Slider";
import { Table } from "@/plugins/mui/Table";

export default function mui(): Plugin {
  return {
    components: [
      ["Box", Box],
      ["Button", Button],
      ["Checkbox", Checkbox],
      ["CircularProgress", CircularProgress],
      ["IconButton", IconButton],
      ["LinearProgress", LinearProgress],
      ["RadioGroup", RadioGroup],
      ["Select", Select],
      ["Slider", Slider],
      ["Switch", Switch],
      ["Table", Table],
      ["Tabs", Tabs],
      ["Typography", Typography],
    ],
  };
}
