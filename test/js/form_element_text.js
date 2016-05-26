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
    assert.equal(render_actual, render_expected);

    // modify data
    form_data.element.elements.test.dom_element.value = 'bar';
    form_data.element.elements.test.notify_change();

    var render_actual = form_data.element.elements.test.dom.innerHTML;
    var render_expected = '<input type="text" class="form_modified" name="data[test]">';
    assert.equal(render_actual, render_expected);

    assert.deepEqual(form_data.get_data(), { test: 'bar' });
    assert.deepEqual(form_data.errors(), false);
  });

  it("set_data before show", function() {
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
    var render_expected = '<input type="text" class="form_orig" name="data[test]" value="foobar">';
    assert.equal(render_actual, render_expected);

    // modify data
    form_data.element.elements.test.dom_element.value = "bar";
    form_data.element.elements.test.notify_change();

    var render_actual = form_data.element.elements.test.dom.innerHTML;
    var render_expected = '<input type="text" class="form_modified" name="data[test]" value="foobar">';
    assert.equal(render_actual, render_expected);

    assert.deepEqual(form_data.get_data(), { test: 'bar' });
    assert.deepEqual(form_data.errors(), false);
  });

  it("set_data after show", function() {
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
    form_data.show(document.getElementById('test_form'));
    form_data.set_data(orig_data);

    var render_actual = form_data.element.elements.test.dom.innerHTML;
    var render_expected = '<input type="text" class="form_orig" name="data[test]" value="foobar">';
    assert.equal(render_actual, render_expected);

    // modify data
    form_data.element.elements.test.dom_element.value = "bar";
    form_data.element.elements.test.notify_change();

    var render_actual = form_data.element.elements.test.dom.innerHTML;
    var render_expected = '<input type="text" class="form_modified" name="data[test]" value="foobar">';
    assert.equal(render_actual, render_expected);

    assert.deepEqual(form_data.get_data(), { test: 'bar' });
    assert.deepEqual(form_data.errors(), false);
  });

  it("req=true", function() {
    var def = {
      test: {
        type: 'text',
        name: 'Test',
        req: true
      }
    };
    var form_data = new form('data', def);
    form_data.show(document.getElementById('test_form'));

    var render_actual = form_data.element.elements.test.dom.innerHTML;
    var render_expected = '<input type="text" class="form_orig" name="data[test]">';
    assert.equal(render_actual, render_expected);

    assert.deepEqual(form_data.get_data(), { test: null });
    assert.deepEqual(form_data.errors(), [ 'Test: Value is mandatory.' ]);
  });

  it("override empty_value", function() {
    var def = {
      test: {
        type: 'text',
        name: 'Test',
        empty_value: 'foobar'
      }
    };
    var form_data = new form('data', def);
    form_data.show(document.getElementById('test_form'));

    var render_actual = form_data.element.elements.test.dom.innerHTML;
    var render_expected = '<input type="text" class="form_orig" name="data[test]">';
    assert.equal(render_actual, render_expected);

    assert.deepEqual(form_data.get_data(), { test: 'foobar' });
    assert.deepEqual(form_data.errors(), false);
  });

  it("regexp check", function() {
    var def = {
      test: {
        type: 'text',
        name: 'Test',
        check: [ 'regexp', '^foo' ]
      }
    };
    var form_data = new form('data', def);
    form_data.show(document.getElementById('test_form'));

    var render_actual = form_data.element.elements.test.dom.innerHTML;
    var render_expected = '<input type="text" class="form_orig" name="data[test]">';
    assert.equal(render_actual, render_expected);

    // modify data
    form_data.element.elements.test.dom_element.value = "bar";
    form_data.element.elements.test.notify_change();

    var render_actual = form_data.element.elements.test.dom.innerHTML;
    var render_expected = '<input type="text" class="form_modified" name="data[test]">';
    assert.equal(render_actual, render_expected);

    assert.deepEqual(form_data.get_data(), { test: 'bar' });
    assert.deepEqual(form_data.errors(), [ 'Test: Invalid value.' ]);
  });

  it("values simple array", function() {
    var def = {
      test: {
        type: 'text',
        name: 'Test',
        values: [ 'foo', 'bar', 'bla' ]
      }
    };
    var form_data = new form('data', def);
    form_data.show(document.getElementById('test_form'));

    var render_actual = form_data.element.elements.test.dom.innerHTML;
    var render_expected = '<input type="text" class="form_orig" name="data[test]" list="data_test-datalist"><span class="form_datalist_container"><datalist id="data_test-datalist"><option value="foo">foo</option><option value="bar">bar</option><option value="bla">bla</option></datalist></span>';
    assert.equal(render_actual, render_expected);

    // modify data
    form_data.element.elements.test.dom_element.value = "bar";
    form_data.element.elements.test.notify_change();

    var render_actual = form_data.element.elements.test.dom.innerHTML;
    var render_expected = '<input type="text" class="form_modified" name="data[test]" list="data_test-datalist"><span class="form_datalist_container"><datalist id="data_test-datalist"><option value="foo">foo</option><option value="bar">bar</option><option value="bla">bla</option></datalist></span>';
    assert.equal(render_actual, render_expected);

    assert.deepEqual(form_data.get_data(), { test: 'bar' });
    assert.deepEqual(form_data.errors(), false);
  });

  it("values hash", function() {
    var def = {
      test: {
        type: 'text',
        name: 'Test',
        values: { 'foo': 'Foo', 'bar': 'Bar', 'bla': 'Bla' }
      }
    };
    var form_data = new form('data', def);
    form_data.show(document.getElementById('test_form'));

    var render_actual = form_data.element.elements.test.dom.innerHTML;
    var render_expected = '<input type="text" class="form_orig" name="data[test]" list="data_test-datalist"><span class="form_datalist_container"><datalist id="data_test-datalist"><option value="Foo">Foo</option><option value="Bar">Bar</option><option value="Bla">Bla</option></datalist></span>';
    assert.equal(render_actual, render_expected);

    // modify data
    form_data.element.elements.test.dom_element.value = "bar";
    form_data.element.elements.test.notify_change();

    var render_actual = form_data.element.elements.test.dom.innerHTML;
    var render_expected = '<input type="text" class="form_modified" name="data[test]" list="data_test-datalist"><span class="form_datalist_container"><datalist id="data_test-datalist"><option value="Foo">Foo</option><option value="Bar">Bar</option><option value="Bla">Bla</option></datalist></span>';
    assert.equal(render_actual, render_expected);

    assert.deepEqual(form_data.get_data(), { test: 'bar' });
    assert.deepEqual(form_data.errors(), false);
  });

  it("values complex hash", function() {
    var def = {
      test: {
        type: 'text',
        name: 'Test',
        values: { 'foo': { 'name': 'Foo', 'desc': 'Foo Desc' }, 'bar': { 'name': 'Bar'}, 'bla': 'Bla' }
      }
    };
    var form_data = new form('data', def);
    form_data.show(document.getElementById('test_form'));

    var render_actual = form_data.element.elements.test.dom.innerHTML;
    var render_expected = '<input type="text" class="form_orig" name="data[test]" list="data_test-datalist"><span class="form_datalist_container"><datalist id="data_test-datalist"><option value="Foo">Foo</option><option value="Bar">Bar</option><option value="Bla">Bla</option></datalist></span>';
    assert.equal(render_actual, render_expected);

    // modify data
    form_data.element.elements.test.dom_element.value = "bar";
    form_data.element.elements.test.notify_change();

    var render_actual = form_data.element.elements.test.dom.innerHTML;
    var render_expected = '<input type="text" class="form_modified" name="data[test]" list="data_test-datalist"><span class="form_datalist_container"><datalist id="data_test-datalist"><option value="Foo">Foo</option><option value="Bar">Bar</option><option value="Bla">Bla</option></datalist></span>';
    assert.equal(render_actual, render_expected);

    assert.deepEqual(form_data.get_data(), { test: 'bar' });
    assert.deepEqual(form_data.errors(), false);
  });

});
