<?php
class form_element_checkbox_test extends PHPUnit_Framework_TestCase {
  public function testRenderArray() {
    $_REQUEST['data'] = array(
      'test' => array('foo', 'bar'),
    );

    $form = new form('data', array(
      'test' => array(
        'name' => 'Test',
        'type' => 'checkbox',
        'values' => array('foo', 'bar', 'bla'),
      ),
    ));

    $dom = new DOMDocument();
    $node = $form->element->elements['test']->show_element($dom);
    $dom->appendChild($node);
    $result = trim($dom->saveHTML());
    $this->assertEquals(
      '<span class="form_element_checkbox" id="data_test"><span class="form_orig"><input type="checkbox" id="data_test-foo" name="data[test][]" value="foo" checked><label for="data_test-foo">foo</label></span><span class="form_orig"><input type="checkbox" id="data_test-bar" name="data[test][]" value="bar" checked><label for="data_test-bar">bar</label></span><span class="form_orig"><input type="checkbox" id="data_test-bla" name="data[test][]" value="bla"><label for="data_test-bla">bla</label></span></span>',
      $result
    );

    $this->assertEquals(array(
      'test' => array('foo', 'bar'),
    ), $form->get_data());
  }

  public function testRenderHash() {
    $_REQUEST['data'] = array(
      'test' => array('foo', 'bar'),
    );

    $form = new form('data', array(
      'test' => array(
        'name' => 'Test',
        'type' => 'checkbox',
        'values' => array('foo' => "Foo", 'bar' => "Bar", 'bla' => "Bla"),
      ),
    ));

    $dom = new DOMDocument();
    $node = $form->element->elements['test']->show_element($dom);
    $dom->appendChild($node);
    $result = trim($dom->saveHTML());
    $this->assertEquals(
      '<span class="form_element_checkbox" id="data_test"><span class="form_orig"><input type="checkbox" id="data_test-foo" name="data[test][]" value="foo" checked><label for="data_test-foo">Foo</label></span><span class="form_orig"><input type="checkbox" id="data_test-bar" name="data[test][]" value="bar" checked><label for="data_test-bar">Bar</label></span><span class="form_orig"><input type="checkbox" id="data_test-bla" name="data[test][]" value="bla"><label for="data_test-bla">Bla</label></span></span>',
      $result
    );

    $this->assertEquals(array(
      'test' => array('foo', 'bar'),
    ), $form->get_data());
  }

  public function testRenderComplexHash() {
    $_REQUEST['data'] = array(
      'test' => array('foo', 'bar'),
    );

    $form = new form('data', array(
      'test' => array(
        'name' => 'Test',
        'type' => 'checkbox',
        'values' => array('foo' => array("name" => "Foo", "desc" => "Foo Desc"), 'bar' => array("name" => "Bar"), 'bla' => "Bla"),
      ),
    ));

    $dom = new DOMDocument();
    $node = $form->element->elements['test']->show_element($dom);
    $dom->appendChild($node);
    $result = trim($dom->saveHTML());
    $this->assertEquals(
      '<span class="form_element_checkbox" id="data_test"><span class="form_orig"><input type="checkbox" id="data_test-foo" name="data[test][]" value="foo" checked><label for="data_test-foo">Foo</label><span class="description">Foo Desc</span></span><span class="form_orig"><input type="checkbox" id="data_test-bar" name="data[test][]" value="bar" checked><label for="data_test-bar">Bar</label></span><span class="form_orig"><input type="checkbox" id="data_test-bla" name="data[test][]" value="bla"><label for="data_test-bla">Bla</label></span></span>',
      $result
    );

    $this->assertEquals(array(
      'test' => array('foo', 'bar'),
    ), $form->get_data());
  }
}
