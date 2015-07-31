<?php
class form_element_radio extends form_element {
  function show_element($document) {
    $div=parent::show_element($document);

    foreach($this->get_values() as $k=>$v) {
      $id="{$this->id}-$k";

      // check for changes
      $class="form_orig";
      if(isset($this->orig_data)&&
	 ($this->data!=$this->orig_data)&&
	 (($k==$this->data)||($k==$this->orig_data)))
	$class="form_modified";

      $span=$document->createElement("span");
      $span->setAttribute("class", $class);
      $div->appendChild($span);

      $input=$document->createElement("input");
      $input->setAttribute("type", "radio");
      $input->setAttribute("id", $id);
      $input->setAttribute("name", "{$this->options['var_name']}");
      $input->setAttribute("value", $k);
      if($k==$this->data)
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

    return $div;
  }
}
