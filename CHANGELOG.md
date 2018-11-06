Newer
-----
* Form Element Form Chooser: new form element type!
* Form Element Switch: new form element type!
* Form Element Select: suppress placeholder (by setting option to false)
* Form Element Checkbox: support option 'presets' (and 'presets:label')
* Form Element Array: new option 'index_type' (keep, _keys or array)
* Form Element Checkbox: support option 'auto_add_values'
* All elements which have 'values': new values_mode 'property'
* Form Element Array: new option 'createable'
* Form Element Text: option 'change_on' ('blur', 'keyup')
* Form Element Form Chooser: children may have option 'non_used_value'
* Form Element File: include 'file' in JS data (when uploading, JS type File)

2017-09-15 (Version >= 2.6)
---------------------------
* Form Element Autocomplete: support option 'placeholder'

2017-08-11 (Version >= 2.6)
---------------------------
* Print error when PHP post_max_size exceeded
* Form Element File: print info about max. allowed file size

2017-01-24 (Version >= 2.6)
---------------------------
* Form Element Array: new option 'removeable' (shall elements be removeable)

2016-04-20 (Version >= 2.6)
---------------------------
Form Element Text: Option max_bytes: Value may not be longer than 'max_bytes' bytes.

2016-03-01 (Version >= 2.6)
---------------------------
Form Element Text: Option max_length: Value may not be longer than 'max_length' characters.

2015-02-28 (Version >= 2.6)
---------------------------
Form Element *: 'include_data' may be 'not_null': include only if value not null

2015-01-08 (Version >= 2.6)
---------------------------
Form Element Select: new option 'null_value'

2015-12-04 (Version >= 2.6)
-------------------
Form Element Array: also accept 'min'; generate error when not in range

2015-09-24
----------
Form Element *: show_depend may be boolean false
Form Element Fixed: new form type

2015-08-21
----------
* Form Element *: new option 'weight' (define order of elements for display)

2015-07-31
----------
* Form Element Array: new option 'exclude_null_values'

2015-06-23
----------
* Form Element Radio/Checkbox: values may have a description ('desc' or 'desc:en' for localized string)

2015-06-14
----------
* Documentation 'Func Call'
* Func Call: A JS function can be specified as string.
* Form Element *: new option 'default_func' (get the default value programmatically)
* Form Element Array: if array is empty, return value of 'empty_value' or null.

2015-06-10
----------
* New check 'required'
* Form Element Array: when req=true, require at least one element
* New Form Element 'hash' (like 'array', but with additional key)

2015-06-01
----------
* Form Element Date: specify 'timezone' (default: 'UTC')

2015-05-18
----------
* Checks may return an array for multiple error messages
* Form Element Text: new check 'not_regexp'

2015-05-06
----------
* New Form Element 'Intermediate Text'
* New option for all Form Elements: 'include_data'

2015-04-26
----------
* New check: 'has_value'

2015-04-24
----------
* New function: get_request_data() (JS only)

2015-04-06
----------
* New option: 'orig_data' (set to false, if orig_data should not be passed to subsequent requests as GET/POST-parameter)

2015-03-12
----------
* New check: 'fun'
* New check: 'unique'

2015-03-03
----------
* Form Element Checkbox: options check_all and uncheck_all

2015-03-02
----------
* New check: 'contains'

2015-02-27
----------
* Values (for Checkbox, Select, ...) may contain 'show_depend' (then this value is only available when the check is successful)
* Checks on parent elements.

2015-02-25
----------
* Highlight required fields by prefixing label with '*'

2015-02-16
----------
* All Form Elements: new option 'hide_label' (hide left column with label and description; stretch form element to full content width)
* Form Element Display: new element; just show content which may be formatted by using HTML.

2015-02-11
----------
* Form Elements: new option 'values_func' (get list of values from function)
