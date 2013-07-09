function calendar(element, date, callback) {
  this.date=date;
  this.callback=callback;

  this.div=document.createElement("div");
  this.div.className="calendar";
  this.div.innerHTML="FOO";

  element.parentNode.appendChild(this.div);
}
