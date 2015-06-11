function preview_update_data() {
  var data = form_test.get_data();

  document.getElementById("result_display").innerHTML = json_readable_encode(data);
}

function editor_update_form() {
  var def = form_data.get_data().elements;

  document.getElementById("definition_display").innerHTML = json_readable_encode(def);

  var form_test_div = document.getElementById("form_test");
  while(form_test_div.lastChild)
    form_test_div.removeChild(form_test_div.lastChild);

  var data = {};
  if(form_test)
    data = form_test.get_data();

  form_test = new form('test', def);
  form_test.set_data(data);
  form_test.show(form_test_div);

  form_test.onchange = preview_update_data;
  preview_update_data();
};

window.onload = function() {
  call_hooks("init");
  form_data.onchange = editor_update_form;
  editor_update_form();
}
