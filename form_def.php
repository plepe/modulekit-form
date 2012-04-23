<?
$form_def=array(
  'name'	=>array(
    'name'	=>"Name",
    'desc'	=>"Please enter a name",
    'type'	=>"text",
    'req'	=>true,
  ),
  'sex'		=>array(
    'name'	=>"Sex",
    'desc'	=>"Choose your gender",
    'type'	=>"radio",
    'values'	=>array('m'=>"male", 'f'=>"female"),
  ),
  'hobbies'	=>array(
    'name'	=>"Hobbies",
    'type'	=>"text",
    'count'	=>array('default'=>2),
    'req'	=>true,
  ),
/*  'birthday'	=>array(
    'name'	=>"Birthday",
    'type'	=>"date",
  ), */
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
      ),
      'age'	=>array(
        'name'	=>"Age",
	'type'	=>"text",
      ),
    ),
  ),
);

$default_data=array(
  "name"=>"Max Mustermann",
  "sex"=>"m",
  "hobbies"=>array(0=>"Linux", 2=>"PHP", 5=>"Cycling"),
  "languages"=>array("php", "js"),
);
