<?php
class form_element_geolocation extends form_element_json {
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

    $text = lang("form_element_geolocation:unknown_location");
    $data = $this->get_data();

    if(is_array($data))
      $text = lang("form_element_geolocation:location_latlon", 0, $data['latitude'], $data['longitude']);

    $this->display->appendChild(DOM_createHTMLElement($text, $document));
    $div->appendChild($this->display);

    return $div;
  }
}
