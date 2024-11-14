# Welcome to Chartlets

Chartlets is a software framework that allows websites developed with
React to be extended by server-side widgets programmed in Python or other
programming languages. 

It comprises a 
[Python backend package](https://github.com/bcdev/chartlets/tree/main/chartlets.py)
and a 
[JavaScript/React frontend package](https://github.com/bcdev/chartlets/tree/main/chartlets.js).

## Features

- Enhance your React web application by UI-contributions programmed in Python
- Enhance your (Python) web API to serve server-side UI-contributions.
- Uses [Material UI](https://mui.com/material-ui/) components and 
  [Vega-Lite](https://vega.github.io/vega-lite/) charts.

## How it works

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

![images/sequence.png](images/sequence.png)
