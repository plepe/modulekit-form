<?
class form_element_keywords extends form_element {
  function type() {
    return "keywords";
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
    $input->setAttribute("value", implode(", ", $this->data));

    $div->appendChild($input);
    return $div;
  }

  function get_data() {
    if(is_string($this->data)) {
      $this->data=explode(",", $this->data);
      foreach($this->data as $i=>$d)
        $this->data[$i]=trim($d);
    }

    $this->data=array_unique($this->data);

    return $this->data;
  }
}
