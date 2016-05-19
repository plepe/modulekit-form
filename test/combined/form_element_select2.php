<?php
$def = array(
  'test' => array(
    'type' => 'select',
    'name'=>'Test',
    'values' => array(
      'foo' => 'Foo',
      'bar' => 'Bar',
      'bla' => 'Bla',
      '3' => '3',
      '2' => '2',
      '4' => '4',
    )
  )
);
$data = array('test' => 'foo');
$form = new form('data', $def);
$form->set_data($data);
