<?
class form_element_select extends form_element {
  function show_element($document) {
    $div=parent::show_element($document);

    // check for changes
    $class="form_orig";
    if(isset($this->orig_data)&&
       ($this->data!=$this->orig_data))
      $class="form_modified";

    $select=$document->createElement("select");
    $select->setAttribute("name", "{$this->options['var_name']}");
    $select->setAttribute("id", $this->id);

    foreach($this->get_values() as $k=>$v) {
      $option=$document->createElement("option");
      $option->setAttribute("value", $k);
      if($val==$this->data)
	$option->setAttribute("selected", "selected");
      $select->appendChild($option);
      
      $text=$document->createTextNode($v);
      $option->appendChild($text);
    }

    $div->appendChild($select);

    return $div;
  }
}
