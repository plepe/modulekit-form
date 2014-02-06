function modulekit_form_debug(element, span) {
  ret = ''
  ret += 'ID: ' + element.id + '\n\n';

  ret += 'Def:\n' + JSON.stringify(element.def, null, '  ') + '\n\n';

  ret += 'Data:\n' + JSON.stringify(element.get_data(), null, '  ');

  alert(ret);
}

register_hook('form_element_connected', function(element) {
  if(!element.tr)
    return;

  var obs = element.tr.getElementsByTagName("div");
  for(var i = 0; i < obs.length; i++) {
    var ob = obs.item(i);

    if(ob.className == "form_name") {
      var span = document.createElement("span");
      span.appendChild(document.createTextNode("⚙"));
      span.className = "debug";
      span.onclick = modulekit_form_debug.bind(this, element, span);

      ob.appendChild(span);
    }
  }
});
