<?
Header("content-type: text/html; charset=utf-8");
include "inc/form.php";
include "form_def.php";
?>
<html>
<head>
<?form_include();?>
<script type='text/javascript' src='test_js.js'></script>
</head>
<body>
<div id='form'>
<?
form_process_def($form_def);
html_export_var(array("form_def"=>$form_def, "default_data"=>$default_data));

// show form


?>
</body>
</html>
