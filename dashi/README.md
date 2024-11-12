# chartlets 

Chartlets is a JavaScript library that allows configuring server-side widgets
and plugging them into existing web frontends.

_Note, this library is experimental and under development still._

## How it is supposed to work

Users write the widgets in, e.g. Python, and a REST server implements three 
endpoints to publish the widgets:

- `GET /contributions`: Called once after application UI starts up.
  Returns an object whose keys are contribution points (e.g., "panels") 
  and whose values are arrays of contribution objects.
- `POST /layout/{contribPoint}/{contribIndex}`:
  Called once for every contribution when it becomes visible in the UI.
  Returns the contribution's initial component tree
- `POST /callback`:
  Called when users interact with the component tree or on application 
  state changes. Returns an array of contribution changes where each 
  contribution change contains an array of actions to be applied to the 
  component tree.

The following sequence diagram depicts how the library is supposed to 
work. The top shows the JavaScript frontend that uses this library.
The bottom shows the lifeline of the backend REST server.

![docs/sequence.png](docs/sequence.png)

## How to run the demo

```bash
git clone https://github.com/bcdev/chartlets.git
```

### Run the server

```bash
cd chartlets/dashipy
conda env create
conda activate chartlets
pip install -ve . 
python -m dashipy.demo.server
```

### Run the UI

```bash
cd ../chartlets
npm install
npm run dev
```

