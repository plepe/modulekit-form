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

  function type() {
    if($this->def['type'])
      return $this->def['type'];

    return "default";
  }

  function path_name() {
    $parent_path=$this->parent->path_name();

    if($parent_path===null)
      return $this->name();

    return $parent_path."/".$this->name();
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

  function get_orig_data() {
    return $this->orig_data;
  }

  function show($document) {
    $tr=$document->createElement("tr");
    $td=$document->createElement("td");
    $td->setAttribute("class", "field_desc");
    $tr->appendChild($td);

    if((!isset($this->def['hide_field_name']))||(!$this->def['hide_field_name'])) {
      if(isset($this->def['name'])) {
	$div=$document->createElement("div");
	$div->setAttribute("class", "form_name");
	$text=$document->createTextNode($this->def['name'].":");
	$div->appendChild($text);
	$td->appendChild($div);
      }

      if(isset($this->def['desc'])) {
	$div=$document->createElement("div");
	$div->setAttribute("class", "form_desc");
        $text=DOM_createHTMLElement($this->def['desc'], $document);
	$div->appendChild($text);
	$td->appendChild($div);
      }
    }

    $td=$document->createElement("td");
    $td->setAttribute("class", "field_value");
    $tr->appendChild($td);

    $td->appendChild($this->show_element($document));

    return $tr;
  }

  function show_element($document) {
    $div=$document->createElement("div");
    $div->setAttribute("class", "form_element_".$this->type());
    $div->setAttribute("id", $this->id);
    return $div;
  }

  function save_data() {
  }
}
