# Providers guide

As an application provider you allow for enhancing your web application by
server-side UI-contributions provided by an application contributor.

## How Chartlets works

Users write the widgets in, e.g. Python, and a REST server implements three
endpoints to publish the widgets:

- `GET /contributions`: Called once after application UI starts up.
  Returns an object whose keys are contribution points (e.g., "panels")
  and whose values are arrays of contribution objects.
- `POST /layout/{contribPoint}/{contribIndex}`:
  Called once for every contribution when it becomes visible in the UI.
  Returns the contribution's initial component tree.
- `POST /callback`:
  Called when users interact with the component tree or on application
  state changes. Returns an array of contribution changes where each
  contribution change contains an array of actions to be applied to the
  component tree.

The following sequence diagram depicts how the library is supposed to
work. The top shows the JavaScript frontend that uses this library.
The bottom shows the lifeline of the backend REST server.

![sequence.png](../images/sequence.png)

## Backend integration

The Chartlets backend implementation is provided by the module 
`chartlets.controllers` of the Python package `chartlets`.
It makes it easy to integrate the Chartlet endpoints in your preferred
webserver framework, such as Flask, FastAPI, or Tornado.

The following steps are required to enable your web server to support
UI-contributions:

1. Update project dependencies 
2. Implement the possible contributions
3. Define the contributions points
4. Load the extensions
5. Publish the extensions 

In the following the above steps are detailed further. 

### Update project dependencies

Add the Python package `chartlets` to your project dependencies.
Currently, Chartlets is available from PyPI only.

### Implement the possible contributions

Implement the application-specific contributions that users 
can add to their extensions.

As an example, see [`panel.py` of the demo](https://github.com/bcdev/chartlets/tree/main/chartlets.py/demo/server/contribs/panel.py):

```python
from chartlets import Contribution


class Panel(Contribution):
    """Panel contribution"""

    def __init__(self, name: str, title: str | None = None):
        super().__init__(name, title=title)
```

### Define the contributions points

Define the possible contribution points in your application.

As an example, see [`app.py` of the demo server](https://github.com/bcdev/chartlets/tree/main/chartlets.py/demo/server/app.py):

```python
from chartlets import Extension
from .contribs import Panel

Extension.add_contrib_point("panels", Panel)
```

### Load the extensions

Load the extensions that augment your application.

As an example, see [`app.py` of the demo server](https://github.com/bcdev/chartlets/tree/main/chartlets.py/demo/server/app.py):

```python
from chartlets import ExtensionContext

ext_ctx = ExtensionContext.load(app_ctx, extension_refs)
```

### Publish the extensions 

Implement the Chartlets API in your application-specific webserver using
the controller implementations in `chartlets.controllers`. 

As an example, see [`app.py` of the demo server](https://github.com/bcdev/chartlets/tree/main/chartlets.py/demo/server/app.py).

## Frontend integration

The JavaScript package `chartlets` provides the types, actions, and hooks
to allow for supporting server-side UI contributions in your React 
application. 

As an example, see [the demo application](https://github.com/bcdev/chartlets/tree/main/chartlets.js/packages/demo/src).

As an application provider you will need to perform the 
following steps:

1. Update project dependencies 
2. Configure the framework
3. Implement derived application state
4. Render the contributions

### Update project dependencies

Add the `chartlets` package as a dependency to your `package.json`.
The package provides also TypeScript type definitions.
There is nothing more to be considered.

### Configure the framework

To configure the framework and fetch the initial contributions from the
server the `initializeContributions` function must be called once in your
application. In the following example, the default plugins are used. 

```TypeScript
import { initializeContributions } from "chartlets";
import mui from "chartlets/plugins/mui";
import vega from "chartlets/plugins/vega";

initializeContributions({
  plugins: [mui(), vega()],
  ...
});
```

If you need to separate configuration and fetching configurations you can also
pass the options to the `configureFramework` function and call 
`initializeContributions` without options.

### Implement derived application state

_Coming soon._

### Render the contributions

_Coming soon._

## Extend the framework

_Coming soon._
