if (!Function.prototype.bind) {
  Function.prototype.bind = function (oThis) {
    if (typeof this !== "function") {
      // closest thing possible to the ECMAScript 5 internal IsCallable function
      throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
    }

    var aArgs = Array.prototype.slice.call(arguments, 1),
        fToBind = this,
        fNOP = function () {},
        fBound = function () {
          return fToBind.apply(this instanceof fNOP && oThis
                                 ? this
                                 : oThis,
                               aArgs.concat(Array.prototype.slice.call(arguments)));
        };

    fNOP.prototype = this.prototype;
    fBound.prototype = new fNOP();

    return fBound;
  };
}

function class_exists (cls) {
    // http://kevin.vanzonneveld.net
    // +   original by: Brett Zamir (http://brett-zamir.me)
    // *     example 1: function class_a() {this.meth1 = function () {return true;}};
    // *     example 1: var instance_a = new class_a();
    // *     example 1: class_exists('class_a');
    // *     returns 1: true
    var i = '';
    cls = this.window[cls]; // Note: will prevent inner classes
    if (typeof cls !== 'function') {
        return false;
    }

    for (i in cls.prototype) {
        return true;
    }
    for (i in cls) { // If static members exist, then consider a "class"
        if (i !== 'prototype') {
            return true;
        }
    }
    if (cls.toSource && cls.toSource().match(/this\./)) {
        // Hackish and non-standard but can probably detect if setting
        // a property (we don't want to test by instantiating as that
        // may have side-effects)
        return true;
    }

    return false;
}

Function.prototype.inherits_from=function(parentClass) {
  var name=this.toString().match(/function\s*(\w+)/);
  if(name&&name.length===2)
    name=name[1];
  else
    name=null;

  this.prototype = new parentClass;
  this.prototype.constructor = this;

  if(!this.prototype.parent_list)
    this.prototype.parent_list={};
  this.prototype.parent_list[name]=
    parentClass.prototype;

  this.prototype.parent=function(current) {
    if((!current)||(!this.parent_list[current]))
      current=null;

    return this.parent_list[current];
  }
}

// Source: http://www.hardcode.nl/subcategory_1/article_414-copy-or-clone-javascript-array-object
// use as: var b=new clone(a);
function clone(source) {
    for (i in source) {
        if (typeof source[i] == 'source') {
            this[i] = new clone_object(source[i]);
        }
        else{
            this[i] = source[i];
        }
    }
}

// Source: http://phpjs.org/functions/in_array:432
function in_array (needle, haystack, argStrict) {
    // http://kevin.vanzonneveld.net
    // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   improved by: vlado houba
    // +   input by: Billy
    // +   bugfixed by: Brett Zamir (http://brett-zamir.me)
    // *     example 1: in_array('van', ['Kevin', 'van', 'Zonneveld']);
    // *     returns 1: true
    // *     example 2: in_array('vlado', {0: 'Kevin', vlado: 'van', 1: 'Zonneveld'});
    // *     returns 2: false
    // *     example 3: in_array(1, ['1', '2', '3']);
    // *     returns 3: true
    // *     example 3: in_array(1, ['1', '2', '3'], false);
    // *     returns 3: true
    // *     example 4: in_array(1, ['1', '2', '3'], true);
    // *     returns 4: false
    var key = '',
        strict = !! argStrict;

    if (strict) {
        for (key in haystack) {
            if (haystack[key] === needle) {
                return true;
            }
        }
    } else {
        for (key in haystack) {
            if (haystack[key] == needle) {
                return true;
            }
        }
    }

    return false;
}

// compares if both arrays contain the same values
// ignores order of elements
function array_compare_values(arr1, arr2) {
  var tmp={};

  if((!arr1)&&(!arr2))
    return false;

  if((!arr1)||(!arr2))
    return true;

  for(var i=0; i<arr1.length; i++)
    tmp[arr1[i]]=true;

  for(var i=0; i<arr2.length; i++)
    if(typeof tmp[arr2[i]]=="undefined")
      return true;
    else
      delete tmp[arr2[i]];

  for(var i in tmp)
    return true;

  return false;
}

function array_compare(arr1, arr2) {
  return JSON.stringify(arr1) === JSON.stringify(arr2);
}

function format_file_size(size) {
  if(size > 800000000000)
    return sprintf("%.1f TiB", size/1024.0/1024.0/1024.0/1024.0);
  if(size > 80000000000)
    return sprintf("%.0f GiB", size/1024.0/1024.0/1024.0);
  if(size > 800000000)
    return sprintf("%.1f GiB", size/1024.0/1024.0/1024.0);
  if(size > 80000000)
    return sprintf("%.0f MiB", size/1024.0/1024.0);
  if(size > 800000)
    return sprintf("%.1f MiB", size/1024.0/1024.0);
  if(size > 80000)
    return sprintf("%.0f kiB", size/1024.0);
  if(size > 800)
    return sprintf("%.1f kiB", size/1024.0);

  return sprintf("% B", size);
}

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

function add_class(dom, cls) {
  var classes = dom.className.split(" ");

  if(classes.indexOf(cls) == -1)
    dom.className += " " + cls;
}

function remove_class(dom, cls) {
  var classes = dom.className.split(" ");
  var p = classes.indexOf(cls);

  if(p != -1) {
    classes.splice(p, 1);
    dom.className = classes.join(" ");
  }
}

function get_value_string(v, key) {
  if(!key)
    key = 'name';

  if(typeof v == "object") {
    if(key in v)
      return v[key];

    else if(key == 'name')
      return lang(v);

    else {
      var v1 = {};
      for(var k in v)
	if(k.substr(0, key.length + 1) == key + ':')
	  v1[k.substr(key.length +1)] = v[k];

      return lang(v1);
    }
  }
  else if(key == 'name')
    return v;

  return null;
}

function array_merge() {
  //  discuss at: http://phpjs.org/functions/array_merge/
  // original by: Brett Zamir (http://brett-zamir.me)
  // bugfixed by: Nate
  // bugfixed by: Brett Zamir (http://brett-zamir.me)
  //    input by: josh
  //   example 1: arr1 = {"color": "red", 0: 2, 1: 4}
  //   example 1: arr2 = {0: "a", 1: "b", "color": "green", "shape": "trapezoid", 2: 4}
  //   example 1: array_merge(arr1, arr2)
  //   returns 1: {"color": "green", 0: 2, 1: 4, 2: "a", 3: "b", "shape": "trapezoid", 4: 4}
  //   example 2: arr1 = []
  //   example 2: arr2 = {1: "data"}
  //   example 2: array_merge(arr1, arr2)
  //   returns 2: {0: "data"}

  var args = Array.prototype.slice.call(arguments),
    argl = args.length,
    arg,
    retObj = {},
    k = '',
    argil = 0,
    j = 0,
    i = 0,
    ct = 0,
    toStr = Object.prototype.toString,
    retArr = true;

  for (i = 0; i < argl; i++) {
    if (toStr.call(args[i]) !== '[object Array]') {
      retArr = false;
      break;
    }
  }

  if (retArr) {
    retArr = [];
    for (i = 0; i < argl; i++) {
      retArr = retArr.concat(args[i]);
    }
    return retArr;
  }

  for (i = 0, ct = 0; i < argl; i++) {
    arg = args[i];
    if (toStr.call(arg) === '[object Array]') {
      for (j = 0, argil = arg.length; j < argil; j++) {
        retObj[ct++] = arg[j];
      }
    } else {
      for (k in arg) {
        if (arg.hasOwnProperty(k)) {
          if (parseInt(k, 10) + '' === k) {
            retObj[ct++] = arg[k];
          } else {
            retObj[k] = arg[k];
          }
        }
      }
    }
  }
  return retObj;
}

// http://stackoverflow.com/a/5515960/4832631
function lengthInUtf8Bytes(str) {
  // Matches only the 10.. bytes that are non-initial characters in a multi-byte sequence.
  var m = encodeURIComponent(str).match(/%[89ABab]/g);
  return str.length + (m ? m.length : 0);
}
