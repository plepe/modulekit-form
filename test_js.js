var form_data;

function init() {
  form_data=new form("foobar", form_def);
  form_data.show(document.getElementById("form"));
  form_data.set_data(default_data);
}

window.onload=init;
