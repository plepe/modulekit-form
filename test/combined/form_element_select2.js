describe("form_element_select - test 2", function() {
  it("form_data returns correct data", function() {
    var data = form_data.get_data();
    assert.deepEqual(data, { "test": "foo" });
  });
  it("form_data show_element", function() {
    var result = form_data.element.elements.test.show_element().innerHTML;
    // TODO: this is actually wrong, order of numbers is incorrect
    assert.equal(result, '<select class="form_orig" id="data_test" name="data[test]"><option value="">-- please select --</option><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="foo" selected="selected">Foo</option><option value="bar">Bar</option><option value="bla">Bla</option></select><div class="description"></div>');
  });
});
