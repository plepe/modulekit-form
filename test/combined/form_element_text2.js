describe("form_element_text - test 2", function() {
  it("form_data returns correct data", function() {
    var data = form_data.get_data();
    assert.deepEqual(data, { "test": "foobar" });
  });
  it("modify element", function() {
    var obs = document.getElementsByName("data[test]");
    obs[0].value = "barfoo";
    var data = form_data.get_data();
    assert.deepEqual(data, { "test": "barfoo" });
  });
  it("form_data show_element", function() {
    var result = form_data.element.elements.test.show_element().innerHTML;
    assert.equal(result, '<input type="text" class="form_modified" name="data[test]" list="data_test-datalist">');
  });
});
