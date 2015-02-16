<?php
class form_element_display extends form_element {
  function type() {
    return "display";
  }

  function show_element($document) {
    $div=parent::show_element($document);

    // check for changes
    $class="form_orig";
    if($this->is_modified())
      $class="form_modified";

    $input = DOM_createHTMLElement($this->data, $document);

    if(isset($this->def['html_attributes']))
      foreach($this->def['html_attributes'] as $k=>$v) {
        $input->setAttribute($k, $v);
      }

    $input->setAttribute("class", $class);

    $this->dom_display=$input;
    $div->appendChild($input);

    $input = $document->createElement("input");
    $input->setAttribute("type", "hidden");
    $input->setAttribute("value", $this->data);
    $input->setAttribute("name", $this->options['var_name']);
    $this->dom_element = $input;

    $div->appendChild($input);
    return $div;
  }

  function get_data() {
    $data = parent::get_data();

    if(($data==="")||($data===null)) {
      if(array_key_exists('empty_value', $this->def))
	return $this->def['empty_value'];

      return null;
    }

    return $data;
  }
}
