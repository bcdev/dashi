import type { Plugin } from "@/index";
import { Box } from "./Box";
import { Button } from "./Button";
import { Checkbox } from "./Checkbox";
import { CircularProgress } from "./CircularProgress";
import { IconButton } from "./IconButton";
import { RadioGroup } from "./RadioGroup";
import { Select } from "./Select";
import { Switch } from "./Switch";
import { Typography } from "./Typography";

export default function mui(): Plugin {
  return {
    components: [
      ["Box", Box],
      ["Button", Button],
      ["Checkbox", Checkbox],
      ["CircularProgress", CircularProgress],
      ["IconButton", IconButton],
      ["RadioGroup", RadioGroup],
      ["Select", Select],
      ["Switch", Switch],
      ["Typography", Typography],
    ],
  };
}
