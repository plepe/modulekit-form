beforeEach(function() {
  document.getElementById('test_form').innerHTML = '';
});

describe("form_element_radio", function() {
  it("values simple array", function() {
    var def = {
      test: {
        type: 'radio',
        name: 'Test',
        values: [ 3, 'foo', 1, 'bar', 'bla', 2 ]
      }
    };
    var form_data = new form('data', def);
    form_data.show(document.getElementById('test_form'));

    var render_actual = form_data.element.elements.test.dom.innerHTML;
    var render_expected = '<span class="form_orig"><input type="radio" id="data_test-3" name="data[test]" value="3"><label for="data_test-3">3</label></span><span class="form_orig"><input type="radio" id="data_test-foo" name="data[test]" value="foo"><label for="data_test-foo">foo</label></span><span class="form_orig"><input type="radio" id="data_test-1" name="data[test]" value="1"><label for="data_test-1">1</label></span><span class="form_orig"><input type="radio" id="data_test-bar" name="data[test]" value="bar"><label for="data_test-bar">bar</label></span><span class="form_orig"><input type="radio" id="data_test-bla" name="data[test]" value="bla"><label for="data_test-bla">bla</label></span><span class="form_orig"><input type="radio" id="data_test-2" name="data[test]" value="2"><label for="data_test-2">2</label></span>';
    assert.equal(render_actual, render_expected);

    // modify data
    $(form_data.element.elements.test.dom).find('[value="bar"]').prop('checked', true);
    form_data.element.elements.test.notify_change();

    var render_actual = form_data.element.elements.test.dom.innerHTML;
    var render_expected = '<span class="form_modified"><input type="radio" id="data_test-3" name="data[test]" value="3"><label for="data_test-3">3</label></span><span class="form_modified"><input type="radio" id="data_test-foo" name="data[test]" value="foo"><label for="data_test-foo">foo</label></span><span class="form_modified"><input type="radio" id="data_test-1" name="data[test]" value="1"><label for="data_test-1">1</label></span><span class="form_modified"><input type="radio" id="data_test-bar" name="data[test]" value="bar"><label for="data_test-bar">bar</label></span><span class="form_modified"><input type="radio" id="data_test-bla" name="data[test]" value="bla"><label for="data_test-bla">bla</label></span><span class="form_modified"><input type="radio" id="data_test-2" name="data[test]" value="2"><label for="data_test-2">2</label></span>';
    assert.equal(render_actual, render_expected);

    assert.deepEqual(form_data.get_data(), { test: 'bar' });
    assert.deepEqual(form_data.errors(), false);
  });

  it("values hash", function() {
    var def = {
      test: {
        type: 'radio',
        name: 'Test',
        values: { 3: 'Three', 'foo': 'Foo', 1: 'One', 'bar': 'Bar', 'bla': 'Bla', 2: 'Two' }
      }
    };
    var form_data = new form('data', def);
    form_data.show(document.getElementById('test_form'));

    var render_actual = form_data.element.elements.test.dom.innerHTML;
    var render_expected = '<span class="form_orig"><input type="radio" id="data_test-3" name="data[test]" value="3"><label for="data_test-3">Three</label></span><span class="form_orig"><input type="radio" id="data_test-foo" name="data[test]" value="foo"><label for="data_test-foo">Foo</label></span><span class="form_orig"><input type="radio" id="data_test-1" name="data[test]" value="1"><label for="data_test-1">One</label></span><span class="form_orig"><input type="radio" id="data_test-bar" name="data[test]" value="bar"><label for="data_test-bar">Bar</label></span><span class="form_orig"><input type="radio" id="data_test-bla" name="data[test]" value="bla"><label for="data_test-bla">Bla</label></span><span class="form_orig"><input type="radio" id="data_test-2" name="data[test]" value="2"><label for="data_test-2">Two</label></span>';
    assert.equal(render_actual, render_expected);

    // modify data
    $(form_data.element.elements.test.dom).find('[value="bar"]').prop('checked', true);
    form_data.element.elements.test.notify_change();

    var render_actual = form_data.element.elements.test.dom.innerHTML;
    var render_expected = '<span class="form_modified"><input type="radio" id="data_test-3" name="data[test]" value="3"><label for="data_test-3">Three</label></span><span class="form_modified"><input type="radio" id="data_test-foo" name="data[test]" value="foo"><label for="data_test-foo">Foo</label></span><span class="form_modified"><input type="radio" id="data_test-1" name="data[test]" value="1"><label for="data_test-1">One</label></span><span class="form_modified"><input type="radio" id="data_test-bar" name="data[test]" value="bar"><label for="data_test-bar">Bar</label></span><span class="form_modified"><input type="radio" id="data_test-bla" name="data[test]" value="bla"><label for="data_test-bla">Bla</label></span><span class="form_modified"><input type="radio" id="data_test-2" name="data[test]" value="2"><label for="data_test-2">Two</label></span>';
    assert.equal(render_actual, render_expected);

    assert.equal(render_actual, render_expected);
    assert.deepEqual(form_data.get_data(), { test: 'bar' });
    assert.deepEqual(form_data.errors(), false);
  });

  it("values complex hash", function() {
    var def = {
      test: {
        type: 'radio',
        name: 'Test',
        values: { '3': 'Three', 'foo': { 'name': 'Foo', 'desc': 'Foo Desc' }, '1': 'One', 'bar': { 'name': 'Bar'}, 'bla': 'Bla', '2': { 'name': 'Two' } }
      }
    };
    var form_data = new form('data', def);
    form_data.show(document.getElementById('test_form'));

    var render_actual = form_data.element.elements.test.dom.innerHTML;
    var render_expected = '<span class="form_orig"><input type="radio" id="data_test-3" name="data[test]" value="3"><label for="data_test-3">Three</label></span><span class="form_orig"><input type="radio" id="data_test-foo" name="data[test]" value="foo"><label for="data_test-foo">Foo</label><span class="description">Foo Desc</span></span><span class="form_orig"><input type="radio" id="data_test-1" name="data[test]" value="1"><label for="data_test-1">One</label></span><span class="form_orig"><input type="radio" id="data_test-bar" name="data[test]" value="bar"><label for="data_test-bar">Bar</label></span><span class="form_orig"><input type="radio" id="data_test-bla" name="data[test]" value="bla"><label for="data_test-bla">Bla</label></span><span class="form_orig"><input type="radio" id="data_test-2" name="data[test]" value="2"><label for="data_test-2">Two</label></span>';
    assert.equal(render_actual, render_expected);

    // modify data
    $(form_data.element.elements.test.dom).find('[value="foo"]').prop('checked', true);
    form_data.element.elements.test.notify_change();

    var render_actual = form_data.element.elements.test.dom.innerHTML;
    var render_expected = '<span class="form_modified"><input type="radio" id="data_test-3" name="data[test]" value="3"><label for="data_test-3">Three</label></span><span class="form_modified"><input type="radio" id="data_test-foo" name="data[test]" value="foo"><label for="data_test-foo">Foo</label><span class="description">Foo Desc</span></span><span class="form_modified"><input type="radio" id="data_test-1" name="data[test]" value="1"><label for="data_test-1">One</label></span><span class="form_modified"><input type="radio" id="data_test-bar" name="data[test]" value="bar"><label for="data_test-bar">Bar</label></span><span class="form_modified"><input type="radio" id="data_test-bla" name="data[test]" value="bla"><label for="data_test-bla">Bla</label></span><span class="form_modified"><input type="radio" id="data_test-2" name="data[test]" value="2"><label for="data_test-2">Two</label></span>';

    assert.equal(render_actual, render_expected);
    assert.deepEqual(form_data.get_data(), { test: 'foo' });
    assert.deepEqual(form_data.errors(), false);
  });

});
