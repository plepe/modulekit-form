function fav_hobby_list(value, form_element, form) {
  return form.get_data()['hobbies'];
}

function demo_submit() {
  var div=document.getElementById("form_data");
  while(div.firstChild)
    div.removeChild(div.firstChild);

  var text=document.createTextNode(JSON.stringify(form_demo.get_data(), null, "    "));
  div.appendChild(text);

  var errors=form_data.errors();
  var div=document.getElementById("errors");
  while(div.firstChild)
    div.removeChild(div.firstChild);
  form_data.show_errors(div);
}
