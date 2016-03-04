test: php_test selenium_test

php_test:
	phpunit --bootstrap test/load.php test/php/*test.php

selenium_test:
	phpunit --bootstrap test/phponly.php test/selenium/*test.php
