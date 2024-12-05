import type { Plugin } from "@/lib";
import { Box } from "./Box";
import { Button } from "./Button";
import { Checkbox } from "./Checkbox";
import { CircularProgress } from "./CircularProgress";
import { IconButton } from "./IconButton";
import { Select } from "./Select";
import { Typography } from "./Typography";

export default function mui(): Plugin {
  return {
    components: [
      ["Box", Box],
      ["Button", Button],
      ["Checkbox", Checkbox],
      ["CircularProgress", CircularProgress],
      ["IconButton", IconButton],
      ["Select", Select],
      ["Typography", Typography],
    ],
  };
}
