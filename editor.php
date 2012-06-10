<?
Header("content-type: text/html; charset=utf-8");
include "modulekit/loader.php"; /* loads all php-includes */

?>
<html>
<head>
<?php print modulekit_include_js(); /* prints all js-includes */ ?>
<?php print modulekit_include_css(); /* prints all css-includes */ ?>
</head>
<body>
<?

$form_types=array();
foreach(get_declared_classes() as $cls) {
  if(preg_match("/^form_element_(.*)$/", $cls, $m))
    $form_types[$m[1]]=$m[1];
}

$form_editor=array(
  'elements'	=>array(
    'name'	=>"Elements",
    'type'	=>"form",
    'count'	=>array("default"=>1),

    'def'	=>array(
      'id'		=>array(
	'name'	=>"ID",
	'type'	=>"text",
	'req'	=>true,
      ),
      'name'	=>array(
	'name'	=>"Name",
	'type'	=>"text",
	'req'	=>true,
      ),
      'type'	=>array(
	'name'	=>"Type",
	'type'	=>"radio",
	'values'	=>$form_types,
      ),
      'values'	=>array(
        'name'	=>"Values",
	'type'	=>"form",
	'def'	=>array(
		  'k'	=>array(
		    'name'	=>"k",
		    'type'	=>"text",
		  ),
		  'v'	=>array(
		    'name'	=>"v",
		    'type'	=>"text",
		  ),
	  ),
	'count'	=>array("default"=>2),
      ),
    ),
  ),
);

if($_REQUEST['q']) {
  $form_def=json_decode($_REQUEST['q'], true);
  $default_data=null;
}
if($_REQUEST['d']) {
  $default_data=json_decode($_REQUEST['d'], true);
}

$form=new form("data", $form_editor);

if($form->errors()) {
  // print errors
  print "Errors in the form were found:";
  print $form->show_errors();
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

function fix_values(&$def) {
  foreach($def as $id=>$d) {
    if(($d['type']=="form")||($d['type']=="array")) {
      fix_values($def[$id]['def']);
    }

    $values=array();
    if($d['values']) foreach($d['values'] as $x) {
      $values[$x['k']]=$x['v'];
    }
    $def[$id]['values']=$values;
  }
}

if($form->is_complete()) {
  $data=$form->get_data();
  $def=array();
  foreach($data['elements'] as $i=>$v) {
    $def[$v['id']]=$v;
    unset($def[$v['id']]['id']);
  }

  fix_values($def);

  print "Form definition:<pre>\n";
  print_r($def);
  print "</pre>\n";

  // save data to database (or - in this example - print to stdout)
  print "This is what the form will look like:\n";

  $ex=new form("ex", $def);
  print $ex->show();

  // reset form data
  //$form->reset();
}

?>
</body>
</html>
