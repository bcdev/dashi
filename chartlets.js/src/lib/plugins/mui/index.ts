import { componentRegistry as cr } from "@/lib";

export default function initPlugin() {
  import("@/lib/plugins/mui/Box").then((m) => cr.register("Box", m.Box));
  import("@/lib/plugins/mui/Button").then((m) =>
    cr.register("Button", m.Button),
  );
  import("@/lib/plugins/mui/Checkbox").then((m) =>
    cr.register("Checkbox", m.Checkbox),
  );
  import("@/lib/plugins/mui/CircularProgress").then((m) =>
    cr.register("CircularProgress", m.CircularProgress),
  );
  import("@/lib/plugins/mui/IconButton").then((m) =>
    cr.register("IconButton", m.IconButton),
  );
  import("@/lib/plugins/mui/Select").then((m) =>
    cr.register("Select", m.Select),
  );
  import("@/lib/plugins/mui/Typography").then((m) =>
    cr.register("Typography", m.Typography),
  );
}
