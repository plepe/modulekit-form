<?php
class form_element_switch extends form_element {
  function type() {
    return "switch";
  }

  function __construct($id, $def, $options, $form_parent) {
    parent::__construct($id, $def, $options, $form_parent);

    if(!array_key_exists('hide_label', $this->def))
      $this->def['hide_label'] = true;

    $this->build_form();

    $this->reload_clicked = false;
  }

  function build_form() {
    $this->elements=array();

    foreach($this->def['def'] as $k=>$element_def) {
      $this->create_element($k, $element_def);
    }
  }

  function create_element($k, $element_def) {
    $element_class=get_form_element_class($element_def);
    $element_id="{$this->id}_{$k}";
    $element_options=$this->options;
    $element_options['var_name']="{$this->options['var_name']}[{$k}]";

    $this->elements[$k]=new $element_class($element_id, $element_def, $element_options, $this);
  }

  function show($document) {
    $this->element_table = array();

    $reload_dom = $document->createElement("tr");
    $reload_dom->setAttribute("id", $this->id);
    $reload_dom->appendChild(DOM_createHTMLElement("<td></td>", $document));
    $reload_dom->appendChild(DOM_createHTMLElement("<td><input type='submit' value='" . lang('reload') . "' name='" . $this->options['var_name'] . "[__reload__]'> " . lang("form_element_switch:reload_desc", 0, $this->get_switch_element()->name()) . "</td>", $document));

    $el = $this->get_active_element();

    foreach($this->elements as $k=>$element) {
      $this->element_table[$k] = $element->show($document);

      if($element != $el)
        $this->element_table[$k]->setAttribute("style", "display: none");
    }

    return array_merge(array($reload_dom), $this->element_table);
  }

  function get_switch_element() {
    if(!isset($this->switch_element)) {
      $this->switch_element = $this->form_parent->resolve_other_elements($this->def['switch']);

      if((!$this->switch_element) || (!sizeof($this->switch_element))) {
        print "Switch {$this->id} can't resolve switch element {$this->def['switch']}\n";
        return null;
      }

      $this->switch_element = $this->switch_element[0];
    }

    return $this->switch_element;
  }

  function get_active_element() {
    $switch_el = $this->get_switch_element();
    if(!$switch_el)
      return null;

    $switch_data = $switch_el->get_data();

    if(!array_key_exists($switch_data, $this->elements))
      return null;

    return $this->elements[$switch_data];
  }

  function get_data() {
    $el = $this->get_active_element();

    if($el == null)
      return null;

    return $el->get_data();
  }

  function set_data($data) {
    foreach($this->elements as $k=>$element)
      $element->set_data($data);
  }

  function set_request_data($data) {
    $ret = true;

    if(array_key_exists('__reload__', $data))
      $this->reload_clicked = true;

    foreach($this->elements as $k=>$element) {
      if(!isset($data[$k]))
	$data[$k] = null;

      $r = $element->set_request_data($data[$k]);

      if($r === false)
	$ret = false;
    }

    return $ret;
  }

  function is_modified() {
    return !$this->reload_clicked;
  }

  function set_orig_data($data) {
    foreach($this->elements as $k=>$element)
      $element->set_orig_data($data);
  }
/*
  form_element_switch.prototype.refresh=function() {
    var el = this.get_active_element();

    for(var k in this.elements) {
      if(this.elements[k] == el)
        this.element_table[k].style.display = null;
      else
        this.element_table[k].style.display = 'none';
    }
  }
*/
}
