<?
include "form_element.php";
include "form_element_text.php";
include "form_element_array.php";
include "form_element_radio.php";
include "form_element_checkbox.php";

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

    if($_REQUEST[$this->options['var_name']])
      $this->set_data(form_get_data($this->def, $_REQUEST[$this->options['var_name']]));
  }

  function build_form() {
    $this->elements=array();

    foreach($this->def as $k=>$element_def) {
      $element_class="form_element_{$element_def['type']}";
      $element_id="{$this->id}_{$k}";
      $element_options=$this->options;
      $element_options['var_name']="{$this->options['var_name']}[{$k}]";

      if(class_exists($element_class)) {
	$this->elements[$k]=new $element_class($element_id, $element_def, $element_options);
      }
    }
  }

  function get_data() {
    $data=array();
    foreach($this->elements as $k=>$element) {
      $data[$k]=$element->get_data();
    }

    return $data;
  }

  function set_data($data) {
    foreach($this->elements as $k=>$element) {
      if(isset($data[$k]))
	$element->set_data($data[$k]);
      else
	$element->set_data(null);
    }
  }

  function errors() {
    return form_check($this->def, $this->data);
  }

  function show_errors() {
    return form_print_errors($this->errors());
  }

  function reset() {
    return form_reset($this->def, $this->data, $this->options['var_name']);
  }

  function show() {
    $ret ="<table id='{$this->id}' class='form'>\n";

    foreach($this->elements as $k=>$element) {
      $ret.=$element->show();
    }

    $ret.="</table>\n";

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
