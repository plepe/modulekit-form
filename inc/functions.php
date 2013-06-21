<?
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
  $dom->loadHTML("<?xml encoding='UTF-8'><html><span>{$text}</span></html>");
  return $document->importNode($dom->lastChild, true);
}

// Source: http://www.benjaminkeen.com/function-is_hash/
function is_hash($var)
{
  if (!is_array($var))
    return false;

  return array_keys($var) !== range(0,sizeof($var)-1);
}
