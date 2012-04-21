<?
include "form_element.php";
include "form_element_text.php";
include "form_element_array.php";
include "form_element_radio.php";
include "form_element_checkbox.php";

function form_include() {
  ?>
<link rel='stylesheet' type='text/css' href='inc/form.css'>
<script type='text/javascript' src='inc/functions.js'></script>
<script type='text/javascript' src='inc/form.js'></script>
<script type='text/javascript' src='inc/form_element.js'></script>
<script type='text/javascript' src='inc/form_element_text.js'></script>
<script type='text/javascript' src='inc/form_element_array.js'></script>
  <?
}

class form {
  public $def;
  public $id;
  public $options;

  function __construct($id, $def, $options=array()) {
    $this->id=$id;
    $this->def=$def;
    form_process_def($this->def);
    $this->options=$options;
    if(!$this->options['var_name'])
      $this->options['var_name']=$this->id;

    $this->build_form();

    $this->has_data=false;
    if($_REQUEST[$this->options['var_name']])
      $this->set_request_data($_REQUEST[$this->options['var_name']]);

    $this->has_orig_data=false;
    if(isset($_REQUEST['form_orig_'.$this->options['var_name']])) {
      $orig_data=json_decode($_REQUEST['form_orig_'.$this->options['var_name']], true);
      $this->set_orig_data($orig_data);
    }
  }

  function build_form() {
    $this->elements=array();

    foreach($this->def as $k=>$element_def) {
      $element_class="form_element_{$element_def['type']}";
      $element_id="{$this->id}_{$k}";
      $element_options=$this->options;
      $element_options['var_name']="{$this->options['var_name']}[{$k}]";

      if(class_exists($element_class)) {
	$this->elements[$k]=new $element_class($element_id, $element_def, $element_options, null);
      }
    }
  }

  function get_data() {
    if(!$this->has_data)
      return null;

    $data=array();
    foreach($this->elements as $k=>$element) {
      $data[$k]=$element->get_data();
    }

    return $data;
  }

  function set_data($data) {
    $this->has_data=true;

    foreach($this->elements as $k=>$element) {
      if(isset($data[$k]))
	$element->set_data($data[$k]);
      else
	$element->set_data(null);
    }
  }

  function set_request_data($data) {
    $this->has_data=true;

    foreach($this->elements as $k=>$element) {
      if(isset($data[$k]))
	$element->set_request_data($data[$k]);
      else
	$element->set_request_data(null);
    }
  }

  function set_orig_data($data) {
    $this->has_orig_data=true;

    foreach($this->elements as $k=>$element) {
      if(isset($data[$k]))
	$element->set_orig_data($data[$k]);
      else
	$element->set_orig_data(null);
    }
  }

  function get_orig_data() {
    if(!$this->has_orig_data)
      return $this->get_data();

    $data=array();
    foreach($this->elements as $k=>$element) {
      $data[$k]=$element->get_orig_data();
    }

    return $data;
  }

  function errors() {
    $errors=array();

    if(!$this->has_data)
      return false;

    foreach($this->elements as $k=>$element) {
      if(!$element->is_complete())
	return false;
    }

    foreach($this->elements as $k=>$element) {
      $data[$k]=$element->errors(&$errors);
    }

    if(!sizeof($errors))
      return false;
    return $errors;
  }

  function is_empty() {
    return !$this->has_data;
  }

  function is_complete() {
    if(!$this->has_data)
      return false;

    if($this->errors())
      return false;

    foreach($this->elements as $k=>$element) {
      if(!$element->is_complete())
	return false;
    }

    return true;
  }

  function show_errors($errors) {
    if(!$errors)
      $errors=$this->errors();

    $ret="";

    $ret.="<ul class='form_errors'>\n";
    foreach($errors as $e) {
      $ret.="  <li> $e</li>\n";
    }
    $ret.="</ul>\n";

    return $ret;
  }

  function reset() {
    $this->has_orig_data=false;
    //return form_reset($this->def, $this->data, $this->options['var_name']);
  }

  function show() {
    $ret ="<table id='{$this->id}' class='form'>\n";

    $orig_data=$this->get_orig_data();

    $ret.="<input type='hidden' name='form_orig_{$this->options['var_name']}' value=\"".htmlspecialchars(json_encode($orig_data))."\">";
    foreach($this->elements as $k=>$element) {
      $ret.=$element->show();
    }

    $ret.="</table>\n";

    $ret.="<script type='text/javascript'>\n";
    $ret.="var form_{$this->id}=new form(\"{$this->id}\", ".json_encode($this->def).", ".json_encode($this->options).");\n";
    $ret.="</script>\n";

    return $ret;
  }
}

function form_process_def(&$def) {
  foreach($def as $k=>$element_def) {
    if(isset($element_def['count'])) {
      $def[$k]=array(
        'name'		=>$element_def['name'],
	'desc'		=>$element_def['desc'],
	'type'		=>"array",
	'count'		=>$element_def['count'],
      );
      unset($element_def['name']);
      unset($element_def['desc']);
      unset($element_def['count']);
      $def[$k]['def']=$element_def;
    }
  }
}
