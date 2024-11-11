import type { ObjPath } from "@/lib/utils/objPath";

export type Link = "component" | "container" | "app";

/**
 * Base for `Input` and `Output`.
 */
export interface Channel {
  /**
   * The link provides the source for inputs and that target for outputs.
   */
  link: Link;

  /**
   * The identifier of a subcomponent.
   * `id` is not needed if link == "AppInput" | "AppOutput".
   */
  id?: string;

  /**
   * The property of an object or array index.
   */
  property: string | ObjPath;
}

export interface Input extends Channel {
  noTrigger?: boolean;
}

export interface Output extends Channel {}
