<?php
$current_variant="combined";
if(preg_match("/demo_([a-zA-Z0-9_]*)\.php/", $_SERVER['SCRIPT_NAME'], $m))
  $current_variant=$m[1];

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

  $t ="<a href='{$url}'";
  if($current_variant==$variant)
    $t.=" class='current'";
  $t.=">{$variant_name}</a>\n";

  $text[]=$t;
}

print implode(" |\n", $text);

print " Language: ";
print "<form action='demo_{$current_variant}.php' method='get'>\n";
print "<input type='hidden' name='q' value=\"".htmlspecialchars($_REQUEST['q'])."\">\n";
print "<input type='hidden' name='d' value=\"".htmlspecialchars($_REQUEST['d'])."\">\n";
print "<select name='ui_lang' onchange='this.form.submit()'>\n";
$data=modulekit_loaded("");
foreach($data['languages'] as $lang_id) {
  print "  <option value='{$lang_id}'";
  if($lang_id==$ui_lang)
    print " selected";
  print ">".lang("lang_native:$lang_id")." (".lang("lang:$lang_id").")</option>\n";
}
print "</select>\n";
print "</form>\n";

print "</div>\n";
