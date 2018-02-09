<?php
class form_element_checkbox extends form_element {
  function get_data() {
    $data = parent::get_data();

    if(($data === "") or ($data === null))
      return array();

    return $data;
  }

  function set_request_data($data) {
    $ret = true;

    if($data && array_key_exists("__check_all", $data)) {
      $data = array_keys($this->get_values());
      $ret = false;
    }

    if($data && array_key_exists("__uncheck_all", $data)) {
      $data = array();
      $ret = false;
    }

    if ($data && array_key_exists('__presets', $data)) {
      if ($data['__presets'] === '') {
        unset($data['__presets']);
      }
      else if (array_key_exists($data['__presets'], $this->def['presets'])) {
        $data = $this->def['presets'][$data['__presets']]['values'];
      }
      else {
        // TODO: error? can't load preset
      }
    }

    $r = parent::set_request_data($data);

    if($r === false)
      return false;

    return $ret;
  }

  function show_element($document) {
    $div=parent::show_element($document);

    $data=$this->data;
    if($data===null) {
      if(isset($this->def['default']))
	$data=$this->def['default'];
      else
	$data=array();
    }
    if($data==="")
      $data=array();

    $values = $this->get_values();

    if (array_key_exists('auto_add_values', $this->def) && $this->def['auto_add_values']) {
      foreach ($this->get_data() as $d) {
        if (!array_key_exists($d, $values)) {
          $values[$d] = $d;
        }
      }
    }

    foreach($values as $k=>$v) {
      $id="{$this->id}-$k";

      // check for changes
      $class="form_orig";
      if(isset($this->orig_data)&&
         (in_array($k, $this->orig_data)!=in_array($k, $data)))
	$class="form_modified";

      $span=$document->createElement("span");
      $span->setAttribute("class", $class);
      $div->appendChild($span);

      $input=$document->createElement("input");
      $input->setAttribute("type", "checkbox");
      $input->setAttribute("id", $id);
      $input->setAttribute("name", "{$this->options['var_name']}[]");
      $input->setAttribute("value", $k);

      if(is_array($data)&&(in_array($k, $data)))
	$input->setAttribute("checked", "checked");
      $span->appendChild($input);
      
      $label=$document->createElement("label");
      $label->setAttribute("for", $id);
      $text=$document->createTextNode(get_value_string($v));
      $label->appendChild($text);
      $span->appendChild($label);

      if($desc = get_value_string($v, "desc")) {
	$desc_label = $document->createElement("span");
	$desc_label->setAttribute("class", "description");
	$desc_label->appendChild($document->createTextNode($desc));
	$span->appendChild($desc_label);
      }
    }

    if(array_key_exists('check_all', $this->def) && $this->def['check_all']) {
      $this->input_check_all = $document->createElement("input");
      $this->input_check_all->setAttribute("type", "submit");
      $this->input_check_all->setAttribute("name", "{$this->options['var_name']}[__check_all]");
      $this->input_check_all->setAttribute("value", lang("form:check_all"));
      $div->appendChild($this->input_check_all);
    }

    if(array_key_exists('uncheck_all', $this->def) && $this->def['uncheck_all']) {
      $this->input_uncheck_all = $document->createElement("input");
      $this->input_uncheck_all->setAttribute("type", "submit");
      $this->input_uncheck_all->setAttribute("name", "{$this->options['var_name']}[__uncheck_all]");
      $this->input_uncheck_all->setAttribute("value", lang("form:uncheck_all"));
      $div->appendChild($this->input_uncheck_all);
    }

    if (array_key_exists('presets', $this->def) && $this->def['presets']) {
      $this->input_presets = $document->createElement('select');
      $this->input_presets->setAttribute('name', "{$this->options['var_name']}[__presets]");

      if(array_key_exists('presets:label', $this->def))
        if(is_array($this->def['presets:label']))
          $placeholder = lang($this->def['presets:label']);
        else
          $placeholder = $this->def['presets:label'];
      else
        $placeholder = lang('form:load_preset');

      $option = $document->createElement('option');
      $option->setAttribute('value', '');
      $option->appendChild($document->createTextNode($placeholder));
      $this->input_presets->appendChild($option);

      foreach ($this->def['presets'] as $k => $v) {
        $option = $document->createElement('option');
        $option->setAttribute('value', $k);
        $option->appendChild($document->createTextNode(get_value_string($v)));
        if ($desc = get_value_string($v, 'desc')) {
          $option->setAttribute('title', $desc);
        }
        $this->input_presets->appendChild($option);
      }

      $div->appendChild($this->input_presets);
    }

    return $div;
  }

  function is_modified() {
    if(sizeof(array_diff($this->get_data(), $this->get_orig_data()))!=0)
      return true;
    if(sizeof(array_diff($this->get_orig_data(), $this->get_data()))!=0)
      return true;

    return false;
  }
}
