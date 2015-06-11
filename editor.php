<?php
Header("content-type: text/html; charset=utf-8");
$modulekit_load[] = "json_readable_encode";
$modulekit_load[] = "modulekit-form-debug";
include "modulekit/loader.php"; /* loads all php-includes */
call_hooks("init");

?>
<!DOCTYPE HTML>
<html>
<head>
<?php print modulekit_include_js(); /* prints all js-includes */ ?>
<?php print modulekit_include_css(); /* prints all css-includes */ ?>
<?php print_add_html_headers(); ?>
<meta name="viewport" content="width=device-width, initial-scale=1">
<script type='text/javascript' src='editor.js'></script>
<link rel='stylesheet' type='text/css' href='editor.css'/>
</head>
<body>
<form enctype='multipart/form-data' method='post'>
<?php

$form_editor = form_template_editor();

if($_REQUEST['q']) {
  $form_def=json_decode($_REQUEST['q'], true);
  $default_data=null;
}
if($_REQUEST['d']) {
  $default_data=json_decode($_REQUEST['d'], true);
}

$form=new form("data", $form_editor);

if($form->is_empty()) {
  // load data from database (or use default data)
  $form->set_data($default_data);
}

// show form
print "<div id='editor' class='struct'>\n";
print "Define the form:\n";
print $form->show();
print "<input type='submit' value='Ok'>\n";
print "</div>\n";

$data = $form->get_data();
$def = $data['fields'];

// save data to database (or - in this example - print to stdout)
print "<div id='preview' class='struct'>\n";
print "This is what the form will look like:\n";

print "<div id='form_test'>\n";

$ex=new form("test", $def);
print $ex->show();

print "</div>\n";
print "<input type='submit' value='Ok'>\n";
print "</div>\n";

print "<div id='definition' class='struct'>\n";
print "Form definition:<pre id='definition_display'>\n";
print json_readable_encode($def);
print "</pre>\n";
print "</div>\n";

print "<div id='result' class='struct'>\n";
print "Form result:<pre id='result_display'>\n";
print json_readable_encode($ex->get_data());
print "</pre>\n";
print "</div>\n";

?>
</form>
</body>
</html>
