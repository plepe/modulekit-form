<?php
class form_element_intermediate_text extends form_element {
  function type() {
    return "intermediate_text";
  }

  function show($document) {
    $this->tr = $document->createElement("tr");

    $div = DOM_createHTMLElement($this->def['text'], $document);
    $this->td = $document->createElement("td");
    $this->td->setAttribute("colspan", 2);
    $this->td->appendChild($div);

    $this->tr->appendChild($this->td);

    return $this->tr;
  }

  function get_data() {
    return null;
  }
}
