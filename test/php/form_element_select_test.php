<?php
class form_element_select_test extends PHPUnit_MochaPhantomJS {
  public function testRenderArray() {
    $def = array(
      'test' => array(
        'name' => 'Test',
        'type' => 'select',
        'values' => array(3, 'foo', 1, 'bar', 'bla', 2),
      ),
    );

    $form = new form('data', $def);

    $this->run_combined($form, <<<EOT
// Change form data
form_data.set_data({ test: "bar" });
// document.getElementsByName("data[test]")[0].value = "bar";

// Tests
describe("form_element_select", function() {
  it("form_data is defined", function() {
    assert.isObject(form_data);
  });
  it("status", function() {
    // TODO: when will has_data will be set to true?
    // assert.equal(form_data.is_complete(), true);
    assert.deepEqual(form_data.get_data(), { test: "bar" });
  });
});
EOT
    );

    // Reload form after submitting
    $form = new form('data', $def);

    $dom = new DOMDocument();
    $node = $form->element->elements['test']->show_element($dom);
    $result = $this->toXML($node);
    $expected = <<<EOT
<span class="form_element_select" id="data_test">
  <select name="data[test]" id="data_test">
    <option value="">-- please select --</option>
    <option value="3">3</option>
    <option value="foo">foo</option>
    <option value="1">1</option>
    <option value="bar" selected="selected">bar</option>
    <option value="bla">bla</option>
    <option value="2">2</option>
  </select>
  <div class="description">
    <span/>
  </div>
</span>
EOT;

    $this->assertEquals($expected, $result);

    $this->assertEquals(array(
      'test' => 'bar',
    ), $form->get_data());
  }

  public function testRenderHash() {
    $def = array(
      'test' => array(
        'name' => 'Test',
        'type' => 'select',
        'values' => array(2 => 'Two', 'foo' => "Foo", 1 => 'One', 'bar' => "Bar", 'bla' => "Bla", 3 => 'Three'),
      ),
    );

    $form = new form('data', $def);

    $this->run_combined($form, <<<EOT
// Change form data
form_data.set_data({ test: "bar" });
// document.getElementsByName("data[test]")[0].value = "bar";

// Tests
describe("form_element_select", function() {
  it("form_data is defined", function() {
    assert.isObject(form_data);
  });
  it("status", function() {
    // TODO: when will has_data will be set to true?
    // assert.equal(form_data.is_complete(), true);
    assert.deepEqual(form_data.get_data(), { test: "bar" });
  });
});
EOT
    );

    // Reload form after submitting
    $form = new form('data', $def);

    $dom = new DOMDocument();
    $node = $form->element->elements['test']->show_element($dom);
    $result = $this->toXML($node);
    $expected = <<<EOT
<span class="form_element_select" id="data_test">
  <select name="data[test]" id="data_test">
    <option value="">-- please select --</option>
    <option value="2">Two</option>
    <option value="foo">Foo</option>
    <option value="1">One</option>
    <option value="bar" selected="selected">Bar</option>
    <option value="bla">Bla</option>
    <option value="3">Three</option>
  </select>
  <div class="description">
    <span/>
  </div>
</span>
EOT;
    $this->assertEquals($expected, $result);

    $this->assertEquals(array(
      'test' => 'bar',
    ), $form->get_data());
  }

  public function testRenderComplexHash() {
    $def = array(
      'test' => array(
        'name' => 'Test',
        'type' => 'select',
        'values' => array(2 => array('name' => 'Two', 'desc' => '2'), 'foo' => array("name" => "Foo", "desc" => "Foo Desc"), 1 => array('name' => 'One', 'desc' => '1'), 'bar' => array("name" => "Bar"), 'bla' => "Bla", 3 => 'Three'),
      ),
    );

    $form = new form('data', $def);

    $this->run_combined($form, <<<EOT
// Change form data
form_data.set_data({ test: "bar" });
// document.getElementsByName("data[test]")[0].value = "bar";

// Tests
describe("form_element_select", function() {
  it("form_data is defined", function() {
    assert.isObject(form_data);
  });
  it("status", function() {
    // TODO: when will has_data will be set to true?
    // assert.equal(form_data.is_complete(), true);
    assert.deepEqual(form_data.get_data(), { test: "bar" });
  });
});
EOT
    );

    // Reload form after submitting
    $form = new form('data', $def);

    $dom = new DOMDocument();
    $node = $form->element->elements['test']->show_element($dom);
    $result = $this->toXML($node);
    $expected = <<<EOT
<span class="form_element_select" id="data_test">
  <select name="data[test]" id="data_test">
    <option value="">-- please select --</option>
    <option value="2">Two</option>
    <option value="foo">Foo</option>
    <option value="1">One</option>
    <option value="bar" selected="selected">Bar</option>
    <option value="bla">Bla</option>
    <option value="3">Three</option>
  </select>
  <div class="description">
    <span>
      <ul>
        <li><b>Two</b>: 2</li>
        <li><b>Foo</b>: Foo Desc</li>
        <li><b>One</b>: 1</li>
      </ul>
    </span>
  </div>
</span>
EOT;
    $this->assertEquals($expected, $result);

    $this->assertEquals(array(
      'test' => 'bar',
    ), $form->get_data());
  }
}
