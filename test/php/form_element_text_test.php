<?php
class form_element_text_test extends PHPUnit_Framework_TestCase {
  public function testReadTextFromRequest() {
    $_REQUEST['data'] = array(
      'text' => 'foo bar test'
    );

    $form = new form('data', array(
      'text' => array(
        'name' => 'Text',
        'type' => 'text',
      ),
    ));

    // is_complete?
    $this->assertEquals(true, $form->is_complete());
    // data?
    $this->assertEquals(array(
      'text' => 'foo bar test'
    ), $form->get_data());
  }

  public function testEmptyvalueIsNull() {
    $_REQUEST['data'] = array(
      'text' => '',
    );

    $form = new form('data', array(
      'text' => array(
        'name' => 'Text',
        'type' => 'text',
      ),
    ));

    // is_complete?
    $this->assertEquals(true, $form->is_complete());
    // data?
    $this->assertEquals(array(
      'text' => null,
    ), $form->get_data());
  }

  public function testReqEmptyvalue() {
    $_REQUEST['data'] = array(
      'text' => '',
    );

    $form = new form('data', array(
      'text' => array(
        'name' => 'Text',
        'type' => 'text',
        'req'  => true,
      ),
    ));

    // is_complete?
    $this->assertEquals(false, $form->is_complete());
    // data?
    $this->assertEquals(array(
      'text' => null,
    ), $form->get_data());
    // errors?
    $this->assertEquals(array(
      'Text: Value is mandatory.',
    ), $form->errors());
  }

  public function testOverrideEmptyvalue() {
    $_REQUEST['data'] = array(
      'text' => '',
    );

    $form = new form('data', array(
      'text' => array(
        'name' => 'Text',
        'type' => 'text',
        'empty_value'  => 'foobar',
      ),
    ));

    // is_complete?
    $this->assertEquals(true, $form->is_complete());
    // data?
    $this->assertEquals(array(
      'text' => 'foobar',
    ), $form->get_data());
  }

  public function testRegexp() {
    $_REQUEST['data'] = array(
      'text' => 'bar',
    );

    $form = new form('data', array(
      'text' => array(
        'name' => 'Text',
        'type' => 'text',
        'check'  => array('regexp', '^foo'),
      ),
    ));

    // is_complete?
    $this->assertEquals(false, $form->is_complete());
    // data?
    $this->assertEquals(array(
      'text' => 'bar',
    ), $form->get_data());
  }

  public function testMaxLength1() {
    $_REQUEST['data'] = array(
      'text' => '012345',
    );

    $form = new form('data', array(
      'text' => array(
        'name' => 'Text',
        'type' => 'text',
        'max_length' => 5,
      ),
    ));

    // is_complete?
    $this->assertEquals(false, $form->is_complete());
    // data?
    $this->assertEquals(array(
      'text' => '012345',
    ), $form->get_data());
    // errors?
    $this->assertEquals(array(
      'Text: Value is longer than 5 characters.',
    ), $form->errors());
  }

  public function testMaxLength2() {
    $_REQUEST['data'] = array(
      'text' => '01234',
    );

    $form = new form('data', array(
      'text' => array(
        'name' => 'Text',
        'type' => 'text',
        'max_length' => 5,
      ),
    ));

    // is_complete?
    $this->assertEquals(true, $form->is_complete());
    // data?
    $this->assertEquals(array(
      'text' => '01234',
    ), $form->get_data());
  }
}
