<?
$form_element_type_alias['date']='date';
$form_element_type_alias['datetime']='date';
$form_element_type_alias['datetime-local']='date';

$form_element_date_display_format=array(
  'date'=>"j.n.Y",
  'datetime'=>"j.n.Y G:i:s P",
  'datetime-local'=>"j.n.Y G:i:s",
);
$form_element_date_value_format=array(
  'date'=>"Y-m-d",
  'datetime'=>"Y-m-d\\TH:i:sP",
  'datetime-local'=>"Y-m-d\\TH:i:s",
);

class form_element_date extends form_element_text {
  function type() {
    return $this->def['type'];
  }

  function create_element($document) {
    $input=$document->createElement("input");
    $input->setAttribute("type", "text");

    return $input;
  }

  function date_format() {
    if(isset($this->def['format']))
      return $this->def['format'];

    global $form_element_date_display_format;
    return $form_element_date_display_format[$this->type()];
  }

  function set_request_data($data) {
    global $form_element_date_value_format;

    $dt=DateTime::createFromFormat($this->date_format(), $data);
    $data=$dt->format($form_element_date_value_format[$this->type()]);

    parent::set_request_data($data);
  }

  function show_element($document) {
    $div=parent::show_element($document);

    $format=$this->date_format();

    if($this->data!==null) {
      $dt=new DateTime($this->data);
      $this->dom_element->setAttribute("value", $dt->format($format));
    }

    return $div;
  }
}
