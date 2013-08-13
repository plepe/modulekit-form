<?
class form_element_file extends form_element {
  function type() {
    return "file";
  }

  function show_element($document) {
    $div=parent::show_element($document);

    // check for changes
    $class="form_orig";
    if($this->is_modified())
      $class="form_modified";

    if($this->data) {
      // create hidden input for data
      $input=$document->createElement("input");
      $input->setAttribute("type", "hidden");
      $input->setAttribute("value", json_encode($this->data));
      $input->setAttribute("name", $this->options['var_name']."[data]");
      $div->appendChild($input);

      // create div for text of old file
      $span=$document->createElement("div");
      $span->setAttribute("id", $this->id."-oldfile");
      $div->appendChild($span);

      $txt=$document->createTextNode($this->data['orig_name']);
      $span->appendChild($txt);
    }

    // create input field for new file
    $span=$document->createElement("div");
    $span->setAttribute("id", $this->id."-newfile");
    $div->appendChild($span);

    $input=$document->createElement("input");
    $input->setAttribute("type", "file");
    $input->setAttribute("class", $class);
    $input->setAttribute("name", $this->options['var_name']."[file]");
    $span->appendChild($input);

    return $div;
  }

  function _FILES_value($var_path, $k) {
    if(!isset($_FILES[$var_path[0]])||!isset($_FILES[$var_path[0]][$k]))
      return null;

    $m=$_FILES[$var_path[0]][$k];

    for($i=1; $i<sizeof($var_path); $i++) {
      if(!isset($var_path[$i]))
	return null;

      $m=$m[$var_path[$i]];
    }

    return $m;
  }

  function errors($errors) {
    parent::errors(&$errors);

    $data=$this->get_data();
    if($data['error']) {
      global $lang_str;

      if(isset($lang_str["form:file_upload_error:{$data['error']}"]))
	$errors[]=$this->path_name().": "+lang("form:file_upload_error:{$data['error']}", 0, $data['orig_name']);
      else
	$errors[]=$this->path_name().": "+lang('form:file_upload_error', 0, $data['orig_name'], $data['error']);
    }
  }

  function set_request_data($data) {
    $var_path=array();
    $var_name=$this->options['var_name'];

    $p1=strpos($var_name, "[");
    $var_path[]=substr($var_name, 0, $p1);

    $m=explode("][", substr($var_name, $p1+1, strlen($var_name)-$p1-2));
    $var_path=array_merge($var_path, $m);
    $var_path[]="file";

    if($this->_FILES_value($var_path, "tmp_name")==null) {
      if(isset($data['data'])) {
	$data=json_decode($data['data'], true);

	parent::set_request_data($data);
      }

      return;
    }

    $data=array();
    foreach(array("name", "type", "tmp_name", "error", "size") as $k)
      $data[$k]=$this->_FILES_value($var_path, $k);

    // no file uploaded
    if($data['error']==UPLOAD_ERR_NO_FILE)
      return;

    $data['orig_name']=$data['name'];
    $p2=strrpos($data['name'], ".");
    $data['ext']=substr($data['name'], $p2+1);

    $template="[orig_name]";
    if(isset($this->def['template']))
      $template=$this->def['template'];

    $data['new_name']=strtr($template, array(
      '[orig_name]'	=>$data['name'],
      '[ext]'		=>$data['ext'],
      '[timestamp]'	=>Date("Y-m-d-H-i-s"),
    ));

    // move to a new temporary location (in case of reload, e.g. due to
    // missing other values, we might reload, then the file would be
    // removed).
    $tmp_name=$data['tmp_name'];
    $data['tmp_name']=".form-upload-".uniqid();
    move_uploaded_file($tmp_name, "{$this->def['path']}/{$data['tmp_name']}");

    parent::set_request_data($data);
  }

  function save_data() {
    rename("{$this->def['path']}/{$this->data['tmp_name']}",
           "{$this->def['path']}/{$this->data['new_name']}");

    $this->data['name']=$this->data['new_name'];
    unset($this->data['tmp_name']);
    unset($this->data['new_name']);
  }
}
