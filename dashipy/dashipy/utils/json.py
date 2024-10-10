import numpy as np

def convert_ndarray_to_list(obj):
    if isinstance(obj, np.ndarray):
        return obj.tolist()
    elif isinstance(obj, dict):
        return {k: convert_ndarray_to_list(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [convert_ndarray_to_list(e) for e in obj]
    elif isinstance(obj, tuple):
        return tuple(convert_ndarray_to_list(e) for e in obj)
    elif hasattr(obj, 'to_plotly_json'):
        return convert_ndarray_to_list(obj.to_plotly_json())
    else:
        return obj
