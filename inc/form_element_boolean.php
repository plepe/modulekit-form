<?
class form_element_boolean extends form_element {
  function type() {
    return "boolean";
  }

  function show_element($document) {
    $div=parent::show_element($document);

    // check for changes
    $class="form_orig";
    if($this->is_modified())
      $class="form_modified";

    $span=$document->createElement("span");
    $span->setAttribute("class", $class);
    $div->appendChild($span);

    $input=$document->createElement("input");
    $input->setAttribute("type", "checkbox");

    if(isset($this->def['html_attributes']))
      foreach($this->def['html_attributes'] as $k=>$v) {
        $input->setAttribute($k, $v);
      }

    $input->setAttribute("name", $this->options['var_name']);
    $input->setAttribute("id", $this->options['var_name']);
    $input->setAttribute("value", "on");
    if(($this->data==="on")||($this->data===true))
      $input->setAttribute("checked", "checked");

    $this->dom_element=$input;
    $span->appendChild($input);

    $label=$document->createElement("label");
    $label->setAttribute("for", $this->options['var_name']);
    $span->appendChild($label);

    return $div;
  }

  function get_data() {
    $data=parent::get_data();

    if(($data===null)||($data===false)||($data===0))
      return false;

    return true;
  }

  function is_modified() {
    $orig_data=$this->get_orig_data();
    $data=$this->get_data();

    return ($orig_data!=$data);
  }
}
