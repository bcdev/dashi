from chartlets import Contribution
from chartlets import ExtensionContext
from chartlets import Response
from chartlets.util.assertions import assert_is_not_empty
from chartlets.util.assertions import assert_is_instance_of


def get_contribution(
    ext_ctx: ExtensionContext,
    contrib_point_name: str,
    contrib_index: int,
) -> tuple[Contribution, None] | tuple[None, Response]:
    """Get the contribution for given `contrib_point_name` at `contrib_index`.

    Args:
        ext_ctx: Extension context.
        contrib_point_name: Contribution point name.
        contrib_index: Contribution index.
    Returns:
        A pair comprising an optional `Contribution` and optional `Response` object.
    """
    assert_is_instance_of("ext_ctx", ext_ctx, ExtensionContext)
    assert_is_not_empty("contrib_point_name", contrib_point_name)
    assert_is_instance_of("contrib_index", contrib_index, int)

    try:
        contributions = ext_ctx.contributions[contrib_point_name]
    except KeyError:
        return None, Response.failed(
            404, f"contribution point {contrib_point_name!r} not found"
        )

    try:
        contribution = contributions[contrib_index]
    except IndexError:
        return None, Response.failed(
            404,
            (
                f"index range of contribution point {contrib_point_name!r} is"
                f" 0 to {len(contributions) - 1}, got {contrib_index}"
            ),
        )

    return contribution, None
