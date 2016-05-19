<?php
$def = array(
  'test' => array(
    'type' => 'select',
    'name'=>'Test',
    'values' => array(
      'foo', 'bar', 'bla',
    )
  )
);
$data = array('test' => 'foo');
$form = new form('data', $def);
$form->set_data($data);
