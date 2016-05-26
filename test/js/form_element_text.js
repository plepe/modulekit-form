beforeEach(function() {
  document.getElementById('test_form').innerHTML = '';
});

describe("form_element_text", function() {
  it("simple", function() {
    var def = {
      test: {
        type: 'text',
        name: 'Test'
      }
    };
    var form_data = new form('data', def);
    form_data.show(document.getElementById('test_form'));

    var render_actual = form_data.element.elements.test.dom.innerHTML;
    var render_expected = '<input type="text" class="form_orig" name="data[test]">';

    // modify data
    form_data.element.elements.test.dom_element.value = 'bar';

    assert.equal(render_actual, render_expected);
    assert.deepEqual(form_data.get_data(), { test: 'bar' });
    assert.deepEqual(form_data.errors(), false);
  });

  it("set_data", function() {
    var def = {
      test: {
        type: 'text',
        name: 'Test'
      }
    };
    var orig_data = {
      test: 'foobar'
    };
    var form_data = new form('data', def);
    form_data.set_data(orig_data);
    form_data.show(document.getElementById('test_form'));

    var render_actual = form_data.element.elements.test.dom.innerHTML;
    var render_expected = '<input type="text" class="form_orig" name="data[test]">';

    // modify data
    form_data.element.elements.test.dom_element.value = "bar";

    assert.equal(render_actual, render_expected);
    assert.deepEqual(form_data.get_data(), { test: 'bar' });
    assert.deepEqual(form_data.errors(), false);
  });
});
