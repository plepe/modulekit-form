<?
class form_element_text extends form_element {
  function show_element() {
    return "<input ".
      "type='text' ".
      "name='{$this->options['var_name']}' ".
      "onChange='form_element_changed(this)' ".
      "onKeyUp='form_element_typing(this)' ".
      "value=\"".htmlspecialchars($this->data)."\" />\n";
  }
}
