<?
class form_element {
  public $def;
  public $id;
  public $options;
  public $data;

  function __construct($id, $def, $options) {
    $this->id=$id;
    $this->def=$def;
    $this->options=$options;
  }

  function set_data($data) {
    $this->data=$data;
  }

  function get_data() {
    return $this->data;
  }

  function show() {
    $ret.="<tr><td class='field_desc'>";
    if((!isset($this->def['hide_field_name']))||(!$this->def['hide_field_name']))
      $ret.="<div class='form_name'>{$this->def['name']}:</div>";
    $ret.="<div class='form_desc'>{$this->def['desc']}</div></td>\n";
    $ret.="<td class='field_value'>\n";

    $ret.=$this->show_element();

    $ret.="</td></tr>\n";

    return $ret;
  }
}
