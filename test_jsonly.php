<?
Header("content-type: text/html; charset=utf-8");
include "inc/form.php";
include "form_def.php";

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
<?form_include();?>
<script type='text/javascript' src='test_jsonly.js'></script>
</head>
<body>

<h1>Data (JSON)</h1>
<pre id='data'>
</pre>

<h1>FORM</h1>
<div id='errors'>
</div>
<form id='form'>
<?
form_process_def($form_def);
html_export_var(array("form_def"=>$form_def, "default_data"=>$default_data));

// show form


?>
</form>

</body>
</html>
