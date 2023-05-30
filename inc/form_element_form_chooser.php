<?php
class form_element_form_chooser extends form_element {
  public $changed_count;

  function __construct($id, $def, $options, $form_parent) {
    parent::__construct($id, $def, $options, $form_parent);
    $this->changed_count=false;

    $this->build_form(true);
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
      $errors[] = lang('form_element_form_chooser:error_min', 0, $this->def['min']);
    }

    if(isset($this->def['max']) && (sizeof($this->elements) > $this->def['max'])) {
      $errors[] = lang('form_element_form_chooser:error_max', 0, $this->def['max']);
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

    foreach($this->available_elements as $k=>$element) {
      if (!array_key_exists($k, $this->elements)) {
        if (array_key_exists('non_used_value', $element->def)) {
          $data[$k] = $element->def['non_used_value'];
        }
      }
    }

    if (array_key_exists('result_keep_order', $this->def) && $this->def['result_keep_order']) {
      $d = array();
      foreach ($this->def['def'] as $k => $v) {
        if (array_key_exists($k, $data)) {
          $d[$k] = $data[$k];
        }
      }
      $data = $d;
    }

    if(!sizeof($data))
      return array_key_exists('empty_value', $this->def) ?
        $this->def['empty_value'] : null;

    return $data;
  }

  function set_data($data) {
    $this->data=$data;

    if ($data) {
      foreach ($data as $k => $d) {
        if (!array_key_exists($k, $this->elements)) {
          $this->add_element($k);
        }

        if (array_key_exists($k, $this->elements)) {
          $this->elements[$k]->set_data($d);
        }
      }

      $this->reorder(array_keys($data));
    }

    foreach ($this->elements as $k => $element) {
      if (!$data || !array_key_exists($k, $data)) {
        $this->remove_element($k);
      }
    }

    unset($this->data);
  }

  function reorder ($keys) {
    uksort($this->elements, function ($a, $b) use ($keys) {
      return array_search($a, $keys) <=> array_search($b, $keys);
    });
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
    if(isset($this->data['__preset'])) {
      if ($k = $this->data['__preset']) {
        $preset = $k;
        $ret = false;
      }
      unset($this->data['__preset']);
    }
    if(isset($this->data['__placeholder'])) {
      $placeholder=$this->data['__placeholder'];
      $order = array();
      foreach ($placeholder as $k => $d) {
        $order[$k] = $this->data[$k] ?? null;
      }
      $this->data = $order;
    }

    if ($this->data) {
      foreach ($this->data as $k => $d) {
        if (!array_key_exists($k, $this->elements)) {
          $this->add_element($k);
        }
      }
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

    if (isset($preset)) {
      $this->set_data($this->def['presets'][$preset]['value']);
      $this->changed_count=true;
    }

    if (isset($new)) {
      $this->add_element($new);
      $this->changed_count=true;
    }

    unset($this->data);

    return $ret;
  }

  function set_orig_data($data) {
    if ((!isset($data)) || (!is_array($data))) {
      $data=array();
    }

    foreach ($this->available_elements as $k => $element) {
      if (array_key_exists($k, $data)) {
        $element->set_orig_data($data[$k]);
      } else {
        $element->set_orig_data(null);
      }
    }

    $this->orig_data_elements = array_keys($data);
  }

  function get_orig_data() {
    $ret = array();

    if (!isset($this->orig_data_elements)) {
      return array();
    }

    foreach ($this->orig_data_elements as $k) {
      if (array_key_exists($k, $this->available_elements)) {
        $ret[$k] = $this->available_elements[$k]->get_orig_data();
      }
    }

    return $ret;
  }

  function build_form($show_default=false) {
    $this->elements=array();
    $this->available_elements=array();

    if (!$this->data) {
      $this->data = array();
    }

    $this->def['def'] = weight_sort($this->def['def']);

    foreach ($this->def['def'] as $k => $def) {
      $element_def = $def;
      $element_class = get_form_element_class($element_def);
      $element_id = "{$this->id}_{$k}";
      $element_options = $this->options;
      $element_options['var_name'] = form_build_child_var_name($this->options, $k);

      if (class_exists($element_class)) {
        $this->available_elements[$k] = new $element_class($element_id, $element_def, $element_options, $this);
      } else {
      }

      if ($show_default && array_key_exists('show_default', $def) && $def['show_default']) {
        $this->add_element($k);
      }
    }
  }
  function add_element ($k) {
    if (array_key_exists($k, $this->elements)) {
      return false;
    }

    if (!array_key_exists($k, $this->available_elements)) {
      trigger_error("{$this->id} - add_element: \"{$k}\" not found", E_USER_WARNING);
      return;
    }

    $this->elements[$k] = $this->available_elements[$k];
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
    $tr->setAttribute("class", $tr->getAttribute("class") . " form_element_form_chooser_part_element form_element_{$element->type()} form_element_form_chooser_{$order}_{$removeable}");

    // Actions #k
    $el_div=$document->createElement("td");
    $el_div->setAttribute("form_element_num", $k);
    $el_div->setAttribute("class", "form_element_form_chooser_part_element_actions");
    $tr->appendChild($el_div);

    $input=$document->createElement("input");
    $input->setAttribute("type", "hidden");
    $input->setAttribute("name", "{$this->options['var_name']}[__placeholder][{$k}]");
    $input->setAttribute("value", "");
    $el_div->appendChild($input);

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
    $this->dom_table->setAttribute('class', 'form_element_form_chooser_table');
    $this->dom_table->setAttribute('id', $this->id);
    $div->appendChild($this->dom_table);

    $this->dom_table_body = $document->createElement('tbody');
    $this->dom_table->appendChild($this->dom_table_body);

    foreach($this->elements as $k=>$element) {
      $part_div=$this->show_element_part($k, $element, $document);
      $this->dom_table_body->appendChild($part_div);
    }

    $el_div=$document->createElement("div");
    $el_div->setAttribute("class", "form_element_form_chooser_actions");
    $div->appendChild($el_div);

    $input = $document->createElement('select');
    $input->setAttribute("name", "{$this->options['var_name']}[__new]");
    $input->setAttribute("class", "form_element_form_chooser_action_add");

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

    foreach ($this->available_elements as $k => $element) {
      $option = $document->createElement('option');
      $option->setAttribute('value', $k);

      if (array_key_exists($k, $this->elements)) {
        $option->setAttribute('disabled', 'true');
      }

      $option->appendChild($document->createTextNode($element->name()));
      $input->appendChild($option);
    }

    $el_div->appendChild($input);

    $this->show_preset($document, $el_div);

    $input = $document->createElement('input');
    $input->setAttribute('type', 'submit');
    $input->setAttribute('value', lang('ok'));
    $el_div->appendChild($input);

    if (sizeof($this->def['def']) == sizeof($this->elements)) {
      $el_div->setAttribute('class', $el_div->getAttribute('class') . ' reached_max');
    }

    return $div;
  }

  function show_preset ($document, $el_div) {
    $input = $document->createElement('select');
    $input->setAttribute("name", "{$this->options['var_name']}[__preset]");
    $input->setAttribute("class", "form_element_form_chooser_action_preset");

    $option = $document->createElement('option');
    $option->setAttribute('value', '');
    $option->setAttribute('selected', 'true');

    if(array_key_exists("presets:label", $this->def)) {
      if(is_array($this->def['presets:label']))
        $option->appendChild($document->createTextNode(lang($this->def['presets:label'])));
      else
        $option->appendChild($document->createTextNode($this->def['presets:label']));
    }
    else
      $option->appendChild($document->createTextNode(lang("form:load_preset")));
    $input->appendChild($option);

    foreach ($this->def['presets'] as $k => $def) {
      $option = $document->createElement('option');
      $option->setAttribute('value', $k);

      $option->appendChild($document->createTextNode($def['name']));
      $input->appendChild($option);
    }

    $el_div->appendChild($input);
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

  function check_required(&$errors, $param, $no_path=0) {
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
