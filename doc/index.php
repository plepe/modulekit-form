<?
require_once("Text/Wiki/Creole.php");
$parser=new Text_Wiki_Creole();
$parser->setRenderConf("Xhtml", "wikilink", "new_url", "index.php?q=");

$content=file_get_contents("form_element.creole");
$text=$parser->transform($content, "Xhtml");

if(preg_match_all("/Example: (\{.*\})/", $text, $m, PREG_OFFSET_CAPTURE)) {
  $new_text="";
  $last=0;
  foreach($m[1] as $i=>$m1) {
    $new_text.=substr($text, $last, $m1[1]);
    $url=substr($text, $m1[1], strlen($m1[0]));
    $new_text.="<a href='../try.php?q=".urlencode(html_entity_decode($url))."'>$url</a>";
    $last=$m1[1]+strlen($m1[0]);
  }
  $text=$new_text;
}

print $text;
