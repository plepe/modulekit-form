function tryCss (dom, variants, elements) {
  var originalClass = dom.className
  var minHeight = null
  var minVariant = null

  for (var i = 0; i < variants.length; i++) {
    dom.className = originalClass

    for (var j = 0; j < variants[i].length; j++) {
      dom.classList.add(variants[i][j])
    }

    for (var k in elements) {
      elements[k].resize()
    }

    if (minHeight === null || dom.offsetHeight < minHeight) {
      minHeight = dom.offsetHeight
      minVariant = i
    }
  }

  dom.className = originalClass

  if (minVariant !== null) {
    for (var j = 0; j < variants[minVariant].length; j++) {
      dom.classList.add(variants[minVariant][j])
    }

    for (var k in elements) {
      elements[k].resize()
    }
  }
}
