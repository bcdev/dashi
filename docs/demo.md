Chartlets provides a simple demo that explains serves as a
reference for the framework usage and testbed for its features.

```bash
git clone https://github.com/bcdev/chartlets.git
```

### Run the server

```bash
cd chartlets/chartlets.py
conda env create
conda activate chartlets
pip install -ve . 
python -m chartlets.demo.server
```

### Run the UI

```bash
cd ../chartlets.js
npm install
npm run dev
```