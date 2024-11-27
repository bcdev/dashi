# Contributor guide

As an application contributor you enhance an existing web application
by UI contributions developed in Python. You implement a Python module 
that is consumed by (one of) the application's backend servers that 
implements expected Chartlets REST API as outlined above.

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

## Create the extension object

Your contributions to the application are published using a
`chartlets.Extension` object that is exported from your extension module. 

```python
from chartlets import Extension

ext = Extension("my_dashboard")
```

## Create the contribution object

In a submodule you create a contribution object from an application specific
contribution, e.g., a `Panel`. Application-specific contribution classes 
are always derived from `chartlets.Contribution`.

```python
from chartlets.demo import Panel

panel = Panel(title="Click Statistics")
```

## Implement the contribution layout

In the submodule

```python
@panel.layout()
def get_layout(ctx):
  return Button(id="button", text="Click me")
```

## Implement the contribution callback

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

## Register the contribution

In the extension module

```python
from chartlets import Extension
from .stats_panel import panel as stats_panel

ext = Extension("my_dashboard")
ext.add(stats_panel)
```
