from typing import Any

from chartlets.extensioncontext import ExtensionContext
from chartlets.response import Response
from chartlets.util.assertions import assert_is_instance_of
from ._helpers import get_contribution


def get_layout(
    ext_ctx: ExtensionContext,
    contrib_point_name: str,
    contrib_index: int,
    data: dict[str, Any],
) -> Response:
    """Generate the response for the endpoint
    `POST /chartlets/layout/{contrib_point_name}/{contrib_index}`.

    Args:
        ext_ctx: Extension context.
        contrib_point_name: Contribution point name.
        contrib_index: Contribution index.
        data: A dictionary deserialized from a request JSON body
            that may contain a key `inputValues` of type `list`.
    Returns:
        A `Response` object.
        On success, the response is a dictionary that represents
        a JSON-serialized component tree.
    """
    assert_is_instance_of("ext_ctx", ext_ctx, ExtensionContext)
    assert_is_instance_of("data", data, dict)

    # TODO: validate data
    input_values = data.get("inputValues") or []

    contribution, response = get_contribution(
        ext_ctx, contrib_point_name, contrib_index
    )
    if response is not None:
        return response

    callback = contribution.layout_callback
    if callback is None:
        return Response.failed(400, f"contribution {contribution.name!r} has no layout")

    component = callback.invoke(ext_ctx.app_ctx, input_values)

    return Response.success(component.to_dict())
