function demo_submit() {
  var div=document.getElementById("form_data");
  while(div.firstChild)
    div.removeChild(div.firstChild);

  var text=document.createTextNode(JSON.stringify(form_demo.get_data(), null, "    "));
  div.appendChild(text);

  form_data.show_errors();
}
