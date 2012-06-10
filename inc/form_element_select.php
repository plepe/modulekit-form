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

    foreach($this->def['values'] as $k=>$v) {
      $input=$document->createElement("option");
      $input->setAttribute("type", "radio");
      $input->setAttribute("id", $id);
      $input->setAttribute("name", "{$this->options['var_name']}");
      $input->setAttribute("value", $k);
      if($k==$this->data)
	$input->setAttribute("selected", "selected");
      $select->appendChild($input);
      
      $text=$document->createTextNode($v);
      $input->appendChild($text);
    }

    $div->appendChild($select);

    return $div;
  }
}
