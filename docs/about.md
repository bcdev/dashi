## Changes

You can find the complete Chartlets changelog 
[here](https://github.com/bcdev/chartlets/blob/main/CHANGES.md). 

## Reporting

If you have suggestions, ideas, feature requests, or if you have identified
a malfunction or error, then please 
[post an issue](https://github.com/bcdev/chartlets/issues). 

## Contributions

The Chartlets project welcomes contributions of any form
as long as you respect our 
[code of conduct](https://github.com/bcdev/chartlets/blob/main/CODE_OF_CONDUCT.md)
and follow our 
[contribution guide](https://github.com/bcdev/chartlets/blob/main/CONTRIBUTING.md).

If you'd like to submit code or documentation changes, we ask you to provide a 
pull request (PR) 
[here](https://github.com/bcdev/chartlets/pulls). 
For code and configuration changes, your PR must be linked to a 
corresponding issue. 

## Development

To set up the Python development environment, with repository root as 
current working directory:

```bash
cd chartlets.py
pip install .[dev,doc]
```

### Testing and Coverage

Chartlets uses [pytest](https://docs.pytest.org/) for unit-level testing 
and coverage analysis for its Python code.

```bash
cd chartlets.py
pytest --cov=chartlets tests
```

### Coding Style

Chartlets' Python code is formatted by [black](https://black.readthedocs.io/).

```bash
cd chartlets.py
black .
```

Chartlets' TypeScript code is formatted by 
[prettier](https://prettier.io/).

```bash
cd chartlets.js/packages/lib
prettier -w .
```

### Documentation

Chartlets' documentation is built using the [mkdocs](https://www.mkdocs.org/) tool.

```bash
cd chartlets.py
pip install .[doc]
cd ..
```

With repository root as current working directory:

```bash
# Write
mkdocs serve

# Publish
mkdocs build
mkdocs gh-deploy
```

## License

Chartlets is open source made available under the terms and conditions of the 
[MIT License](https://github.com/bcdev/chartlets/blob/main/LICENSE).

Copyright © 2024 Brockmann Consult Development
