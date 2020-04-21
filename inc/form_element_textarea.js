form_element_textarea.inherits_from(form_element_text);
function form_element_textarea() {
}

form_element_textarea.prototype.connect=function(dom_parent) {
  this.dom_element=dom_parent.getElementsByTagName("textarea")[0];

  this.dom_element.oncut = this.delayed_resize.bind(this);
  this.dom_element.onpaste = this.delayed_resize.bind(this);
  this.dom_element.ondrop = this.delayed_resize.bind(this);
  this.dom_element.onkeydown = this.delayed_resize.bind(this);

  this.parent("form_element_textarea").connect.call(this, dom_parent);
}

form_element_textarea.prototype.create_element=function() {
  var input=document.createElement("textarea");

  input.oncut = this.delayed_resize.bind(this);
  input.onpaste = this.delayed_resize.bind(this);
  input.ondrop = this.delayed_resize.bind(this);
  input.onkeydown = this.delayed_resize.bind(this);

  return input;
}

form_element_textarea.prototype.refresh = function(force) {
  this.parent("form_element_textarea").refresh.call(this, force);

  this.resize(null, force);
}

form_element_textarea.prototype.delayed_resize = function(ev, shrink) {
  window.setTimeout(this.resize.bind(this, ev, shrink), 0);
}

form_element_textarea.prototype.resize = function(ev, shrink) {
  if(this.dom_element) {
    // temporarily set fixed height for parent node to avoid page jumping
    this.dom_element.parentNode.style.display = 'block';
    this.dom_element.parentNode.style.minHeight = this.dom_element.parentNode.scrollHeight + 'px';

    // thanks for http://codingaspect.com/blog/textarea-auto-grow-resizing-textarea-to-fit-text-height for this solution
    this.dom_element.style.overlowY = 'hidden';
    this.dom_element.style.height = 'auto';
    // add 2px for good measure
    this.dom_element.style.height = (this.dom_element.scrollHeight + 2) + 'px';

    this.dom_element.parentNode.style.minHeight = null;
  }
}

form_element_textarea.prototype.notify_change = function() {
  this.parent("form_element_textarea").notify_change.call(this);

  this.delayed_resize(null, true);
}
