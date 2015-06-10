<?php
Header("content-type: text/html; charset=utf-8");
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
<?php

$form_types=array();
foreach(get_declared_classes() as $cls) {
  if(preg_match("/^form_element_(.*)$/", $cls, $m))
    $form_types[$m[1]]=$m[1];
}

$has_values = array("check", "type", array("or", array("is", "radio"), array("is", "select"), array("is", "checkbox"), array("is", "text"), array("is", "autocomplete"), array("is", "keywords")));

$form_editor=array(
  'elements'	=>array(
    'name'	=>"Elements",
    'type'	=>"hash",
    'default'   =>1,
    'hide_label'=>true,

    'key_def'	=>array(
      'name'  =>lang('form:hash_key_field_name'),
      'type'	=>"text",
      'req'	=>true,
      'check'	=>array("regexp", "^[a-zA-Z0-9_]+$"),
    ),
    'def'       =>array(
      'type'      =>'form',
      'def'       => array(
        'name'	=>array(
          'name'	=>"Name",
          'type'	=>"text",
          'req'	=>true,
        ),
        'type'	=>array(
          'name'	=>"Type",
          'type'	=>"select",
          'values'	=>$form_types,
        ),
        'values'	=>array(
          'name'	=>"Values",
          'type'	=>"hash",
          'def'	=>array(
            'name'	=>lang('form:hash_value_field_name'),
            'type'	=>"text",
          ),
          'default'=>2,
          'show_depend'=>$has_values,
          // 'include_data'=>array('and', array('not_empty'), $has_values),
          'include_data'=>$has_values,
        ),
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

if($form->is_empty()) {
  // load data from database (or use default data)
  $form->set_data($default_data);
}

// show form
print "<div id='editor' class='struct'>\n";
print "Define the form:\n";
print "<form enctype='multipart/form-data' method='post'>\n";
print $form->show();
print "<input type='submit' value='Ok'>\n";
print "</form>\n";
print "</div>\n";

$data = $form->get_data();
$def = $data['elements'];

// save data to database (or - in this example - print to stdout)
print "<div id='preview' class='struct'>\n";
print "This is what the form will look like:\n";

print "<form id='form_test'>\n";

$ex=new form("form_test", $def);
print $ex->show();

print "</form>\n";
print "</div>\n";

print "<div id='definition' class='struct'>\n";
print "Form definition:<pre>\n";
print_r($def);
print "</pre>\n";
print "</div>\n";

?>
</body>
</html>
