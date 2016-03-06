<?php
$form_element_geolocation_keys = array(
  "latitude"    => array(
    "format"      => "%.5f",
  ),
  "longitude"   => array(
    "format"      => "%.5f",
  ),
  "accuracy"    => array(
    "format"      => "%.0f",
  ),
);
html_export_var(array("form_element_geolocation_keys" => $form_element_geolocation_keys));

class form_element_geolocation extends form_element {
  function type() {
    return "geolocation";
  }

  function create_element($document) {
    $input=$document->createElement("textarea");
    $input->setAttribute("style", "display: none;");

    return $input;
  }

  function show_element($document) {
    $div=parent::show_element($document);

    $this->display = $document->createElement("div");
    $this->display->setAttribute("class", "display");

    $class="form_orig";
    if($this->is_modified())
      $class="form_modified";

    $data = $this->get_data();

    // base data
    $input = $document->createElement("input");
    $input->setAttribute("type", "hidden");
    $input->setAttribute("name", $this->options['var_name'] . "[_base_]");
    $input->setAttribute("value", json_encode($data));
    $this->display->appendChild($input);

    // latitude, longitude
    global $form_element_geolocation_keys;
    foreach($form_element_geolocation_keys as $k => $v) {
      $span = $document->createElement("span");
      $this->display->appendChild($span);


      $span->appendChild(
        $document->createTextNode(lang("form_element_geolocation:short:{$k}") . ": "));
      $input = $document->createElement("input");
      $input->setAttribute("name", $this->options['var_name'] . "[{$k}]");
      $input->setAttribute("class", $class." geolocation");
      $input->setAttribute("type", "text");
      if(is_array($data))
        $input->setAttribute("value", sprintf($v['format'], $data[$k]));
      $span->appendChild($input);
    }

    $div->appendChild($this->display);

    return $div;
  }

  function set_request_data($data) {
    global $form_element_geolocation_keys;
    $base = array();

    if($data && array_key_exists('_base_', $data))
      $base = json_decode($data['_base_'], true);

    if($data) foreach($data as $k=>$v) {
      if(array_key_exists($k, $form_element_geolocation_keys) && (sprintf($form_element_geolocation_keys[$k]['format'], $base[$k]) != $data[$k]))
        $base[$k] = $v;
    }

    $base['enable_tracking'] = false;
    if($data && array_key_exists("enable_tracking", $data))
      $base['enable_tracking'] = true;

    parent::set_request_data($base);
  }
}
