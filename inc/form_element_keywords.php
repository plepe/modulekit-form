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

    if(isset($this->def['values'])) {
      $datalist=$document->createElement("datalist");
      $datalist->setAttribute("id", "{$this->id}-datalist");

      foreach($this->def['values'] as $value) {
	$option=$document->createElement("option");
	$option->setAttribute("value", $value);

	$datalist->appendChild($option);
      }

      $div->appendChild($datalist);
    }

    $div->appendChild($input);
    return $div;
  }

  function set_request_data($data) {
    $this->data=$data;

    if(is_string($this->data)) {
      $this->data=explode(",", $this->data);
      foreach($this->data as $i=>$d)
        $this->data[$i]=trim($d);
    }

    $this->data=array_unique($this->data);
  }

  function get_data() {
    return $this->data;
  }
}
