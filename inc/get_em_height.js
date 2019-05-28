var em_height_cache = {};

// from: http://stackoverflow.com/a/5265175
function elementCurrentStyle(element, styleName){
    if (element.currentStyle){
        var i = 0, temp = "", changeCase = false;
        for (i = 0; i < styleName.length; i++)
            if (styleName[i] != '-'){
                temp += (changeCase ? styleName[i].toUpperCase() : styleName[i]);
                changeCase = false;
            } else {
                changeCase = true;
            }
        styleName = temp;
        return element.currentStyle[styleName];
    } else {
        return getComputedStyle(element, null).getPropertyValue(styleName);
    }
}

module.exports = function get_em_height(dom_el) {
  var font_size = elementCurrentStyle(dom_el, "font-size");

  if(!(font_size in em_height_cache) || em_height_cache[font_size] === 0) {
    // calculate height of M
    var em=document.createElement("div");
    em.setAttribute("style", "display:inline-block; padding:0; line-height:1; position:absolute; visibility:hidden; font-size:1em;");
    em.appendChild(document.createTextNode("M"));
    dom_el.appendChild(em);
    em_height_cache[font_size] = em.offsetHeight;
    dom_el.removeChild(em);

  }

  return em_height_cache[font_size];
}
