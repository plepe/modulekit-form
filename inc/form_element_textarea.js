form_element_textarea.inherits_from(form_element_text);
function form_element_textarea() {
}

form_element_textarea.prototype.connect=function(dom_parent) {
  this.dom_element=dom_parent.getElementsByTagName("textarea")[0];

  this.dom_element.oncut=this.delayed_resize.bind(this);
  this.dom_element.onpaste=this.delayed_resize.bind(this);
  this.dom_element.ondrop=this.delayed_resize.bind(this);
  this.dom_element.onkeydown=this.delayed_resize.bind(this);

  this.parent("form_element_textarea").connect.call(this, dom_parent);

  this.set_data(this.get_data());
}

form_element_textarea.prototype.create_element=function() {
  var input=document.createElement("textarea");

  return input;
}

form_element_textarea.prototype.refresh = function() {
  this.parent("form_element_textarea").refresh.call(this);

  this.resize();
}

form_element_textarea.prototype.delayed_resize = function() {
  window.setTimeout(this.resize.bind(this), 0);
}

form_element_textarea.prototype.resize = function() {
  if(this.dom_element) {
    this.dom_element.style.height = 0;
    this.dom_element.style.height = this.dom_element.scrollHeight +
      // as we use box-sizing 'border-box' we need to add the border height
      (this.dom_element.offsetHeight - this.dom_element.clientHeight) +
      "px";
  }
}
