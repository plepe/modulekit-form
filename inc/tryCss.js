function tryCss (dom, variants, elements) {
  var originalClass = dom.className
  var minHeight = null
  var minVariant = variants.length ? 0 : null
  var r = []

  for (var i = 0; i < variants.length; i++) {
    dom.className = originalClass
    var error = false

    for (var j = 0; j < variants[i].length; j++) {
      dom.classList.add(variants[i][j])
    }

    for (var k in elements) {
      elements[k].resize()
    }

    if (dom.offsetWidth > dom.parentNode.offsetWidth) {
      error = true
    }

    if (!error && (minHeight === null || dom.offsetHeight < minHeight)) {
      minHeight = dom.offsetHeight
      minVariant = i
      r.push(dom.offsetHeight)
    } else {
      r.push(null)
    }
  }

  dom.className = originalClass

  if (minVariant !== null) {
    console.log(r)
    for (var j = 0; j < variants[minVariant].length; j++) {
      dom.classList.add(variants[minVariant][j])
    }

    for (var k in elements) {
      elements[k].resize()
    }
  }
}
