function editor_update_form() {
  var def = form_data.get_data().elements;

  var form_test_div = document.getElementById("form_test");
  while(form_test_div.lastChild)
    form_test_div.removeChild(form_test_div.lastChild);

  form_test = new form('form_test', def);
  form_test.show(form_test_div);
};

window.onload = function() {
  call_hooks("init");
  form_data.onchange = editor_update_form;
  editor_update_form();
}
