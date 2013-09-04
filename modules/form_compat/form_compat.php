<?
// Compatibility layer to the branch-1.0 version of the form library
global $form_compat;
$form_compat=array();

function form_compat_get_form($varname, $def) {
  global $form_compat;

  if($varname===null) {
    foreach($_REQUEST as $k=>$v) {
      if(preg_match("/^data_?/", $k))
	$varname=$k;
    }
  }

  foreach($form_compat as $f) {
    if($f['def']==$def) {
      return $f['form'];
    }
  }

  $f=array();
  $f['varname']=$varname;
  $f['def']=$def;
  $f['form']=new form($varname, $def);

  $form_compat[]=$f;

  return $f['form'];
}

function form_show($def, $data, $varname, $moreparam=array()) {
   $form=form_compat_get_form($varname, $def); 

   $form->set_data($data);
   return $form->show();
}

function form_get_data($def, $data) {
   $form=form_compat_get_form(null, $def); 

   return $form->get_data();
}

function form_save_data($def, $data) {
   $form=form_compat_get_form(null, $def); 

   return $form->save_data();
}

function form_check($def, $data) {
   $form=form_compat_get_form(null, $def); 

   return $form->errors();
}

function form_print_errors($error) {
  $ret="";

  $ret.="<div class='form_errors'>\n";
  $ret.="<ul>\n";
  foreach($error as $e) {
    $ret.="  <li> $e</li>\n";
  }
  $ret.="</ul>\n";
  $ret.="</div>\n";

  return $ret;
}
