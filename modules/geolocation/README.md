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
* options: options for the navigator.geolocation element, typically: enableHighAccuracy, timeout, maximumAge. See http://dev.w3.org/geo/api/spec-source.html#position_options_interface for details.
* default_enable_tracking: per default GPS tracking will be enabled. Set to false to disable tracking per default (users need to check to enable).

Notes
-----
To enable this form element, you need to load the module
"modulekit-form-geolocation".
