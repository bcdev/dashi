## Version 0.1.0 (in development)

* Reorganised Chartlets project to better separate demo from library code.
  Created separate folder `demo` in `chartlets.py` that contains 
  a demo `server` package and example configuration.
  Also simplified demo server code:
  - Moved `panel` module one level up
  - Removed `util` module which was no longer required 

* Allow for different chart providers. `VegaChart` can be configured only if 
  `altair` package is installed.
  
* Renamed `Plot` into `VegaChart`, which now also respects a `theme` property. 

* Changed schema of the yet unused descriptor for callback functions.
  - using `schema` instead of `type` property for callback arguments
  - using `return` object with `schema` property for callback return values

* Added `tooltip` property to interactive components.

* New components
  - `Switch`
  - `RadioGroup` and `Radio`
  - `Tabs`
  - `Slider`
  - `Table`

## Version 0.0.29 (from 2024/11/26)

* Fixed a bug that prevents using annotations of type `dict` or `dict[str, T]`.
  in callback functions.
* Introduced a callback function in `my_panel.py` to handle click events. 
  Demonstrates how to dynamically change the color of a clicked bar.


## Version 0.0.28 (from 2024/11/26)

* Updated docs.

* Added component `IconButton` and enhanced other components' attributes.

* Channels such as `Input`, `State`, `Output` no longer have a `link` property. 
  Instead, we use a special `id` format, namely `"@app"` and `@container` 
  to address states other than components. 
  This way, the call syntax `Input(id, property)` is the same for all states, 
  e.g., `Input("@app", "selectedDatasetId")`, instead of 
  `Input(source="app", property="selectedDatasetId")`. (#52)

* Added progress components `CircularProgress`, `CircularProgressWithLabel`, 
  `LinearProgress`, `LinearProgressWithLabel`.

* Replacing components is now possible by using an 
  `Output` with `property` set to an empty string. (#38)

* `Component` children can now also be text nodes (of type `string`).

* `Typography` component has children instead of `text`.

* Renamed `Dropdown` component into `Select`
  (to refer to MUI component with same name).

* `Select` component has more flexible options.

* Dealing with callbacks parameter and return types 
  that are just `list` and not, e.g., `list[str]`.
 
## Version 0.0.16 (from 2024/11/12)

Initial, still experimental version. 
