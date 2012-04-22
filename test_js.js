var form_data;

function init() {
  form_data=new form("foobar", form_def);
  form_data.set_data(default_data);
  form_data.show(document.getElementById("form"));
}

window.onload=init;
