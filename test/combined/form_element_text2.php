<?php
$def = array('test'=>array('type'=>'text', 'name'=>'Test'));
$data = array('test' => 'foobar');
$form = new form('data', $def);
$form->set_data($data);
