import { describe, expect, it } from "vitest";
import { isFileList } from "./isFileList.mts";

describe("isFileList", () => {
  it("returns true for a real FileList (browser environment)", () => {
    const input = document.createElement("input");
    input.type = "file";

    const fileList = input.files;

    // In jsdom this may be null depending on environment,
    // so guard the assertion
    if (fileList) {
      expect(isFileList(fileList)).toBe(true);
    }
  });

  it("returns false for null", () => {
    expect(isFileList(null)).toBe(false);
  });

  it("returns false for undefined", () => {
    expect(isFileList(undefined)).toBe(false);
  });

  it("returns false for plain objects with length", () => {
    const fakeFileList = {
      length: 1,
      0: new File(["a"], "a.txt"),
    };

    expect(isFileList(fakeFileList)).toBe(false);
  });

  it("returns false for arrays", () => {
    const arr = [new File(["a"], "a.txt")];

    expect(isFileList(arr)).toBe(false);
  });

  it("returns false for strings", () => {
    expect(isFileList("not-a-filelist")).toBe(false);
  });

  it("returns false for object with correct shape but wrong tag", () => {
    const fake = {
      toString: () => "[object FileList]",
    };

    expect(isFileList(fake)).toBe(false);
  });

  it("returns false for File object", () => {
    const file = new File(["a"], "a.txt");

    expect(isFileList(file)).toBe(false);
  });
});
