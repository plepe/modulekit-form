<?
Header("content-type: text/html; charset=utf-8");

$page="form_element";
if(isset($_REQUEST['page'])&&(preg_match("/^[a-z_]+$/", $_REQUEST['page'])))
  $page=$_REQUEST['page'];
?>
<html>
<head>
<link rel='stylesheet' type='text/css' href='doc.css'>
<title>Form - Doc - <?=$page?></title>
</head>
<body>
<div class='overview'>
<ul>
<?
$d=opendir(".");
while($f=readdir($d)) {
  if(preg_match("/^(.*)\.creole$/", $f, $m)) {
    $pages[]=$m[1];
  }
}
closedir($d);

foreach($pages as $p) {
  if($page==$p)
    print "<li>{$p}</li>\n";
  else
    print "<li><a href='index.php?page={$p}'>{$p}</a></li>\n";
}
?>
</ul>
</div>
<div class='content'>
<?
require_once("Text/Wiki/Creole.php");
$parser=new Text_Wiki_Creole();
$parser->setRenderConf("Xhtml", "wikilink", "new_url", "index.php?page=");
$parser->setRenderConf("Xhtml", "wikilink", "view_url", "index.php?page=");
$parser->setRenderConf('xhtml', 'wikilink', 'pages', $pages);

$content=file_get_contents("{$page}.creole");
$text=$parser->transform($content, "Xhtml");

if(preg_match_all("/Example: (\{.*\})/", $text, $m, PREG_OFFSET_CAPTURE)) {
  $new_text="";
  $last=0;
  foreach($m[1] as $i=>$m1) {
    $new_text.=substr($text, $last, $m1[1]-$last);
    $url=substr($text, $m1[1], strlen($m1[0]));
    $new_text.="<a href='../try.php?q=".urlencode(html_entity_decode($url))."'>$url</a>";
    $last=$m1[1]+strlen($m1[0]);
  }
  $new_text.=substr($text, $last);

  $text=$new_text;
}

print $text;
?>
</div>
</body>
</html>
