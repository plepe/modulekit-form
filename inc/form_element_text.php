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

      // Compatibility HTML4 browsers (i.e. IE8)
      $datalist_container=$document->createElement("span");
      $datalist_container->setAttribute("class", "form_datalist_container");

      $datalist=$document->createElement("datalist");
      $datalist->setAttribute("id", $this->id."-datalist");

      foreach($this->def['values'] as $k=>$v) {
        $option=$document->createElement("option");
        $option->setAttribute("value", $v);
        $datalist->appendChild($option);

        $text=$document->createTextNode($v);
        $option->appendChild($text);
      }

      $div->appendChild($datalist_container);
      $datalist_container->appendChild($datalist);
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

  function errors($errors) {
    parent::errors(&$errors);

    if(($this->data!="")||($this->data!=null)) {
      if(isset($this->def['force_values'])&&($this->def['force_values'])&&
         isset($this->def['values'])) {
        if(!in_array($this->data, $this->def['values'])) {
          $errors[]=$this->path_name().": ".lang('form:invalid_value');
        }
      }
    }
  }

  function is_modified() {
    $this->get_data();

    if( (($this->orig_data==="")||($this->orig_data===null))
      &&(($this->data==="")||($this->data===null)))
      return false;

    return parent::is_modified();
  }
}
