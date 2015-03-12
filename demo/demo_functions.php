<?
function fav_hobby_list($value, $form_element, $form) {
  $values = $form->get_data();
  return $values['hobbies'];
}
