<?php
class form_element_radio_test extends PHPUnit_MochaPhantomJS {
  public function testValuesArray() {
    $def = array(
      'test' => array(
        'name' => 'Test',
        'type' => 'radio',
        'values' => array(3, 'foo', 1, 'bar', 'bla', 2),
      ),
    );

    $form = new form('data', $def);
    $content = $form->show();

    // render
    $node = $form->element->elements['test']->dom;
    $result = $this->toXML($node);
    $expected = <<<EOT
<span class="form_element_radio" id="data_test">
  <span class="form_orig">
    <input type="radio" id="data_test-3" name="data[test]" value="3"/>
    <label for="data_test-3">3</label>
  </span>
  <span class="form_orig">
    <input type="radio" id="data_test-foo" name="data[test]" value="foo"/>
    <label for="data_test-foo">foo</label>
  </span>
  <span class="form_orig">
    <input type="radio" id="data_test-1" name="data[test]" value="1"/>
    <label for="data_test-1">1</label>
  </span>
  <span class="form_orig">
    <input type="radio" id="data_test-bar" name="data[test]" value="bar"/>
    <label for="data_test-bar">bar</label>
  </span>
  <span class="form_orig">
    <input type="radio" id="data_test-bla" name="data[test]" value="bla"/>
    <label for="data_test-bla">bla</label>
  </span>
  <span class="form_orig">
    <input type="radio" id="data_test-2" name="data[test]" value="2"/>
    <label for="data_test-2">2</label>
  </span>
</span>
EOT;
    $this->assertEquals($expected, $result);

    $this->run_combined($form, <<<EOT
// Change form data
    $(form_data.element.elements.test.dom).find('[value="bar"]').prop('checked', true);
    form_data.element.elements.test.notify_change();

// Tests
describe("form_element_radio values array", function() {
  it("form_data is defined", function() {
    assert.isObject(form_data);
  });
  it("status", function() {
    // TODO: when will has_data will be set to true?
    // assert.equal(form_data.is_complete(), true);
    var render_actual = form_data.element.elements.test.dom.innerHTML;
    var render_expected = '<span class="form_modified"><input type="radio" id="data_test-3" name="data[test]" value="3"><label for="data_test-3">3</label></span><span class="form_modified"><input type="radio" id="data_test-foo" name="data[test]" value="foo"><label for="data_test-foo">foo</label></span><span class="form_modified"><input type="radio" id="data_test-1" name="data[test]" value="1"><label for="data_test-1">1</label></span><span class="form_modified"><input type="radio" id="data_test-bar" name="data[test]" value="bar"><label for="data_test-bar">bar</label></span><span class="form_modified"><input type="radio" id="data_test-bla" name="data[test]" value="bla"><label for="data_test-bla">bla</label></span><span class="form_modified"><input type="radio" id="data_test-2" name="data[test]" value="2"><label for="data_test-2">2</label></span>';
    assert.equal(render_actual, render_expected);

    assert.deepEqual(form_data.get_data(), { test: "bar" });
  });
});
EOT
    );

    // Reload form after submitting
    $form = new form('data', $def);
    $content = $form->show();

    $node = $form->element->elements['test']->dom;
    $result = $this->toXML($node);
    $expected = <<<EOT
<span class="form_element_radio" id="data_test">
  <span class="form_orig">
    <input type="radio" id="data_test-3" name="data[test]" value="3"/>
    <label for="data_test-3">3</label>
  </span>
  <span class="form_orig">
    <input type="radio" id="data_test-foo" name="data[test]" value="foo"/>
    <label for="data_test-foo">foo</label>
  </span>
  <span class="form_orig">
    <input type="radio" id="data_test-1" name="data[test]" value="1"/>
    <label for="data_test-1">1</label>
  </span>
  <span class="form_orig">
    <input type="radio" id="data_test-bar" name="data[test]" value="bar" checked="checked"/>
    <label for="data_test-bar">bar</label>
  </span>
  <span class="form_orig">
    <input type="radio" id="data_test-bla" name="data[test]" value="bla"/>
    <label for="data_test-bla">bla</label>
  </span>
  <span class="form_orig">
    <input type="radio" id="data_test-2" name="data[test]" value="2"/>
    <label for="data_test-2">2</label>
  </span>
</span>
EOT;

    $this->assertEquals($expected, $result);

    $this->assertEquals(array(
      'test' => 'bar',
    ), $form->get_data());
  }

  public function testValuesHash() {
    $def = array(
      'test' => array(
        'name' => 'Test',
        'type' => 'radio',
        'values' => array(2 => 'Two', 'foo' => "Foo", 1 => 'One', 'bar' => "Bar", 'bla' => "Bla", 3 => 'Three'),
      ),
    );

    $form = new form('data', $def);
    $content = $form->show();

    // render
    $node = $form->element->elements['test']->dom;
    $result = $this->toXML($node);
    $expected = <<<EOT
<span class="form_element_radio" id="data_test">
  <span class="form_orig">
    <input type="radio" id="data_test-2" name="data[test]" value="2"/>
    <label for="data_test-2">Two</label>
  </span>
  <span class="form_orig">
    <input type="radio" id="data_test-foo" name="data[test]" value="foo"/>
    <label for="data_test-foo">Foo</label>
  </span>
  <span class="form_orig">
    <input type="radio" id="data_test-1" name="data[test]" value="1"/>
    <label for="data_test-1">One</label>
  </span>
  <span class="form_orig">
    <input type="radio" id="data_test-bar" name="data[test]" value="bar"/>
    <label for="data_test-bar">Bar</label>
  </span>
  <span class="form_orig">
    <input type="radio" id="data_test-bla" name="data[test]" value="bla"/>
    <label for="data_test-bla">Bla</label>
  </span>
  <span class="form_orig">
    <input type="radio" id="data_test-3" name="data[test]" value="3"/>
    <label for="data_test-3">Three</label>
  </span>
</span>
EOT;
    $this->assertEquals($expected, $result);

    $this->run_combined($form, <<<EOT
// Change form data
    $(form_data.element.elements.test.dom).find('[value="bar"]').prop('checked', true);
    form_data.element.elements.test.notify_change();

// Tests
describe("form_element_radio hash", function() {
  it("form_data is defined", function() {
    assert.isObject(form_data);
  });
  it("status", function() {
    // TODO: when will has_data will be set to true?
    // assert.equal(form_data.is_complete(), true);
    var render_actual = form_data.element.elements.test.dom.innerHTML;
    var render_expected = '<span class="form_modified"><input type="radio" id="data_test-2" name="data[test]" value="2"><label for="data_test-2">Two</label></span><span class="form_modified"><input type="radio" id="data_test-foo" name="data[test]" value="foo"><label for="data_test-foo">Foo</label></span><span class="form_modified"><input type="radio" id="data_test-1" name="data[test]" value="1"><label for="data_test-1">One</label></span><span class="form_modified"><input type="radio" id="data_test-bar" name="data[test]" value="bar"><label for="data_test-bar">Bar</label></span><span class="form_modified"><input type="radio" id="data_test-bla" name="data[test]" value="bla"><label for="data_test-bla">Bla</label></span><span class="form_modified"><input type="radio" id="data_test-3" name="data[test]" value="3"><label for="data_test-3">Three</label></span>';
    assert.equal(render_actual, render_expected);

    assert.deepEqual(form_data.get_data(), { test: "bar" });
  });
});
EOT
    );

    // Reload form after submitting
    $form = new form('data', $def);
    $content = $form->show();

    $node = $form->element->elements['test']->dom;
    $result = $this->toXML($node);
    $expected = <<<EOT
<span class="form_element_radio" id="data_test">
  <span class="form_orig">
    <input type="radio" id="data_test-2" name="data[test]" value="2"/>
    <label for="data_test-2">Two</label>
  </span>
  <span class="form_orig">
    <input type="radio" id="data_test-foo" name="data[test]" value="foo"/>
    <label for="data_test-foo">Foo</label>
  </span>
  <span class="form_orig">
    <input type="radio" id="data_test-1" name="data[test]" value="1"/>
    <label for="data_test-1">One</label>
  </span>
  <span class="form_orig">
    <input type="radio" id="data_test-bar" name="data[test]" value="bar" checked="checked"/>
    <label for="data_test-bar">Bar</label>
  </span>
  <span class="form_orig">
    <input type="radio" id="data_test-bla" name="data[test]" value="bla"/>
    <label for="data_test-bla">Bla</label>
  </span>
  <span class="form_orig">
    <input type="radio" id="data_test-3" name="data[test]" value="3"/>
    <label for="data_test-3">Three</label>
  </span>
</span>
EOT;

    $this->assertEquals($expected, $result);

    $this->assertEquals(array(
      'test' => 'bar',
    ), $form->get_data());
  }

  public function testValuesComplexHash() {
    $def = array(
      'test' => array(
        'name' => 'Test',
        'type' => 'radio',
        'values' => array(2 => array('name' => 'Two', 'desc' => '2'), 'foo' => array("name" => "Foo", "desc" => "Foo Desc"), 1 => array('name' => 'One', 'desc' => '1'), 'bar' => array("name" => "Bar"), 'bla' => "Bla", 3 => 'Three'),
      ),
    );

    $form = new form('data', $def);
    $content = $form->show();

    // render
    $node = $form->element->elements['test']->dom;
    $result = $this->toXML($node);
    $expected = <<<EOT
<span class="form_element_radio" id="data_test">
  <span class="form_orig">
    <input type="radio" id="data_test-2" name="data[test]" value="2"/>
    <label for="data_test-2">Two</label>
    <span class="description">2</span>
  </span>
  <span class="form_orig">
    <input type="radio" id="data_test-foo" name="data[test]" value="foo"/>
    <label for="data_test-foo">Foo</label>
    <span class="description">Foo Desc</span>
  </span>
  <span class="form_orig">
    <input type="radio" id="data_test-1" name="data[test]" value="1"/>
    <label for="data_test-1">One</label>
    <span class="description">1</span>
  </span>
  <span class="form_orig">
    <input type="radio" id="data_test-bar" name="data[test]" value="bar"/>
    <label for="data_test-bar">Bar</label>
  </span>
  <span class="form_orig">
    <input type="radio" id="data_test-bla" name="data[test]" value="bla"/>
    <label for="data_test-bla">Bla</label>
  </span>
  <span class="form_orig">
    <input type="radio" id="data_test-3" name="data[test]" value="3"/>
    <label for="data_test-3">Three</label>
  </span>
</span>
EOT;
    $this->assertEquals($expected, $result);

    $this->run_combined($form, <<<EOT
// Change form data
    $(form_data.element.elements.test.dom).find('[value="foo"]').prop('checked', true);
    form_data.element.elements.test.notify_change();

// Tests
describe("form_element_radio complex hash", function() {
  it("form_data is defined", function() {
    assert.isObject(form_data);
  });
  it("status", function() {
    // TODO: when will has_data will be set to true?
    // assert.equal(form_data.is_complete(), true);
    var render_actual = form_data.element.elements.test.dom.innerHTML;
    var render_expected = '<span class="form_modified"><input type="radio" id="data_test-2" name="data[test]" value="2"><label for="data_test-2">Two</label><span class="description">2</span></span><span class="form_modified"><input type="radio" id="data_test-foo" name="data[test]" value="foo"><label for="data_test-foo">Foo</label><span class="description">Foo Desc</span></span><span class="form_modified"><input type="radio" id="data_test-1" name="data[test]" value="1"><label for="data_test-1">One</label><span class="description">1</span></span><span class="form_modified"><input type="radio" id="data_test-bar" name="data[test]" value="bar"><label for="data_test-bar">Bar</label></span><span class="form_modified"><input type="radio" id="data_test-bla" name="data[test]" value="bla"><label for="data_test-bla">Bla</label></span><span class="form_modified"><input type="radio" id="data_test-3" name="data[test]" value="3"><label for="data_test-3">Three</label></span>';
    assert.equal(render_actual, render_expected);

    assert.deepEqual(form_data.get_data(), { test: "foo" });
  });
});
EOT
    );

    // Reload form after submitting
    $form = new form('data', $def);
    $content = $form->show();

    $node = $form->element->elements['test']->dom;
    $result = $this->toXML($node);
    $expected = <<<EOT
<span class="form_element_radio" id="data_test">
  <span class="form_orig">
    <input type="radio" id="data_test-2" name="data[test]" value="2"/>
    <label for="data_test-2">Two</label>
    <span class="description">2</span>
  </span>
  <span class="form_orig">
    <input type="radio" id="data_test-foo" name="data[test]" value="foo" checked="checked"/>
    <label for="data_test-foo">Foo</label>
    <span class="description">Foo Desc</span>
  </span>
  <span class="form_orig">
    <input type="radio" id="data_test-1" name="data[test]" value="1"/>
    <label for="data_test-1">One</label>
    <span class="description">1</span>
  </span>
  <span class="form_orig">
    <input type="radio" id="data_test-bar" name="data[test]" value="bar"/>
    <label for="data_test-bar">Bar</label>
  </span>
  <span class="form_orig">
    <input type="radio" id="data_test-bla" name="data[test]" value="bla"/>
    <label for="data_test-bla">Bla</label>
  </span>
  <span class="form_orig">
    <input type="radio" id="data_test-3" name="data[test]" value="3"/>
    <label for="data_test-3">Three</label>
  </span>
</span>
EOT;

    $this->assertEquals($expected, $result);

    $this->assertEquals(array(
      'test' => 'foo',
    ), $form->get_data());
  }
}

