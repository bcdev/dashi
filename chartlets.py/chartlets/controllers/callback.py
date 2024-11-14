from typing import Any

from chartlets.extensioncontext import ExtensionContext
from chartlets.response import Response


# POST /chartlets/callback
def get_callback_results(
    ext_ctx: ExtensionContext | None, data: dict[str, Any]
) -> Response:
    """Generate the response for the endpoint `POST /chartlets/callback`.

    Args:
        ext_ctx: Extension context. If `None`,
            the function returns a 404 error response.
        data: A dictionary deserialized from a request JSON body
            that should contain a key `callbackRequests` of type `list`.
    Returns:
        A `Response` object.
        On success, the response is a list of state-change requests
        grouped by contributions.
    """
    if ext_ctx is None:
        return Response.failed(404, f"no contributions configured")

    # TODO: validate data
    callback_requests: list[dict] = data.get("callbackRequests") or []

    # TODO: assert correctness, set status code on error
    state_change_requests: list[dict] = []
    for callback_request in callback_requests:
        contrib_point_name: str = callback_request["contribPoint"]
        contrib_index: int = callback_request["contribIndex"]
        callback_index: int = callback_request["callbackIndex"]
        input_values: list = callback_request["inputValues"]

        contributions = ext_ctx.contributions[contrib_point_name]
        contribution = contributions[contrib_index]
        callback = contribution.callbacks[callback_index]
        output_values = callback.invoke(ext_ctx.app_ctx, input_values)

        if len(callback.outputs) == 1:
            output_values = (output_values,)

        state_changes: list[dict] = []
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

        state_change_requests.append(
            {
                "contribPoint": contrib_point_name,
                "contribIndex": contrib_index,
                "stateChanges": state_changes,
            }
        )

    return Response.success(state_change_requests)
