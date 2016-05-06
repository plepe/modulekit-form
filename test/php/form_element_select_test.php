<?php
class form_element_select_test extends PHPUnit_Framework_TestCase {
  public function testRenderArray() {
    $_REQUEST['data'] = array(
      'test' => '2'
    );

    $form = new form('data', array(
      'test' => array(
        'name' => 'Test',
        'type' => 'select',
        'values' => array('foo', 'bar', 'bla'),
      ),
    ));

    $dom = new DOMDocument();
    $node = $form->element->elements['test']->show_element($dom);
    $dom->appendChild($node);
    $result= $dom->saveHTML();
    $this->assertEquals(
      "<span class=\"form_element_select\" id=\"data_test\"><select name=\"data[test]\" id=\"data_test\"><option value=\"\">-- please select --</option><option value=\"foo\">foo</option><option value=\"bar\">bar</option><option value=\"bla\">bla</option></select><div class=\"description\"><span></span></div></span>\n",
      $result
    );
  }

  public function testRenderHash() {
    $_REQUEST['data'] = array(
      'test' => 'bar'
    );

    $form = new form('data', array(
      'test' => array(
        'name' => 'Test',
        'type' => 'select',
        'values' => array('foo' => "Foo", 'bar' => "Bar", 'bla' => "Bla"),
      ),
    ));

    $dom = new DOMDocument();
    $node = $form->element->elements['test']->show_element($dom);
    $dom->appendChild($node);
    $result= $dom->saveHTML();
    $this->assertEquals(
      "<span class=\"form_element_select\" id=\"data_test\"><select name=\"data[test]\" id=\"data_test\"><option value=\"\">-- please select --</option><option value=\"foo\">Foo</option><option value=\"bar\" selected>Bar</option><option value=\"bla\">Bla</option></select><div class=\"description\"><span></span></div></span>\n",
      $result
    );
  }

  public function testRenderComplexHash() {
    $_REQUEST['data'] = array(
      'test' => 'bar'
    );

    $form = new form('data', array(
      'test' => array(
        'name' => 'Test',
        'type' => 'select',
        'values' => array('foo' => array("name" => "Foo", "desc" => "Foo Desc"), 'bar' => array("name" => "Bar"), 'bla' => "Bla"),
      ),
    ));

    $dom = new DOMDocument();
    $node = $form->element->elements['test']->show_element($dom);
    $dom->appendChild($node);
    $result= $dom->saveHTML();
    $this->assertEquals(
      "<span class=\"form_element_select\" id=\"data_test\"><select name=\"data[test]\" id=\"data_test\"><option value=\"\">-- please select --</option><option value=\"foo\">Foo</option><option value=\"bar\" selected>Bar</option><option value=\"bla\">Bla</option></select><div class=\"description\"><span><ul><li><b>Foo</b>: Foo Desc</li></ul></span></div></span>\n",
      $result
    );
  }

}
