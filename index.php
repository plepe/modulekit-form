<html>
<head>
</head>
<body>
<?
if($_REQUEST['q']) {
  $params="?q=".urlencode($_REQUEST['q']);
}
if($_REQUEST['d']) {
  $params.="&d=".urlencode($_REQUEST['d']);
}

?>

<h1>Forms</h1>
<p>
This Forms library has the goal to easily create HTML forms. Configuration is done with an associative array, the returned data will have the same structure (same keys, but with data).

<p>There are three modes to use this library:<ul>
<li> <a href='test_phponly.php<?=$params?>'>PHP Only</a><br>Maybe users disable Javascript. Forms should still work. Also we should never trust the Javascript implementation to get checks (e.g. for correct data) right or rather people might try nasty stuff.
<li> <a href='test_combined.php<?=$params?>'>PHP/Javascript combined</a><br>The forms are defined and created in PHP, Javascript is responsible for interactivity, like checking validity of data, adding/removing elements and highlighting changed values.
<li> <a href='test_jsonly.php<?=$params?>'>Javascript only</a><br>If you are writing an Ajax application you might want to create Forms directly from Javascript, e.g. because you do no longer reload webpages.
</ul>

<h1>Documentation</h1>
See the <a href='doc/'>Documentation</a>.

</body>
</html>
