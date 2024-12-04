import { componentRegistry as cr } from "@/lib";

export default function initPlugin() {
  import("@/lib/plugins/vega/VegaChart").then((m) =>
    cr.register("VegaChart", m.VegaChart),
  );
}
