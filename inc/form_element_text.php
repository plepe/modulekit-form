<?
class form_element_text extends form_element {
  function type() {
    return "text";
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

    if(isset($this->def['html_attributes']))
      foreach($this->def['html_attributes'] as $k=>$v) {
        $input->setAttribute($k, $v);
      }

    $input->setAttribute("class", $class);
    $input->setAttribute("name", $this->options['var_name']);
    $input->setAttribute("value", $this->data);

    if(isset($this->def['values'])) {
      $input->setAttribute("list", $this->id."-datalist");

      $datalist=$document->createElement("datalist");
      $datalist->setAttribute("id", $this->id."-datalist");

      foreach($this->def['values'] as $k=>$v) {
        $option=$document->createElement("option");
        $option->setAttribute("value", $v);
        $datalist->appendChild($option);

        $text=$document->createTextNode($v);
        $option->appendChild($text);
      }

      $div->appendChild($datalist);
    }


    $this->dom_element=$input;

    $div->appendChild($input);
    return $div;
  }

  function check_regexp($errors, $param) {
    if(sizeof($param)<1)
      return;

    if(!preg_match("/{$param[0]}/", $this->get_data())) {
      if(sizeof($param)<2)
	$errors[]="Ungültiger Wert";
      else
	$errors[]=$param[1];
    }
  }

  function get_data() {
    $data=parent::get_data();

    if(($data==="")||($data===null)) {
      if(array_key_exists('empty_value', $this->def))
	return $this->def['empty_value'];

      return null;
    }

    return $data;
  }
}
