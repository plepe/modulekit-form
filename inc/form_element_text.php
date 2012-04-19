<?
class form_element_text extends form_element {
  function show_element() {
    // check for changes
    $class="form_orig";
    if(isset($this->orig_data)&&
      ($this->data!=$this->orig_data))
      $class="form_modified";

    return "<input ".
      "type='text' ".
      "class='$class' ".
      "name='{$this->options['var_name']}' ".
      "onChange='form_element_changed(this)' ".
      "onKeyUp='form_element_typing(this)' ".
      "value=\"".htmlspecialchars($this->data)."\" />\n";
  }
}
