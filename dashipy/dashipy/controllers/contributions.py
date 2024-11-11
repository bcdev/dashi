from dashipy.extensioncontext import ExtensionContext
from dashipy.response import Response


def get_contributions(ext_ctx: ExtensionContext | None) -> Response:
    """Generate the response for `GET /dashi/contributions`."""
    if ext_ctx is None:
        return Response.failed(
            404, f"no contributions configured"
        )

    extensions = ext_ctx.extensions
    contributions = ext_ctx.contributions
    return Response.success(
        {
            "extensions": [e.to_dict() for e in extensions],
            "contributions": {
                cpk: [c.to_dict() for c in cpv] for cpk, cpv in contributions.items()
            },
        }
    )
