## Version 0.0.23 (in development)

* Replacing entire components if a related component `StateChange` 
  has an empty `property`. (#38)

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
