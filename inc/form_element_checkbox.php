<?
class form_element_checkbox extends form_element {
  function show_element($document) {
    $div=parent::show_element($document);

    $data=$this->data;
    if($data===null) {
      if(isset($this->def['default']))
	$data=$this->def['default'];
      else
	$data=array();
    }

    foreach($this->get_values() as $k=>$v) {
      $id="{$this->id}-$k";

      // check for changes
      $class="form_orig";
      if(isset($this->orig_data)&&
         (in_array($k, $this->orig_data)!=in_array($k, $this->data)))
	$class="form_modified";

      $span=$document->createElement("span");
      $span->setAttribute("class", $class);
      $div->appendChild($span);

      $input=$document->createElement("input");
      $input->setAttribute("type", "checkbox");
      $input->setAttribute("id", $id);
      $input->setAttribute("name", "{$this->options['var_name']}[]");
      $input->setAttribute("value", $k);

      if(in_array($k, $data))
	$input->setAttribute("checked", "checked");
      $span->appendChild($input);
      
      $label=$document->createElement("label");
      $label->setAttribute("for", $id);
      $text=$document->createTextNode($v);
      $label->appendChild($text);
      $span->appendChild($label);

      $br=$document->createElement("br");
      $div->appendChild($br);
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
