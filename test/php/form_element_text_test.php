<?php
class form_element_text_test extends PHPUnit_MochaPhantomJS {
  public function testReadTextFromRequest() {
    $def = array(
      'text' => array(
        'name' => 'Text',
        'type' => 'text',
      ),
    );

    $form = new form('data', $def);
    $form->set_data(array("text" => "test"));

    $this->run_combined($form, <<<EOT
// Change form data
document.getElementsByName("data[text]")[0].value = "foo bar test";

// Tests
describe("form_element_text", function() {
  it("form_data is defined", function() {
    assert.isObject(form_data);
  });
  it("status", function() {
    // TODO: when will has_data will be set to true?
    // assert.equal(form_data.is_complete(), true);
    assert.deepEqual(form_data.get_data(), { text: "foo bar test" });
  });
});
EOT
    );

    // Reload form after submitting
    $form = new form('data', $def);

    // is_complete?
    $this->assertEquals(true, $form->is_complete());
    // data?
    $this->assertEquals(array(
      'text' => 'foo bar test'
    ), $form->get_data());
  }

  public function testEmptyvalueIsNull() {
    $def = array(
      'text' => array(
        'name' => 'Text',
        'type' => 'text',
      ),
    );

    $form = new form('data', $def);

    // is_complete? (not submitted yet)
    $this->assertEquals(false, $form->is_complete());
    // data?
    $this->assertEquals(array(
      'text' => null,
    ), $form->get_data());

    $this->run_combined($form, <<<EOT
// Change form data
document.getElementsByName("data[text]")[0].value = "";

// Tests
describe("form_element_text", function() {
  it("form_data is defined", function() {
    assert.isObject(form_data);
  });
  it("status", function() {
    // TODO: when will has_data will be set to true?
    // assert.equal(form_data.is_complete(), true);
    assert.deepEqual(form_data.get_data(), { text: null });
  });
});
EOT
    );

    // Reload form after submitting
    $form = new form('data', $def);

    // is_complete?
    $this->assertEquals(true, $form->is_complete());
    // data?
    $this->assertEquals(array(
      'text' => null,
    ), $form->get_data());
  }

  public function testReqEmptyvalue() {
    $def = array(
      'text' => array(
        'name' => 'Text',
        'type' => 'text',
        'req'  => true,
      ),
    );

    $form = new form('data', $def);

    $this->run_combined($form, <<<EOT
// Change form data
document.getElementsByName("data[text]")[0].value = "";

// Tests
describe("form_element_text", function() {
  it("form_data is defined", function() {
    assert.isObject(form_data);
  });
  it("status", function() {
    // TODO: when will has_data will be set to true?
    // assert.equal(form_data.is_complete(), true);
    assert.deepEqual(form_data.get_data(), { text: null });
    assert.deepEqual(form_data.errors(), [ 'Text: Value is mandatory.' ]);
  });
});
EOT
    );

    // Reload form after submitting
    $form = new form('data', $def);

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
    $def = array(
      'text' => array(
        'name' => 'Text',
        'type' => 'text',
        'empty_value'  => 'foobar',
      ),
    );

    $form = new form('data', $def);

    $this->run_combined($form, <<<EOT
// Change form data
document.getElementsByName("data[text]")[0].value = "";

// Tests
describe("form_element_text", function() {
  it("form_data is defined", function() {
    assert.isObject(form_data);
  });
  it("status", function() {
    // TODO: when will has_data will be set to true?
    // assert.equal(form_data.is_complete(), true);
    assert.deepEqual(form_data.get_data(), { text: 'foobar' });
  });
});
EOT
    );

    // Reload form after submitting
    $form = new form('data', $def);

    // is_complete?
    $this->assertEquals(true, $form->is_complete());
    // data?
    $this->assertEquals(array(
      'text' => 'foobar',
    ), $form->get_data());
  }

  public function testRegexp() {
    $def = array(
      'text' => array(
        'name' => 'Text',
        'type' => 'text',
        'check'  => array('regexp', '^foo'),
      ),
    );

    $form = new form('data', $def);

    $this->run_combined($form, <<<EOT
// Change form data
document.getElementsByName("data[text]")[0].value = "bar";

// Tests
describe("form_element_text", function() {
  it("form_data is defined", function() {
    assert.isObject(form_data);
  });
  it("status", function() {
    // TODO: when will has_data will be set to true?
    // assert.equal(form_data.is_complete(), true);
    assert.deepEqual(form_data.get_data(), { text: 'bar' });
    assert.deepEqual(form_data.errors(), [ 'Text: Invalid value.' ]);
  });
});
EOT
    );

    // Reload form after submitting
    $form = new form('data', $def);

    // is_complete?
    $this->assertEquals(false, $form->is_complete());
    // data?
    $this->assertEquals(array(
      'text' => 'bar',
    ), $form->get_data());
    // errors?
    $this->assertEquals(array(
      'Text: Ungültiger Wert',
    ), $form->errors());
  }

  public function testMaxLength1() {
    $def = array(
      'text' => array(
        'name' => 'Text',
        'type' => 'text',
        'max_length' => 5,
      ),
    );

    $form = new form('data', $def);

    $this->run_combined($form, <<<EOT
// Change form data
document.getElementsByName("data[text]")[0].value = "012345";

// Tests
describe("form_element_text", function() {
  it("form_data is defined", function() {
    assert.isObject(form_data);
  });
  it("status", function() {
    // TODO: when will has_data will be set to true?
    // assert.equal(form_data.is_complete(), true);
    assert.deepEqual(form_data.get_data(), { text: '012345' });
    assert.deepEqual(form_data.errors(), [ 'Text: Value is longer than 5 characters.' ]);
  });
});
EOT
    );

    // Reload form after submitting
    $form = new form('data', $def);

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
    $def = array(
      'text' => array(
        'name' => 'Text',
        'type' => 'text',
        'max_length' => 5,
      ),
    );

    $form = new form('data', $def);

    $this->run_combined($form, <<<EOT
// Change form data
document.getElementsByName("data[text]")[0].value = "01234";

// Tests
describe("form_element_text", function() {
  it("form_data is defined", function() {
    assert.isObject(form_data);
  });
  it("status", function() {
    // TODO: when will has_data will be set to true?
    // assert.equal(form_data.is_complete(), true);
    assert.deepEqual(form_data.get_data(), { text: '01234' });
    assert.deepEqual(form_data.errors(), false);
  });
});
EOT
    );

    // Reload form after submitting
    $form = new form('data', $def);

    // is_complete?
    $this->assertEquals(true, $form->is_complete());
    // data?
    $this->assertEquals(array(
      'text' => '01234',
    ), $form->get_data());
  }

  public function testRenderSimple() {
    $def = array(
      'test' => array(
        'name' => 'Text',
        'type' => 'text',
      ),
    );

    $form = new form('data', $def);

    $this->run_combined($form, <<<EOT
// Change form data
document.getElementsByName("data[test]")[0].value = "foo bar test";

// Tests
describe("form_element_text", function() {
  it("form_data is defined", function() {
    assert.isObject(form_data);
  });
  it("status", function() {
    // TODO: when will has_data will be set to true?
    // assert.equal(form_data.is_complete(), true);
    assert.deepEqual(form_data.get_data(), { test: 'foo bar test' });
    assert.deepEqual(form_data.errors(), false);
  });
});
EOT
    );

    // Reload form after submitting
    $form = new form('data', $def);

    $dom = new DOMDocument();
    $node = $form->element->elements['test']->show_element($dom);
    $dom->appendChild($node);
    $result= trim($dom->saveHTML());
    $this->assertEquals(
      '<span class="form_element_text" id="data_test"><input type="text" class="form_modified" name="data[test]" value="foo bar test"></span>',
      $result
    );

    $this->assertEquals(array(
      'test' => 'foo bar test',
    ), $form->get_data());
  }

  public function testRenderValuesArray() {
    $def = array(
      'test' => array(
        'name' => 'Test',
        'type' => 'text',
        'values' => array('foo', 'bar', 'bla'),
      ),
    );

    $form = new form('data', $def);

    $this->run_combined($form, <<<EOT
// Change form data
document.getElementsByName("data[test]")[0].value = "bar";

// Tests
describe("form_element_text", function() {
  it("form_data is defined", function() {
    assert.isObject(form_data);
  });
  it("status", function() {
    // TODO: when will has_data will be set to true?
    // assert.equal(form_data.is_complete(), true);
    assert.deepEqual(form_data.get_data(), { test: 'bar' });
    assert.deepEqual(form_data.errors(), false);
  });
});
EOT
    );

    // Reload form after submitting
    $form = new form('data', $def);

    $dom = new DOMDocument();
    $node = $form->element->elements['test']->show_element($dom);
    $dom->appendChild($node);
    $result= trim($dom->saveHTML());
    $this->assertEquals(
      '<span class="form_element_text" id="data_test"><span class="form_datalist_container"><datalist id="data_test-datalist"><option value="foo">foo</option><option value="bar">bar</option><option value="bla">bla</option></datalist></span><input type="text" class="form_modified" name="data[test]" value="bar" list="data_test-datalist"></span>',
      $result
    );

    $this->assertEquals(array(
      'test' => 'bar',
    ), $form->get_data());
  }

  public function testRenderValuesHash() {
    $def = array(
      'test' => array(
        'name' => 'Test',
        'type' => 'text',
        'values' => array('foo' => "Foo", 'bar' => "Bar", 'bla' => "Bla"),
      ),
    );

    $form = new form('data', $def);

    $this->run_combined($form, <<<EOT
// Change form data
document.getElementsByName("data[test]")[0].value = "bar";

// Tests
describe("form_element_text", function() {
  it("form_data is defined", function() {
    assert.isObject(form_data);
  });
  it("status", function() {
    // TODO: when will has_data will be set to true?
    // assert.equal(form_data.is_complete(), true);
    assert.deepEqual(form_data.get_data(), { test: 'bar' });
    assert.deepEqual(form_data.errors(), false);
  });
});
EOT
    );

    // Reload form after submitting
    $form = new form('data', $def);

    $dom = new DOMDocument();
    $node = $form->element->elements['test']->show_element($dom);
    $dom->appendChild($node);
    $result= trim($dom->saveHTML());
    $this->assertEquals(
      '<span class="form_element_text" id="data_test"><span class="form_datalist_container"><datalist id="data_test-datalist"><option value="Foo">Foo</option><option value="Bar">Bar</option><option value="Bla">Bla</option></datalist></span><input type="text" class="form_modified" name="data[test]" value="bar" list="data_test-datalist"></span>',
      $result
    );

    $this->assertEquals(array(
      'test' => 'bar',
    ), $form->get_data());
  }

  public function testRenderValuesComplexHash() {
    $def = array(
      'test' => array(
        'name' => 'Test',
        'type' => 'text',
        'values' => array('foo' => array("name" => "Foo", "desc" => "Foo Desc"), 'bar' => array("name" => "Bar"), 'bla' => "Bla"),
      ),
    );

    $form = new form('data', $def);

    $this->run_combined($form, <<<EOT
// Change form data
document.getElementsByName("data[test]")[0].value = "bar";

// Tests
describe("form_element_text", function() {
  it("form_data is defined", function() {
    assert.isObject(form_data);
  });
  it("status", function() {
    // TODO: when will has_data will be set to true?
    // assert.equal(form_data.is_complete(), true);
    assert.deepEqual(form_data.get_data(), { test: 'bar' });
    assert.deepEqual(form_data.errors(), false);
  });
});
EOT
    );

    // Reload form after submitting
    $form = new form('data', $def);

    $dom = new DOMDocument();
    $node = $form->element->elements['test']->show_element($dom);
    $dom->appendChild($node);
    $result= trim($dom->saveHTML());
    $this->assertEquals(
      '<span class="form_element_text" id="data_test"><span class="form_datalist_container"><datalist id="data_test-datalist"><option value="Foo">Foo</option><option value="Bar">Bar</option><option value="Bla">Bla</option></datalist></span><input type="text" class="form_modified" name="data[test]" value="bar" list="data_test-datalist"></span>',
      $result
    );

    $this->assertEquals(array(
      'test' => 'bar',
    ), $form->get_data());
  }
}
