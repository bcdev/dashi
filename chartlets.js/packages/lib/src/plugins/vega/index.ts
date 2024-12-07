import type { Plugin } from "@/index";
import { VegaChart } from "./VegaChart";

export default function vega(): Plugin {
  return { components: [["VegaChart", VegaChart]] };
}
