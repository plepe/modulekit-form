<?php
class form_element_filters extends form_element {
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

  function errors(&$errors) {
    parent::errors($errors);

    if(isset($this->def['min']) && (sizeof($this->elements) < $this->def['min'])) {
      $errors[] = lang('form_element_filters:error_min', 0, $this->def['min']);
    }

    if(isset($this->def['max']) && (sizeof($this->elements) > $this->def['max'])) {
      $errors[] = lang('form_element_filters:error_max', 0, $this->def['max']);
    }
  }

  function get_data() {
    $data=array();
    foreach($this->elements as $k=>$element) {
      $d = $element->get_data();

      if((isset($this->def['exclude_null_values']) && ($this->def['exclude_null_values'])) && ($d === null))
	continue;

      if($element->include_data())
	$data[$k] = $d;
    }

    if(!sizeof($data))
      return array_key_exists('empty_value', $this->def) ?
        $this->def['empty_value'] : null;

    return $data;
  }

  function set_data($data) {
    $this->data=$data;

    if ($data)
      foreach ($data as $k => $d) {
        if (!array_key_exists($k, $this->elements)) {
          $this->create_element($k);
        }

        $this->elements[$k]->set_data($d);
      }

    foreach ($this->elements as $k => $element) {
      if (!$data || !array_key_exists($k, $data)) {
        $this->remove_element($k);
      }
    }

    unset($this->data);
  }

  function set_request_data($data) {
    $ret = true;

    $this->build_form();

    // request data empty? -> empty array
    if($data === null) {
      $data = array();
    }

    $this->data=$data;
    if(isset($this->data['__new'])) {
      if ($k = $this->data['__new']) {
        $new = $k;
        $ret = false;
      }
      unset($this->data['__new']);
    }
    if(isset($this->data['__remove'])) {
      $remove = $this->data['__remove'];
      foreach ($remove as $k => $d) {
        unset($this->data[$k]);
      }
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

    if ($this->data)
      foreach ($this->data as $k => $d) {
        if (!array_key_exists($k, $this->elements)) {
          $this->create_element($k);
        }

        $this->elements[$k]->set_data($d);
      }

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

    if (isset($new)) {
      $this->create_element($new);
      $this->changed_count=true;
    }

    unset($this->data);

    return $ret;
  }

  function set_orig_data($data) {
    // TODO!
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

    if (!$this->data) {
      $this->data = array();
    }
  }

  function create_element ($k) {
    $element_def = $this->def['def'][$k];
    $element_class = get_form_element_class($element_def);
    $element_id = "{$this->id}_{$k}";
    $element_options = $this->options;
    $element_options['var_name'] = "{$element_options['var_name']}[{$k}]";

    if (class_exists($element_class)) {
      $this->elements[$k] = new $element_class($element_id, $element_def, $element_options, $this);
    } else {
    }
  }

  function remove_element ($k) {
    unset($this->elements[$k]);
  }

  function show_element_part($k, $element, $document) {
    $order = ((!array_key_exists("order", $this->def)) || ($this->def['order'] == true)) ? "order": "no_order";
    $removeable = ((!array_key_exists("removeable", $this->def)) || ($this->def['removeable'] !== false)) ? "removeable" : "not_removeable";

    // element #k
    $tr = $element->show($document);

    $tr->setAttribute("form_element_num", $k);
    $tr->setAttribute("class", $tr->getAttribute("class") . " form_element_filters_part_element form_element_{$element->type()} form_element_filters_{$order}_{$removeable}");

    // Actions #k
    $el_div=$document->createElement("td");
    $el_div->setAttribute("form_element_num", $k);
    $el_div->setAttribute("class", "form_element_filters_part_element_actions");
    $tr->appendChild($el_div);

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

    if ($removeable === 'removeable') {
      $input=$document->createElement("input");
      $input->setAttribute("type", "submit");
      $input->setAttribute("name", "{$this->options['var_name']}[__remove][{$k}]");
      $input->setAttribute("value", "X");
      $el_div->appendChild($input);
    }

    return $tr;
  }

  function show_element($document) {
    $div=parent::show_element($document);

    $this->dom_table = $document->createElement('table');
    $this->dom_table->setAttribute('class', 'form_element_filters_table');
    $div->appendChild($this->dom_table);

    foreach($this->elements as $k=>$element) {
      $part_div=$this->show_element_part($k, $element, $document);
      $this->dom_table->appendChild($part_div);
    }

    $el_div=$document->createElement("div");
    $el_div->setAttribute("class", "form_element_filters_actions");
    $div->appendChild($el_div);

    $input = $document->createElement('select');
    $input->setAttribute("name", "{$this->options['var_name']}[__new]");
    $input->setAttribute("class", "form_element_filters_action_add");

    $option = $document->createElement('option');
    $option->setAttribute('value', '');
    $option->setAttribute('selected', 'true');

    if(array_key_exists("button:add_element", $this->def)) {
      if(is_array($this->def['button:add_element']))
        $option->appendChild($document->createTextNode(lang($this->def['button:add_element'])));
      else
        $option->appendChild($document->createTextNode($this->def['button:add_element']));
    }
    else
      $option->appendChild($document->createTextNode(lang("form:add_element")));
    $input->appendChild($option);

    foreach ($this->def['def'] as $k => $element_def) {
      $option = $document->createElement('option');
      $option->setAttribute('value', $k);

      if (array_key_exists($k, $this->elements)) {
        $option->setAttribute('disabled', 'true');
      }

      $option->appendChild($document->createTextNode($element_def['name'] . ""));
      $input->appendChild($option);
    }

    $el_div->appendChild($input);

    $input = $document->createElement('input');
    $input->setAttribute('type', 'submit');
    $input->setAttribute('value', lang('ok'));
    $el_div->appendChild($input);

    if (sizeof($this->def['def']) == sizeof($this->elements)) {
      $el_div->setAttribute('class', $el_div->getAttribute('class') . ' reached_max');
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
