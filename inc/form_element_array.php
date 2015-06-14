<?php
class form_element_array extends form_element {
  public $changed_count;

  function __construct($id, $def, $options, $form_parent) {
    parent::__construct($id, $def, $options, $form_parent);
    $this->changed_count=false;

    $this->build_form();
  }

  function is_complete() {
    if($this->changed_count)
      return false;

    foreach($this->elements as $k=>$element) {
      if(!$element->is_complete())
	return false;
    }

    return true;
  }

  function all_errors(&$errors) {
    parent::all_errors($errors);

    foreach($this->elements as $k=>$element) {
      $element->all_errors($errors);
    }
  }

  function get_data() {
    $data=array();
    foreach($this->elements as $k=>$element) {
      if($element->include_data())
	$data[$k]=$element->get_data();
    }

    if(!sizeof($data))
      return array_key_exists('empty_value', $this->def) ?
        $this->def['empty_value'] : null;

    return $data;
  }

  function set_data($data) {
    $this->data=$data;
    $this->build_form();

    if($data&&is_array($data))
      foreach($data as $k=>$d) {
	if(isset($this->elements[$k]))
	  $this->elements[$k]->set_data($d);
      }

    unset($this->data);
  }

  function set_request_data($data) {
    $ret = true;

    // request data empty? -> empty array
    if($data === null) {
      $data = array();
    }

    $this->data=$data;
    if(isset($this->data['__new'])) {
      unset($this->data['__new']);
      $this->data[]=null;
      $this->changed_count=true;
      $ret = false;
    }
    if(isset($this->data['__remove'])) {
      $remove=$this->data['__remove'];
      unset($this->data['__remove']);
      $ret = false;
    }
    if(isset($this->data['__order_up'])) {
      $order_up=$this->data['__order_up'];
      unset($this->data['__order_up']);
      $ret = false;
    }
    if(isset($this->data['__order_down'])) {
      $order_down=$this->data['__order_down'];
      unset($this->data['__order_down']);
      $ret = false;
    }

    $this->build_form();

    if(isset($order_up)) {
      foreach($order_up as $i=>$dummy) {
	$keys=array_keys($this->data);
	$elements=array_values($this->elements);
	$pos=array_search($i, $keys);

	$keys=array_merge(
	  array_slice($keys, 0, $pos-1),
	  array_slice($keys, $pos, 1),
	  array_slice($keys, $pos-1, 1),
	  array_slice($keys, $pos+1)
	);
	$elements=array_merge(
	  array_slice($elements, 0     , $pos-1),
	  array_slice($elements, $pos  , 1),
	  array_slice($elements, $pos-1, 1),
	  array_slice($elements, $pos+1)
	);

	$this->elements=array_combine($keys, $elements);
      }
    }

    if(isset($order_down)) {
      foreach($order_down as $i=>$dummy) {
	$keys=array_keys($this->data);
	$elements=array_values($this->elements);
	$pos=array_search($i, $keys);

	$keys=array_merge(
	  array_slice($keys, 0     , $pos),
	  array_slice($keys, $pos+1, 1),
	  array_slice($keys, $pos  , 1),
	  array_slice($keys, $pos+2)
	);
	$elements=array_merge(
	  array_slice($elements, 0     , $pos),
	  array_slice($elements, $pos+1, 1),
	  array_slice($elements, $pos  , 1),
	  array_slice($elements, $pos+2)
	);

	$this->elements=array_combine($keys, $elements);
      }
    }

    foreach($this->elements as $k=>$element) {
      if(!isset($data[$k]))
	$data[$k] = null;

      $r = $element->set_request_data($data[$k]);

      if($r === false)
	$ret = false;
    }

    if(isset($remove)) {
      foreach($remove as $k=>$dummy) {
	unset($this->data[$k]);
	unset($this->elements[$k]);
      }
      $this->changed_count=true;
    }

    unset($this->data);

    return $ret;
  }

  function set_orig_data($data) {
    if((!isset($data))||(!is_array($data)))
      $data=array();
    $this->orig_data=$data;

    foreach($data as $k=>$v) {
      if(isset($this->elements[$k])) {
	$this->elements[$k]->set_orig_data($v);
      }
    }
  }

  function get_orig_data() {
    return $this->orig_data;
  }

  function build_form() {
    $this->elements=array();

    $data = array();
    if($this->def['default'] > 0)
      $data=array_fill(0, $this->def['default'], null);

    if(isset($this->data)&&is_array($this->data))
      $data=$this->data;

    $element_class=get_form_element_class($this->def['def']);
    $element_def=$this->def['def'];
    foreach($data as $k=>$v) {
      $element_id="{$this->id}_{$k}";
      $element_options=$this->options;
      $element_options['var_name']="{$this->options['var_name']}[{$k}]";
      $element_def['_name']="#".(sizeof($this->elements)+1);

      $this->elements[$k]=new $element_class($element_id, $element_def, $element_options, $this);
    }
  }

  function show_element_part($k, $element, $document) {
    $order = ((!array_key_exists("order", $this->def)) || ($this->def['order'] == true)) ? "order": "no_order";

    // wrapper #k
    $div=$document->createElement("div");
    $div->setAttribute("form_element_num", $k);
    $div->setAttribute("class", "form_element_array_part");

    // element #k
    $el_div=$document->createElement("span");
    $el_div->setAttribute("form_element_num", $k);
    $el_div->setAttribute("class", "form_element_array_part_element form_element_{$element->type()} form_element_array_{$order}");
    $div->appendChild($el_div);

    $el_div->appendChild($element->show_element($document));

    // errors #k
    $el_div->appendChild($element->show_div_errors($document));

    // Actions #k
    $el_div=$document->createElement("span");
    $el_div->setAttribute("form_element_num", $k);
    $el_div->setAttribute("class", "form_element_array_part_element_actions");
    $div->appendChild($el_div);

    if($order == "order") {
      $input=$document->createElement("input");
      $input->setAttribute("type", "submit");
      $input->setAttribute("name", "{$this->options['var_name']}[__order_up][{$k}]");
      $input->setAttribute("value", "↑");
      $el_div->appendChild($input);

      $input=$document->createElement("input");
      $input->setAttribute("type", "submit");
      $input->setAttribute("name", "{$this->options['var_name']}[__order_down][{$k}]");
      $input->setAttribute("value", "↓");
      $el_div->appendChild($input);
    }

    $input=$document->createElement("input");
    $input->setAttribute("type", "submit");
    $input->setAttribute("name", "{$this->options['var_name']}[__remove][{$k}]");
    $input->setAttribute("value", "X");
    $el_div->appendChild($input);

    return $div;
  }

  function show_element($document) {
    $div=parent::show_element($document);

    foreach($this->elements as $k=>$element) {
      $part_div=$this->show_element_part($k, $element, $document);
      $div->appendChild($part_div);
    }

    $el_div=$document->createElement("div");
    $el_div->setAttribute("class", "form_element_array_actions");
    $div->appendChild($el_div);

    $input=$document->createElement("input");
    $input->setAttribute("type", "submit");
    $input->setAttribute("name", "{$this->options['var_name']}[__new]");
    if(array_key_exists("button:add_element", $this->def)) {
      if(is_array($this->def['button:add_element']))
        $input->setAttribute("value", lang($this->def['button:add_element']));
      else
        $input->setAttribute("value", $this->def['button:add_element']);
    }
    else
      $input->setAttribute("value", lang("form:add_element"));
    $el_div->appendChild($input);

    if(isset($this->def['max']) && (sizeof($this->elements) >= $this->def['max'])) {
      $input->setAttribute("class", "reached_max");
    }

    return $div;
  }

  function save_data() {
    parent::save_data();

    foreach($this->elements as $k=>$element) {
      $element->save_data();
    }
  }

  function is_modified() {
    $orig_data=$this->get_orig_data();

    foreach($this->elements as $k=>$element) {
      // new key, was not present in orig_data
      if(!isset($orig_data[$k]))
	return true;

      // data of sub-elements were changed
      if($element->is_modified())
	return true;
    }

    foreach($orig_data as $k=>$v) {
      // key has been removed
      if(!isset($this->elements[$k]))
	return true;
    }

    return false;
  }

  function check_required(&$errors, $param) {
    if($this->required()) {
      if(sizeof($this->elements))
        return;

      if(sizeof($param)<2)
        $errors[]=lang('form:require_value');
      else
        $errors[]=$param[1];
    }
  }

  function refresh($force=false) {
    parent::refresh($force);

    foreach($this->elements as $k=>$element) {
      $element->refresh($force);
    }
  }
}
