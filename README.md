# Gauge

## Usage

### Install package

```
$ cd project
$ npm install Gauge
```

### Include

Styles:

```
<link rel="stylesheet" href="node_modules/Gauge/dist/styles/gauge.min.css">
```

Script:

```
<script src="node_modules/Gauge/dist/scripts/gauge.min.js"></script>
```

Element:

```
<div class="gauge"
    gauge-value="13" 
    gauge-min="0" 
    gauge-max="100" 
    gauge-step="10" 
    gauge-radius="175" 
    gauge-lineWidth="2"
    >
    <div class="sector" sector-width="1.3"></div>
    <div class="sector" sector-width="2.1"></div>
    <div class="sector" sector-width="2.3"></div>
  </div>
```


## Development

### Server

```
$ gulp server
```

### Build

```
$ gulp
```

