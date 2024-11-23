import type { ObjPathLike } from "@/lib/utils/objPath";

/**
 * Base for `Input` and `Output`.
 */
export interface Channel {
  /**
   * The identifier for a component or state.
   *
   * Special identifiers are:
   * - `"@app"` the application state referred to by `HostStore`
   * - `"@container"` the state referred to by contribution's container
   */
  id: "@app" | "@container" | string;

  /**
   * The property of an object or array index.
   */
  property: ObjPathLike;
}

export interface Input extends Channel {
  noTrigger?: boolean;
}

export interface Output extends Channel {}

export function isComponentChannel(channel: Channel): boolean {
  return Boolean(channel.id) && !channel.id.startsWith("@");
}

export function isHostChannel(channel: Channel): boolean {
  return channel.id === "@app";
}

export function isContainerChannel(channel: Channel): boolean {
  return channel.id === "@container";
}
