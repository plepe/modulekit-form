<?php
if(!function_exists("html_export_var")) {
  function html_export_var($data) {
    print "<script type='text/javascript'>\n";
    foreach($data as $k=>$v) {
      print "var $k=".json_encode($v).";\n";
    }
    print "</script>\n";
  }
}

function DOM_createHTMLElement($text, $document) {
  $dom=new DOMDocument();
  @$dom->loadHTML("<?xml encoding='UTF-8'><html><body><span>{$text}</span></body></html>");
  return $document->importNode($dom->lastChild->lastChild->lastChild, true);
}

// Source: http://www.benjaminkeen.com/function-is_hash/
function is_hash($var)
{
  if (!is_array($var))
    return false;

  return array_keys($var) !== range(0,sizeof($var)-1);
}

function format_file_size($size) {
  if($size > 800000000000)
    return sprintf("%.1f TiB", $size/1024.0/1024.0/1024.0/1024.0);
  if($size > 80000000000)
    return sprintf("%.0f GiB", $size/1024.0/1024.0/1024.0);
  if($size > 800000000)
    return sprintf("%.1f GiB", $size/1024.0/1024.0/1024.0);
  if($size > 80000000)
    return sprintf("%.0f MiB", $size/1024.0/1024.0);
  if($size > 800000)
    return sprintf("%.1f MiB", $size/1024.0/1024.0);
  if($size > 80000)
    return sprintf("%.0f kiB", $size/1024.0);
  if($size > 800)
    return sprintf("%.1f kiB", $size/1024.0);

  return sprintf("% B", $size);
}

function get_value_string($v, $key="name") {
  if(is_array($v) == "object") {
    if(array_key_exists($key, $v))
      return $v[$key];

    else if($key == 'name')
      return lang($v);

    else {
      $v1 = array();
      foreach($v as $k=>$x)
	if(substr($k, 0, strlen($key) + 1) == $key . ':')
	  $v1[substr($k, strlen($key) + 1)] = $v[$k];

      return lang($v1);
    }
  }
  else if($key == 'name')
    return $v;

  return null;
}

function form_build_child_var_name ($options, $k) {
  if($options['var_name'])
    return "{$options['var_name']}[{$k}]";

  else
    return "{$k}";
}
