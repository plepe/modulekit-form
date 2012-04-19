<?
class form_element_radio extends form_element {
  function show_element() {
    $ret="";
    foreach($this->def['values'] as $k=>$v) {
      $id="{$this->id}-$k";

      $ret.="<input ".
	"type='radio' ".
	"id='{$id}' ".
	"name='{$this->options['var_name']}' ".
	"onChange='form_element_changed(this)' ".
	"onKeyUp='form_element_typing(this)' ".
	"value=\"".htmlspecialchars($k)."\"".
	($k==$this->data?" checked":"").
	"/>\n";

      $ret.="<label for='{$id}'>$v</label><br/>";
    }

    return $ret;
  }
}
