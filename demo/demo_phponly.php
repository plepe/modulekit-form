<?php
Header("content-type: text/html; charset=utf-8");
// create file .nocache to disable caching
$modulekit_nocache=file_exists(".nocache");

if (file_exists('../vendor')) {
  # Extensions installed - load them
  require_once '../vendor/autoload.php';
  require_once './twig.php';
}

include "demo_form.php";
include "../modulekit/loader.php"; /* loads all php-includes */

include "demo_functions.php";
call_hooks("init");
?>
<!DOCTYPE HTML>
<html>
<head>
<?php print modulekit_include_css(); /* prints all css-includes */ ?>
<?php print_add_html_headers(); ?>
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel='stylesheet' type='text/css' href='demo.css'/>
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

$form=new form("data", $form_def, $options);

if($form->is_complete()) {
  // save data to database
  print "Form is complete (no errors).<br>\n";

  // reset form data
  $form->save_data();
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
print htmlspecialchars(json_readable_encode($form_def));
print "</pre>\n";
print "</div>\n";

// save data to database (or - in this example - print to stdout)
print "<div class='form_data'>\n";
print "Data: <pre id='form_data'>\n";
print htmlspecialchars(json_readable_encode($form->get_data()));
print "</pre>\n";
print "</div>\n";

print "</div> <!-- demo -->\n";

?>
</body>
</html>
