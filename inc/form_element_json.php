<?
class form_element_json extends form_element {
  function type() {
    return "json";
  }

  function create_element($document) {
    $input=$document->createElement("input");
    $input->setAttribute("type", "text");

    return $input;
  }

  function show_element($document) {
    $div=parent::show_element($document);

    // check for changes
    $class="form_orig";
    if(isset($this->orig_data)&&
      ($this->data!=$this->orig_data))
      $class="form_modified";

    $input=$this->create_element($document);
    $input->setAttribute("class", $class);
    $input->setAttribute("name", $this->options['var_name']);
    $input->setAttribute("value", $this->data);

    $div->appendChild($input);
    return $div;
  }

  function get_data() {
    return json_decode(parent::get_data(), true);
  }

  function set_data($data) {
    parent::set_data(json_encode($data));
  }

  function is_modified() {
    return json_encode($this->get_data())!==json_encode($this->get_orig_data());
  }
}
