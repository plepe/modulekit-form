<?
class form_element_select extends form_element {
  function show_element($document) {
    $div=parent::show_element($document);

    // check for changes
    $class="form_orig";
    if($this->is_modified())
      $class="form_modified";

    $select=$document->createElement("select");
    $select->setAttribute("name", "{$this->options['var_name']}");
    $select->setAttribute("id", $this->id);
    foreach($this->get_values() as $k=>$v) {
      $option=$document->createElement("option");
      $option->setAttribute("value", $k);
      if($k==$this->data)
	$option->setAttribute("selected", "selected");
      $select->appendChild($option);
      
      $text=$document->createTextNode($v);
      $option->appendChild($text);
    }

    $div->appendChild($select);

    $all_descriptions = "<ul>";
    foreach($this->def['values'] as $v)
      if(is_array($v)) {
	$name = lang($v);
	$desc = lang($v, "desc:");

	if($desc) {
	  $all_descriptions .= "<li><b>{$name}</b>: {$desc}</li>";
	}
      }
    $all_descriptions .= "</ul>\n";

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
