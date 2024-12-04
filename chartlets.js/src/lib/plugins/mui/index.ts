import { componentRegistry as cr } from "@/lib";

export default function initPlugin() {
  import("./Box").then((m) => cr.register("Box", m.Box));
  import("./Button").then((m) => cr.register("Button", m.Button));
  import("./Checkbox").then((m) => cr.register("Checkbox", m.Checkbox));
  import("./CircularProgress").then((m) =>
    cr.register("CircularProgress.ts", m.CircularProgress),
  );
  import("./IconButton").then((m) => cr.register("IconButton", m.IconButton));
  import("./Select").then((m) => cr.register("Select", m.Select));
  import("./Typography").then((m) => cr.register("Typography", m.Typography));
}
