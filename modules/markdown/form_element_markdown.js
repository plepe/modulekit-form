form_element_markdown.inherits_from(form_element_textarea);
function form_element_markdown() {
}

form_element_markdown.prototype.set_data = function(data) {
  this.parent("form_element_markdown").set_data.call(this, data)
  this.update_preview()
}

form_element_markdown.prototype.resize = function(ev, shrink) {
  this.parent("form_element_markdown").resize.call(this, ev, shrink);

  if (this.dom_preview) {
    if (this.dom.classList.contains('side-by-side')) {
      this.dom_preview.style.height = this.dom_element.style.height;
    } else {
      this.dom_preview.style.height = null;
    }
  }
}

form_element_markdown.prototype.refresh = function(force) {
  this.parent("form_element_markdown").refresh.call(this, force);

  if (typeof marked === 'undefined') {
    return console.log('Library "marked" not loaded')
  }

  if (this.dom_element && !this.dom_preview) {
    this.dom_preview = document.createElement('div')
    this.dom_preview.className = 'preview'
    this.dom_element.parentNode.appendChild(this.dom_preview)

    this.update_preview()
    this.dom_element.addEventListener('input', this.update_preview.bind(this))

    let menu = document.createElement('div')
    menu.className = 'menu'

    this.dom.classList.add('side-by-side')

    this.actions = []

    let action = this.add_menu('side-by-side', menu)
    action.classList.add('active')
    this.add_menu('source', menu)
    this.add_menu('preview', menu)

    this.dom_element.parentNode.insertBefore(menu, this.dom_element)
  }
}

form_element_markdown.prototype.add_menu = function(action, menu) {
  this.actions.push(action)

  button = document.createElement('button')
  button.href = '#'
  button.className = action
  button.onclick = function (button) {
    this.actions.forEach(action => this.dom.classList.remove(action))
    let b = menu.firstChild
    while (b) {
      b.classList.remove('active')
      b = b.nextSibling
    }

    this.dom.classList.add(action)
    button.classList.add('active')

    this.resize()

    return false
  }.bind(this, button)
  button.innerHTML = lang('form:' + action)
  menu.appendChild(button)

  return button
}

form_element_markdown.prototype.update_preview = function() {
  if (typeof marked !== 'undefined') {
    if (this.dom_preview) {
      this.dom_preview.innerHTML = marked(this.dom_element.value)

      // when cursor is as bottom of the textarea, scroll preview to the bottom too
      let rows = this.dom_element.value.split(/\n/g)
      let current_row = this.dom_element.value.substr(0, this.dom_element.selectionEnd).split(/\n/g)
      if (current_row.length === rows.length) {
        this.dom_preview.scrollTop = this.dom_preview.scrollHeight
      }
    }
  }
}
