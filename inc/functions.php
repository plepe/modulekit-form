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
