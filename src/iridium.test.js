const fs = require("fs");
const request = require("request");
const cheerio = require("cheerio");
const utils = require("./utils");
const { getTable } = require("./iridium");

jest.mock("fs");
jest.mock("request");
jest.mock("cheerio");
jest.mock("./utils");

utils.get_options.mockReturnValue({ url: "https://mock.url" });
utils.post_options.mockReturnValue({ url: "https://mock.url" });
utils.iridium_options.mockReturnValue({ url: "https://mock.details" });
utils.image_options.mockReturnValue({ url: "https://mock.image" });
utils.md5.mockReturnValue("mocked-id-123");

cheerio.load.mockImplementation(() => {
  const element = {
    find: () => element,
    eq: () => element,
    text: () => "mocked-text",
    attr: () => "mocked-attr",
    each: (cb) => cb(0, {}),
    html: () => "<table></table>"
  };

  // return callable function $() that behaves like cheerio
  const $ = jest.fn(() => element);
  $.find = element.find;
  $.eq = element.eq;
  $.text = element.text;
  $.attr = element.attr;
  $.each = element.each;
  $.html = element.html;

  return $;
});

describe("Iridium getTable()", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("calls utils.get_options() on first run", () => {
    request.mockImplementation((opt, cb) =>
      cb(null, { statusCode: 200 }, "<html></html>")
    );

    getTable({
      root: "./data/",
      pages: 1,
      counter: 0,
      count: 0,
      database: [],
      opt: ""
    });

    expect(utils.get_options).toHaveBeenCalled();
  });

  test("calls utils.post_options() when counter > 0", () => {
    request.mockImplementation((opt, cb) =>
      cb(null, { statusCode: 200 }, "<html></html>")
    );

    getTable({
      root: "./data/",
      pages: 1,
      counter: 1,
      count: 0,
      database: [],
      opt: ""
    });

    expect(utils.post_options).toHaveBeenCalled();
  });

  test("creates directory when missing", () => {
    fs.existsSync.mockReturnValue(false);
    fs.mkdir.mockImplementation((dir, cb) => cb(null));
    request.mockImplementation((opt, cb) =>
      cb(null, { statusCode: 200 }, "<html></html>")
    );

    getTable({
      root: "./data/",
      pages: 1,
      counter: 0,
      count: 0,
      database: [],
      opt: ""
    });

    expect(fs.mkdir).toHaveBeenCalled();
  });

  test("skips mkdir if directory exists", () => {
    fs.existsSync.mockReturnValue(true);
    request.mockImplementation((opt, cb) =>
      cb(null, { statusCode: 200 }, "<html></html>")
    );

    getTable({
      root: "./data/",
      pages: 1,
      counter: 0,
      count: 0,
      database: [],
      opt: ""
    });

    expect(fs.mkdir).not.toHaveBeenCalled();
  });

  test("handles request error safely", () => {
    request.mockImplementation((opt, cb) => cb(new Error("network fail")));

    expect(() =>
      getTable({
        root: "./data/",
        pages: 1,
        counter: 0,
        count: 0,
        database: [],
        opt: ""
      })
    ).not.toThrow();
  });
});
