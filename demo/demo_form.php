<?php
$form_def=array(
  'name'	=>array(
    'name'	=>"Name",
    'desc'	=>"Please enter a name",
    'type'	=>"text",
    'req'	=>true,
    'html_attributes'   =>array("style"=>"border: 2px solid black;"),
    'check'	=> array("fun", array("js"=>"name_check", "php"=>"name_check")),
  ),
  'nickname'   =>array(
    'name'      =>'Nickname',
    'desc'      =>"By default rot13 of the name",
    'type'      =>'text',
    'default_func' => array(
      "js"=><<<EOT
function(value, form_element, form) {
  var s = form.get_data().name;
  if(s == null)
    return null;

  // Source: http://stackoverflow.com/a/617685/4832631
  return s.replace(/[a-zA-Z]/g,function(c){return String.fromCharCode((c<="Z"?90:122)>=(c=c.charCodeAt(0)+13)?c:c-26);});
}
EOT
, "php"=>function($value, $form_element, $form) {
  $d = $form->get_data();
  return str_rot13($d['name']);
}),
  ),
  'sex'		=>array(
    'name'	=>array("en"=>"Sex", "de"=>"Geschlecht"),
    'desc'	=>array("en"=>"Choose your <a href='http://en.wikipedia.org/wiki/Gender'>gender</a>", "de"=>"Wähle Dein Geschlecht"),
    'type'	=>"radio",
    'values'	=>array('m'=>array("en"=>"male", "de"=>"männlich"), 'f'=>array("en"=>"female", "de"=>"weiblich")),
  ),
  '_0' => array(
    'type'	=> 'intermediate_text',
    'text'	=> '<b>Tell something about your hobbies:</b>',
  ),
  'hobbies'	=>array(
    'name'	=>"Hobbies",
    'type'	=>"array",
    'default'	=>2,
    'def'	=>array(
      'type'	=>"text",
    ),
    'req'	=>true,
    'check'	=>array("unique"),
    'order'	=>false,
  ),
  'fav_hobby'   =>array(
    'type'      => 'select',
    'values'    => array(),
    'values_func'=>array("js"=>"fav_hobby_list", "php"=>"fav_hobby_list"),
    'values_mode'=>"values",
    'name'      =>array("en"=>"Favorite hobby", "de"=>"Lieblingshobby"),
  ),
  'birthday'	=>array(
    'name'	=>"Birthday",
    'type'	=>"date",
    'include_data'=>array('check', 'sex', array('is', 'm')),
  ),
  'languages'	=>array(
    'name'	=>"What languages do you speak?",
    'type'	=>"checkbox",
    'values'	=>array("php"=>"PHP", "perl"=>"Perl", "c"=>"C", "cpp"=>"C++", "java"=>"Java", "js"=>"Javascript"),
  ),
  'comment'	=>array(
    'name'	=>"Comment",
    'type'	=>"textarea",
  ),
  'num'         => array(
    'name'      =>"Num",
    'type'      =>"integer",
    'default'   =>"3",
  ),
  'nationality'	=>array(
    'name'	=>"Nationality",
    'type'	=>"select",
    'values'	=>array(
      "at"=>array(
	'en'=>"Austria",
	'de'=>"Österreich",
	'desc:en'=>"A small country in the middle of Europe (with no cangoroos)",
	'desc:de'=>"Ein kleines Land im Herzen Europas (aber ohne Känguruhs)",
      ),
      "au"=>array(
        'en'=>"Australia",
        'de'=>"Australien",
	'desc:en'=>"A continent on the Southern hemisphere (contains cangoroos)",
	'desc:de'=>"Ein Kontinent auf der Südhalbkugel (enthält Känguruhs)",
      ),
      "de"=>"Germany", "gb"=>"Great Britian", "us"=>"USA"),
  ),
  'residence'	=>array(
    'name'	=>"Where do you live",
    'type'	=>"select",
    'values'	=>array("Austria", "Australia", "Germany", "Great Britian", "USA", "asdfjaksdfj klasdjfkas jdfkassjdk fjaksjdfka jsdfk jaskdfjlkas jdfkasdfj kasfjdk jaskdfjkas jdfkl ajsfkdjadjf kljadfljadf"),
  ),
  'supervisor'	=>array(
    'name'	=>"Supervisor(s)",
    'type'	=>"text",
    'values'	=>array("Mr. Smith", "Mrs. Meyer", "Stephen Whoever", "Susan Somebody"),
    'force_values'=>true,
    'count'     =>array("default"=>1),
  ),
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
	'check' => array("unique", "../*/name"),
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
  'ready'	=>array(
    'type'	=>"boolean",
    'name'	=>"Ready",
    'desc'	=>"Are you ready yet?",
  ),
  'kv'          =>array(
    'type'      =>"hash",
    'name'      =>"Key/Value",
    'def'       =>array(
      'type'      => 'text',
    ),
  ),
  'kv_form'     =>array(
    'type'      =>"hash",
    'name'      =>"Key/Value (with form)",
    'def'       =>array(
      'type'      => 'form',
      'def'       => array(
        'a'         => array(
          'type'      => 'text',
          'name'      => 'A',
        ),
        'b'         => array(
          'type'      => 'text',
          'name'      => 'B',
        ),
      ),
    ),
  ),
);

$default_data=array(
  "sex"=>"m",
  "comment"=>"Foo Bar\nBlablabla\n",
  "hobbies"=>array(0=>"Linux", 2=>"PHP", 5=>"Cycling"),
  "fav_hobby"=>"Cycling",
  "birthday"=>"1879-03-14", // Albert Einstein
  "languages"=>array("php", "js"),
  "nationality"=>"de",
  "residence"=>"Germany",
  "os"=>array("Ubuntu Linux", "Debian Linux"),
  "tags"=>array("Foo", "Bar"),
  "json"=>array(1, 2, "foo", "bar"=>array("b", "a", "r")),
  "cats"=>array(array("name"=>"Foo", "age"=>3)),
  "num"=>10,
);
