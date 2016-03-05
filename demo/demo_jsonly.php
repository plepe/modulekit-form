<?php
Header("content-type: text/html; charset=utf-8");
// create file .nocache to disable caching
$modulekit_nocache=file_exists(".nocache");
$modulekit_load[]="modulekit-form-debug";
include "demo_form.php";
include "../modulekit/loader.php"; /* loads all php-includes */
call_hooks("init");

?>
<!DOCTYPE HTML>
<html>
<head>
<?php print modulekit_include_js(); /* prints all js-includes */ ?>
<?php print modulekit_include_css(); /* prints all css-includes */ ?>
<?php print_add_html_headers(); ?>
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel='stylesheet' type='text/css' href='demo.css'/>
<script type='text/javascript' src='demo_jsonly.js'></script>
<script type='text/javascript' src='demo_functions.js'></script>
</head>
<body>
<?php

if(isset($_REQUEST['q'])) {
  $form_def=json_decode($_REQUEST['q'], true);
  $default_data=null;
}
if(isset($_REQUEST['d'])) {
  $default_data=json_decode($_REQUEST['d'], true);
}
include "demo_header.php";
?>
<div id='errors'>
</div>
<form id='form'>
<?php
print html_export_var(array("form_def"=>$form_def, "default_data"=>$default_data));

// show form


?>
</form>

<div class='demo'>

<div class='definition'>
Form definition:<pre id='definition'>
</pre>
</div>

<div class='form_data'>
Data: <pre id='form_data'>
</pre>
</div>

</div> <!-- demo -->

</body>
</html>
