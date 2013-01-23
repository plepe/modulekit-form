<?
Header("content-type: text/html; charset=utf-8");
include "modulekit/loader.php"; /* loads all php-includes */
include "demo_form.php";
?>
<html>
<head>
<?php print modulekit_include_css(); /* prints all css-includes */ ?>
<link rel='stylesheet' type='text/css' href='demo.css'/>
</head>
<body>
<?

if($_REQUEST['q']) {
  $form_def=json_decode($_REQUEST['q'], true);
  $default_data=null;
}
if($_REQUEST['d']) {
  $default_data=json_decode($_REQUEST['d'], true);
}

$form=new form("data", $form_def);

if($form->errors()) {
  // print errors
  print "Errors in the form were found:";
  print $form->show_errors();
}

if($form->is_complete()) {
  // save data to database
  print "Form is complete (no errors).<br>\n";

  // reset form data
  $form->reset();
}

if($form->is_empty()) {
  // load data from database (or use default data)
  $form->set_data($default_data);
}

// show form
print "<form enctype='multipart/form-data' method='post'>\n";
print $form->show();
print "<input type='submit' value='Ok'>\n";
print "</form>\n";

print "<div class='demo'>\n";

print "<div class='definition'>\n";
print "Form definition:<pre id='definition'>\n";
print_r($form_def);
print "</pre>\n";
print "</div>\n";

// save data to database (or - in this example - print to stdout)
print "<div class='form_data'>\n";
print "Data: <pre id='form_data'>\n";
print_r($form->get_data());
print "</pre>\n";
print "</div>\n";

print "</div> <!-- demo -->\n";

?>
</body>
</html>
