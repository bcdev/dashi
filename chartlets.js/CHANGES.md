## Version 0.1.0 (not started)

* Reorganise Chartlets project
  - Create `chartlets` GH org. 
  - Split current `chartlets` repo and move to `chartlets` org:
    - `chartlets.py` The Python package, defines standard components
    - `chartlets.js` The JS package, implements standard components 
    - `chartlets-demo` Chartlets demo which uses the above  
  - Allow for different component implementation bases, therefore
    make corresponding dependencies optional and dynamically check at runtime
    whether they are available. We may also think of going further by
    using dedicated implementation packages:
    - `chartlets.py.vega` Defines the `VegaChart` component
    - `chartlets.js.mui` Registers MUI impls. of the standard components
    - `chartlets.js.vega` Registers Vega React impl. of the `VegaChart` component

## Version 0.0.30 (in development)

* Allow for different chart providers:
  - Renamed `Plot` into `VegaChart`.
  - `VegaChart` is defined only if `vega-altair` is installed.

* The `Plot` component now respects a `theme` property. If not given,
  it will respect the current MUI theme mode `"dark"`. 

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
