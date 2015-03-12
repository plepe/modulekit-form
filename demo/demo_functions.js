function fav_hobby_list(value, form_element, form) {
  return form.get_data()['hobbies'];
}

function name_check(value, form_element, form) {
  if(value == "Max Mustermann")
    return value + " is not a valid name";

  return null;
}
