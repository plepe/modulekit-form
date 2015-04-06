<?php
function fav_hobby_list($value, $form_element, $form) {
  $values = $form->get_data();
  return $values['hobbies'];
}

function name_check($value, $form_element, $form) {
  if($value == "Max Mustermann")
    return $value . " is not a valid name";

  return null;
}
