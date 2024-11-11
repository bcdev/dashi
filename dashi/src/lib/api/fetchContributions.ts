import { type Contributions } from "@/lib/types/model/extension";
import { type Callback } from "@/lib/types/model/callback";
import { callApi } from "@/lib/utils/fetchApiResult";
import { toObjPath } from "@/lib/utils/objPath";
import { mapObject } from "@/lib/utils/mapObject";
import type { Contribution } from "@/lib/types/model/contribution";
import type { Channel } from "@/lib/types/model/channel";
import type { ApiOptions } from "@/lib/api/types";
import { makeUrl } from "@/lib/api/common";

export async function fetchContributions(
  options?: ApiOptions,
): Promise<Contributions> {
  return callApi<Contributions>(
    makeUrl("contributions", options),
    undefined,
    (contributions: Contributions) => ({
      ...contributions,
      contributions: mapObject(
        contributions.contributions,
        (contributions: Contribution[]) =>
          contributions.map(
            (contribution): Contribution => ({
              ...contribution,
              layout: contribution.layout
                ? normalizeCallback(contribution.layout)
                : undefined,
              callbacks: normalizeCallbacks(contribution.callbacks),
            }),
          ),
      ),
    }),
  );
}

function normalizeCallbacks(callbacks: Callback[] | undefined): Callback[] {
  return callbacks ? callbacks.map(normalizeCallback) : [];
}

function normalizeCallback(callback: Callback): Callback {
  return {
    ...callback,
    inputs: callback.inputs ? normalizeChannels(callback.inputs) : [],
    outputs: callback.outputs ? normalizeChannels(callback.outputs) : [],
  };
}

function normalizeChannels<S extends Channel>(channels: S[]): S[] {
  return channels ? channels.map(normalizeChannel) : [];
}

function normalizeChannel<S extends Channel>(channel: S): S {
  return {
    ...channel,
    property: toObjPath(channel.property),
  };
}
