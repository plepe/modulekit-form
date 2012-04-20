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

  function path_name() {
    if($this->parent===null)
      return $this->name();

    return $this->parent->path_name()."/".$this->name();
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
  }

  function is_complete() {
    return true;
  }

  function set_orig_data($data) {
    $this->orig_data=$data;
  }

  function get_orig_data($data) {
    return $this->orig_data;
  }

  function show() {
    $ret.="<tr id='$this->id'><td class='field_desc'>";
    if((!isset($this->def['hide_field_name']))||(!$this->def['hide_field_name']))
      $ret.="<div class='form_name'>{$this->def['name']}:</div>";
    $ret.="<div class='form_desc'>{$this->def['desc']}</div></td>\n";
    $ret.="<td class='field_value'>\n";

    $ret.=$this->show_element();

    $ret.="</td></tr>\n";

    return $ret;
  }
}
