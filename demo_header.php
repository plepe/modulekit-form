<?
print "<div class='demo_header'>\n";
print "Variants: ";
$text=array();
foreach(array("phponly"=>"PHP Only", "combined"=>"PHP/JS combined", "jsonly"=>"Javascript only") as $variant=>$variant_name) {
  $url="demo_{$variant}.php";

  $url_param=array();
  if($_REQUEST['q'])
    $url_param[]="q=".urlencode($_REQUEST['q']);
  if($_REQUEST['d'])
    $url_param[]="d=".urlencode($_REQUEST['d']);
  if(sizeof($url_param))
    $url.="?".implode("&amp;", $url_param);

  $text[]="<a href='{$url}'>{$variant_name}</a>\n";
}

print implode(" |\n", $text);
print "</div>\n";
