<?php
$form_def=array(
  'filters'     =>array(
    'name'      =>"Filters",
    'type'      =>'form_chooser',
    'order'     =>false,
    'result_keep_order' => true,
    'def'       =>array(
      'a'         => array(
        'type'    => 'text',
        'name'    => 'A',
      ),
      'b'         => array(
        'type'    => 'select',
        'name'    => 'B',
        'values'  => array('1', '2', '3'),
        'show_default' => true,
      ),
      'c'         => array(
        'type'    => 'date',
        'name'    => 'C',
      ),
    ),
  ),
  'name'	=>array(
    'name'	=>"Name",
    'desc'	=>"Please enter a name",
    'type'	=>"text",
    'req'	=>true,
    'max_length' => 10,
    'html_attributes'   =>array("style"=>"border: 2px solid black;"),
    'check'	=> array("fun", array("js"=>"name_check", "php"=>"name_check")),
    'non_used_value' => 'FOO',
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
    'exclude_null_values' => true,
    'createable' => false,
  ),
  'fav_hobby'   =>array(
    'type'      => 'select',
    'values'    => array(),
    'values_func'=>array("js"=>"fav_hobby_list", "php"=>"fav_hobby_list"),
    'values_mode'=>"values",
    'name'      =>array("en"=>"Favorite hobby", "de"=>"Lieblingshobby"),
    'include_data' => 'not_null',
  ),
  'fav_meal'    => array(
    'type'      => 'select',
    'name'      => 'Favorite Meal',
    'values_mode' => 'property',
    'values_property' => 'id',
    'values'    => array(
      array('id' => 'pizza', 'name' => 'Pizza'),
      array('id' => 'kebab', 'name' => 'Kebab'),
    ),
  ),
  'birthday'	=>array(
    'name'	=>"Birthday",
    'type'	=>"date",
    'include_data'=>array('check', 'sex', array('is', 'm')),
    'weight' => -1,
  ),
  'languages'	=>array(
    'name'	=>"What languages do you speak?",
    'type'	=>"checkbox",
    'values'	=>array("php"=>"PHP", "perl"=>"Perl", "c"=>"C", "cpp"=>"C++", "java"=>"Java", "js"=>array("name"=>"Javascript", "desc"=>"Script language, supported by web browsers")),
    'auto_add_values' => true,
    'presets'   => array(
      array('name' => 'Web', 'values' => array('php', 'js', 'java'), 'desc:en' => 'Languages used for web development', 'desc:de' => 'Computersprachen für Webseiten'),
      array('name' => 'System', 'values' => array('c', 'cpp', 'java'), 'desc' => 'Hard-core ;-)'),
    ),
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
    'placeholder'=>false,
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
    'type'	=>"select_other",
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
    'desc'	=>"Describe all your cats (max. 3)",
    'count'	=>array("default"=>2, "index_type" => 'array', 'check'	=> array('count', '<=', 3, 'Max. 3 accepted.')),
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
  'switch_chooser' => array(
    'name'      => 'Switch for next field?',
    'type'      => 'radio',
    'desc'      => 'Is the next field a text or a textarea?',
    'default'   => 'none',
    'values'    => array('none', 'text', 'textarea', 'select', 'autocomplete'),
  ),
  'switch_value'      =>array(
    'type'      =>"switch",
    'switch'    =>"switch_chooser",
    'def'       =>array(
      'text'       =>array(
        'type'  =>"text",
        'name'  =>"text",
      ),
      'textarea'       =>array(
        'type'  =>"textarea",
        'name'  =>"textarea",
      ),
      'select'     => array(
        'type'  => 'select',
        'name'  => 'Select',
        'values' => array('foo', 'bar'),
      ),
      'autocomplete'     => array(
        'type'  => 'autocomplete',
        'name'  => 'Autocomplete',
        'values' => array('foo', 'bar'),
      ),
    ),
  ),
);

$options = array(
);

$default_data=array(
  "sex"=>"m",
  "comment"=>"Foo Bar\nBlablabla\n",
  "hobbies"=>array(0=>"Linux", 2=>"PHP", 5=>"Cycling"),
  "fav_hobby"=>"Cycling",
  "birthday"=>"1879-03-14", // Albert Einstein
  "languages"=>array("php", "js", "test"),
  "nationality"=>"de",
  "residence"=>"Germany",
  "os"=>array("Ubuntu Linux", "Debian Linux"),
  "tags"=>array("Foo", "Bar"),
  "json"=>array(1, 2, "foo", "bar"=>array("b", "a", "r")),
  "cats"=>array(array("name"=>"Foo", "age"=>3)),
  "num"=>10,
  "switch_value" => "foobar",
  "filters" => array("a"=>'Foobar', "b"=>"3"),
);
