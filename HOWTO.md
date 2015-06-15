How to include modulekit-form into application using modulekit.

1. create an application, initialize git
----------------------------------------
```sh
mkdir myapp
cd myapp
git init
```

2. include modulekit-form and other required sub modules
--------------------------------------------------------
```sh
git submodule add https://github.com/plepe/modulekit.git modulekit
git submodule add https://github.com/plepe/modulekit-form.git lib/modulekit/form
git submodule add https://github.com/plepe/modulekit-lang.git lib/modulekit/lang
git submodule add https://github.com/plepe/modulekit-base.git lib/modulekit/base
git commit -m "Include submodules"
```

3. Create configuration
-----------------------
See https://github.com/plepe/modulekit for details.

File `modulekit.php`:
```php
<?php
$name = "This is my app!";
$id = "myapp";
$depend = array("modulekit-form"); // use modulekit-form and all its requirements
$include = array(
  'php' => array(
    'inc/*.php' // automatically include all files in inc-directory
  ),
  'js' => array(
    'inc/*.js' // automatically include all files in inc-directory
  ),
  'css' => array(
    'style.css' // include style.css
  )
);
```

File `conf.php-dist` (resp. `conf.php`):
```php
<?php
// Copy this file to conf.php and fill in your database credentials, ...

// Additional submodules, which are not necessarily required
# $modulekit_load[] = "modulekit-form-debug"; // uncomment this to enable debugging

// Additional configuration for your app, like database and so on ...
# ...
```


```sh
git add modulekit.php conf.php-dist
git commit -m "Create configuration files"
```

4. Create index.php
-------------------
```php
<?php include "conf.php"; /* load a local configuration */ ?>
<?php include "modulekit/loader.php"; /* loads all php-includes */ ?>
<?php call_hooks("init"); /* initialize submodules */ ?>
<?php // App functionality
$form_def = array(
  "something" => array(
    "type" => "text",
    "name" => "Something"
  ),
);
$form_data = new form("data", $form_def);

if($form_data->is_complete()) {
  $data = $form_data->save_data();

  // save to database/file/whatever
  print "<pre>\n";
  print_r($data);
  print "</pre>\n";
}

if($form_data->is_empty()) {
  // load data
  $data = array("something" => "interesting");

  $form_data->set_data($data);
}

$body = $form_data->show();
?>
<!DOCTYPE HTML>
<html>
  <head>
    <title>My App</title>
    <?php print modulekit_to_javascript(); /* pass modulekit configuration to JavaScript */ ?>
    <?php print modulekit_include_js(); /* prints all js-includes */ ?>
    <?php print modulekit_include_css(); /* prints all css-includes */ ?>
    <?php print_add_html_headers(); /* print additional html headers */ ?>
  </head>
  <body>
    <form enctype='multipart/form-data' method='post'>
    <?php print $body ?>
    <input type='submit' value='Submit'/>
    </form>
  </body>
</html>
```

```sh
git add index.php
git commit -m "basic index.php"
```

END. Turn on production mode.
-----------------------------
As all these libraries consist of many files, loading the page may take quite long. There's a script in the modulekit directory which will concatenate the files and therefore speed up page loading.

Execute:
```sh
modulekit/build_cache
```

This will create `.modulekit-cache` directory with the cached files. The cache will check the current git version on loading, therefore the cache does not have to be re-created, when the code is being updated.

Just remove the directory `.modulekit-cache` to return to development mode.
