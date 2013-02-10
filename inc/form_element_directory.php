<?
class form_element_directory extends form_element {
  function type() {
    return "directory";
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
    $input->setAttribute("name", "{$this->options['var_name']}[]");
    $input->setAttribute("multiple", "multiple");
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
    $count=sizeof($this->_FILES_value($var_path, "tmp_name"));

    $data=array('list'=>array());
    foreach($this->_FILES_value($var_path, "tmp_name") as $i=>$k)
      $data['list'][$i]=array();

    foreach(array("name", "type", "tmp_name", "error", "size") as $k)
      foreach($this->_FILES_value($var_path, $k) as $i=>$v)
        $data['list'][$i][$k]=$v;

    $template="[timestamp]";
    if(isset($this->def['template']))
      $template=$this->def['template'];

    $data['new_name']=strtr($template, array(
      '[timestamp]'	=>Date("Y-m-d-H-i-s"),
    ));

    parent::set_request_data($data);
  }

  function save_data() {
    $dir="{$this->def['path']}/{$this->data['new_name']}";
    mkdir($dir);

    foreach($this->data['list'] as $i=>$d) {
      move_uploaded_file($d['tmp_name'], "{$dir}/{$d['name']}");

      unset($this->data['list'][$i]['tmp_name']);
    }

    $this->data['name']=$this->data['new_name'];
    unset($this->data['new_name']);
  }
}