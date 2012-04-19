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

// data was entered to the form
if($_REQUEST['data']) {
  // read data from form
  $data=form_get_data($form_def, $_REQUEST['data']);
  // check form for errors (like invalid values, ...)
  $error=form_check($form_def, $data);

  if($error) {
    // print errors
    print "Errors in the form were found:";
    print form_print_errors($error);
  }
  else {
    // save data to database (or - in this example - print to stdout)
    print "Data: <pre>\n";
    print_r($data);
    print "</pre>\n";

    // reset form data
    form_reset($form_def, $data, "data");
  }
}
else {
  // load data from database (or use default data)
  $data=array();
}

// show form
print "<form enctype='multipart/form-data' method='post'>\n";
print form_show($form_def, $data, "data");
print "<input type='submit' value='Ok'>\n";
print "</form>\n";

print "Form definition:<pre>\n";
print_r($form_def);
print "</pre>\n";

?>
</body>
</html>
