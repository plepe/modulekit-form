describe("form_element_select - test 1", function() {
  it("form_data returns correct data", function() {
    var data = form_data.get_data();
    assert.deepEqual(data, { "test": "foo" });
  });
  it("form_data show_element", function() {
    var result = form_data.element.elements.test.show_element().innerHTML;
    assert.equal(result, '<select class="form_orig" id="data_test" name="data[test]"><option value="">-- please select --</option><option value="foo" selected="selected">foo</option><option value="bar">bar</option><option value="bla">bla</option></select><div class="description"></div>');
  });
});
