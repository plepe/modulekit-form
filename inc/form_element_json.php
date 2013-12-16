<?
class form_element_json extends form_element {
  function type() {
    return "json";
  }

  function create_element($document) {
    $input=$document->createElement("textarea");

    return $input;
  }

  function show_element($document) {
    $div=parent::show_element($document);

    // check for changes
    $class="form_orig";
    if($this->is_modified())
      $class="form_modified";

    $input=$this->create_element($document);
    $input->setAttribute("class", $class);
    $input->setAttribute("name", $this->options['var_name']);

    $value=$document->createTextNode($this->data);
    $input->appendChild($value);

    $div->appendChild($input);
    return $div;
  }

  function get_data() {
    return json_decode(parent::get_data(), true);
  }

  function set_data($data) {
    parent::set_data(json_encode($data));
  }

  function errors($errors) {
    parent::errors(&$errors);

    if($this->data=="null")
      return;

    if((($this->data!="")||($this->data!=null))&&
       json_decode($this->data)===null) {

      $errors[]=$this->path_name().": ".lang("form:invalid_value");
    }
  }

  function is_modified() {
    return json_encode($this->get_data())!==json_encode($this->get_orig_data());
  }
}
