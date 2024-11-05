# Dashi UI TODOs

- Keep state flat, avoid deep nesting!
  
  - Why: Changing a deeply nested property is more complex, error prone,
    and takes more time to execute.
    Deeply nested state models are harder to understand too.
    It will also require changing all parent objects and arrays that contain the changed value
    which potentially causes more UI renders and/or more tests whether component properties changed.
  
  - How: Go back to former design where initial contributions that stay constant
    are separate from changing contribution states and components.

- Consequently use `propertyPath: string[]` instead of `propertyName: string`  

- Add true actions from `src/actions` to store state so that lib users
  know what actions are public.