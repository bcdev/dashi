Chartlets provides a simple demo that serves as a
reference for the framework usage and testbed for its features.

The following steps assume the latest versions of the following 
development tools are installed:

- `git`
- `conda` or `mamba`
- `npm` from `node.js` 

## Get sources from repo

```bash
git clone https://github.com/bcdev/chartlets.git
```

This will create the folder `chartlets` which is referred to as
`${project}` in the following.

## Run demo server

Create environment and install library

```bash
cd ${project}/chartlets.py
conda env create
conda activate chartlets
pip install -ve . 
```

Run demo server

```bash
cd ${project}/chartlets.py/demo
python -m server.main 
```

## Run demo UI

Install common dependencies

```bash
cd ${project}/chartlets.js
npm install
```

Build the library

```bash
cd ${project}/chartlets.js/packages/lib
npm run build
```

Run the demo UI

```bash
cd ${project}/chartlets.js/packages/demo
npm run dev
```
