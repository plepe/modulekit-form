test: php_test

php_test:
	phpunit --bootstrap test/load.php test/php/*test.php
