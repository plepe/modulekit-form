var form_data;

function init() {
  var div=document.getElementById("form");

  form_data=new form("data", form_def, options);
  form_data.show(div);
  form_data.set_data(default_data);

  var input=document.createElement("input");
  input.type="submit";
  input.value="Ok";
  div.appendChild(input);

  var input=document.createElement("input");
  input.type="button";
  input.value="Req";
  input.onclick = function() {
    var d = form_data.get_request_data();
    console.log(d);
    alert(JSON.stringify(d, null, '  '));
  }
  div.appendChild(input);

  div.onsubmit=process;
  process(false);
}

function process(check_errors) {
  var div=document.getElementById("definition");
  while(div.firstChild)
    div.removeChild(div.firstChild);

  var text=document.createTextNode(JSON.stringify(form_data.def, null, "    "));
  div.appendChild(text);

  var div=document.getElementById("form_data");
  while(div.firstChild)
    div.removeChild(div.firstChild);

  var text=document.createTextNode(JSON.stringify(form_data.get_data(), null, "    "));
  div.appendChild(text);

  if(check_errors!==false) {
    form_data.show_errors();
  }

  return false;
}

window.onload=init;
