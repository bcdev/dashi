import { type ComponentState } from "@/lib/types/state/component";
import {
  type ContribPoint,
  type Contributions,
} from "@/lib/types/model/extension";
import {
  type Callback,
  type CallbackRequest,
  type StateChangeRequest,
} from "@/lib/types/model/callback";
import { callApi } from "@/lib/utils/fetchApiResult";
import type { Input, Output } from "@/lib/types/model/channel";
import { type ObjPath, toObjPath } from "@/lib/utils/objPath";
import { mapObject } from "@/lib/utils/mapObject";
import type { Contribution } from "@/lib/types/model/contribution";

const defaultServerUrl = "http://localhost:8888";
const defaultEndpointName = "dashi";

interface WithStringProperty {
  property?: string;
}

interface RawInput extends Omit<Input, "property">, WithStringProperty {}

interface RawOutput extends Omit<Output, "property">, WithStringProperty {}

interface RawCallback extends Omit<Omit<Callback, "inputs">, "outputs"> {
  inputs?: RawInput[];
  outputs?: RawOutput[];
}

interface RawContribution
  extends Omit<Omit<Contribution, "layout">, "callbacks"> {
  layout?: RawCallback;
  callbacks: RawCallback[];
}

interface RawContributions extends Omit<Contributions, "contributions"> {
  contributions: Record<ContribPoint, RawContribution[]>;
}

export interface ApiOptions {
  serverUrl?: string;
  endpointName?: string;
}

export async function fetchContributions(
  options?: ApiOptions,
): Promise<Contributions> {
  return callApi<RawContributions, Contributions>(
    makeUrl("contributions", options),
    undefined,
    (contributions: RawContributions) => ({
      ...contributions,
      contributions: mapObject(
        contributions.contributions,
        (contributions: RawContribution[]) =>
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

function normalizeCallbacks(callbacks: RawCallback[] | undefined): Callback[] {
  return callbacks ? callbacks.map(normalizeCallback) : [];
}

function normalizeCallback(callback: RawCallback): Callback {
  return {
    ...callback,
    inputs: callback.inputs ? normalizeChannels(callback.inputs) : [],
    outputs: callback.outputs ? normalizeChannels(callback.outputs) : [],
  };
}

function normalizeChannels<S extends WithStringProperty>(
  channels: S[],
): (S & { property: ObjPath })[] {
  return channels ? channels.map(normalizeChannel) : [];
}

function normalizeChannel<S extends WithStringProperty>(
  channel: S,
): S & { property: ObjPath } {
  return {
    ...channel,
    property: toObjPath(channel.property),
  };
}

export async function fetchInitialComponentState(
  contribPoint: ContribPoint,
  contribIndex: number,
  inputValues: unknown[],
  options?: ApiOptions,
): Promise<ComponentState> {
  return callApi(makeUrl(`layout/${contribPoint}/${contribIndex}`, options), {
    body: JSON.stringify({ inputValues }),
    method: "post",
  });
}

export async function fetchStateChangeRequests(
  callbackRequests: CallbackRequest[],
  options?: ApiOptions,
): Promise<StateChangeRequest[]> {
  return callApi(makeUrl("callback", options), {
    body: JSON.stringify({ callbackRequests }),
    method: "post",
  });
}

function makeUrl(path: string, options?: ApiOptions): string {
  const serverUrl = options?.serverUrl || defaultServerUrl;
  const endpointName = options?.endpointName || defaultEndpointName;
  return `${serverUrl}/${endpointName}/${path}`;
}
