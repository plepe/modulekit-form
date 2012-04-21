<?
class form_element_text extends form_element {
  function type() {
    return "text";
  }

  function show_element($document) {
    $div=parent::show_element($document);

    // check for changes
    $class="form_orig";
    if(isset($this->orig_data)&&
      ($this->data!=$this->orig_data))
      $class="form_modified";

    $input=$document->createElement("input");
    $input->setAttribute("type", "text");
    $input->setAttribute("class", $class);
    $input->setAttribute("name", $this->options['var_name']);
    $input->setAttribute("value", $this->data);

    $div->appendChild($input);
    return $div;
  }
}
