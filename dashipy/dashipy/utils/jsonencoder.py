import json
from typing import Any, Union, List, Dict

import numpy as np

JsonArray = list["JsonValue"]
JsonObject = dict[str, "JsonValue"]
JsonValue = Union[None, bool, int, float, str, JsonArray, JsonObject]

class NumpyJSONEncoder(json.JSONEncoder):
    """A JSON encoder that converts numpy-like
    scalars into corresponding serializable Python objects.
    """

    def default(self, obj: Any) -> JsonValue:
        converted_obj = _convert_default(obj)
        if converted_obj is not obj:
            return converted_obj
        return json.JSONEncoder.default(self, obj)

def _convert_default(obj: Any) -> Any:
    if hasattr(obj, "dtype") and hasattr(obj, "ndim"):
        if obj.ndim == 0:
            if np.issubdtype(obj.dtype, bool):
                return bool(obj)
            elif np.issubdtype(obj.dtype, np.integer):
                return int(obj)
            elif np.issubdtype(obj.dtype, np.floating):
                return float(obj)
            elif np.issubdtype(obj.dtype, np.datetime64):
                return np.datetime_as_string(obj, timezone="UTC", unit="s")
            elif np.issubdtype(obj.dtype, np.str):
                return str(obj)
        else:
            return [_convert_default(item) for item in obj]
    # We may handle other non-JSON-serializable datatypes here
    return obj