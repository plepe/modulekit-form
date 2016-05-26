beforeEach(function() {
  document.getElementById('test_form').innerHTML = '';
});

describe("form_element_select", function() {
  it("values simple array", function() {
    var def = {
      test: {
        type: 'select',
        name: 'Test',
        values: [ 'foo', 'bar', 'bla' ]
      }
    };
    var form_data = new form('data', def);
    form_data.show(document.getElementById('test_form'));

    var render_actual = form_data.element.elements.test.dom.innerHTML;
    var render_expected = '<select class="form_orig" id="data_test" name="data[test]"><option value="">-- please select --</option><option value="foo">foo</option><option value="bar">bar</option><option value="bla">bla</option></select><div class="description"></div>';
    assert.equal(render_actual, render_expected);

    // modify data
    $(form_data.element.elements.test.dom_element).find('[value="bar"]').prop('selected', true);
    form_data.element.elements.test.notify_change();

    var render_actual = form_data.element.elements.test.dom.innerHTML;
    var render_expected = '<select class="form_modified" id="data_test" name="data[test]"><option value="">-- please select --</option><option value="foo">foo</option><option value="bar">bar</option><option value="bla">bla</option></select><div class="description"></div>';
    assert.equal(render_actual, render_expected);

    assert.deepEqual(form_data.get_data(), { test: 'bar' });
    assert.deepEqual(form_data.errors(), false);
  });

  it("values hash", function() {
    var def = {
      test: {
        type: 'select',
        name: 'Test',
        values: { 'foo': 'Foo', 'bar': 'Bar', 'bla': 'Bla' }
      }
    };
    var form_data = new form('data', def);
    form_data.show(document.getElementById('test_form'));

    var render_actual = form_data.element.elements.test.dom.innerHTML;
    var render_expected = '<select class="form_orig" id="data_test" name="data[test]"><option value="">-- please select --</option><option value="foo">Foo</option><option value="bar">Bar</option><option value="bla">Bla</option></select><div class="description"></div>';
    assert.equal(render_actual, render_expected);

    // modify data
    $(form_data.element.elements.test.dom_element).find('[value="bar"]').prop('selected', true);
    form_data.element.elements.test.notify_change();

    var render_actual = form_data.element.elements.test.dom.innerHTML;
    var render_expected = '<select class="form_modified" id="data_test" name="data[test]"><option value="">-- please select --</option><option value="foo">Foo</option><option value="bar">Bar</option><option value="bla">Bla</option></select><div class="description"></div>';
    assert.equal(render_actual, render_expected);

    assert.equal(render_actual, render_expected);
    assert.deepEqual(form_data.get_data(), { test: 'bar' });
    assert.deepEqual(form_data.errors(), false);
  });

  it("values complex hash", function() {
    var def = {
      test: {
        type: 'select',
        name: 'Test',
        values: { 'foo': { 'name': 'Foo', 'desc': 'Foo Desc' }, 'bar': { 'name': 'Bar'}, 'bla': 'Bla' }
      }
    };
    var form_data = new form('data', def);
    form_data.show(document.getElementById('test_form'));

    // modify data
    $(form_data.element.elements.test.dom_element).find('[value="foo"]').prop('selected', true);
    form_data.element.elements.test.notify_change();

    var render_actual = form_data.element.elements.test.dom.innerHTML;
    var render_expected = '<select class="form_modified" id="data_test" name="data[test]"><option value="">-- please select --</option><option value="foo">Foo</option><option value="bar">Bar</option><option value="bla">Bla</option></select><div class="description">Foo Desc</div>';

    assert.equal(render_actual, render_expected);
    assert.deepEqual(form_data.get_data(), { test: 'foo' });
    assert.deepEqual(form_data.errors(), false);
  });

});
