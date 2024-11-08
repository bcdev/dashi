# dashi 

Dashi is a framework for server-configured panels. 

## Run demo server

``` bash
mamba env create
conda activate dashi
python -m dashipy.server 
```

## How to use the framework

### 1. Implement the possible contributions

Implement the application-specific contributions that users 
can add to their extensions.

As an example, see [`panel.py` of the demo](dashipy/demo/contribs/panel.py).

### 2. Define the contributions points

Define the possible contribution points in your application.

As an example, see [`server.py` of the demo](dashipy/demo/server.py):

```python
from dashipy import Extension
from dashipy.demo.contribs import Panel

Extension.add_contrib_point("panels", Panel)
```

### 3. Load the extensions

Load the extensions that augment your application.

As an example, see [`server.py` of the demo](dashipy/demo/server.py):

```python
from dashipy import ExtensionContext

ext_ctx = ExtensionContext.load(app_ctx, extension_refs)
```

### 4. Publish the extensions 

Implement the Dashi API in your application-specific webserver using
the controller implementations in `dashipy.controllers`. 

As an example, see [`server.py` of the demo](dashipy/demo/server.py).

