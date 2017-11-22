<?php
class form_element_fixed extends form_element {
  function type() {
    return "fixed";
  }

  function show_element($document) {
    $div=parent::show_element($document);

    // check for changes
    $class="form_orig";
    if($this->is_modified())
      $class="form_modified";

    $input = DOM_createHTMLElement($this->get_data(), $document);

    if(isset($this->def['html_attributes']))
      foreach($this->def['html_attributes'] as $k=>$v) {
        $input->setAttribute($k, $v);
      }

    $input->setAttribute("class", $class);

    $this->dom_element=$input;
    $div->appendChild($input);

    return $div;
  }

  function get_data() {
    return $this->def['value'];
  }

  function set_data($data) {
  }
}
