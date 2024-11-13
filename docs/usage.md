This chapter describes how to enhance your web application by server-side 
UI-contributions.  

The chartlets backend implementation is provided by the Python package `chartlets`.
It makes it easy to implement the chartlet endpoints in your preferred
webserver framework, such as Flask, FastAPI, or Tornado. 

### 1. Implement the possible contributions

Implement the application-specific contributions that users 
can add to their extensions.

As an example, see [`panel.py` of the demo](chartlets.py/chartlets/demo/contribs/panel.py):

```python
from chartlets import Contribution


class Panel(Contribution):
    """Panel contribution"""

    def __init__(self, name: str, title: str | None = None):
        super().__init__(name, title=title)
```

### 2. Define the contributions points

Define the possible contribution points in your application.

As an example, see [`server.py` of the demo](chartlets.py/chartlets/demo/server.py):

```python
from chartlets import Extension
from chartlets.demo.contribs import Panel

Extension.add_contrib_point("panels", Panel)
```

### 3. Load the extensions

Load the extensions that augment your application.

As an example, see [`server.py` of the demo](chartlets.py/chartlets/demo/server.py):

```python
from chartlets import ExtensionContext

ext_ctx = ExtensionContext.load(app_ctx, extension_refs)
```

### 4. Publish the extensions 

Implement the Chartlets API in your application-specific webserver using
the controller implementations in `chartlets.controllers`. 

As an example, see [`server.py` of the demo](chartlets.py/chartlets/demo/server.py).

### 5. Consume the extensions

Use JavaScript package `chartlets` in your frontend to implement the 
contribution lifecycle in your React application.

As an example, see [the demo application](chartlets.js/src/demo).
