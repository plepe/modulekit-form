<?php
class form_element_grid extends form_element {
  function type() {
    return "grid";
  }

  function __construct($id, $def, $options, $form_parent) {
    parent::__construct($id, $def, $options, $form_parent);

    $this->build_form();
  }

  function path_name() {
    if($this->form_parent===null)
      return null;

    return parent::path_name();
  }

  function build_form() {
    $this->elements = array();
    $this->headers = array();

    foreach($this->def['def'] as $k => $element_def) {
      $element_class = get_form_element_class($element_def);

      $element_id = "{$this->id}_head_{$k}";
      $element_options=$this->options;
      if($this->options['var_name'])
	$element_options['var_name']="{$this->options['var_name']}[head_{$k}]";
      else
	$element_options['var_name']="head_{$k}";

      $this->headers[$k]=new $element_class($element_id, $element_def, $element_options, $this);
    }

    $data = array();
    if(array_key_exists('default', $this->def) && $this->def['default'] > 0)
      $data=array_fill(0, $this->def['default'], null);

    if(isset($this->data)&&is_array($this->data))
      $data=$this->data;

    $this->elements = array();
    foreach ($data as $n => $row) {
      $this->elements[$n] = array();

      foreach($this->def['def'] as $k => $element_def) {
        $element_class = get_form_element_class($element_def);

        $element_id = "{$this->id}_{$n}_{$k}";
        $element_options=$this->options;
        if($this->options['var_name'])
          $element_options['var_name']="{$this->options['var_name']}[{$n}][{$k}]";
        else
          $element_options['var_name']="{$n}_{$k}";

        $this->elements[$n][$k] = new $element_class($element_id, $element_def, $element_options, $this);
      }
    }
  }

  function get_data() {
    $data=array();
    foreach($this->elements as $n => $row) {
      foreach ($row as $k => $element) {
        if($element->include_data())
          $data[$n][$k] = $element->get_data();
      }
    }

    if (array_key_exists('index_type', $this->def)) {
      switch ($this->def['index_type']) {
        case 'keep':
        case '_keys':
          break;
        case 'array':
          $data = array_values($data);
          break;
        default:
          trigger_error("{$this->id}: form_element_grid: unknown index_type '{$this->def['index_type']}'", E_USER_WARNING);
      }
    }

    return $data;
  }

  function set_data($data) {
    $this->data = $data;
    $this->build_form();

    if($data)
      foreach($data as $n=>$row) {
        foreach($row as $k=>$d) {
          if(isset($this->elements[$n][$k]))
            $this->elements[$n][$k]->set_data($d);
        }
      }
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

    foreach($this->elements as $n => $row) {
      foreach ($row as $k => $element) {
        if(!isset($data[$n][$k]))
          $data[$n][$k] = null;

        $r = $element->set_request_data($data[$n][$k]);

        if($r === false)
          $ret = false;
      }
    }

    if(isset($remove)) {
      foreach($remove as $n=>$dummy) {
	unset($this->data[$n]);
	unset($this->elements[$n]);
      }
      $this->changed_count=true;
    }

    unset($this->data);

    return $ret;
  }

  function set_orig_data($data) {
    $this->orig_data = $data;

    if($data)
      foreach($data as $n=>$row) {
        foreach($row as $k=>$d) {
          if(isset($this->elements[$n][$k]))
            $this->elements[$n][$k]->set_orig_data($d);
        }
      }
  }

  function get_orig_data() {
    $data=array();

    foreach ($this->elements as $n => $row) {
      foreach ($row as $k => $element) {
        $data[$n][$k] = $element->get_orig_data();
      }
    }

    return $data;
  }

  function all_errors(&$errors) {
    parent::all_errors($errors);

    foreach ($this->elements as $n => $row) {
      foreach ($row as $k => $element) {
        $element->all_errors($errors);
      }
    }
  }

  function is_complete() {
    foreach ($this->elements as $n => $row) {
      foreach ($row as $k => $element) {
        if(!$element->is_complete())
          return false;
      }
    }

    return true;
  }

  function show_element($document) {
    $order = ((!array_key_exists("order", $this->def)) || ($this->def['order'] == true)) ? "order": "no_order";
    $removeable = ((!array_key_exists("removeable", $this->def)) || ($this->def['removeable'] !== false)) ? "removeable" : "not_removeable";

    $div=parent::show_element($document);

    $table = $document->createElement("table");
    $div->appendChild($table);

    $tr = $document->createElement('tr');
    $table->appendChild($tr);
    foreach ($this->headers as $k => $element) {
      $th = $document->createElement('th');
      $tr->appendChild($th);
      $th->appendChild($element->show_desc($document));
    }

    foreach ($this->elements as $n => $elements) {
      $tr = $document->createElement('tr');
      $tr->setAttribute("form_element_num", $n);
      $table->appendChild($tr);

      foreach($elements as $k => $element) {
        $td = $document->createElement('td');
        $tr->appendChild($td);

        $td->appendChild($element->show_element($document));
      }

      // Actions #k
      $el_div=$document->createElement("td");
      $el_div->setAttribute("class", "form_element_grid_part_element_actions");
      $tr->appendChild($el_div);

      if($order == "order") {
        $el_div->setAttribute("class", "{$el_div->getAttribute("class")} orderable");
        $input=$document->createElement("input");
        $input->setAttribute("type", "submit");
        $input->setAttribute("name", "{$this->options['var_name']}[__order_up][{$n}]");
        $input->setAttribute("value", "↑");
        $el_div->appendChild($input);

        $input=$document->createElement("input");
        $input->setAttribute("type", "submit");
        $input->setAttribute("name", "{$this->options['var_name']}[__order_down][{$n}]");
        $input->setAttribute("value", "↓");
        $el_div->appendChild($input);
      }

      if ($removeable === 'removeable') {
        $el_div->setAttribute("class", "{$el_div->getAttribute("class")} removeable");
        $input=$document->createElement("input");
        $input->setAttribute("type", "submit");
        $input->setAttribute("name", "{$this->options['var_name']}[__remove][{$n}]");
        $input->setAttribute("value", "X");
        $el_div->appendChild($input);
      }
    }

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
    $div->appendChild($input);

    if(isset($this->def['max']) && (sizeof($this->elements) >= $this->def['max'])) {
      $input->setAttribute("class", "reached_max");
    }

    if(isset($this->def['min']) && (sizeof($this->elements) <= $this->def['min'])) {
      $input->setAttribute("class", "reached_min");
    }

    return $div;
  }

  function save_data() {
    parent::save_data();

    foreach ($this->elements as $n => $row) {
      foreach ($row as $k => $element) {
        $element->save_data();
      }
    }
  }

  function is_modified() {
    foreach ($this->elements as $n => $row) {
      foreach ($row as $k => $element) {
        if($element->is_modified())
          return true;
      }
    }

    return false;
  }

  function refresh($force=false) {
    parent::refresh($force);

    foreach($this->elements as $n => $row) {
      foreach ($row as $k => $element) {
        $element->refresh($force);
      }
    }
  }
}
