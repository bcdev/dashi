import type { Plugin } from "@/lib";
import { VegaChart } from "./VegaChart";

export default function vega(): Plugin {
  return { components: [["VegaChart", VegaChart]] };
}
