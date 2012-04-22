var form_data;

function init() {
  var div=document.getElementById("form");

  form_data=new form("foobar", form_def);
  form_data.show(div);
  form_data.set_data(default_data);

  var input=document.createElement("input");
  input.type="submit";
  input.value="Ok";
  div.appendChild(input);

  div.onsubmit=process;
  process();
}

function process() {
  var div=document.getElementById("data");
  while(div.firstChild)
    div.removeChild(div.firstChild);

  var text=document.createTextNode(json_encode(form_data.get_data()));
  div.appendChild(text);

  var errors=form_data.errors();
  var div=document.getElementById("errors");
  while(div.firstChild)
    div.removeChild(div.firstChild);
  form_data.show_errors(div);

  return false;
}

window.onload=init;
