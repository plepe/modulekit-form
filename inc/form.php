<?
class form {
  public $def;
  public $id;
  public $options;

  function __construct($id, $def, $options=array()) {
    $this->id=$id;
    $this->def=$def;
    form_process_def($this->def);
    $this->options=$options;
    if(!isset($this->options['var_name']))
      $this->options['var_name']=$this->id;

    $this->build_form();

    $this->has_data=false;
    if(isset($_REQUEST[$this->options['var_name']]))
      $this->set_request_data($_REQUEST[$this->options['var_name']]);

    $this->has_orig_data=false;
    if(isset($_REQUEST['form_orig_'.$this->options['var_name']])) {
      $orig_data=json_decode($_REQUEST['form_orig_'.$this->options['var_name']], true);
      $this->set_orig_data($orig_data);
    }
  }

  function build_form() {
    $def=array(
      'type'	=>'form',
      'def'	=>$this->def,
    );
    $this->element=new form_element_form($this->id, $def, $this->options, null);
    $this->element->form=$this;
  }

  function get_data() {
    if(!$this->has_data)
      return null;

    return $this->element->get_data();
  }

  function set_data($data) {
    $this->element->set_data($data);

    if((!$this->has_data)&&(!$this->has_orig_data))
      $this->element->set_orig_data($data);

    $this->has_data=true;
  }

  function set_request_data($data) {
    $this->has_data=true;

    $this->element->set_request_data($data);
  }

  function set_orig_data($data) {
    $this->has_orig_data=true;

    $this->element->set_orig_data($data);
  }

  function get_orig_data() {
    if(!$this->has_orig_data)
      return $this->get_data();

    return $this->element->get_orig_data();
  }

  function errors() {
    $errors=array();

    if(!$this->has_data)
      return false;

    if(!$this->element->is_complete())
      return false;

    $this->element->errors(&$errors);

    if(!sizeof($errors))
      return false;
    return $errors;
  }

  function is_empty() {
    return !$this->has_data;
  }

  function is_complete() {
    if(!$this->has_data)
      return false;

    if($this->errors())
      return false;

    return $this->element->is_complete();
  }

  function show_errors($errors=null) {
    if(!$errors)
      $errors=$this->errors();

    $ret="";

    $ret.="<ul class='form_errors'>\n";
    foreach($errors as $e) {
      $ret.="  <li> $e</li>\n";
    }
    $ret.="</ul>\n";

    return $ret;
  }

  function reset() {
    $this->has_orig_data=false;
    //return form_reset($this->def, $this->data, $this->options['var_name']);
  }

  // save_data() is like get_data(), but calls save_data() on all elements
  // (e.g. to save temporary files to disk and resets "orig data" to the new
  // state
  function save_data() {
    $this->has_orig_data=false;

    $this->element->save_data();
    $data=$this->get_data();
    $this->element->set_orig_data($data);

    return $data;
  }

  function is_modified() {
    return $this->element->is_modified();
  }

  function show() {
    $document=new DOMDocument();

    $div=$this->element->show_element($document);
    $document->appendChild($div);

    $orig_data=$this->get_orig_data();

    $input_orig_data=$document->createElement("input");
    $input_orig_data->setAttribute("type", "hidden");
    $input_orig_data->setAttribute("name", "form_orig_{$this->options['var_name']}");
    $input_orig_data->setAttribute("value", json_encode($orig_data));
    $document->appendChild($input_orig_data);

    $ret="";

    // Include a hidden submit button as default action, to prevent that other submit buttons (e.g. for removing/adding elements in array elements) get precedence for default submit actions (e.g. user presses enter)
    $ret.="<div style='width: 0px; height: 0px; overflow: hidden'><input type='submit'></div>\n";

    // render the form
    $ret.=$document->saveHTML();

    // create javascript representation of form
    $ret.="<script type='text/javascript'>\n";
    $ret.="if(typeof form !== 'undefined') {\n";
    $ret.="  var form_{$this->id}=\n";
    $ret.="    new form(\"{$this->id}\", ".json_encode($this->def).", ".json_encode($this->options).");\n";
    $ret.="}\n";
    $ret.="</script>\n";

    return $ret;
  }
}

function form_process_def(&$def) {
  foreach($def as $k=>$element_def) {
    if(isset($element_def['count'])&&($element_def['type']!="array")) {
      $def[$k]=$element_def['count'];
      $def[$k]['type']="array";

      if(isset($element_def['name']))
	$def[$k]['name']=$element_def['name'];
      if(isset($element_def['desc']))
	$def[$k]['desc']=$element_def['desc'];

      unset($element_def['name']);
      unset($element_def['desc']);
      unset($element_def['count']);

      $def[$k]['def']=$element_def;
    }

    if((($element_def['type']=="array")||($element_def['type']=="form"))&&
      isset($def[$k]['def']['def']))
	form_process_def($def[$k]['def']['def']);
  }
}
