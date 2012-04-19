<?
class form_element_array extends form_element {
  function __construct($id, $def, $options) {
    parent::__construct($id, $def, $options);

    $this->build_form();
  }

  function get_data() {
    $data=array();
    foreach($this->elements as $k=>$element) {
      $data[$k]=$element->get_data();
    }

    return $data;
  }

  function set_data($data) {
    $this->data=$data;
    $this->build_form();

    foreach($this->elements as $k=>$element) {
      if(isset($data[$k]))
	$element->set_data($data[$k]);
      else
	$element->set_data(null);
    }

    unset($this->data);
  }

  function set_orig_data($data) {
    $this->orig_data=$data;

    $element_class="form_element_{$this->def['def']['type']}";
    $element_def=$this->def['def'];

    foreach($data as $k=>$v) {
      if(!isset($this->elements[$k])) {
	$element_id="{$this->id}_{$k}";
	$element_options=$this->options;
	$element_options['var_name']="{$this->options['var_name']}[{$k}]";

	if(class_exists($element_class)) {
	  $this->elements[$k]=new $element_class($element_id, $element_def, $element_options);
	}
      }

      $this->elements[$k]->set_orig_data($v);
    }
  }

  function get_orig_data($data) {
    return $this->orig_data;
  }

  function build_form() {
    $this->elements=array();

    $data=array_fill(0, $this->def['count']['default'], null);
    if(isset($this->data))
      $data=$this->data;

    $element_class="form_element_{$this->def['def']['type']}";
    $element_def=$this->def['def'];
    foreach($data as $k=>$v) {
      $element_id="{$this->id}_{$k}";
      $element_options=$this->options;
      $element_options['var_name']="{$this->options['var_name']}[{$k}]";

      if(class_exists($element_class)) {
	$this->elements[$k]=new $element_class($element_id, $element_def, $element_options);
      }
    }
  }

  function show_element() {
    $ret="";

    foreach($this->elements as $k=>$element) {
      $ret.="<div>\n";
      $ret.=$element->show_element();
      $ret.="</div>\n";
    }

    return $ret;
  }
}
