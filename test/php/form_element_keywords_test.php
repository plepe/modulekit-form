<?php
class form_element_keywords_test extends PHPUnit_Framework_TestCase {
  public function testRenderArray() {
    $_REQUEST['data'] = array(
      'test' => "bar, blubb",
    );

    $form = new form('data', array(
      'test' => array(
        'name' => 'Test',
        'type' => 'keywords',
        'values' => array('foo', 'bar', 'bla'),
      ),
    ));

    $dom = new DOMDocument();
    $node = $form->element->elements['test']->show_element($dom);
    $dom->appendChild($node);
    $result = trim($dom->saveHTML());
    $this->assertEquals(
      '<span class="form_element_keywords" id="data_test"><datalist id="data_test-datalist"><option value="foo"></option><option value="bar"></option><option value="bla"></option></datalist><input type="text" class="form_modified" name="data[test]" value="bar, blubb"></span>',
      $result
    );

    $this->assertEquals(array(
      'test' => array('bar', 'blubb'),
    ), $form->get_data());
  }

  public function testRenderHash() {
    $_REQUEST['data'] = array(
      'test' => "bar, blubb",
    );

    $form = new form('data', array(
      'test' => array(
        'name' => 'Test',
        'type' => 'keywords',
        'values' => array('foo' => "Foo", 'bar' => "Bar", 'bla' => "Bla"),
      ),
    ));

    $dom = new DOMDocument();
    $node = $form->element->elements['test']->show_element($dom);
    $dom->appendChild($node);
    $result = trim($dom->saveHTML());
    $this->assertEquals(
      '<span class="form_element_keywords" id="data_test"><datalist id="data_test-datalist"><option value="Foo"></option><option value="Bar"></option><option value="Bla"></option></datalist><input type="text" class="form_modified" name="data[test]" value="bar, blubb"></span>',
      $result
    );

    $this->assertEquals(array(
      'test' => array('bar', 'blubb'),
    ), $form->get_data());
  }

  public function testRenderComplexHash() {
    $_REQUEST['data'] = array(
      'test' => "bar, blubb",
    );

    $form = new form('data', array(
      'test' => array(
        'name' => 'Test',
        'type' => 'keywords',
        'values' => array('foo' => array("name" => "Foo", "desc" => "Foo Desc"), 'bar' => array("name" => "Bar"), 'bla' => "Bla"),
      ),
    ));

    $dom = new DOMDocument();
    $node = $form->element->elements['test']->show_element($dom);
    $dom->appendChild($node);
    $result = trim($dom->saveHTML());
    $this->assertEquals(
      '<span class="form_element_keywords" id="data_test"><datalist id="data_test-datalist"><option value="Foo"></option><option value="Bar"></option><option value="Bla"></option></datalist><input type="text" class="form_modified" name="data[test]" value="bar, blubb"></span>',
      $result
    );

    $this->assertEquals(array(
      'test' => array('bar', 'blubb'),
    ), $form->get_data());
  }

  public function testRenderValuesKey() {
    $_REQUEST['data'] = array(
      'test' => "bar, blubb",
    );

    $form = new form('data', array(
      'test' => array(
        'name' => 'Test',
        'type' => 'keywords',
        'values' => array(
          array('key' => 'foo', "name" => "Foo", "desc" => "Foo Desc"),
          array('key' => 'bar', "name" => "Bar"),
          array('key' => 'bla', "name" => "Bla"),
        ),
      ),
    ));

    $dom = new DOMDocument();
    $node = $form->element->elements['test']->show_element($dom);
    $dom->appendChild($node);
    $result = trim($dom->saveHTML());
    $this->assertEquals(
      '<span class="form_element_keywords" id="data_test"><datalist id="data_test-datalist"><option value="Foo"></option><option value="Bar"></option><option value="Bla"></option></datalist><input type="text" class="form_modified" name="data[test]" value="bar, blubb"></span>',
      $result
    );

    $this->assertEquals(array(
      'test' => array('bar', 'blubb'),
    ), $form->get_data());
  }

  public function testRenderValuesSimple() {
    $_REQUEST['data'] = array(
      'test' => "bar, blubb",
    );

    $form = new form('data', array(
      'test' => array(
        'name' => 'Test',
        'type' => 'keywords',
        'values' => array(
          array('foo', "Foo"),
          array('bar', "Bar"),
          array('bla', "Bla"),
        ),
      ),
    ));

    $dom = new DOMDocument();
    $node = $form->element->elements['test']->show_element($dom);
    $dom->appendChild($node);
    $result = trim($dom->saveHTML());
    $this->assertEquals(
      '<span class="form_element_keywords" id="data_test"><datalist id="data_test-datalist"><option value="Foo"></option><option value="Bar"></option><option value="Bla"></option></datalist><input type="text" class="form_modified" name="data[test]" value="bar, blubb"></span>',
      $result
    );

    $this->assertEquals(array(
      'test' => array('bar', 'blubb'),
    ), $form->get_data());
  }
}
