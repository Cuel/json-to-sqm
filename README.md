## What

Outputs SQM files from valid JSON, based on output from [arma-class-parser](https://github.com/Fusselwurm/arma-class-parser)

## Installation

`npm install json-to-sqm`

## Usage

```
var jsonToSqm = require('json-to-sqm')
var res = jsonToSqm({"Mission": {}})
```

## Tests

`npm test`

## Known issues:
Floating point numbers (not really an issue with this package)
E.g `7.3458068e-007` would be `-7.3458068e-7`

## License

[WTFPL](https://en.wikipedia.org/wiki/WTFPL)
