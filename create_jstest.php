<?php
Header("content-type: text/html; charset=utf-8");
include "modulekit/loader.php"; /* loads all php-includes */

$test = $argv[1];

include "test/combined/{$test}.php";

$f = fopen("test.html", "w");
fprintf($f, "<!DOCTYPE HTML>\n");
fprintf($f, "<html>\n");
fprintf($f, "<head>\n");
fprintf($f, "<meta charset='UTF-8'>\n");
fprintf($f, "<link rel='stylesheet' href='./node_modules/mocha/mocha.css'>\n");
fprintf($f, "<div id='mocha'></div>\n");
fprintf($f, "<script src='./node_modules/mocha/mocha.js'></script>\n");
fprintf($f, "<script src='./node_modules/chai/chai.js'></script>\n");
fprintf($f, "<script>\n");
fprintf($f, "mocha.ui('bdd'); \n");
fprintf($f, "mocha.reporter('html');\n");
fprintf($f, "var expect = chai.expect;\n");
fprintf($f, "var assert = chai.assert;\n");
fprintf($f, "</script>\n");
fprintf($f, modulekit_include_js());
fprintf($f, modulekit_include_css());
fprintf($f, get_add_html_headers());
fprintf($f, '<meta name="viewport" content="width=device-width, initial-scale=1">' . "\n");
fprintf($f, "</head>\n");
fprintf($f, "<body>\n");
fprintf($f, "<form method='post'>\n");
fprintf($f, $form->show());
fprintf($f, "<input type='submit'>\n");
fprintf($f, "</form>\n");
fprintf($f, "<script src='test/combined/{$test}.js'></script>\n");
fprintf($f, "<script>\n");
fprintf($f, "if (window.mochaPhantomJS) { mochaPhantomJS.run(); }\n");
fprintf($f, "else { mocha.run(); }\n");
fprintf($f, "</script>\n");
fprintf($f, "</body>\n");
fprintf($f, "</html>\n");
