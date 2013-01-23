function demo_submit() {
  var div=document.getElementById("form_data");
  while(div.firstChild)
    div.removeChild(div.firstChild);

  var text=document.createTextNode(JSON.stringify(form_data.get_data(), null, "    "));
  div.appendChild(text);

  var errors=form_data.errors();
  var div=document.getElementById("errors");
  while(div.firstChild)
    div.removeChild(div.firstChild);
  form_data.show_errors(div);
}
