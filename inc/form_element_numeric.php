<?
$form_element_type_alias['integer']='numeric';
$form_element_type_alias['float']='numeric';

class form_element_numeric extends form_element_text {
  function type() {
    return $this->def['type'];
  }

  function get_data() {
    $data=parent::get_data();

    if(($data===null)||($data===""))
      return null;

    switch($this->def['type']) {
      case 'integer':
        return (int)$this->data;
      default:
        return (float)$this->data;
    }
  }

  function get_orig_data() {
    $data=parent::get_orig_data();

    if(($data===null)||($data===""))
      return null;

    switch($this->def['type']) {
      case 'integer':
        return (int)$data;
      default:
        return (float)$data;
    }
  }

  function set_data($data) {
    parent::set_data((string)$data);
  }

  function errors($errors) {
    parent::errors(&$errors);

    if(($this->data===null)||($this->data===""))
      return;

    $regexp=null;
    switch($this->def['type']) {
      case 'integer':
        $regexp="/^\s*[\\-+]?[0-9]+\s*$/";
	break;
      case 'float':
      case 'numeric':
        $regexp="/^\s*[\\-+]?[0-9]*(\.[0-9]+)?([Ee][+-][0-9]+)?\s*$/";
        break;
      default:
    }

    if($regexp) {
      if(!preg_match($regexp, $this->data)) {
	$errors[]=$this->path_name().": ".lang('form:invalid_value');
      }
    }
  }

  function check_ge($errors, $param) {
    if($this->get_data() === null)
      return;

    if($this->get_data() < $param[0]) {
      if(sizeof($param) > 1)
	$errors[] = $param[1];
      else
	$errors[] = lang('form:check_ge_failed', 0, $param[0]);
    }
  }

  function check_le($errors, $param) {
    if($this->get_data() === null)
      return;

    if($this->get_data() > $param[0]) {
      if(sizeof($param) > 1)
	$errors[] = $param[1];
      else
	$errors[] = lang('form:check_le_failed', 0, $param[0]);
    }
  }

  function check_gt($errors, $param) {
    if($this->get_data() === null)
      return;

    if($this->get_data() <= $param[0]) {
      if(sizeof($param) > 1)
	$errors[] = $param[1];
      else
	$errors[] = lang('form:check_gt_failed', 0, $param[0]);
    }
  }

  function check_lt($errors, $param) {
    if($this->get_data() === null)
      return;

    if($this->get_data() >= $param[0]) {
      if(sizeof($param) > 1)
	$errors[] = $param[1];
      else
	$errors[] = lang('form:check_lt_failed', 0, $param[0]);
    }
  }
}
