<?
Header("content-type: text/html; charset=utf-8");
?>
<html>
<head>
<link rel='stylesheet' type='text/css' href='inc/form.css'>
<script type='text/javascript' src='inc/form.js'></script>
</head>
<body>
<?
include "inc/form.php";
include "form_def.php";

$form=new form("data", $form_def);

if($data=$form->get_data()) {
  if($form->errors()) {
    // print errors
    print "Errors in the form were found:";
    print $form->show_errors();
  }
  else {
    // save data to database (or - in this example - print to stdout)
    print "Data: <pre>\n";
    print_r($data);
    print "</pre>\n";

    // reset form data
    $form->reset();
  }
}
else {
  // load data from database (or use default data)
  $data=array();
  $form->set_data($data);
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
