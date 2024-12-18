from typing import Any

from chartlets.extensioncontext import ExtensionContext
from chartlets.response import Response
from chartlets.util.assertions import assert_is_instance_of
from ._helpers import get_contribution


def get_callback_results(ext_ctx: ExtensionContext, data: dict[str, Any]) -> Response:
    """Generate the response for the endpoint `POST /chartlets/callback`.

    Args:
        ext_ctx: Extension context.
        data: A dictionary deserialized from a request JSON body
            that should contain a key `callbackRequests` of type `list`.
    Returns:
        A `Response` object.
        On success, the response is a list of state-change requests
        grouped by contributions.
    """
    assert_is_instance_of("ext_ctx", ext_ctx, ExtensionContext)
    assert_is_instance_of("data", data, dict)

    # TODO: validate data
    callback_requests: list[dict] = data.get("callbackRequests") or []

    state_change_requests: list[dict[str, Any]] = []
    for callback_request in callback_requests:
        contrib_point_name: str = callback_request["contribPoint"]
        contrib_index: int = callback_request["contribIndex"]
        callback_index: int = callback_request["callbackIndex"]
        input_values: list = callback_request["inputValues"]

        contribution, response = get_contribution(
            ext_ctx, contrib_point_name, contrib_index
        )
        if response is not None:
            return response

        callbacks = contribution.callbacks
        if not callbacks:
            return Response.failed(
                400, f"contribution {contribution.name!r} has no callbacks"
            )

        try:
            callback = callbacks[callback_index]
        except IndexError:
            return Response.failed(
                404,
                (
                    f"index range of callbacks of contribution {contribution.name!r} is"
                    f" 0 to {len(callbacks) - 1}, got {callback_index}"
                ),
            )

        output_values = callback.invoke(ext_ctx.app_ctx, input_values)

        if len(callback.outputs) == 1:
            output_values = (output_values,)

        state_changes: list[dict[str, Any]] = []
        for output_index, output in enumerate(callback.outputs):
            output_value = output_values[output_index]
            state_changes.append(
                {
                    **output.to_dict(),
                    "value": (
                        output_value.to_dict()
                        if hasattr(output_value, "to_dict")
                        and callable(output_value.to_dict)
                        else output_value
                    ),
                }
            )

        # find an existing state change request
        existing_scr: dict[str, Any] | None = None
        for scr in state_change_requests:
            if (
                scr["contribPoint"] == contrib_point_name
                and scr["contribIndex"] == contrib_index
            ):
                existing_scr = scr
                break

        if existing_scr is not None:
            # merge with existing state change request
            existing_scr["stateChanges"].extend(state_changes)
        else:
            # append new state change request
            state_change_requests.append(
                {
                    "contribPoint": contrib_point_name,
                    "contribIndex": contrib_index,
                    "stateChanges": state_changes,
                }
            )

    return Response.success(state_change_requests)
