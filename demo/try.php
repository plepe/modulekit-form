<?php
if($_REQUEST['q']) {
  $params="?q=".urlencode($_REQUEST['q']);
}
if($_REQUEST['d']) {
  $params.="&d=".urlencode($_REQUEST['d']);
}

print "<h2>Example</h2>\n";
print "Definition: ".htmlspecialchars($_REQUEST['q'])."<br>\n";
if($_REQUEST['d'])
  print "Data: ".htmlspecialchars($_REQUEST['d'])."<br>\n";

print "<h2>Choose mode</h2>\n";
print "<a href='demo_phponly.php$params'>PHP Only</a><br>\n";
print "<a href='demo_combined.php$params'>Combined</a><br>\n";
print "<a href='demo_jsonly.php$params'>JS Only</a><br>\n";
