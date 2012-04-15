<?
###############################################################################
# Library for Forms.
# (c)'03 Stephan Plepelits - skunk@xover.mud.at
###############################################################################
# CHANGELOG
# 030321 v1.0    First release
###############################################################################
#
# process_form($varname, $content)
#
# * Parameter
# - $varname
#   Der Name der Variablen, in der die Daten des Formulars abgespeichert 
#   werden sollen.
#
# - $content
#   Was alles im Formular vorkommen soll.
#   $content ist ein assoz. array
#   array("feld1"=>array("Name", "Beschreibung", <type>, zus. params, wertebereich, "Fehler wegen Wertebereich"), ...)
#   . "zus. params" ist ein String, der im <input>, <textarea>, <select>, ... dazugeschrieben wird.
# 
#   $$varname:
#   Assoz. Array, in dem die Ergebnisse stehen, zB. array("feld1"=>"Mein Name");
#
# - Return: 
#   0       Success
#   String  Form noch nicht vollstaendig ausgefuellt
#
#
# * Typen der Form-Items:
# - text
#   Normales einzeiliges Texteingabefeld, Wertebereich ist eine regexp.
#   Value ist der String.
#
# - textarea
#   Mehrzeiliges Texteingabefeld
#   Wertebereich wird nicht beruecksichtigt.
#   Value ist der String.
#
# - select
#   wertebereich ist ein array mit den moeglichen werten
#   Value ist der Index des Arrays.
#
# - multiselect
#   Wie select, nur dass mehrere Elemente ausgewaehlt werden koennen
#   Value ist eine Liste der Indices des Arrays.
#
# - radio
#   Wertebereich ist Liste 
#   Value ist Index des Arrays.
#
# - checkbox
#   Wertebereich ist Liste, mehrfachauswahl moeglich.
#   Value ist eine Liste der Indices des Arrays.
#
# - hidden
#   Value bleibt der, der am Anfang drinnen gespeichert wurde.
#
# - file
#   additional options:
#     path: path in which to save file(s)
#     template: a template for the filename. possible replacement patterns:
#       [orig_name]    the original filename
#       [num]          the number of the uploaded file (if a count has been specified)
#       [ext]          the extension of the uploaded file
#       [timestamp]    timestamp of form "2011-12-24-18-00-00"
#     web_path: a link to allow download of an already uploaded file
#       [file_name]    will be replaced by the given file name
#     accept_ext: an array with acceptable extensions (default: all)
#   value:
#     array(
#       'orig_name'=>'orig filename.pdf',
#       'name'=>'saved name.pdf',
#       'ext'=>'pdf',
#       'size'=>'12345'
#     ),
#
# - inputselect
#   behaves similar to select, but user can input parts of the name
#   additional options:
#     values: hash with possible values
#
# Moegliche $moreparam:
# - cookie_remember
#   Name eines Cookies in dem geaenderte Werte gespeichert werden, damit dieses
#   Formular fortgesetzt werden kann, wenn dazwischen das Formular verlassen wurde.
$form_orig_data=$_REQUEST[form_orig_data];
$form_errors=array();

class form {
  public $def;
  public $id;
  public $options;
  public $data;

  function __construct($id, $def, $options=array()) {
    $this->id=$id;
    $this->def=$def;
    $this->options=$options;
    if(!$this->options['var_name'])
      $this->options['var_name']=$this->id;

    if($_REQUEST[$this->options['var_name']])
      $this->data=form_get_data($this->def, $_REQUEST[$this->options['var_name']]);
  }

  function get_data() {
    return $this->data;
  }

  function set_data($data) {
    $this->data=$data;
  }

  function errors() {
    return form_check($this->def, $this->data);
  }

  function show_errors() {
    return form_print_errors($this->errors());
  }

  function reset() {
    return form_reset($this->def, $this->data, $this->options['var_name']);
  }

  function show() {
    return form_show($this->def, $this->data, $this->options['var_name'], $this->options);
  }
}

function html_export_var($data) {
  print "<script type='text/javascript'>\n";
  foreach($data as $k=>$v) {
    print "var $k=".json_encode($v).";\n";
  }
  print "</script>\n";
}

function form_reset($form, $data, $varname) {
  global $form_orig_data;
  unset($form_orig_data[$varname]);
}

function form_element_orig_name($name) {
  if(eregi("^([^\\[]+)(\\[.*)$", $name, $m))
    return "form_orig_data[".$m[1]."]".$m[2];
}

function form_print_errors($error) {
  $ret="";

  $ret.="<ul>\n";
  foreach($error as $e) {
    $ret.="  <li> $e</li>\n";
  }
  $ret.="</ul>\n";

  return $ret;
}

function form_check($def, $data) {
  unset($error);

  foreach($def as $key=>$conf) {
    if($conf["req"]&&(!$data[$key]))
      $error[]="'$conf[name]' muss angegeben werden.";

    switch($conf["type"]) {
      case "datetime":
      case "date":
        if(($data[$key])&&($conf["type"]=="datetime")) {
          if(!date_get_machine($data[$key], 0)) {
            $error[]="'$conf[name]': Datumsformat falsch.";
          }
        }
        break;
      case "inputselect":
	if(($data[$key]!=="")&&(!$conf['values'][$data[$key]])) {
	  $error[]="'$conf[name]': Ungültiger Wert \"{$data[$key]}\"";
	}
	break;
      case "form":
        $err=form_check($conf["values"], $data[$key]);
        foreach($err as $e) {
          $error[]="'$conf[name]': $e";
        }
      default:
    }
  }

  global $form_errors;
  foreach($form_errors as $e) {
    $error[]=$e;
  }
  $form_errors=array();

  return $error;
}

function form_element_check($field, $conf, $data, $rek=1) {
  $error=array();

  # Wenn die Form submitted wurde, den Inhalt ueberpruefen
    switch($conf[type]) {
      case "text":
      case "integer":
        if($conf["values"]) {
          if(!ereg($conf["values"], $data[$field], $m)) {
            return $conf["valueserror"];
          }
        }
        break;
      case "person":
        if($data[$field]=="") {
          if($conf["values"])
            return $conf["valueserror"];
        }
        else {
          $res_test=sql("select * from person where displayname=\"$data[$field]\"");
          if(!sql_num_rows($res_test)) {

            if(ereg("^[0-9]*$", $data[$field])) {
              $res_test=sql("select * from person where personnummer=\"$data[$field]\"");
              if(!sql_num_rows($res_test))
                return "\"$data[$field]\" nicht gefunden";
            }
            else {
              $res_test=sql("select * from person where concat(vorname, ' ', nachname) like \"%$data[$field]%\"");
              switch(sql_num_rows($res_test)) {
                case 0:
                  return "\"$data[$field]\" nicht gefunden";
                  break;
                case 1:
                  break;
                default:
                  return "\"$data[$field]\" ist nicht eindeutig";
              }
            }
          }
        }
        break;
      case "date":
        if($data[$field]=="") {
          if($conf["values"])
            return $conf["valueserror"];
        }
        else {
          if(date_get_machine($data[$field])===null)
            return "Datumsformat nicht erkannt";

          if($conf["after"]) {
            $other_data=form_get_compare_data($data, $conf["after"]);
            if(date_is_after($other_data, $data[$field]))
              return "Datum nicht nach '$conf[after]'";
          }

          if($conf["before"]) {
            $other_data=form_get_compare_data($data, $conf["before"]);
            if(date_is_after($data[$field], $other_data))
              return "Datum nicht vor '$conf[before]'";
          }
        }

        break;
      case "datetime":
        if($data[$field]=="") {
          if($conf["values"])
            return $conf["valueserror"];
        }
        else {

          if(date_get_machine($data[$field], 2)===null) {
            if(date_get_machine($data[$field])===null)
              return "Datumsformat nicht erkannt";
            else
              return "Keine Uhrzeit angegeben";
          }

          if($conf["after"]) {
            $other_data=form_get_compare_data($data, $conf["after"]);
            if(date_is_after($other_data, $data[$field]))
              return "Datum nicht nach '$conf[after]'";
          }

          if($conf["before"]) {
            $other_data=form_get_compare_data($data, $conf["before"]);
            if(date_is_after($data[$field], $other_data))
              return "Datum nicht vor '$conf[before]'";
          }
        }

        break;
      case "time":
        if($data[$field]=="") {
          if($conf["values"])
            return $conf["valueserror"];
        }

        if(time_get_machine($data[$field])===null)
          return "Zeitformat nicht erkannt";

        break;
      case "password":
      case "textarea":
      case "select":
      case "multiselect":
      case "radio":
      case "checkbox":
      case "file":
      case "hidden":
        break;
      default:
        //print "Illegal Type of Field: \"$conf[2]\"!<br />\n";
    }

  return null;
}

function form_get_maxcount($def, $f, $data) {
  $conf=$def[$f];

  if(!$conf["count"])
    $maxcount=1;
  else {
    if(is_integer($conf["count"]))
      $maxcount=$conf["count"];
    else {
      if($data[$f])
        $maxcount=sizeof($data[$f]);
      else
        $maxcount=$conf["count"]["default"];
    }
  }

  return $maxcount;
}

function form_get_orig_data($orig_data, $varname) {
  if($varname=="") {
    return $orig_data;
  }
 
  if(ereg("^\\[?([a-zA-Z0-9_]*)\\]?(.*)$", $varname, $m)) {
    return form_get_orig_data($orig_data[$m[1]], $m[2]);
  }
}

function form_get_thisinputconf($def, $f, $data, $varname, $c) {
  global $form_orig_data;
  $conf=$def[$f];

  if(!$conf["count"]) {
    $id=0;
    $thisvarname="{$varname}[$f]";
    $morevarname="{$varname}[$f]";
    $v=$data[$f];
  }
  else {
    $id=rand(0, 10000);
    $thisvarname="{$varname}[$f][$c]";
    $morevarname="{$varname}[$f][NUM$id]";
    $v=$data[$f][$c];
  }
  $orig_v=form_get_orig_data($form_orig_data, $thisvarname);

  return array($thisvarname, $morevarname, $v, $id, $orig_v);
}

function form_get_inputstr($def, $f, $data, $maxcount, $varname, $moreparam) {
  $conf=$def[$f];
  $ret="";
  //print_r($moreparam);
  if($x=$moreparam["on_the_fly"]) {
    html_export_var(array("form_on_the_fly"=>$x));
  }
//  print "<br>data:";
//  print_r($data);

  for($c=0; $c<$maxcount; $c++) {
    $inputconf=form_get_thisinputconf($def, $f, $data, $varname, $c);
//    print "<br>inputconf:";
//    print_r($inputconf);
    $thisvarname=$inputconf[0];
    $morevarname=$inputconf[1];
    $v=$inputconf[2];
    $id=$inputconf[3];
    $orig_v=$inputconf[4];
    $more_param=$conf[more_param];
    $more_more_param=$conf[more_param];

    if($moreparam['cookie_remember']) {
      $cookie_name=$moreparam['cookie_remember'];
      $more_param.=" cookie_remember='{$cookie_name}'";
      $more_more_param.=" cookie_remember='{$cookie_name}'";

      $cookie=json_decode($_COOKIE[$cookie_name], true);
      if(isset($cookie[$thisvarname])) {
	$orig_v=$v;
	$v=$cookie[$thisvarname];
      }
    }

    unset($error);
    if($data) {
      if($error=form_element_check($f, $conf, $data)) {
        $ret.="<div class='form_error_msg'>$error</div>\n";
      }
    }

    if($conf["type"]!="form") {
      if(!isset($orig_v))
        $orig_v=$v;

      if(is_array($orig_v)) {
	foreach($orig_v as $orig_vv) {
	  $ret.="<input type='hidden' name='".form_element_orig_name($thisvarname)."[]' value=\"".htmlspecialchars($orig_vv)."\" />\n";
	}
      }
      else {
	$ret.="<input type='hidden' name='".form_element_orig_name($thisvarname)."' value=\"".htmlspecialchars($orig_v)."\" />\n";
      }

      if($error)
        $more_param.=" class='form_error'";
      elseif($orig_v==$v)
        $more_param.=" class='form_orig'";
      else
        $more_param.=" class='form_modified'";
      $more_more_param.=" class='form_orig'";
    }

    $more_param.=" form_name='$conf[name]' form_type='$conf[type]'";
    $more_more_param.=" form_name='$conf[name]' form_type='$conf[type]'";

    if($conf["match"]) {
      $more_param.=" form_match='$conf[match]' form_match_error='$conf[match_error]'";
      $more_more_param.=" form_match='$conf[match]' form_match_error='$conf[match_error]'";
    }

    if((in_array($conf[type], array("date", "datetime")))&&
       $conf["before"]) {
      $more_param.=" form_before='$conf[before]'";
      $more_more_param.=" form_before='$conf[before]'";
    }

    if((in_array($conf[type], array("date", "datetime")))&&
       $conf["after"]) {
      if(is_array($conf["after"]))
        $conf["after"]=implode(",", $conf["after"]);
      $more_param.=" form_after='$conf[after]'";
      $more_more_param.=" form_after='$conf[after]'";
    }

    if($conf["onchange"]) {
      $more_param.=" form_onchange='$conf[onchange]'";
      $more_more_param.=" form_onchange='$conf[onchange]'";
    }

    $ev=$v;
    $more_ret="";
    switch($conf["type"]) {
      case "inputselect":
        $data_id=uniqid();
	$ret.="<script type='text/javascript'>\nvar form_data_{$data_id}=".json_encode($conf['values']).";\n</script>\n";

	if(isset($conf['values'][$ev])) {
	  $x=$conf['values'][$ev];
	}
	else
	  $x=$ev;

	$ret.="<input type='text' name='$thisvarname' $more_param ".
	      "onChange='form_element_changed(this)' ".form_autocomp_init(array("values"=>"form_data_{$data_id}"))." value=\"".htmlspecialchars($x)."\"'/><br>\n";
        $more_ret.="<input type='text' name='$morevarname' $more_more_param ".
                   form_autocomp_init(array("values"=>"form_data_{$data_id}"))."/><br>\n";
        break;
      case "person":
        if(ereg("^[0-9]*$", $v)) {
          $res_forms_pers=sql("select * from person where person.personnummer='$v'");
          if($elem_forms_pers=sql_fetch_assoc($res_forms_pers))
            $ev=$elem_forms_pers[displayname];
        }
        else {
          $ev=array();
          $res_forms_pers=sql("select * from person where concat(vorname, ' ', nachname) like \"%$v%\"");
          while($elem_forms_pers=sql_fetch_assoc($res_forms_pers))
            $ev[]=$elem_forms_pers[displayname];
          if(sizeof($ev)==1)
            $ev=$ev[0];
          elseif(sizeof($ev)==0)
            $ev=$v;
        }

        if(is_array($ev)&&(sizeof($ev)>1)) {
          $ret.="<select name='$thisvarname' $more_param ".
              "onChange='form_element_changed(this)'>\n";
          foreach($ev as $k1=>$ev1) {
            $ret.="<option>$ev1</option>\n";
          }
          $ret.="</select><br>\n";
        }
        else {
          $ret.="<input type='text' name='$thisvarname' $more_param ".
                "value=\"".htmlspecialchars($ev)."\" onChange='form_element_changed(this)' ".autocomp_init("plugin/forms")."/><br>\n";
        }
        $more_ret.="<input type='text' name='$morevarname' $more_more_param ".
                   autocomp_init("plugin/forms")."/><br>\n";
        break;
      case "label":
        $ret.="$ev<br>\n";
        break;
      case "integer":
      case "text":
        $ret.="<input type='text' name='$thisvarname' $more_param onChange='form_element_changed(this)' onKeyUp='form_element_typing(this)' ".
              "value=\"".htmlspecialchars($ev)."\" /><br>\n";
        $more_ret.="<input type='text' name='$morevarname' $more_more_param onChange='form_element_changed(this)' onKeyUp='form_element_typing(this)' /><br>\n";
        break;
      case "date":
        if(!($ev=date_get_human($v, 3)))
          $ev=$v;
        $ret.="<input type='text' name='$thisvarname' id='$thisvarname' $more_param ".
              "value=\"".htmlspecialchars($ev)."\" onChange='form_element_changed(this)' /><img src='images/kalender.png' onClick='form_show_cal(\"$thisvarname\")' align='center'><br>\n";
        $more_ret.="<input type='text' name='$morevarname' $more_more_param onChange='form_element_changed(this)' /><br>\n";
        break;
      case "datetime":
        if(!($ev=date_get_human($v)))
          $ev=$v;
        $ret.="<input type='text' name='$thisvarname' id='$thisvarname' $more_param ".
              "value=\"".htmlspecialchars($ev)."\" onChange='form_element_changed(this)' /><img src='images/kalender.png' onClick='form_show_cal(\"$thisvarname\")' align='center'><br>\n";
        $more_ret.="<input type='text' id='$thisvarname' name='$morevarname' $more_more_param onChange='form_element_changed(this)' /><br>\n";
        break;
      case "time":
        if(!($ev=time_get_human($v)))
          $ev=$v;
        $ret.="<input type='text' name='$thisvarname' id='$thisvarname' $more_param ".
              "value=\"".htmlspecialchars($ev)."\" onChange='form_element_changed(this)' /><br>\n";
        $more_ret.="<input type='text' id='$thisvarname' name='$morevarname' $more_more_param onChange='form_element_changed(this)' /><br>\n";
        break;
      case "password":
        $ret.="<input type='password' name='$thisvarname' $more_param ".
              "value=\"".htmlspecialchars($ev)."\" onChange='form_element_changed(this)' />\n";
        $more_ret.="<input type='password' name='$morevarname' $more_more_param onChange='form_element_changed(this)' />\n";
        break;
      case "textarea": // <div onMouseOver='alert(\"bla\")'>
        $ret.="<table border='0' cellpadding='0' cellspacing='0'><tr><td><textarea name='$thisvarname' $more_param onChange='form_element_changed(this)' >";
        $ret.=htmlspecialchars($ev);
	$ret.="</textarea></td><td width='2' class='form_textarea_resize_e' onMouseDown='form_textarea_down(\"$thisvarname\", event)'></td></tr><tr><td height='2' class='form_textarea_resize_s' onMouseDown='form_textarea_down(\"$thisvarname\", event)'><td class='form_textarea_resize_se' onMouseDown='form_textarea_down(\"$thisvarname\", event)'></td></tr></table>\n";
        $more_ret.="<table border='0' cellpadding='0' cellspacing='0'><tr><td><textarea name='$morevarname' $more_more_param onChange='form_element_changed(this)' ></textarea></td><td width='2' class='form_textarea_resize_e' onMouseDown='form_textarea_down(\"$thisvarname\", event)'></td></tr><tr><td height='2' class='form_textarea_resize_s' onMouseDown='form_textarea_down(\"$thisvarname\", event)'><td class='form_textarea_resize_se' onMouseDown='form_textarea_down(\"$thisvarname\", event)'></td></tr></table>\n";
        break;
      case "select":
        $ret.="<select name='$thisvarname' $more_param onChange='form_element_changed(this)' >\n";
        $more_ret.="<select name='$morevarname' $more_more_param onChange='form_element_changed(this)' >\n";
        foreach($conf["values"] as $i=>$t) {
          $ret.="  <option value=\"".htmlspecialchars($i)."\"";
          $more_ret.="  <option value=\"".htmlspecialchars($i)."\"";
          if($v==$i)
            $ret.=" selected='selected'";
          $ret.=">$t</option>\n";
          $more_ret.=">$t</option>\n";
        }
        $ret.="</select>\n";
        break;
      case "multiselect":
        $ret.="<select name='{$thisvarname}[]' $more_param multiple='multiple' onChange='form_element_changed(this)' >\n";
        $more_ret.="<select name='{$morevarname}[]' $more_more_param multiple='multiple' onChange='form_element_changed(this)' >\n";
        if(!$v)
          $v=array();
        foreach($conf["values"] as $i=>$t) {
          $ret.="  <option value=\"".htmlspecialchars($i)."\"";
          $more_ret.="  <option value=\"".htmlspecialchars($i)."\"";
          if(in_array($i, $v))
            $ret.=" selected";
          $ret.=">$t</option>\n";
          $more_ret.=">$t</option>\n";
        }
        $ret.="</select>\n";
        $more_ret.="</select>\n";
        break;
      case "radio":
        foreach($conf["values"] as $i=>$t) {
          $ret.="<span class='form_orig'><input type='radio' id='$thisvarname-$i' name='$thisvarname' value=\"".htmlspecialchars($i)."\" $more_param";
          $more_ret.="<input class='form_orig' type='radio' id='$morevarname-$i' name='$morevarname' value=\"".htmlspecialchars($i)."\" $more_more_param";
          if($v==$i)
            $ret.=" checked='checked'";
          $ret.=" onChange='form_element_changed(this)' /><label for='$thisvarname-$i'>$t</label></span><br />\n";
          $more_ret.=" onChange='form_element_changed(this)' /><label for='$morevarname-$i'>$t</label></span><br />\n";
        }
        break;
      case "checkbox":
        if(!$v)
          $v=array();
        if(!$conf["values"]) {
          print "Warning: No Values for checkbox entered<br>\n";
          $conf["values"]=array();
        }
        foreach($conf["values"] as $i=>$t) {
          $ret.="<span class='form_orig'><input type='checkbox' id='$thisvarname-$i' name='{$thisvarname}[]' value=\"".htmlspecialchars($i)."\" $more_param";
          $more_ret.="<span class='form_orig'><input type='checkbox' id='$morevarname-$i' name='{$morevarname}[]' value=\"".htmlspecialchars($i)."\" $more_more_param";
          if(in_array($i, $v))
            $ret.=" checked";
          $ret.=" onChange='form_element_changed(this)' /><label for='$thisvarname-$i'>$t</label></span><br />\n";
          $more_ret.=" onChange='form_element_changed(this)' /><label for='$thisvarname-$i'>$t</label></span><br />\n";
        }
        break;
      case "file":
	$more_ret.="<input type='hidden' name='{$morevarname}' value='{$morevarname}'>\n";
	if($v['orig_name']) {
	  $ret.="<span id='{$thisvarname}-oldfile'>\n";
	  if(isset($conf['web_path'])) {
	    $link=strtr($conf['web_path'], array("[file_name]"=>$v['name']));
	    $ret.="<a href='{$link}'>{$v['orig_name']}</a>";
	  }
	  else
	    $ret.="{$v['orig_name']}";
	  $ret.=" <a href='javascript:form_file_overwrite(\"$thisvarname\")'>Change File</a>";
	  $ret.="</span>\n";
	  foreach(array("orig_name", "name", "size", "ext") as $k)
	    $ret.="<input type='hidden' name='{$thisvarname}[$k]' value=\"".htmlspecialchars($v[$k])."\">\n";
	}
	$ret.="<input type='hidden' name='{$thisvarname}[var]' value='{$thisvarname}'>\n";

	if($v['orig_name'])
	  $ret.="<span id='{$thisvarname}-newfile' style='display: none'>";
	$ret.="<span class='form_orig'><input type='file' name='{$thisvarname}' $more_param";
	$more_ret.="<span class='form_orig'><input type='file' name='{$morevarname}' $more_more_param";
	$ret.=" onChange='form_element_changed(this)' />$t</span>";
	if($v['orig_name'])
	  $ret.="</span>";
	$ret.="<br />\n";
	$more_ret.=" onChange='form_element_changed(this)' />$t</span><br />\n";
        break;
      case "hidden":
        $ret.="<input type='hidden' name='$thisvarname' $more_param ".
              "value=\"".htmlspecialchars($v)."\" />\n";
        $more_ret.="<input type='hidden' name='$morevarname' $more_more_param />\n";
        break;
      case "form":
        $ret.=form_show_format($conf["values"], $v, $thisvarname, $conf["format"]);
        $more_ret.=form_show_format($conf["values"], array(), $morevarname, $conf["format"]);
        break;
      default:
        $ret.="Illegal Type of Field!\n";
        $more_ret.="Illegal Type of Field!\n";
    }
  }

  if(is_array($conf["count"])) {
    $more_text=$conf["count"][more_text];
    if(!$more_text)
      $more_text="Element hinzuf&uuml;gen";
    html_export_var(array("form_$id"=>array($more_ret, $maxcount)));

    $ret.="<span id='form_mark_$id' onClick='form_add_element($id, form_$id)'>[+] $more_text</span>";
  }

  return $ret;
}

function form_show_format($def, $data, $varname, $format, $moreparam=array()) {
  if(!$format)
    return form_show($def, $data, $varname, $moreparam);

  //$id=random(1, 10000);
  //print_r($def);
  //html_export_var(array("form_def"=>$def));
  $list_fields=array();
  # Variablen initialisieren
  $ret="";
  $currpos=0;

  while(($p=strpos($format, "%", $currpos))!==false) {
    $ret.=substr($format, $currpos, $p-$currpos);
    $currpos=$p;

    $p=strpos($format, "%", $currpos+1);
    $field=substr($format, $currpos+1, $p-$currpos-1);
    if(eregi("^(.*)_(.*)$", $field, $m)) {
      $field=$m[1];
      $field_what=$m[2];
    }

    if($field_what=="name") {
      $ret.=$def[$field]["name"];
    }
    elseif($field_what=="field") {
      if(in_array($field, $list_fields))
        print "Warning: $field exists twice<br>\n";
      if(!$def[$field])
        print "Warning: nothing known about $field<br>\n";

      $maxcount=form_get_maxcount($def, $field, $data);

      $ret.=form_get_inputstr($def, $field, $data, $maxcount, $varname, $moreparam);
      $list_fields[]=$field;
    }

    $currpos=$p+1;
  }

  $ret.=substr($format, $currpos);
  foreach(array_keys($def) as $f) {
    if(!in_array($f, $list_fields))
      print "Warning: $f doesn't exist<br>\n";
  }

  return $ret;
}

function form_show($def, $data, $varname, $moreparam=array()) {
  # Variablen initialisieren
  $ret="";

  //html_export_var(array("form_def"=>$def));
  $ret.="<table class='form'>";

  # Die Form als String zusammenbasteln
  foreach($def as $field=>$conf) {
    $maxcount=form_get_maxcount($def, $field, $data);

    if($conf["type"]!="hidden") {
      $ret.="<tr><td class='field_desc'>";
      if((!isset($conf['hide_field_name']))||(!$conf['hide_field_name']))
	$ret.="<div class='form_name'>{$conf['name']}:</div>";
      $ret.="<div class='form_desc'>{$conf['desc']}</div></td>\n";
      $ret.="<td class='field_value'>\n";
    }

    $ret.=form_get_inputstr($def, $field, $data, $maxcount, $varname, $moreparam);

    if($conf["type"]!="hidden")
      $ret.="</td></tr>\n";
  }
  $ret.="</table>\n";

  return $ret;
}

function form_get_compare_data($data, $compare_attr) {
  $ret=array();
  foreach(split(",", $compare_attr) as $part) {
    if(ereg("\\[", $compare_attr)) {
      //return $_REQUEST[
    }
    else {
      $ret[]=$data[$part];
    }
  }

  return $ret;
}

function form_get_data($def, $data) {
  global $form_errors;

  if(!$data)
    return $data;

  $newdata=array();
  $str=array();
  foreach($data as $k=>$v) {
    if($def[$k]["count"]) {
      $count=sizeof($data[$k]);
    }
    else {
      $count=1;
    }

    for($i=0;$i<$count;$i++) {
      if($def[$k]["count"])
        $v=$data[$k][$i];
      else
        $v=$data[$k];

      switch($def[$k]["type"]) {
        case "text":
        case "integer":
        case "textarea":
        case "password":
        case "select":
        case "multiselect":
        case "radio":
        case "checkbox":
        case "hidden":
          $ev=$v;
          break;
        case "inputselect":
	  if($v=="") {
	    $ev=null;
	  }
	  else {
	    $x=array_search($v, $def[$k]['values']);
	    if($x===false)
	      $ev=$v;
	    else
	      $ev=$x;
	  }
	  break;
        case "person":
          if(ereg("^[0-9]$", $v)) {
            $res_t=sql("select person.personnummer from person join person_mhda ".
                       "on person.personnumer=person_mhda.personnummer ".
                       "where dienstnummer=\"$v\"");
            if(!sql_num_rows($res_t))
              unset($ev);
          }
          else {
            $res_t=sql("select person.personnummer from person ".
                       "where displayname=\"$v\"");
            if($elem_t=sql_fetch_assoc($res_t))
              $ev=$elem_t[personnummer];
            else {
              $res_t=sql("select personnummer from person ".
                      "where concat(vorname, ' ', nachname) like \"%$v%\"");
              if(sql_num_rows($res_t)==1) {
                $elem_t=sql_fetch_assoc($res_t);
                $ev=$elem_t[personnummer];
              }
              else
                unset($ev);
            }
          }
          break;
        case "date":
          unset($base);
          if($def[$k]["after"]) {
            $base=form_get_compare_data($data, $def[$k]["after"]);
          }

          if($ev=date_get_machine($v, $base, 1));
          else
            unset($ev);
          break;
        case "datetime":
          unset($base);
          if($def[$k]["after"]) {
            $base=form_get_compare_data($data, $def[$k]["after"]);
          }

          if($ev=date_get_machine($v, $base, 2));
          else
            unset($ev);
          break;
        case "time":
          if($ev=time_get_machine($v));
          else
            unset($ev);
          break;
        case "form":
          $ev=form_get_data($def[$k]["values"], $v);
          break;
	case "file":
	  // find path to variable
	  $path=preg_match("/^([a-zA-Z0-9]+)\[([a-zA-Z0-9\[\]]+)*\]$/", $v['var'], $m);
	  $var1=$m[1];
	  $varp=explode("][", $m[2]);

	  $error=false;

	  $x=$_FILES[$var1]['tmp_name'];
	  foreach($varp as $p)
	    $x=$x[$p];
	  $tmp_name=$x;

          if(!$tmp_name) {
	    // no file uploaded -> use old values
	    $ev=$v;
	  }
	  else {
	    // save name
	    $x=$_FILES[$var1]['name'];
	    foreach($varp as $p)
	      $x=$x[$p];
	    if(!$x)
	      $error=true;
	    $ev=array('orig_name'=>$x);

	    // extension
	    $ev['ext']="";
	    if(preg_match("/\.([a-zA-Z0-9]+)$/", $ev['orig_name'], $m))
	      $ev['ext']=strtolower($m[1]);
	    if(isset($def[$k]['accept_ext'])&&
	       (!in_array($ev['ext'], $def[$k]['accept_ext']))) {
	      $form_errors[]="{$def[$k]['name']}: Extension '{$ev['ext']}' nicht akzeptiert";
	      $error=true;
	    }

	    // save size
	    $x=$_FILES[$var1]['size'];
	    foreach($varp as $p)
	      $x=$x[$p];
	    $ev['size']=$x;

	    if($error===false) {
	      // build a new filename from the template
	      if(!$template=$def[$k]['template'])
		$template="[orig_name]";
	      $ev['name']=strtr($template, array(
		'[orig_name]'=>$ev['orig_name'],
		'[num]'=>$i,
		'[ext]'=>$ev['ext'],
		'[timestamp]'=>Date("Y-m-d-H-i-s"),
	      ));
	      // save file to directory (under new name)
	      move_uploaded_file($tmp_name, "{$def[$k]['path']}/{$ev['name']}");
	    }
	  }

	  // hide temporary value
	  $v=null;
	  if(isset($ev['var']))
	    unset($ev['var']);
	  if(!sizeof($ev))
	    $ev=null;

	  break;
        default:
          unset($ev);
      }

      if(isset($ev)) {
        if($def[$k]["count"])
          $newdata[$k][$i]=$ev;
        else
          $newdata[$k]=$ev;
      }
      else {
        // Zwar mit Fehlern, wird aber trotzdem zugewiesen
        if($def[$k]["count"])
          $newdata[$k][$i]=$v;
        else
          $newdata[$k]=$v;
      }
    }
  }

  return $newdata;
}

function form_check_access($form) {
  $access=$_SESSION['auth_access'];
  if(!isset($access))
    $access=array();

  foreach($form as $index=>$data) {
    if(!isset($data['access']))
      continue;
    if(is_string($data['access']))
      $data['access']=array($data['access']);
    if(!array_intersect($data['access'], $access))
      unset($form[$index]);
  }

  return $form;
}

function form_get_changed($form, $var_name) {
  global $form_orig_data;

  $data=form_get_data($form, $_REQUEST[$var_name]);
  $orig_data=form_get_orig_data($form_orig_data[$var_name]);

  $ret=array();
  foreach($form as $k=>$def) {
    if($data[$k]!=$orig_data[$k])
      $ret[$k]=$data[$k];
  }

  return $ret;
}

function form_autocomp_init($data, $search_msg="Searching ...", $error="Nothing found") {
  $ret="";

  if(is_string($data)) {
    $data=array('url'=>$data);
  }

  $ret.=" onKeyDown='form_autocomp_onkeydown(this, event)'";
  $ret.=" onKeyUp='form_autocomp_onkeyup(this, event)'";
  $ret.=" onKeyPress='form_autocomp_onkeypress(this, event)'";
  $ret.=" onFocus='form_autocomp_onfocus(this, event)'";
  $ret.=" onBlur='form_autocomp_onblur(this, event)'";
  $ret.=" autocomplete='off'";
  if(isset($data['url']))
    $ret.=" form_autocomp_url=\"{$data['url']}\"";
  if(isset($data['values']))
    $ret.=" form_autocomp_values=\"{$data['values']}\"";
  $ret.=" form_autocomp_search_msg=\"$search_msg\"";
  $ret.=" form_autocomp_error=\"$error\"";

  return $ret;
}
