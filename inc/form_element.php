<?
class form_element {
  public $def;
  public $id;
  public $options;
  public $data;
  public $orig_data;
  public $parent;

  function __construct($id, $def, $options, $parent) {
    $this->id=$id;
    $this->def=$def;
    $this->options=$options;
    $this->parent=$parent;
  }

  function name() {
    if(isset($this->def['_name']))
      return $this->def['_name'];

    return $this->def['name'];
  }

  function type() {
    if($this->def['type'])
      return $this->def['type'];

    return "default";
  }

  function path_name() {
    $parent_path=$this->parent->path_name();

    if($parent_path===null)
      return $this->name();

    return $parent_path."/".$this->name();
  }

  function set_data($data) {
    $this->data=$data;
  }

  function set_request_data($data) {
    $this->set_data($data);
  }

  function get_data() {
    return $this->data;
  }

  function errors($errors) {
    if(isset($this->def['req'])&&($this->def['req'])&&(!$this->data))
      $errors[]=$this->path_name().": Wert muss angegeben werden.";

    if(isset($this->def['check'])) {
      $check_errors=array();

      $this->check(&$check_errors, $this->def['check']);

      foreach($check_errors as $e)
	$errors[]=$this->path_name().": {$e}";
    }
  }

  function check($errors, $param) {
    $check_fun="check_".array_shift($param);

    if(method_exists($this, $check_fun)) {
      call_user_func(array($this, $check_fun), &$errors, $param);
    }
  }

  function is_complete() {
    return true;
  }

  function set_orig_data($data) {
    $this->orig_data=$data;
  }

  function get_orig_data() {
    return $this->orig_data;
  }

  function show($document) {
    $tr=$document->createElement("tr");
    $td=$document->createElement("td");
    $td->setAttribute("class", "field_desc");
    $tr->appendChild($td);

    if((!isset($this->def['hide_field_name']))||(!$this->def['hide_field_name'])) {
      if(isset($this->def['name'])) {
	$div=$document->createElement("div");
	$div->setAttribute("class", "form_name");
	$text=$document->createTextNode($this->def['name'].":");
	$div->appendChild($text);
	$td->appendChild($div);
      }

      if(isset($this->def['desc'])) {
	$div=$document->createElement("div");
	$div->setAttribute("class", "form_desc");
	$text=$document->createTextNode($this->def['desc']);
	$div->appendChild($text);
	$td->appendChild($div);
      }
    }

    $td=$document->createElement("td");
    $td->setAttribute("class", "field_value");
    $tr->appendChild($td);

    $td->appendChild($this->show_element($document));

    return $tr;
  }

  function show_element($document) {
    $div=$document->createElement("div");
    $div->setAttribute("class", "form_element_".$this->type());
    $div->setAttribute("id", $this->id);
    return $div;
  }

  // call check() for all elements of the param-array
  // if last element is a string it wil be returned as error message (if any of the checks returned an error)
  function check_and($errors, $param) {
    $list_errors=array();

    foreach($param as $i=>$p) {
      if(is_string($p)&&($i==sizeof($param)-1)) {
	if(sizeof($list_errors))
	  $errors[]=$p;

	$list_errors=array();
      }
      else
	$this->check(&$list_errors, $p);
    }

    $errors=array_merge($errors, $list_errors);
  }

  // call check() for all elements of the param-array until one successful check is found
  // if last element is a string it wil be returned as error message (if all of the checks returned an error)
  function check_or($errors, $param) {
    $list_errors=array();

    foreach($param as $i=>$p) {
      $check_errors=array();

      if(is_string($p)&&($i==sizeof($param)-1)) {
	$errors[]=$p;

	$list_errors=array();
      }
      else {
	$this->check(&$check_errors, $p);

	if(!sizeof($check_errors))
	  return;
      }

      $list_errors=array_merge($list_errors, $check_errors);
    }

    $errors=array_merge($errors, $list_errors);
  }

  // call check() for the first element of the param-array, return second element as error message if check() returns successful
  function check_not($errors, $param) {
    $check_errors=array();

    $this->check(&$check_errors, $param[0]);

    if(sizeof($check_errors))
      return;

    $errors[]=$param[1];
  }
}
