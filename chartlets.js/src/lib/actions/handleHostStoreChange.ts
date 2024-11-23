import { store } from "@/lib/store";
import type {
  CallbackRef,
  CallbackRequest,
  ContribRef,
  InputRef,
} from "@/lib/types/model/callback";
import type { Input } from "@/lib/types/model/channel";
import { getInputValues } from "@/lib/actions/helpers/getInputValues";
import { formatObjPath } from "@/lib/utils/objPath";
import { invokeCallbacks } from "@/lib/actions/helpers/invokeCallbacks";
import type { ContributionState } from "@/lib/types/state/contribution";
import type { HostStore } from "@/lib/types/state/options";

/**
 * A reference to a property of an input of a callback of a contribution.
 */
export interface PropertyRef extends ContribRef, CallbackRef, InputRef {
  /** The property. */
  property: string;
}

export function handleHostStoreChange() {
  const { extensions, configuration, contributionsRecord } = store.getState();
  const { hostStore } = configuration;
  if (!hostStore || extensions.length === 0) {
    // Exit if no host store configured or
    // there are no extensions (yet)
    return;
  }
  const propertyRefs = getHostStorePropertyRefs();
  if (!propertyRefs || propertyRefs.length === 0) {
    // Exit if there are is nothing to be changed
    return;
  }
  const callbackRequests = getCallbackRequests(
    propertyRefs,
    contributionsRecord,
    hostStore,
  );
  if (callbackRequests && callbackRequests.length > 0) {
    invokeCallbacks(callbackRequests);
  }
}

function getCallbackRequests(
  propertyRefs: PropertyRef[],
  contributionsRecord: Record<string, ContributionState[]>,
  hostStore: HostStore,
): CallbackRequest[] {
  return propertyRefs.map((propertyRef) => {
    const contributions = contributionsRecord[propertyRef.contribPoint];
    const contribution = contributions[propertyRef.contribIndex];
    const callback = contribution.callbacks![propertyRef.callbackIndex];
    const inputValues = getInputValues(
      callback.inputs!,
      contribution,
      hostStore,
    );
    return { ...propertyRef, inputValues };
  });
}

// TODO: use a memoized selector to get hostStorePropertyRefs
// Note that this will only be effective and once we split the
// static contribution infos and dynamic contribution states.
// The hostStorePropertyRefs only depend on the static
// contribution infos.

/**
 * Get the static list of host state property references for all contributions.
 */
function getHostStorePropertyRefs(): PropertyRef[] {
  const { contributionsRecord } = store.getState();
  const propertyRefs: PropertyRef[] = [];
  Object.getOwnPropertyNames(contributionsRecord).forEach((contribPoint) => {
    const contributions = contributionsRecord[contribPoint];
    contributions.forEach((contribution, contribIndex) => {
      (contribution.callbacks || []).forEach(
        (callback, callbackIndex) =>
          (callback.inputs || []).forEach((input, inputIndex) => {
            if (!input.noTrigger && input.link === "app" && input.property) {
              propertyRefs.push({
                contribPoint,
                contribIndex,
                callbackIndex,
                inputIndex,
                property: formatObjPath(input.property),
              });
            }
          }),
        [] as Input[],
      );
    });
  });
  return propertyRefs;
}
