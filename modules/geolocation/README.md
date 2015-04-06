Form Element Geolocation
========================
An optional form element for the Geolocation Javascript API. The resulting data of such a form element is either null (location not known) or a hash, e.g.:
```json
{
  "speed": null,
  "heading": null,
  "altitudeAccuracy": null,
  "accuracy": 4142,
  "altitude": null,
  "longitude": 16.3677600,
  "latitude": 48.2083556
}
```

Options
-------
none

Notes
-----
To enable this form element, you need to load the module
"modulekit-form-geolocation".
