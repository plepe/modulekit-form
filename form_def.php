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
);

