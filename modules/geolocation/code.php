<?php
$form_element_geolocation_keys = array("latitude", "longitude");

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
    foreach($form_element_geolocation_keys as $k) {
      $span = $document->createElement("span");
      $this->display->appendChild($span);


      $span->appendChild(
        $document->createTextNode(lang("form_element_geolocation:short:{$k}") . ": "));
      $input = $document->createElement("input");
      $input->setAttribute("name", $this->options['var_name'] . "[{$k}]");
      $input->setAttribute("class", $class." geolocation");
      $input->setAttribute("type", "text");
      if(is_array($data))
        $input->setAttribute("value", sprintf("%.5f", $data[$k]));
      $span->appendChild($input);
    }

    $div->appendChild($this->display);

    return $div;
  }

  function set_request_data($data) {
    global $form_element_geolocation_keys;
    $base = array();

    if(array_key_exists('_base_', $data))
      $base = json_decode($data['_base_'], true);

    foreach($data as $k=>$v) {
      if(in_array($k, $form_element_geolocation_keys) && (sprintf("%.5f", $base[$k]) != $data[$k]))
        $base[$k] = $v;
    }

    $base['enable_tracking'] = false;
    if(array_key_exists("enable_tracking", $data))
      $base['enable_tracking'] = true;

    parent::set_request_data($base);
  }
}
