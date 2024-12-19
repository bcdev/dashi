## Version 0.1.0 (in development)

* Reorganised Chartlets project to better separate demo from library code.
  Using monorepo layout for `chartlets.js` with workspaces `lib` and `demo`
  that host the packages for `chartlets` and `chartlets-demo`.

* Other code reorganisations:
  - moved `component/Registry` into `store` 
  - renamed module `component` into `components` 
  - no longer exposing `Registry` type

* Chartlets now allows for plugins that can provide individual component 
  implementations.
  The Vega-based chart and MUI components are now optional and have been 
  moved into respective plugin modules `chartlets/plugins/vega` and
  `chartlets/plugins/mui`.
  To activate them, use the new `plugins: PluginLike[]` option 
  of `FrameworkOptions`:
  ```TypeScript
  import { configureFramework } from "chartlets";
  import mui from "chartlets/plugins/mui";
  import vega from "chartlets/plugins/vega";
  
  configureFramework({ plugins: [mui(), vega()], ... });   
  ```

* Renamed `Plot` component into `VegaChart`.

* The new `VegaChart` component respects a `theme` property. If not given,
  it will respect the current theme mode `"dark"` otherwise fallback to the
  Vega default theme. 

* The demo application now allows for switching the theme mode between
  dark, light, and system mode.

* Changed the yet unused descriptor type `CbFunction` for callback functions.
  - using `schema` instead of `type` property for callback arguments
  - using `return` object with `schema` property for callback return values

* New (MUI) components
  - `LinearProgress`
  - `RadioGroup` and `Radio`
  - `Switch`
  - `Tabs`
  - `Slider`
  - `Table`

* Supporting `tooltip` property for interactive MUI components.

## Version 0.0.29 (from 2024/11/26)

* Resolved warnings that appeared when using Vega charts.

## Version 0.0.28 (from 2024/11/26)

* Updated docs.

## Version 0.0.27 (from 2024/11/25)

* Added component `IconButton` and enhanced other components' attributes.

## Version 0.0.26 (from 2024/11/23)

* Channels such as `Input`, `State`, `Output` no longer have a `link` property.
  Instead, we use a special `id` format, namely `"@app"` and `@container`
  to address states other than components. (#52)

## Version 0.0.25 (from 2024/11/23)

* `Registry.register()` now requires the `type`
  to be passed as 1st argument because `component.name` will
  be a mangled name in most cases.

## Version 0.0.24 (from 2024/11/23)

* Exporting required `HostStore` type.

## Version 0.0.23 (from 2024/11/23)

* Introduced new interface `HostState` that applications may implement
  to provide computed properties, i.e., a derived state. (#43)

* Replacing entire components if a related component `StateChange` 
  has an empty `property`. (#38)

* Added handy hooks `useContributions` and `useComponentChangeHandlers`.


## Version 0.0.22 (from 2024/11/19)

* Improved robustness while rendering the in `Select` component
  wrt `options` property.

* `Button` component now sets a `clicked: boolean` property instead
  of `n_clicks: int`.

## Version 0.0.21 (from 2024/11/19)

* `Component` children can now also be text nodes (of type `string`).

* `Typography` component has children instead of `text`.

* A component's `children` property can now be changed, even from a
  scalar.

* Renamed `Dropdown` component into `Select`
  (to refer to MUI component with same name).

* `Select` component has more flexible options.

## Version 0.0.20 (from 2024/11/19)

* Using `FrameworkOptions.getDerivedHostState` also in
  `handleHostStoreChange()`.

* Actions `handleComponentChange()` and `handleHostStoreChange()`
  now exit immediately, if no extensions are configured yet.

* Module `utils.objPath`: Renamed `toObjPath` into `normalizeObjPath`, 
  added `formatObjPath`.

## Version 0.0.19 (from 2024/11/18)

* Fixed TypeScript typing issues with `configureFramework<S>()` and
  `FrameworkOptions`.
  
## Version 0.0.18 (from 2024/11/18)

* Fixed TypeScript typing issues with `configureFramework<S>()` and 
  `FrameworkOptions`. 

## Version 0.0.17 (from 2024/11/18)

* Enhanced interface `FrameworkOptions` by property `getDerivedHostState`,
  which is a user-supplied function that can compute derived
  host state property. 
  
## Version 0.0.16 (from 2024/11/12)

Initial, still experimental version. 
