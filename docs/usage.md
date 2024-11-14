The Chartlets framework has two types of users:

- **Application contributors** develop new contributions 
  for a specific web application that is powered by Chartlets.
- **Application providers** develop the web application 
  and the service that allows for server-side UI contributions
  using Chartlets.


## Application contributor guide

As a application contributors you develop a Python module that is consumed by
the application's backend service.

Your module is supposed to export one or more instances of the
`chartlets.Extension` class. An extension object is a container for your
UI contributions. It groups contributions that logically belong together.

As an example, see [`my_extension` of the demo](https://github.com/bcdev/chartlets/tree/main/chartlets.py/my_extension).

To develop an extension, follow these steps:

1. Create the extension object
2. Create the contribution object
3. Implement the contribution layout
4. Implement the contribution callbacks
5. Register the contribution

In the following the above steps are detailed further. 

### Create the extension object

Your contributions to the application are published using a
`chartlets.Extension` object that is exported from your extension module. 

```python
from chartlets import Extension

ext = Extension("my_dashboard")
```

### Create the contribution object

In a submodule you create a contribution object from an application specific
contribution, e.g., a `Panel`. Application-specific contribution classes 
are always derived from `chartlets.Contribution`.

```python
from chartlets.demo import Panel

panel = Panel(title="Click Statistics")
```

### Implement the contribution layout

In the submodule

```python
@panel.layout()
def get_layout(ctx):
  return Button(id="button", text="Click me")
```

### Implement the contribution callback

In the submodule

```python
from chartlets import Import, Output

@panel.callback(
  Input("button", "n_clicks"),
  Output("button", "text")
)
def on_button_click(ctx, n_clicks):
  n = n_clicks + 1
  s = {1: "st", 2: "nd", 3: "rd"}.get(n, "th")
  return f"Click me a {n}{s} time"
```

### Register the contribution

In the extension module

```python
from chartlets import Extension
from .stats_panel import panel as stats_panel

ext = Extension("my_dashboard")
ext.add(stats_panel)
```

## Application provider guide

As an application provider you allow for enhancing your web application by 
server-side UI-contributions provided by an application contributor.  

The Chartlets backend implementation is provided by the Python module 
`chartlets.controllers`.
It makes it easy to implement the Chartlet endpoints in your preferred
webserver framework, such as Flask, FastAPI, or Tornado.

The following steps are required to enable your web server to support
UI-contributions:

1. Implement the possible contributions
2. Define the contributions points
3. Load the extensions
4. Publish the extensions 
5. Consume the extensions

In the following the above steps are detailed further. 

### Implement the possible contributions

Implement the application-specific contributions that users 
can add to their extensions.

As an example, see [`panel.py` of the demo](https://github.com/bcdev/chartlets/tree/main/chartlets.py/chartlets/demo/contribs/panel.py):

```python
from chartlets import Contribution


class Panel(Contribution):
    """Panel contribution"""

    def __init__(self, name: str, title: str | None = None):
        super().__init__(name, title=title)
```

### Define the contributions points

Define the possible contribution points in your application.

As an example, see [`server.py` of the demo](https://github.com/bcdev/chartlets/tree/main/chartlets.py/chartlets/demo/server.py):

```python
from chartlets import Extension
from chartlets.demo.contribs import Panel

Extension.add_contrib_point("panels", Panel)
```

### Load the extensions

Load the extensions that augment your application.

As an example, see [`server.py` of the demo](https://github.com/bcdev/chartlets/tree/main/chartlets.py/chartlets/demo/server.py):

```python
from chartlets import ExtensionContext

ext_ctx = ExtensionContext.load(app_ctx, extension_refs)
```

### Publish the extensions 

Implement the Chartlets API in your application-specific webserver using
the controller implementations in `chartlets.controllers`. 

As an example, see [`server.py` of the demo](https://github.com/bcdev/chartlets/tree/main/chartlets.py/chartlets/demo/server.py).

### Consume the extensions

Use JavaScript package `chartlets` in your frontend to implement the 
contribution lifecycle in your React application.

As an example, see [the demo application](https://github.com/bcdev/chartlets/tree/main/chartlets.js/src/demo).
