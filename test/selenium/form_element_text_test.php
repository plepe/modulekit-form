<?php
class form_element_text_test extends PHPUnit_Extensions_Selenium2TestCase {
  public function setUp() {
  }

  public function validInputProvider() {
    $inputs[] = array(
      array(array('data' => array('text' => 'Max')))
    );

    return $inputs;
  }

  public function testFormSubmission() {
    $this->byId('test_form')->submit();
  }

  public function tearDown() {
    $this->stop();
  }
}
