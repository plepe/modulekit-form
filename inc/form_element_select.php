<?
class form_element_select extends form_element {
  function show_element_option($select, $k, $v, $document) {
    $option=$document->createElement("option");
    $option->setAttribute("value", $k);
    if(((string)$k) === ((string)$this->data))
      $option->setAttribute("selected", "selected");
    $select->appendChild($option);

    $text=$document->createTextNode($v);
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

    $this->show_element_option($select, "", $placeholder, $document);
    foreach($values as $k=>$v) {
      $this->show_element_option($select, $k, $v, $document);
    }

    $div->appendChild($select);

    $all_descriptions = "";
    foreach($this->def['values'] as $v)
      if(is_array($v)) {
	$name = lang($v);
	$desc = lang($v, "desc:");

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

    if(($data==="")||($data===null)) {
      if(array_key_exists('empty_value', $this->def))
	return $this->def['empty_value'];

      return null;
    }

    return $data;
  }
}
