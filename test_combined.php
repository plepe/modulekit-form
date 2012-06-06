<?
Header("content-type: text/html; charset=utf-8");
include "modulekit/loader.php"; /* loads all php-includes */
include "form_def.php";
?>
<html>
<head>
<?php print modulekit_include_js(); /* prints all js-includes */ ?>
<?php print modulekit_include_css(); /* prints all css-includes */ ?>
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
  // save data to database (or - in this example - print to stdout)
  print "Data: <pre>\n";
  print_r($form->get_data());
  print "</pre>\n";

  // reset form data
  //$form->reset();
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

print "Form definition:<pre>\n";
print_r($form_def);
print "</pre>\n";

?>
</body>
</html>
