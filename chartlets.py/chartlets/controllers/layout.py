from typing import Any

from chartlets.extensioncontext import ExtensionContext
from chartlets.response import Response
from chartlets.util.assertions import assert_is_not_none
from chartlets.util.assertions import assert_is_not_empty
from chartlets.util.assertions import assert_is_instance_of


def get_layout(
    ext_ctx: ExtensionContext | None,
    contrib_point_name: str,
    contrib_index: int,
    data: dict[str, Any],
) -> Response:
    """Generate the response for the endpoint
    `POST /chartlets/layout/{contrib_point_name}/{contrib_index}`.

    Args:
        ext_ctx: Extension context. If `None`,
            the function returns a 404 error response.
        contrib_point_name: Contribution point name.
        contrib_index: Contribution index.
        data: A dictionary deserialized from a request JSON body
            that may contain a key `inputValues` of type `list`.
    Returns:
        A `Response` object.
        On success, the response is a dictionary that represents
        a JSON-serialized component tree.
    """
    assert_is_not_none("ext_ctx", ext_ctx)
    assert_is_not_empty("contrib_point_name", contrib_point_name)
    assert_is_instance_of("contrib_index", contrib_index, int)
    assert_is_instance_of("data", data, dict)

    # TODO: validate data
    input_values = data.get("inputValues") or []

    try:
        contributions = ext_ctx.contributions[contrib_point_name]
    except KeyError:
        return Response.failed(
            404, f"contribution point {contrib_point_name!r} not found"
        )

    try:
        contribution = contributions[contrib_index]
    except IndexError:
        return Response.failed(
            404,
            (
                f"index range of contribution point {contrib_point_name!r} is"
                f" 0 to {len(contributions) - 1}, got {contrib_index}"
            ),
        )

    callback = contribution.layout_callback
    if callback is None:
        return Response.failed(400, f"contribution {contribution.name!r} has no layout")

    component = callback.invoke(ext_ctx.app_ctx, input_values)

    return Response.success(component.to_dict())
