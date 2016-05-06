<?php
class form_element_select extends form_element {
  function __construct($id, $def, $options, $form_parent) {
    parent::__construct($id, $def, $options, $form_parent);

    if(!array_key_exists('null_value', $this->def))
      $this->def['null_value'] = "";
  }

  function show_element_option($select, $k, $v, $document) {
    $option=$document->createElement("option");
    $option->setAttribute("value", $k);
    if(((string)$k) === ((string)$this->data))
      $option->setAttribute("selected", "selected");
    $select->appendChild($option);

    $text=$document->createTextNode(get_value_string($v));
    $option->appendChild($text);
  }

  function show_element($document) {
    $div=parent::show_element($document);

    // check for changes
    $class="form_orig";
    if($this->is_modified())
      $class="form_modified";

    $select=$document->createElement("select");
    $select->setAttribute("name", "{$this->options['var_name']}");
    $select->setAttribute("id", $this->id);

    $values = $this->get_values();

    if(array_key_exists('placeholder', $this->def))
      if(is_array($this->def['placeholder']))
	$placeholder = lang($this->def['placeholder']);
      else
	$placeholder = $this->def['placeholder'];
    else
      $placeholder = lang('form_element:please_select');

    $this->show_element_option($select, $this->def['null_value'], $placeholder, $document);
    foreach($values as $v) {
      $this->show_element_option($select, $v['key'], $v, $document);
    }

    $div->appendChild($select);

    $all_descriptions = "";
    foreach($values as $v)
      if(is_array($v)) {
	$name = get_value_string($v);
	$desc = get_value_string($v, "desc");

	if($desc) {
	  $all_descriptions .= "<li><b>{$name}</b>: {$desc}</li>";
	}
      }
    if($all_descriptions != "")
      $all_descriptions = "<ul>{$all_descriptions}</ul>\n";

    $div_desc=$document->createElement("div");
    $div_desc->setAttribute("class", "description");
    $text=DOM_createHTMLElement($all_descriptions, $document);
    $div_desc->appendChild($text);
    $div->appendChild($div_desc);

    return $div;
  }

  function get_data() {
    $data=parent::get_data();

    if(($data===$this->def['null_value'])||($data===null)) {
      if(array_key_exists('empty_value', $this->def))
	return $this->def['empty_value'];

      return null;
    }

    return $data;
  }
}
