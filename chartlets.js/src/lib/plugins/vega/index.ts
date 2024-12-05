import { componentRegistry as cr } from "@/lib";

export default function initializePlugin() {
  import("./VegaChart").then((m) => cr.register("VegaChart", m.VegaChart));
}
