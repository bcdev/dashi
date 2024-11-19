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
