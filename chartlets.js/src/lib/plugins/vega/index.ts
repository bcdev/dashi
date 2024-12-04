import { componentRegistry as cr } from "@/lib";

export default function initPlugin() {
  import("./VegaChart").then((m) => cr.register("VegaChart", m.VegaChart));
}
