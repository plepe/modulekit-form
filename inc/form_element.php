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
  static public $additional_checks = array();

  function __construct($id, $def, $options, $form_parent) {
    $this->id=$id;
    $this->def=$def;
    $this->options=$options;

    if(get_class($form_parent) === 'form') {
      $this->form_parent = null;
      $this->form_root = $this;
      $this->form = $form_parent;
    }
    else {
      $this->form_parent = $form_parent;
      $this->form_root = $form_parent->form_root;
    }

    $this->data=null;
    $this->orig_data=null;

    if(array_key_exists('default', $this->def)) {
      $this->set_data($this->def['default']);
      $this->set_orig_data($this->def['default']);
    }

    if(array_key_exists('default_func', $this->def) && ($this->data == null)) {
      $v = $this->func_call($this->def['default_func']);
      $this->set_data($v);
      $this->set_orig_data($v);
    }
  }

  function name() {
    $name = $this->id;

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

  function weight() {
    if(array_key_exists('weight', $this->def)) {
      $weight = $this->def['weight'];

      if (is_array($weight)) {
        $this->check($result, $weight, true);
        return sizeof($result) ? $result[0] : 0;
      }

      return $weight;
    }

    return 0;
  }

  function path_name() {
    if($this->form_parent===null)
      return null;

    $parent_path=$this->form_parent->path_name();

    if($parent_path===null)
      return $this->name();

    return $parent_path."/".$this->name();
  }

  function set_data($data) {
    $this->data=$data;
  }

  // returns:
  // true: this form element might be complete (if there are no errors)
  // false: this form element is not complete (e.g. because a button was
  // clicked to add/remove elements)
  function set_request_data($data) {
    $data = preg_replace("/\r\n/", "\n", $data);

    $this->data=$data;

    return true;
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
	$req = count($req_test) != 0;
      }

      return $req;
    }

    return false;
  }

  function disabled() {
    if(isset($this->def['disabled'])) {
      $v = $this->def['disabled'];
      $v_test = array();

      if(is_array($v)) {
	$this->check($v_test, $v);
	$v = count($v_test) == 0;
      }

      return $v;
    }

    if ($this->form_parent) {
      return $this->form_parent->disabled();
    }

    return false;
  }

  function errors(&$errors) {
    $data=$this->get_data();

    $this->check_required($errors, array());

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

  function check(&$errors, $param, $no_path=0) {
    if (array_key_exists($param[0], self::$additional_checks)) {
      $check_fun = self::$additional_checks[$param[0]];
      call_user_func_array($check_fun, array(&$errors, array_slice($param, 1), $this));
    }
    else {
      $check_fun="check_".array_shift($param);

      if(method_exists($this, $check_fun)) {
        call_user_func_array(array($this, $check_fun), array(&$errors, $param, $no_path));
      }
    }

    $new_errors = array();
    foreach($errors as $e) {
      if(is_array($e))
	$new_errors = array_merge($new_errors, $e);
      else
	$new_errors[] = $e;
    }

    $errors = $new_errors;
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

    $message = $this->message();
    if ($message) {
      $div = $document->createElement('div');
      $div->setAttribute('class', 'message');

      $m = DOM_createHTMLElement($message, $document);
      $div->appendChild($m);

      $this->td_value->appendChild($div);
    }

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

  function include_data() {
    if(isset($this->def['include_data'])) {
      if(is_bool($this->def['include_data']))
	return $this->def['include_data'];

      if($this->def['include_data'] === 'not_null')
        return $this->get_data() !== null;

      $errors=array();

      $this->check($errors, $this->def['include_data']);

      if(sizeof($errors))
	return false;
    }

    return true;
  }

  function save_data() {
  }

  // call check() for all elements of the param-array
  // if last element is a string it wil be returned as error message (if any of the checks returned an error)
  function check_and(&$errors, $param, $no_path=0) {
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

  function check_required(&$errors, $param, $no_path=0) {
    $data=$this->get_data();

    if($this->required() && ($data === null)) {
      if(sizeof($param)<2)
        $errors[]=lang('form:require_value');
      else
        $errors[]=$param[1];
    }
  }

  // call check() for all elements of the param-array until one successful check is found
  // if last element is a string it wil be returned as error message (if all of the checks returned an error)
  function check_or(&$errors, $param, $no_path=0) {
    $list_errors=array();

    if(sizeof($param) == 0)
      $errors[] = lang('form:check_empty_or');

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
  function check_not(&$errors, $param, $no_path=0) {
    $check_errors=array();

    $this->check($check_errors, $param[0]);

    if(sizeof($check_errors))
      return;

    if(sizeof($param)<2)
      $errors[]=lang('form:invalid_value');
    else
      $errors[]=$param[1];
  }

  function resolve_other_elements($path) {
    if(!$path)
      return array($this);

    $p = explode("/", $path);

    $p_first = $p[0];
    array_splice($p, 0, 1);
    $p_other = implode("/", $p);

    if($p_first == "..") {
      return $this->form_parent->resolve_other_elements($p_other);
    }
    else if($p_first == "*") {
      $ret = array();

      foreach($this->elements as $k=>$v)
	$ret = array_merge($ret, $this->elements[$k]->resolve_other_elements($p_other));

      return $ret;
    }
    else if(array_key_exists($p_first, $this->elements)) {
      return array( $this->elements[$p_first] );
    }
    else
      print("Path '". $p_first ."' not known");

    return array();
  }

  // call check() on another form element of the same hierarchy
  function check_check(&$errors, $param, $no_path=0) {
    $check_errors=array();

    $other_list = $this->form_parent->resolve_other_elements($param[0]);

    foreach($other_list as $other) {
      $other->check($check_errors, $param[1], $no_path);

      if(sizeof($check_errors)) {
	if(sizeof($param)>2)
	  $errors[]=$param[2];
	else foreach($check_errors as $e) {
	  $errors[]=($no_path ? $e : $other->path_name().": {$e}");
	}
      }
    }
  }

  function check_is(&$errors, $param, $no_path=0) {
    if(sizeof($param)<1)
      return;

    if($this->get_data()!=$param[0]) {
      if(sizeof($param)<2)
	$errors[]=lang('form:invalid_value');
      else
	$errors[]=$param[1];
    }
  }

  function check_in(&$errors, $param, $no_path=0) {
    if(sizeof($param)<1)
      return;

    if(!in_array($this->get_data(), $param[0])) {
      if(sizeof($param)<2)
	$errors[]=lang('form:invalid_value');
      else
	$errors[]=$param[1];
    }
  }

  function check_contains(&$errors, $param, $no_path=0) {
    if(sizeof($param)<1)
      return;

    if(is_array($param[0])) {
      if(sizeof(array_intersect($param[0], $this->get_data())))
	return;
    }
    else {
      if(in_array($param[0], $this->get_data()))
	return;
    }

    if(sizeof($param)<2)
      $errors[]=lang('form:invalid_value');
    else
      $errors[]=$param[1];
  }

  function check_fun(&$list, $param, $no_path=0) {
    $fun = null;
    $ret = null;

    if(array_key_exists('php', $param[0]))
      $fun = $param[0]['php'];
    else
      return;

    if($fun && (is_callable($fun) || (function_exists($fun)))) {
      $ret = call_user_func($fun, $this->get_data(), $this, $this->form_root->form);
    }
    else
      $ret = null;

    if($ret)
      $list[] = $ret;
  }

  function check_unique(&$list, $param, $no_path=0) {
    $data = array();
    $done = array();
    $dupl = array();

    if((sizeof($param) == 0) || ($param[0] == null)) {
      $data = $this->get_data();

      foreach($data as $k=>$v) {
	if(in_array($v, $done))
	  $dupl[] = json_encode($v);

	$done[] = $v;
      }
    }
    else {
      $this_data = $this->get_data();
      $this_data_enc = json_encode($this_data);

      $other_list = $this->form_parent->resolve_other_elements($param[0]);
      foreach($other_list as $other) {
	if(($other != $this) && (json_encode($other->get_data()) == $this_data_enc)) {
	  $dupl = array( $this_data );
	  break;
	}
      }
    }

    if(sizeof($dupl)) {
      if(sizeof($param) > 1)
	$list[] = lang($param[1], sizeof($dupl), implode(", ", $dupl));
      else
	$list[] = lang("form:duplicate", sizeof($dupl), implode(", ", $dupl));
    }
  }

  function check_has_value(&$errors, $param, $no_path=0) {
    if($this->get_data() === null) {
      if(sizeof($param)<1)
	$errors[]=lang('form:invalid_value');
      else
	$errors[]=$param[0];
    }
  }

  function is_shown() {
    if(isset($this->def['show_depend'])) {
      if($this->def['show_depend'] === false)
	return false;

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

  function func_call($def) {
    $fun = null;

    if(array_key_exists('php', $def))
      $fun = $def['php'];

    if($fun && (is_callable($fun) || (function_exists($fun))))
      return call_user_func($fun, $this->get_data(), $this, $this->form_root->form);

    return null;
  }

  function get_values() {
    $ret=array();

    if(array_key_exists('values_func', $this->def)) {
      $this->def['values'] = $this->func_call($this->def['values_func']);
    }

    if(!isset($this->def['values'])||!is_array($this->def['values']))
      return $ret;

    // check values_mode
    if(!isset($this->def['values_mode']))
      $this->def['values_mode']=is_hash($this->def['values'])?"keys":"values";

    if ($this->def['values_mode'] === 'property') {
      if (!isset($this->def['values_property'])) {
        $this->def['values_property'] = 'id';
      }
    }

    foreach($this->def['values'] as $k=>$v) {
      if($v === null)
	continue;

      if(is_array($v)) {
	if(array_key_exists("show_depend", $v)) {
	  $errors = array();
	  $this->check($errors, $v['show_depend']);

	  if(sizeof($errors))
	    continue;
	}
      }

      switch($this->def['values_mode']) {
	case "keys":
	  $ret[$k]=$v;
	  break;
	case "values":
	  $ret[$v]=array('name' => $v);
	  break;
        case "property":
          $ret[$v[$this->def['values_property']]] = $v;
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

  function refresh($force=false) {
    if(array_key_exists('default_func', $this->def) && ($this->data == null)) {
      $v = $this->func_call($this->def['default_func']);
      $this->set_data($v);
      $this->set_orig_data($v);
    }
  }

  function message () {
    if(isset($this->def['message'])) {
      $v = $this->def['message'];

      if(is_array($v)) {
	$this->check($result, $v);
        return implode("\n", $result);
      }

      return $v;
    }

    return false;
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

function form_create_element ($element_id, $element_def, $element_options, $parent) {
  $element_class=get_form_element_class($element_def);

  return new $element_class($element_id, $element_def, $element_options, $parent);
}
