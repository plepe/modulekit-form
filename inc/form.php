<?php
class form {
  public $def;
  public $id;
  public $options;

  function __construct($id, $def, $options=array()) {
    if(!$id) {
      $id = "_"; // TODO: check if id is unique?
      $options['var_name'] = "";
    }

    $this->id=$id;
    $this->def=$def;
    form_process_def($this->def);
    $this->options=$options;
    if(!isset($this->options['var_name']))
      $this->options['var_name']=$this->id;

    $this->build_form();

    $this->has_data=false;
    if($this->options['var_name'] === '') {
      if(sizeof($_REQUEST)||sizeof($_FILES))
	$this->set_request_data($_REQUEST);
    }
    else {
      if(isset($_REQUEST[$this->options['var_name']])||sizeof($_FILES))
	$this->set_request_data($_REQUEST[$this->options['var_name']]);
    }

    $this->has_orig_data=false;
    if(isset($_REQUEST['form_orig_'.$this->options['var_name']])) {
      $orig_data=json_decode($_REQUEST['form_orig_'.$this->options['var_name']], true);
      $this->set_orig_data($orig_data);
    }
  }

  function build_form() {
    $def=array(
      'type'	=>'form',
      'def'	=>$this->def,
    );
    $this->element=new form_element_form($this->id, $def, $this->options, $this);
  }

  function get_data() {
    return $this->element->get_data();
  }

  function set_data($data) {
    $this->element->set_data($data);

    if((!$this->has_data)&&(!$this->has_orig_data))
      $this->set_orig_data($data);

    $this->has_data=true;

    $this->refresh();
  }

  function set_request_data($data) {
    // if an empty var_name is used, check if any of the element keys has been
    // set in $_REQUEST
    if($this->options['var_name'] === '') {
      foreach($this->element->elements as $k=>$element) {
	if(array_key_exists($k, $_REQUEST))
	  $this->has_data = true;
      }

      if(!$this->has_data)
	return;
    }

    $this->has_data=true;

    if(!array_key_exists("show_errors", $this->options))
      $this->options['show_errors']=true;

    $this->options['complete'] = $this->element->set_request_data($data);
  }

  function set_orig_data($data) {
    $this->has_orig_data=true;

    $this->element->set_orig_data($data);

    $this->refresh();
  }

  function get_orig_data() {
    if(!$this->has_orig_data)
      return $this->get_data();

    return $this->element->get_orig_data();
  }

  function errors() {
    $errors=array();

    $this->element->all_errors($errors);

    if(!sizeof($errors))
      return false;

    return $errors;
  }

  function is_empty() {
    return !$this->has_data;
  }

  function clear() {
    $this->has_data = false;
  }

  function is_complete() {
    if(!$this->has_data)
      return false;

    if($this->errors())
      return false;

    if((!array_key_exists('complete', $this->options)) ||
       (!$this->options['complete']))
      return false;

    return $this->element->is_complete();
  }

  function show_errors() {
    $this->options['show_errors']=true;

    return "";
  }

  function reset() {
    $this->has_orig_data=false;
    $this->has_data=false;
    //return form_reset($this->def, $this->data, $this->options['var_name']);
  }

  // save_data() is like get_data(), but calls save_data() on all elements
  // (e.g. to save temporary files to disk and resets "orig data" to the new
  // state
  function save_data() {
    $this->has_orig_data=false;

    $this->element->save_data();
    $data=$this->get_data();
    $this->element->set_orig_data($data);

    return $data;
  }

  function is_modified() {
    return $this->element->is_modified();
  }

  function show() {
    $document=new DOMDocument();

    $div=$this->element->show_element($document);
    $document->appendChild($div);

    $orig_data=$this->get_orig_data();

    if($this->has_orig_data) {
      if(array_key_exists('orig_data', $this->options) && $this->options['orig_data'] === false) {
	$input_orig_data = $document->createElement("script");
	$input_orig_data->setAttribute("type", "text/javascript");
	$input_orig_data->appendChild($document->createTextNode("\nvar form_orig_{$this->options['var_name']}=". json_encode($orig_data) .";\n"));
	$document->appendChild($input_orig_data);
      }
      else {
	$input_orig_data=$document->createElement("input");
	$input_orig_data->setAttribute("type", "hidden");
	$input_orig_data->setAttribute("name", "form_orig_{$this->options['var_name']}");
	$input_orig_data->setAttribute("value", json_encode($orig_data));
      }

      $document->appendChild($input_orig_data);
    }

    $ret="";

    // Include a hidden submit button as default action, to prevent that other submit buttons (e.g. for removing/adding elements in array elements) get precedence for default submit actions (e.g. user presses enter)
    $ret.="<div style='width: 0px; height: 0px; overflow: hidden'><input type='submit'></div>\n";

    // render the form
    $ret.=$document->saveHTML();

    // create javascript representation of form
    $ret.="<script type='text/javascript'>\n";
    $ret.="if(typeof form !== 'undefined') {\n";
    $ret.="  var form_{$this->id}=\n";
    $ret.="    new form(\"{$this->id}\", ".json_encode($this->def).", ".json_encode($this->options).");\n";
    $ret.="}\n";
    $ret.="</script>\n";

    return $ret;
  }

  function refresh($force=false) {
    $this->element->refresh($force);
  }
}

function form_process_def(&$def) {
  foreach($def as $k=>$element_def) {
    if(isset($element_def['count'])&&(!in_array($element_def['type'], array("array", "hash")))) {
      $def[$k]=$element_def['count'];

      if(!is_array($def[$k])) {
	$def[$k] = array(
	  "default"	=> $def[$k],
	  "max"	=> $def[$k],
	);
      }

      $def[$k]['type']="array";

      if(isset($element_def['name']))
	$def[$k]['name']=$element_def['name'];
      if(isset($element_def['desc']))
	$def[$k]['desc']=$element_def['desc'];

      unset($element_def['name']);
      unset($element_def['desc']);
      unset($element_def['count']);

      $def[$k]['def']=$element_def;
    }

    if((($element_def['type']=="array")||($element_def['type']=="form"))&&
      isset($def[$k]['def']['def']))
	form_process_def($def[$k]['def']['def']);
  }
}
