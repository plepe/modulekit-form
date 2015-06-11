<?php
function form_template_editor() {
  $form_types=array();
  foreach(get_declared_classes() as $cls) {
    if(preg_match("/^form_element_(.*)$/", $cls, $m))
      $form_types[$m[1]]=$m[1];
  }

  $has_values = array("check", "type", array("or", array("is", "radio"), array("is", "select"), array("is", "checkbox"), array("is", "text"), array("is", "autocomplete"), array("is", "keywords")));

  $ret = array(
    'fields'	=>array(
      'name'	=>"Fields",
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
	  ),
	  'type'	=>array(
	    'name'	=>"Type",
	    'type'	=>"select",
	    'values'	=>$form_types,
	    'default'     =>'text',
	  ),
	  'values'	=>array(
	    'name'	=>"Values",
	    'type'	=>"hash",
	    'def'	=>array(
	      'name'	=>lang('form:hash_value_field_name'),
	      'type'	=>"text",
	    ),
	    'default'=>0,
	    'button:add_element' => "Add value",
	    'show_depend'=>$has_values,
	    // 'include_data'=>array('and', array('not_empty'), $has_values),
	    'include_data'=>$has_values,
	  ),
	),
      ),
    ),
  );

  return $ret;
}
