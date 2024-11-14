# Controllers API

The Chartlets controllers API is used by application providers only.
As an application contributor you do not need to care about it.

A controller implements the logic of a specific Chartlets web API endpoint.
It is used to efficiently implement the Chartlets web API using any 
web framework such as FastAPI, Flask or Tornado.

Controllers are imported from the `chartlets.components` module, for example:

```python
from chartlets.controllers import get_layout
```


::: chartlets.controllers.get_contributions

::: chartlets.controllers.get_layout

::: chartlets.controllers.get_callback_results

::: chartlets.ExtensionContext

::: chartlets.Response