<?php
class form_element_file extends form_element {
  function __construct($id, $def, $options, $form_parent) {
    parent::__construct($id, $def, $options, $form_parent);
  }

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

    }

    // if an upload error occured, don't show file info
    if(($this->data) && (!$this->data['error'])) {
      // create div for text of old file
      $span=$document->createElement("div");
      $span->setAttribute("id", $this->id."-oldfile");
      $div->appendChild($span);

      $span_value=$document->createElement("span");
      $span_value->setAttribute("class", "value");
      $span->appendChild($span_value);

      // enclose in a link if web_path is set
      if(isset($this->def['web_path'])) {
	$web_url = strtr($this->def['web_path'], array(
	  "[file_name]"=>($this->data['tmp_name']?$this->data['tmp_name']:$this->data['name'])
	));

	$a=$document->createElement("a");
	$a->setAttribute("href", $web_url);
	$a->setAttribute("target", "_blank");

	$span_value->appendChild($a);
	$span_value=$a;

	if(in_array($this->data['type'], array('image/gif', 'image/jpeg', 'image/pjpeg', 'image/png', 'image/svg+xml'))) {
	  $img=$document->createElement("img");
	  $img->setAttribute("src", $web_url);
	  $img->setAttribute("class", "form_element_file_preview");
	  $span_value->appendChild($img);

	  $span_value->appendChild($document->createTextNode(" "));
	}
      }

      $txt=$document->createTextNode($this->data['orig_name'] ?: $this->data['name']);
      $span_value->appendChild($txt);

      $span_value->appendChild($document->createElement("br"));
      $span_value->appendChild($document->createTextNode(format_file_size($this->data['size'])));

      $input=$document->createElement("input");
      $input->setAttribute("type", "submit");
      $input->setAttribute("name", $this->options['var_name']."[delete]");
      $input->setAttribute("value", lang("delete"));
      $span->appendChild($input);
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

    $size_info = $document->createElement("span");
    $size_info->appendChild($document->createTextNode(
      lang("form:file_max_size", 0, $this->form_root->options['upload_max_filesize'])
    ));
    $span->appendChild($size_info);

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

  function errors(&$errors) {
    parent::errors($errors);

    $data=$this->get_data();

    if(array_key_exists('accept_ext', $this->def) && $data['ext'] &&
       !in_array($data['ext'], $this->def['accept_ext'])) {
      $errors[] = lang("form:file_not_accept_ext", 0, $data['ext']);
    }

    if($data['error']) {
      global $lang_str;

      if(isset($lang_str["form:file_upload_error:{$data['error']}"]))
	$errors[]=lang("form:file_upload_error:{$data['error']}", 0, $data['orig_name']);
      else
	$errors[]=lang('form:file_upload_error', 0, $data['orig_name'], $data['error']);
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

    if(isset($data['delete'])) {
      parent::set_request_data('');
      $this->data = null;
      return;
    }

    if($this->_FILES_value($var_path, "name")==null) {
      if(isset($data['data'])) {
	$data=json_decode($data['data'], true);

	parent::set_request_data($data);

        if ($data === null) {
          $this->data = null;
        }
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

    // an error occured -> no need to try to move file
    if($data['error'])
      return parent::set_request_data($data);

    // if destination directory does not exist, create
    if(!file_exists($this->def['path'])) {
      mkdir($this->def['path'], 0777, true);
    }

    // move to a new temporary location (in case of reload, e.g. due to
    // missing other values, we might reload, then the file would be
    // removed).
    $tmp_name=$data['tmp_name'];
    $data['tmp_name']=".form-upload-".uniqid();
    if(move_uploaded_file($tmp_name, "{$this->def['path']}/{$data['tmp_name']}")===false) {
      $data['error']=16;
    }

    else {
      // Check file size of temporary file
      clearstatcache("{$this->def['path']}/{$this->data['tmp_name']}");
      if(filesize("{$this->def['path']}/{$this->data['tmp_name']}")!=$this->data['size']) {
	$this->data['error']=17;
      }
    }

    return parent::set_request_data($data);
  }

  function save_data() {
    if(!isset($this->data['new_name']))
      return;

    // if destination directory does not exist, create
    if(!file_exists($this->def['path'])) {
      mkdir($this->def['path'], 0777, true);
    }

    $new_name = $this->data['new_name'];

    if ($this->def['no_overwrite'] ?? false) {
      $next_index = 0;
      $ext_pos = strrpos($new_name, '.');
      while (file_exists("{$this->def['path']}/{$new_name}")) {
        if ($ext_pos === false) {
          $new_name = "{$this->data['new_name']}_{$next_index}";
        } else {
          $new_name = substr($this->data['new_name'], 0, $ext_pos) . "_{$next_index}" . substr($this->data['new_name'], $ext_pos);
        }
        $next_index++;
      }
    }

    // rename to final file name
    if(rename("{$this->def['path']}/{$this->data['tmp_name']}",
	      "{$this->def['path']}/{$new_name}")===true) {

      // save data
      $this->data['name']=$new_name;
      unset($this->data['tmp_name']);
      unset($this->data['new_name']);

      // check if upload was successful
      clearstatcache("{$this->def['path']}/{$this->data['name']}");
      if(filesize("{$this->def['path']}/{$this->data['name']}")!=$this->data['size']) {
	$this->data['error']=21;
      }
    }
    else {
      $this->data['error']=20;
    }
  }
}
