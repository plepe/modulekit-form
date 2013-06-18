<?
$form_def=array(
  'name'	=>array(
    'name'	=>"Name",
    'desc'	=>"Please enter a name",
    'type'	=>"text",
    'req'	=>true,
    'html_attributes'   =>array("style"=>"border: 2px solid black;"),
  ),
  'sex'		=>array(
    'name'	=>"Sex",
    'desc'	=>"Choose your <a href='http://en.wikipedia.org/wiki/Gender'>gender</a>",
    'type'	=>"radio",
    'values'	=>array('m'=>"male", 'f'=>"female"),
  ),
  'hobbies'	=>array(
    'name'	=>"Hobbies",
    'type'	=>"text",
    'count'	=>array('default'=>2),
    'req'	=>true,
  ),
  'birthday'	=>array(
    'name'	=>"Birthday",
    'type'	=>"date",
  ),
  'languages'	=>array(
    'name'	=>"What languages to you speak?",
    'type'	=>"checkbox",
    'values'	=>array("php"=>"PHP", "perl"=>"Perl", "c"=>"C", "cpp"=>"C++", "java"=>"Java", "js"=>"Javascript"),
  ),
  'comment'	=>array(
    'name'	=>"Comment",
    'type'	=>"textarea",
  ),
  'nationality'	=>array(
    'name'	=>"Nationality",
    'type'	=>"select",
    'values'	=>array("Austria", "Australia", "Germany", "Great Britian", "USA"),
  ),
  'supervisor'	=>array(
    'name'	=>"Supervisor(s)",
    'type'	=>"text",
    'values'	=>array("Mr. Smith", "Mrs. Meyer", "Stephen Whoever", "Susan Somebody"),
    'count'     =>array("default"=>1),
  ),
/*  'residence'	=>array(
    'name'	=>"Where do you live",
    'type'	=>"inputselect",
    'values'	=>array("Austria", "Australia", "Germany", "Great Britian", "USA"),
  ), */
  'os'	=>array(
    'name'	=>"What operating systems do you use",
    'desc'	=>"You can select several values",
    'type'	=>"multiselect",
    'values'	=>array("Ubuntu Linux", "Debian Linux", "Other Linux", "MacOS X", "MS Windows", "OS/2"),
  ),
  'cats'	=>array(
    'type'	=>"form",
    'name'	=>"Cats",
    'desc'	=>"Describe all your cats",
    'count'	=>array("default"=>2),
    'def'	=>array(
      'name'	=>array(
        'name'	=>"Name",
	'type'	=>"text",
	'empty_value'=>"unnamed",
      ),
      'age'	=>array(
        'name'	=>"Age",
	'type'	=>"integer",
	'default'=>5,
      ),
    ),
  ),
  'tags'	=>array(
    'type'	=>"keywords",
    'name'	=>"Tags",
    'desc'	=>"Comma-separated list of values",
    'values'	=>array("Vacation", "Sightseeing", "Travel", "Paris", "Vienna", "Berlin", "New York", "Tokyo"),
  ),
  'json'	=>array(
    'type'	=>"json",
    'name'	=>"JSON",
  ),
  'cv'	=>array(
    'type'	=>"file",
    'name'	=>"Curriculum Vitae",
    'desc'	=>"Upload a file",
    'path'	=>"/tmp",
    'template'	=>"submission-[timestamp].[ext]",
  ),
  'photos'	=>array(
    'type'	=>"directory",
    'name'	=>"Photos",
    'desc'	=>"Upload multiple files",
    'path'	=>"/tmp",
    'template'	=>"submission-[timestamp]",
  ),
);

$default_data=array(
  "name"=>"Max Mustermann",
  "sex"=>"m",
  "comment"=>"Foo Bar\nBlablabla\n",
  "hobbies"=>array(0=>"Linux", 2=>"PHP", 5=>"Cycling"),
  "languages"=>array("php", "js"),
  "nationality"=>"Austria",
  "os"=>array("Ubuntu Linux", "Debian Linux"),
  "tags"=>array("Foo", "Bar"),
  "json"=>array(1, 2, "foo", "bar"=>array("b", "a", "r")),
);
