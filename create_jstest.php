<?php
Header("content-type: text/html; charset=utf-8");
include "modulekit/loader.php"; /* loads all php-includes */
call_hooks("init");

$test = $argv[1];

include "test/combined/{$test}.php";

$f = fopen("test.html", "w");
fputs($f, "<!DOCTYPE HTML>\n");
fputs($f, "<html>\n");
fputs($f, "<head>\n");
fputs($f, "<meta charset='UTF-8'>\n");
fputs($f, "<link rel='stylesheet' href='./node_modules/mocha/mocha.css'>\n");
fputs($f, "<div id='mocha'></div>\n");
fputs($f, "<script src='./node_modules/mocha/mocha.js'></script>\n");
fputs($f, "<script src='./node_modules/chai/chai.js'></script>\n");
fputs($f, "<script>\n");
fputs($f, "mocha.ui('bdd'); \n");
fputs($f, "mocha.reporter('html');\n");
fputs($f, "var expect = chai.expect;\n");
fputs($f, "var assert = chai.assert;\n");
fputs($f, "</script>\n");
fputs($f, modulekit_include_js());
fputs($f, modulekit_include_css());
fputs($f, get_add_html_headers());
fputs($f, '<meta name="viewport" content="width=device-width, initial-scale=1">' . "\n");
fputs($f, "</head>\n");
fputs($f, "<body>\n");
fputs($f, "<form method='post'>\n");
fputs($f, $form->show());
fputs($f, "<input type='submit'>\n");
fputs($f, "</form>\n");
fputs($f, "<script src='test/combined/{$test}.js'></script>\n");
fputs($f, "<script>\n");
fputs($f, "call_hooks('init');\n");
fputs($f, "if (window.mochaPhantomJS) { mochaPhantomJS.run(); }\n");
fputs($f, "else { mocha.run(); }\n");
fputs($f, "</script>\n");
fputs($f, "</body>\n");
fputs($f, "</html>\n");
