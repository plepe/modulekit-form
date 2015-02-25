<?php
$form_element_type_alias=array();

class form_element {
  public $def;
  public $id;
  public $options;
  public $data;
  public $orig_data;
  public $form_parent;
  public $form_root;

  function __construct($id, $def, $options, $form_parent) {
    $this->id=$id;
    $this->def=$def;
    $this->options=$options;
    $this->form_parent=$form_parent;
    if($form_parent==null)
      $this->form_root=$this;
    else
      $this->form_root=$form_parent->form_root;

    $this->data=null;
    $this->orig_data=null;

    if(array_key_exists('default', $this->def)) {
      $this->set_data($this->def['default']);
      $this->set_orig_data($this->def['default']);
    }
  }

  function name() {
    if(array_key_exists('name', $this->def))
      $name=$this->def['name'];

    if(isset($this->def['_name']))
      $name=$this->def['_name'];

    if(is_array($name))
      return lang($name);

    return $name;
  }

  function type() {
    if($this->def['type'])
      return $this->def['type'];

    return "default";
  }

  function path_name() {
    $parent_path=$this->form_parent->path_name();

    if($parent_path===null)
      return $this->name();

    return $parent_path."/".$this->name();
  }

  function set_data($data) {
    $this->data=$data;
  }

  function set_request_data($data) {
    $data = preg_replace("/\r\n/", "\n", $data);

    $this->data=$data;
  }

  function get_data() {
    return $this->data;
  }

  function required() {
    if(isset($this->def['req'])) {
      $req = $this->def['req'];
      $req_test = array();

      if(is_array($req)) {
	$this->check($req_test, $req);
	$req = count($req_test) == 0;
      }

      return $req;
    }

    return false;
  }

  function errors(&$errors) {
    $data=$this->get_data();

    if($this->required() && ($data===null))
      $errors[]=lang("form:require_value");

    if(isset($this->def['check']) && ($data !== null)) {
      $check_errors=array();

      $this->check($check_errors, $this->def['check']);

      foreach($check_errors as $e)
	$errors[]=$e;
    }
  }

  function all_errors(&$errors) {
    $this_errors = array();
    $this->errors($this_errors);

    foreach($this_errors as $i=>$v)
      $errors[] = $this->path_name() . ": " . $v;
  }

  function check(&$errors, $param) {
    $check_fun="check_".array_shift($param);

    if(method_exists($this, $check_fun)) {
      call_user_func_array(array($this, $check_fun), array(&$errors, $param));
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

  function show_desc($document) {
    $ret = $document->createElement("div");

    if((!isset($this->def['hide_field_name']))||(!$this->def['hide_field_name'])) {
      if(isset($this->def['name'])) {
	$div=$document->createElement("div");
	$div->setAttribute("class", "form_name");
	$text=$document->createTextNode($this->name().":");
	$div->appendChild($text);
	$ret->appendChild($div);
      }

      if(isset($this->def['desc'])) {
	$div=$document->createElement("div");
	$div->setAttribute("class", "form_desc");
        $text=DOM_createHTMLElement((is_array($this->def['desc'])?lang($this->def['desc']):$this->def['desc']), $document);
	$div->appendChild($text);
	$ret->appendChild($div);
      }
    }

    return $ret;
  }

  function show_div_errors($document) {
    $this->div_errors=$document->createElement("div");
    $this->div_errors->setAttribute("class", "field_errors");
    $this->div_errors->setAttribute("id", "errors-".$this->id);

    // show errors
    $opt=$this->form_root->form->options;
    if(isset($opt['show_errors'])&&$opt['show_errors']) {
      $this->show_errors($document);
    }

    return $this->div_errors;
  }

  function show($document) {
    $req = $this->required() ? " required": "";

    $this->tr=$document->createElement("tr");
    $this->tr->setAttribute("id", "tr-".$this->id);
    $this->tr->setAttribute("class", "" . $req);

    if(!$this->is_shown())
      $this->tr->setAttribute("style", "display: none;");

    if((!array_key_exists("hide_label", $this->def)) || ($this->def['hide_label'] == false)) {
      $this->td_desc=$document->createElement("td");
      $this->td_desc->setAttribute("valign", "top");
      $this->td_desc->setAttribute("class", "field_desc" . $req);
      $this->tr->appendChild($this->td_desc);

      $this->td_desc->appendChild($this->show_desc($document));
    }

    $this->td_value=$document->createElement("td");
    $this->td_value->setAttribute("class", "field_value" . $req);
    if((array_key_exists("hide_label", $this->def)) && ($this->def['hide_label'] == true)) {
      $this->td_value->setAttribute("colspan", 2);
    }
    $this->tr->appendChild($this->td_value);

    $this->td_value->appendChild($this->show_element($document));

    $this->td_value->appendChild($this->show_div_errors($document));

    return $this->tr;
  }

  function show_errors($document) {
    $check_errors=array();
    $this->errors($check_errors);

    if(sizeof($check_errors)) {
      $ul=$document->createElement("ul");

      for($i=0; $i<sizeof($check_errors); $i++) {
	$li=$document->createElement("li");
	$li->appendChild($document->createTextNode($check_errors[$i]));
	$ul->appendChild($li);
      }

      $this->div_errors->appendChild($ul);

      if(isset($this->tr))
	$this->tr->setAttribute("class", $this->tr->getAttribute("class")." has_errors");
    }
  }

  function show_element($document) {
    $req = $this->required() ? " required": "";

    $this->dom=$document->createElement("span");
    $this->dom->setAttribute("class", "form_element_".$this->type() . $req);
    $this->dom->setAttribute("id", $this->id);

    return $this->dom;
  }

  function save_data() {
  }

  // call check() for all elements of the param-array
  // if last element is a string it wil be returned as error message (if any of the checks returned an error)
  function check_and(&$errors, $param) {
    $list_errors=array();

    foreach($param as $i=>$p) {
      if(is_string($p)&&($i==sizeof($param)-1)) {
	if(sizeof($list_errors))
	  $errors[]=$p;

	$list_errors=array();
      }
      else
	$this->check($list_errors, $p);
    }

    $errors=array_merge($errors, $list_errors);
  }

  // call check() for all elements of the param-array until one successful check is found
  // if last element is a string it wil be returned as error message (if all of the checks returned an error)
  function check_or(&$errors, $param) {
    $list_errors=array();

    foreach($param as $i=>$p) {
      $check_errors=array();

      if(is_string($p)&&($i==sizeof($param)-1)) {
	$errors[]=$p;

	$list_errors=array();
      }
      else {
	$this->check($check_errors, $p);

	if(!sizeof($check_errors))
	  return;
      }

      $list_errors=array_merge($list_errors, $check_errors);
    }

    $errors=array_merge($errors, $list_errors);
  }

  // call check() for the first element of the param-array, return second element as error message if check() returns successful
  function check_not(&$errors, $param) {
    $check_errors=array();

    $this->check($check_errors, $param[0]);

    if(sizeof($check_errors))
      return;

    if(sizeof($param)<2)
      $errors[]=lang('form:invalid_value');
    else
      $errors[]=$param[1];
  }

  // call check() on another form element of the same hierarchy
  function check_check(&$errors, $param) {
    $check_errors=array();

    $other=$this->form_parent->elements[$param[0]];
    if(!$other)
      return;

    $other->check($check_errors, $param[1]);

    if(sizeof($check_errors)) {
      if(sizeof($param)>2)
	$errors[]=$param[2];
      else foreach($check_errors as $e) {
	$errors[]=$other->path_name().": {$e}";
      }
    }
  }

  function check_is(&$errors, $param) {
    if(sizeof($param)<1)
      return;

    if($this->get_data()!=$param[0]) {
      if(sizeof($param)<2)
	$errors[]=lang('form:invalid_value');
      else
	$errors[]=$param[1];
    }
  }

  function is_shown() {
    if(isset($this->def['show_depend'])) {
      $errors=array();

      $this->check($errors, $this->def['show_depend']);

      if(sizeof($errors)) {
	return false;
      }
    }

    return true;
  }

  function is_modified() {
    return $this->get_data()!==$this->get_orig_data();
  }

  function get_values() {
    $ret=array();

    if(array_key_exists('values_func', $this->def)) {
      $fun = null;

      if(array_key_exists('php', $this->def['values_func']))
	$fun = $this->def['values_func']['php'];

      if($fun && (is_callable($fun) || (function_exists($fun))))
	$this->def['values'] = call_user_func($fun, $this->get_data(), $this, $this->form_root->form);
      else
	$this->def['values'] = null;
    }

    if(!isset($this->def['values'])||!is_array($this->def['values']))
      return $ret;

    // check values_mode
    if(!isset($this->def['values_mode']))
      $this->def['values_mode']=is_hash($this->def['values'])?"keys":"values";

    foreach($this->def['values'] as $k=>$v) {
      if($v === null)
	continue;
      if(is_array($v))
	$v=lang($v);

      switch($this->def['values_mode']) {
	case "keys":
	  $ret[$k]=$v;
	  break;
	case "values":
	  $ret[$v]=$v;
	  break;
	default:
	  // invalid mode
	  break;
      }
    }

    return $ret;
  }

  // replaces tags like [name] in str by the value of an element on the same
  // hierarchy, e.g.
  // parse_data("foo [name] bar") will return "foo Max bar" when
  // element 'name' has value "Max"
  function parse_data($str) {
    $offset=0;

    while(($p1=strpos($str, "[", $offset))!==false) {
      $p2=strpos($str, "]", $p1);

      $key=substr($str, $p1+1, $p2-$p1-1);
      $data=$this->form_parent->get_data();

      if(isset($data[$key]))
	$data=$data[$key];
      else
	$data="";

      $str=substr($str, 0, $p1) . $data . substr($str, $p2+1);

      $offset=$p1+strlen($data);
    }

    return $str;
  }

}

function get_form_element_class($def) {
  global $form_element_type_alias;

  $type=$def['type'];

  if(isset($form_element_type_alias[$type]))
    $type=$form_element_type_alias[$type];

  $element_class="form_element_{$type}";

  if(!class_exists($element_class))
    $element_class="form_element_unsupported";

  return $element_class;
}
