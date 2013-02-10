<?
class form_element_file extends form_element {
  function type() {
    return "file";
  }

  function show_element($document) {
    $div=parent::show_element($document);

    // check for changes
    $class="form_orig";
    if(isset($this->orig_data)&&
      ($this->data!=$this->orig_data))
      $class="form_modified";

    $input=$document->createElement("input");
    $input->setAttribute("type", "file");
    $input->setAttribute("class", $class);
    $input->setAttribute("name", $this->options['var_name']);
    $input->setAttribute("value", $this->data);

    $div->appendChild($input);
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

  function set_request_data($data) {
    $var_path=array();
    $var_name=$this->options['var_name'];

    $p1=strpos($var_name, "[");
    $var_path[]=substr($var_name, 0, $p1);

    $m=explode("][", substr($var_name, $p1+1, strlen($var_name)-$p1-2));
    $var_path=array_merge($var_path, $m);

    if($this->_FILES_value($var_path, "tmp_name")===null)
      return;

    $data=array();
    foreach(array("name", "type", "tmp_name", "error", "size") as $k)
      $data[$k]=$this->_FILES_value($var_path, $k);

    $data['orig_name']=$data['name'];

    parent::set_request_data($data);
  }

  function save_data() {
    move_uploaded_file($this->data['tmp_name'], "{$this->def['path']}/{$this->data['name']}");
    unset($this->data['tmp_name']);
  }
}
