<?
Header("content-type: text/html; charset=utf-8");
include "modulekit/loader.php"; /* loads all php-includes */
include "demo_form.php";
call_hooks("init");

if($_REQUEST['q']) {
  $form_def=json_decode($_REQUEST['q'], true);
  $default_data=null;
}
if($_REQUEST['d']) {
  $default_data=json_decode($_REQUEST['d'], true);
}

?>
<html>
<head>
<?php print modulekit_include_js(); /* prints all js-includes */ ?>
<?php print modulekit_include_css(); /* prints all css-includes */ ?>
<?php print_add_html_headers(); ?>
<link rel='stylesheet' type='text/css' href='demo.css'/>
<script type='text/javascript' src='demo_jsonly.js'></script>
</head>
<body>

<div id='errors'>
</div>
<form id='form'>
<?
form_process_def($form_def);
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
