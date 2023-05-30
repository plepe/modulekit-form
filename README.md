Forms
=====
This Forms library easily creates powerful and interactive HTML forms via PHP and/or JavaScript. Configuration is done with an associative array, the returned data will have the same structure (same keys, but with data).

There are three modes to use this library:
* PHP Only: Maybe users disable Javascript. Forms should still work. Also we should never trust the Javascript implementation to get checks (e.g. for correct data) right or rather people might try nasty stuff.
* PHP/Javascript combined: The forms are defined and created in PHP, Javascript is responsible for interactivity, like checking validity of data, adding/removing elements and highlighting changed values.
* Javascript only: If you are writing an Ajax application you might want to create Forms directly from Javascript, e.g. because you do no longer reload webpages.

Installation
============
```sh
git clone https://github.com/plepe/modulekit-form.git
cd modulekit-form
git submodule init
git submodule update
```

Example code
============
PHP
---
```php
$f=new form('data', array(
  'name'=>array(
    'type'=>'text',
    'name'=>'Name',
  ),
  'sex'=>array(
    'type'=>'radio',
    'name'=>'Sex',
    'values'=>array('m'=>'male', 'f'=>'female', 'x'=>'other'),
  ),
));

$f->set_data({ name: 'Alice', sex: 'f' });

print "<form method='post'>\n";
print $f->show();
print "<input type='submit' value='Ok'>\n";
print "</form>\n";
```

JavaScript
----------
```js
f=new form('data', {
  name: {
    type: 'text',
    name: 'Name',
  },
  sex: {
    type: 'radio',
    name: 'Sex',
    values: { m: 'male', f: 'female', x: 'other' },
  }
});

// create a dom element where the form will be placed
var form_dom = document.createElement("form");
document.body.appendChild(form_dom);

// show the form
f.show(form_dom);

// add a submit button
var submit = document.createElement("input");
submit.type = "submit";
submit.value = "Ok";
form_dom.appendChild(submit);

// what happens, when the submit button is clicked
form_dom.onsubmit = function() {
  alert(JSON.stringify(f, null, '  '));
  return false; // prevent submitting to webserver
}

// fill in some data (you can do this before showing the form, too)
f.set_data({ name: 'Bob', sex: 'm' });
```

Form API
========
Constructor
-----------
```php
$form1 = new form($id, $def, $options);
```

* $id of the form
* $def the definition of the root's child elements.
* $options are the definition of the root element (which is usually a form element 'form', but you can override this with 'type').

Further options:
* change_on_input: if true, `onchange` will be called whenever a keypress happens (for form elements, which support this)

focus() (JS Only)
-----------------
Focus the first element.

Form Elements
=============
All Form Elements
-----------------
All form elements share some options.

Definition:
* type: defines type of form element (e.g. 'text')
* name: Name of the element (e.g. "Birthday"). This key may be translated (see below)
* desc: Description (usually written below Name in smaller letters); accepts full HTML (in contrast to 'name'). This key may be translated (see below)
* count: We internally be converted to a form element of type array using the options of this key. E.g. array('default'=>2) resp. { 'default': 2 }. If count is an integer value, e.g. '2', array('default'=>2, 'max'=>2) will be used. See 'Form Element Array' for more information.
* default: Specify a default value, which is shown if no value is set.
* default_func: if no value is set, use the provided function(s) to get a value. See chapter "Func Call" for details.
* req: A value is required (true/false). Optionally this may be an array of the same syntax as 'check'.
* disabled: If true, the element will be readonly (not supported by all elements though). If not defined, the value of the parent element will be used (default: false). This may use an array like 'check'.
* weight: Modify order of form elements for display; elements with lower weight will appear first. Default: 0. Optionally this may be an array of the same syntax as 'check'.
* check: Evaluate validity of input. Defined as array("type", parameters). Will call function "check_type" inside form element, will be passed parameters. Example: "regexp" for Form Element Text (will call function "check_regexp").
  * 'and': combine several checks, e.g. array("and", array("regexp", ...), array("foo", ...)) - all sub-checks need to resolve positive.
  * 'or': combine several checks, e.g. array("and", array("regexp", ...), array("foo", ...)) - at least one sub-check need to resolve positive.
  * 'not': inverse check, e.g. array("not", array("regexp", ...)) - the sub-check need to resolve negative.
  * 'check': Call check on a sibling element or parent element, e.g. array("check", "name", array("is", "foo")) -> call the check array("is", "foo") on element "name". The Path can be prefixed by "../" to query parent elements. If you have a form within an array, you need "../../". '*' can be used in the path to specify all child elements of the given element (e.g. array/form).
  * 'is': Compare to a specific value, array("is", VALUE, [MESSAGE]), e.g. array("is", 5, "Value '5' required") (MESSAGE may be an array for multiple error messages)
  * 'contains': For arrays and elements which return arrays (e.g. checkbox, keywords, ...). Checks if the value is contained within the data. Optionally the value may be an array, than one of the elements of this array must be contained within the resulting array. array("contains", VALUE, [MESSAGE]). (MESSAGE may be an array for multiple error messages)
  * 'fun': A custom function will be called for evaluating errors. As 2nd parameter a hash pointing to functions ('js', 'ajax', 'php') is required. E.g. { 'js': "update_function" }. The function will get passed the current value of the element (1st parameter), a reference to the form element (2nd parameter) and the form itself (3rd parameter). Currently only modes 'php' and 'js' supported. Inline functions are possible.
  * 'unique': Check if all values of this element are different (element needs to return an array) OR - if a path as 2nd parameter is given - the values of the other elements are different. E.g. array('unique', '../*/name'). See check 'check' how to specify paths.
  * 'required': Error, if this element is required but value is empty.
  * 'has_value': Check if value of this element is not null. If it is null, print "Invalid Value" message or value of 1st parameter.
* show_depend: if boolean 'false', do not show this field (it is active though). if an array similar to 'check', show the field when it evaluates to success.
* hide_label: if true, hides the left column with label and description and stretches the form element to the full content width.
* include_data: if set to false, the current form element is not included in get_data(). if it is 'not_null', it will be only included, if the value is not null. May contain a check like in 'check'.

Translation of name, desc, ...:
To translate the options you may supply an array with the language codes as keys, e.g. array("en"=>"English text", "de"=>"German text"); if translation is missing, the first translation will be used.

Form Element "Form"
-------------------
A form inside the form. E.g. if you have several cats, and want to record the same properties for every cat, like Name, Age and Race.

Definition (see 'All Form Elements' for inherited options):
* type: 'form'
* def: Definition of the sub form.

Value:
* A hash of the sub form.

Form Element "Array"
--------------------
A variable count of the child elements. This can also be accomplished by setting a 'count' to any form element. Single values may be removed or added interactively.

Definition:
* type: 'array'
* def: Definition of the sub element.
* default: default count of values
* min: minimum count of values
* max: maximum count of values
* order: whether the elements of the array shall be orderable. true (default) / false.
* removeable: whether the elements of the array shall be removeable. true (default) / false.
* createable: whether new elements may be added. (boolean; default: true)
* button:add_element: override text of "Add Element" button (may be translated)
* req: require at least one element
* empty_value: value to return if array is empty. Default: null.
* exclude_null_values: if true, remove null values from the array. Default: false.
* index_type: 'keep' (keep index values; re-ordering does not work in JS), 'array' (always re-number from 0 on, use a real array in JS mode), '_keys' (like 'keep', but in JS mode add a '_keys' property - an array with the ordering of indexes). Default: 'keep'
* Additional checks:
  * 'count' with parameters operator ('==', '>=', '>', '<', '<=', '!='), value and (optional) message. If count of elements does not compare to the specified value, create error message.

Value:
* Array of sub elements.

Form Element "Hash"
-------------------
Similar to "Array", but adds an additional key element. Values of key elements must be distinct. Result is a hash array with the key from the key element.

Definition (see 'array' for additional options):
* type: 'hash'
* key_def: Definition of the key element. (Default: a field of type 'text')

Form Element "Text"
-------------------
Basic form element with a single line text input.

Definition:
* type: 'text'
* checks:
  * regexp: array("regexp", REGEXP, [MESSAGE]), e.g. array("regexp", "^A", "Value needs to start with an 'A'") (MESSAGE may be an array for multiple error messages)
  * not_regexp: array("not_regexp", REGEXP, [MESSAGE]), e.g. array("not_regexp", "^A", "Value may not start with an 'A'") (MESSAGE may be an array for multiple error messages)
* empty_value: Value to be returned if text field is empty (default: null)
* html_attributes: Assoc. Array, e.g. array("style"=>"text-weight: bold;", "autofocus=>true)
* values: array of recommended values
* values_func: function(s) which can update values list; see chapter "Func Call" for details.
* force_values: boolean; if true, value must be member of 'values' array (default: false).
* max_length: Value may not be longer than 'max_length' characters.
* max_bytes: Value may not be longer than 'max_bytes' bytes in the current encoding (hopefully UTF-8).
* change_on: per default, the element will emit the 'onchange' event on blur. if 'keyup', it will emit on the keyup event. (default: 'blur')

Value:
* String. Will be stripped of additional slashes.

Compatibility Issues:
* Non-CSS browsers will show the "values" list in the page content.

TODO:
* If an element with "values" is used in an array, the datalist will be included for every member. A workaround is to generate the datalist manually and include "html_attributes" instead with `list=id of datalist`.

Form Element "Textarea"
-----------------------
Similar to Form Element "Text", but provides a multi line text input.

Definition (also see Form Element "Text", except 'values'):
* type: 'textarea'

Value:
* String. Will be stripped of additional slashes.

Form Element "Numeric"
----------------------
In contrast to other elements you define this element as 'integer' or 'float', to specify the numeric type. The element is based on the Form Element "Text", therefore you can use all options specified there.

Definition (also see Form Element "Text"):
* type: 'integer' or 'float'

Additional check types are available: gt (greater than), lt (less than), ge (greater or equal), le (less or equal). E.g. array("lt", 5, "Must be less than 5"). (Error message optional).

Value:
* Returns a value in the specified numeric type or the 'empty value' (default null).

Form Element "date", "datetime", "datetime-local"
-------------------------------------------------
The element is based on the Form Element "Text", therefore you can use all options specified there.

Definition (also see Form Element "Text"):
* type: 'date', 'datetime', 'datetime-local'
* format: How date is displayed resp. entered in input field. Default: "j.n.Y G:i:s" (see PHP function 'Date' for details). Supported keys: Y, y, m, n, d, j, g, G, h, H, h, i, s, O, P, a, A.
* value_format: How date is represented in set_data()/get_data(). See below under 'Value'.
* check: Additional check type 'after', can be a date value or a reference to another date element on the same hierarchy level (e.g. 'check'=>array("after", "[start]", "Date has to be after 'start' element") )
* timezone: which timezone to use (default: 'UTC')

Value:
* Returns a value in the specified type (see RFC 3339 for details). The format can be overwritten by the option 'value_format':
  * 'date': e.g. '2013-12-24'
  * 'datetime': e.g. '2013-12-24T19:00:00Z' or '2013-12-24T19:00:00.123+02:00'
  * 'datetime-local': e.g. '2013-12-24T19:00:00'

TODO: The format in JavaScript is much more flexible than the PHP format (esp. concerning string representations of weekday/month). So, currently it's not advisable to use string representations.

Unsupported Form Elements
-------------------------
Any form elements that are not supported (yet) will show the name and a warning, that the form element type is not supported. Any data set to the element will be kept, as internally a JSON form element will be used.

Definition:
* type: any which is not listed on this page

Value:
* Any, see JSON.

Form Element "Checkbox"
-----------------------
A list of checkboxes where a random count of boxes may be checked.

Definition:
* type: 'checkbox'
* values: hash array of values, e.g. array("php"=>"PHP", "cpp"=>"C++", "js"=>"Javascript") or simple array of values, e.g. array("PHP", "C++", "Javascript"); may be translated like: array('m'=>array("en"=>"male", "de"=>"männlich"), 'f'=>array("en"=>"female", "de"=>"weiblich")). A value may also have a description (see Form Element "Select").
* values_func: function(s) which can update values list; see chapter "Func Call" for details.
* values_mode: 'keys' (default when a hash array is used) or 'values' (default when a simple array is used) or 'property' (values is an array of hashes, where a property (default: 'id') is used as key).
* check_all: if true, include a button "check all" which will check all checkboxes
* uncheck_all: like 'check_all', but for unchecking
* presets: Adds a selector with presets for checkbox selections. An array (assoc. array), where each entry has a name and a list of options to select (values). Example: [ { name: "Test", values: [ 1, 2, 3 ] }, { name: "Only 3": values: [ 3 ] } ]. Each entry may also have a description ('desc').
* presets:label: Override label for "-- load preset --" option.
* auto_add_values: if true, add additional checkboxes if data contains values which were not defined. Default: false.
* result_mode: 'array' (return an array), 'csv' (return a string with comma separated values). default: 'array'.

Value:
* In 'keys' values_mode an array of the keys of the chosen values is returned (e.g. array("php", "cpp"); in 'values' mode an array of the the keys of the chosen values is returned (e.g. array("PHP", "C++")).
* If no element is checked, an empty array will be returned.

Form Element "Radio"
--------------------
A list of radio boxes where a maximum of one of boxes may be checked.

Definition:
* type: 'radio'
* values: hash array of values, e.g. array("m"=>"male", "f"=>"female") or simple array of values, e.g. array("male", "female"); may be translated like: array('m'=>array("en"=>"male", "de"=>"männlich"), 'f'=>array("en"=>"female", "de"=>"weiblich")). A value may also have a description (see Form Element "Select").
* values_func: function(s) which can update values list; see chapter "Func Call" for details.
* values_mode: 'keys' (default when a hash array is used) or 'values' (default when a simple array is used) or 'property' (values is an array of hashes, where a property (default: 'id') is used as key).

Value:
* In 'keys' values_mode the key of the chosen value is returned (e.g. "m"); in 'values' mode the value is returned (e.g. "male")

Form Element "Boolean"
----------------------
A single checkbox without label.

Definition:
* type: 'boolean'

Value:
* true/false

Form Element "Select"
---------------------
A dropdown box where an entry can be selected.

Definition:
* type: 'select'
* values: hash array of values, e.g. array("m"=>"male", "f"=>"female") or simple array of values array("male", "female"); optionally descriptions for values are possible too, when each value is a hash itself (value is saved as key 'name', description in key 'desc') e.g. 'f'=>array("name"=>"female", "desc"=>"the female gender"); may be translated like: array('m'=>array("en"=>"male", "de"=>"männlich"), 'f'=>array("en"=>"female", "de"=>"weiblich")); optionally localized descriptions for values are possible too (with prefix 'desc:'), e.g. 'f'=>array("en"=>"female", "desc:en"=>"the female gender", "de"=>"weiblich", "desc:de"=>"Das weibliche Geschlecht"); optionally values can be hidden by adding a key 'show_depend' with a check similar to the field 'show_depend'.
* values_mode: 'keys' (default when a hash array is used) or 'values' (default when a simple array is used) or 'property' (values is an array of hashes, where a property (default: 'id') is used as key).
* values_func: function(s) which can update values list; see chapter "Func Call" for details.
* empty_value: Value to be returned if key is empty (default: null)
* placeholder: Text which will be used, when no value is selected (default: '--- please select ---'). If set to boolean false, no placeholder option will be created.
* null_value: By default an option with the internal value "" (empty string) will be added for the "please select" resp. null option. Set the 'null_value' if "" should be a valid option. Example: '__NULL__'.

Value:
* In 'keys' values_mode the key of the chosen value is returned (e.g. "m"); in 'values' mode the value is returned (e.g. "male")

Form Element "Select Other"
---------------------
A dropdown box where an entry can be selected with an "Other" option.

Definition (all options from 'Select'):
* type: 'select_other'
* other_def: a definition for the other form, default: `{ "type": "text" }`.
* button:other: the visible value of the other option, default: 'Other'.

There's a check 'other_selected', which is not an error, if the other option is selected.

Value:
* Either the value from the Select or the value from the Other option.

Form Element "Autocomplete"
---------------------------
Similar to Form Element "Select", but in Combined or JS mode a text input is shown, where a search for values is possible.

Definition:
* type: 'select'
* values: hash array of values, e.g. array("m"=>"male", "f"=>"female") or simple array of values array("male", "female"); may be translated like: array('m'=>array("en"=>"male", "de"=>"männlich"), 'f'=>array("en"=>"female", "de"=>"weiblich")); optionally descriptions for values are possible too (with prefix 'desc:'), e.g. 'f'=>array("en"=>"female", "desc:en"=>"the female gender", "de"=>"weiblich", "desc:de"=>"Das weibliche Geschlecht")
* values_func: function(s) which can update values list; see chapter "Func Call" for details.
* values_mode: 'keys' (default when a hash array is used) or 'values' (default when a simple array is used) or 'property' (values is an array of hashes, where a property (default: 'id') is used as key).
* empty_value: Value to be returned if key is empty (default: null)
* placeholder: Text which will be used, when no value is selected (default: '--- please select ---')

Value:
* In 'keys' values_mode the key of the chosen value is returned (e.g. "m"); in 'values' mode the value is returned (e.g. "male")

Form Element "Password"
-----------------------
Like Form Element "Text", but hides the password.

Definition:
* type: 'password'

Value:
* String

Form Element "JSON"
-------------------
An input for arbitrary JSON data. Will be returned as decoded value, as supported by the language.

Definition:
* type: 'json'

Value:
* A mixed value which is supported by JSON.

Form Element "Hidden"
---------------------
A hidden input, which can be used for data which should be available in the form but not be visible to the user. Remember, that the data of such a field may be modified by the user anyway.

Definition:
* type: 'hidden'

Value:
* Mixed value (internally, the data will be saved in JSON format)

Form Element "Label"
--------------------
A text input which can not be modified. It will update on set_data().

Definition:
* type: 'label'

Value:
* The value which has been set.

Form Element "Color"
--------------------
An input of type 'color'. You may want to load the Spectrum Colorpicker: http://bgrins.github.com/spectrum/ 

Definition:
* type: 'color'

Value:
* Depends on your system, but usually a 6-character hex code prefixed with '#'.

Form Element "Keywords"
-----------------------
Provide an interface to add/remove random keywords.

Definition:
* type: 'keywords'
* values: List of common keywords from which the user can select while typing (HTML5 only; using a "datalist")
* values_func: function(s) which can update values list; see chapter "Func Call" for details.
* link: Link each keyword to the specified URL, where % will be replaced by the current value, e.g. "search.php?keyword=%"
* text_remove: Text to display on the remove-buttons (default: "X")
* text_add: Text to display on the add-button (default: "neu")
* text_edit: Text to display on the edit-button (default: "editieren")
* text_edit_save: Text to display on the Save-button in edit mode (default: "Ok")
* text_edit_cancel: Text to display on the Cancel-button in edit mode (default: "Abbrechen")

Value:
* Array of strings, e.g. array("foo", "bar") resp. ["foo", "bar"]

Form Element "File"
-------------------
Upload single files. Files are moved to the specified directory (see option 'path'), as value an array will be returned.

Definition:
* type: 'file'
* path: Path where the files get saved to
* template: A name template how files may be called, the following patterns may be used (Example: "submission-[timestamp].[ext]", Default: "[orig_name]"):
  * [orig_name]: original file name
  * [ext]: the extension
  * [timestamp]: Date in form YYYY-MM-DD-HH-MM-SS
* web_path: If file should be downloadable, set a web_path. "[file_name]" will be replaced by the name of the file (e.g. download.php?file=[file_name]").
* accept_ext: an array with acceptable extensions (default: all)

Value:
```php
array(
  'name'=>name of file as saved in path,
  'type'=>mime type,
  'size'=>size in byte,
  'orig_name'=>name of file as it was when uploaded,
  'error'=>Error code of file upload
)
```

STATE: It's not possible yet to read file content in JavaScript mode

* See http://www.php.net/manual/en/features.file-upload.errors.php for possible error codes. Additional error codes:
  * Error 16: Can't move file from PHP temporary folder to temporary file in final folder
  * Error 17: Temporary file size differs from PHP upload data
  * Error 20: Can't rename temporary file to final file
  * Error 21: Final file size differs from PHP upload data

Form Element "Form Chooser"
---------------------------
Choose sub elements from a predefined list of elements. The result will only include the selected sub elements.

Definition:
* type: 'form_chooser'
* def: a list of available sub elements
* presets: a list of pre-defined values, with:
  * name: name of the selection
  * value: value to set if chosen
* presets:label: label of the input field for the presets
* min: how many elements must be selected at minimum
* max: how many elements must be selected at maximum
* exclude_null_values: if true, remove null values from the array. Default: false.
* order: whether the elements shall be orderable. true (default) / false.
* removeable: whether the elements shall be removeable. true (default) / false.
* result_keep_order: if true, resulting elements will be ordered by appearance in def.

Child elements may have a property 'non_used_value', which will be returned for this element if the child has not been added to the form.

Child elements may have a property 'show_default'. If true, this field will be shown, even if it has not been added.

Child elements may have a property 'weight'. Elements will be ordered by weight. Elements added interactively will always be added at the bottom.

Example:
```json
"foobar": {
    "name": "Foobar",
    "type": "form_chooser",
    "def": {
        "foo": {
            "name": "Foo",
            "type": "text"
        },
        "bar": {
            "name": "Bar",
            "type": "textarea",
            "non_used_value": "default value"
        }
    }
}
```

Form Element "Directory"
------------------------
Upload multiple files. Files are moved to a newly created directory in the specified path, as value an array will be returned.

Definition:
* type: 'directory'
* path: Path where the directory for the files will be created and the files get saved to
* template: A name template how the directory will be called, the following patterns may be used (Example: "submission-[timestamp]", Default: "[timestamp]"):
  * [timestamp]: Date in form YYYY-MM-DD-HH-MM-SS

Value:
```php
array(
  'name'=>name of the directory,
  'list'=>array(   // list of all the files
    0=>array(
      'name'=>name of file,
      'type'=>mime type,
      'size'=>size in byte,
    )
    1=>...
  )
)
```

STATE: Currently disabled

Form Element "Display"
----------------------
A non-editable field. It just shows the value. In opposition to other elements, this may contain HTML for formatting.

Definition:
* type: 'display'

Form Element "Intermediate Text"
--------------------------------
A non-editable field, which does not even contain data. It's meant for intermediate headings or longer descriptions.

Definition:
* type: 'intermediate_text'
* text: some text which will be shown. May contain HTML.

Form Element "Fixed"
----------------------
A non-editable field, it always has the specified value and can not be changed by UI or set_data(). It just shows the value. In opposition to other elements, this may contain HTML for formatting.

Definition:
* type: 'fixed'
* value: the value of the element.

Tips:
Set 'show_depend' to false to hide this field.

Form Element "Switch"
---------------------
This is not really a form element of it's own, but selects one of several sub form elements by the value of another element. Only the selected sub form element will be shown.

Definition:
* type: 'switch'
* switch: path (see check 'check' at Form Element) to other form element, whose value will be used for deciding which sub form element to show.
* def: hash array where the keys are the possible values of the switch element and value is the definition of the sub form element.

Example:
```json
{
    "text_short_long": {
        "type": "radio",
        "name": "Short or long text?",
        "values": [ "short", "long" ],
        "default": "short"
    },
    "data": {
        "type": "switch",
        "switch": "text_short_long",
        "def": {
            "short": {
                "type": "text",
                "name": "Text"
            },
            "long": {
                "type": "textarea",
                "name": "Textarea"
            }
        }
    }
}
```

Form Element Markdown
---------------------
Optional module, needs 'modulekit-form-markdown' loaded. Also, needs the npm module [marked](https://www.npmjs.com/package/marked) loaded globally.

Definition:
* type: markdown

Inherits all options from Form Element Textarea. When `marked` is not loaded, a warning will be issued on the JavaScript console and no preview is available.

Extensions
==========
Twig
----
Allows twig templates for checks and similar fields (disabled, required, message), e.g.:

```json
{
  "name": {
    "type": "text",
    "message": ["twig", "message {{ value }}"]
  }
}
```

The following values will be available:
* value: current value of this field
* orig_value: the 'original' value of this field
* data: the whole data of the form, from the root element
* orig_data: the original data of the form, from the root element
* path: the path to the current element as array

How to enable Twig, please check `demo/twig.php`.

General functions
=================
Func Call
---------
This is used by the option 'values_func'.

* A hash, pointing to functions ('js', 'php'). E.g.
```php
array(
  'js': "function(value, form_element, form) { return 'something'; }",
  'php': function($value, $form_element, $form) { return 'something'; },
);
```

As values to the hash you can use:
* a callable function (PHP, JS mode)
* the name of a function as string (PHP, JS mode)
* an unnamed JS function as string

The function will get passed the current value of the element (1st parameter), a reference to the form element (2nd parameter) and the form itself (3rd parameter).

Functions of form
=================
Constructor
-----------
Creates a form.

Synopsis:
* PHP/JS: `new form(id, def, options)`

Parameters:
* id: a string which will be used to identify elements of this form. By default, the name of HTML input elements will be prefixed with this value.
* def: a hash defining the form, see the Example code above and the Elements definition.
* options: influence workings of the form, possible options:
  * var_name: override default html input element prefix
  * orig_data: set to false, if orig_data should not be passed to subsequent requests as GET/POST-parameter

set_data(data)
--------------
PHP/JS: Change data to supplied values. If data doesn't contain a key existing in the form, these values are not changed.

Example:
* PHP: f->set_data(array('sex'=>'f'))
* JS: f.set_data({'sex': 'f'})

Changes the form element 'sex' to 'f', but leaves (in the above example) 'name' untouched.

get_data()
----------
PHP/JS: Returns data of all elements.

Example:
* PHP: f->get_data()
* JS: f.get_data()

Returns array('name'=>"Alice", 'sex'=>"f") resp. { 'name': "Alice", 'sex': "f" }

is_empty()
----------
Ask, if the form has not been filled with data yet.

clear()
-------
Let the form forget its data (is_empty() will return true).

get_request_data()
------------------
(JS only): Return a structure similar to this which would be submitted to the server via GET/POST.

ADVANCED DEVELOPMENT
====================
Define additional checks
------------------------
You can define additional checks. Examples:

PHP:
```php
register_hook('init', function () {
  form_element::$additional_checks['example'] = function (&$errors, $param, $thast) {
    $errors[] = 'ERROR FOUND';
  }
});
```

JS:
```js
form_element.prototype.check_example = function (errors, param) {
  errors.push('ERROR FOUND')
}
```
