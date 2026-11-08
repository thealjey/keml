import { describe, expect, it } from "vitest";
import { matchObject } from "./config.mts";

type TestCase = [
  name: string,
  pattern: string,
  target: Record<string, any>,
  expected: boolean,
];

const cases: Record<string, TestCase[]> = {
  "Basic matching": [
    ["Empty pattern", "", {}, true],
    ["Single key exists", "foo", { foo: "bar" }, true],
    ["Single key missing", "foo", {}, false],
    ["Multiple keys", "foo,bar", { foo: 1, bar: 2 }, true],
    ["Multiple keys, one missing", "foo,bar", { foo: 1 }, false],
    ["Extra target properties", "foo", { foo: 1, bar: 2 }, true],
    ["Whitespace around keys", " foo , bar ", { foo: 1, bar: 2 }, true],
    ["Empty key is ignored", ",foo,,", { foo: 1 }, true],
    ["escaped quote", 'value="a\\"b"', { value: 'a"b' }, true],
    [
      "even number of backslashes before closing quote",
      'value="a\\\\",other=yes',
      { value: "a\\", other: "yes" },
      true,
    ],
    ["null target", "detail={foo}", { detail: null }, false],
    ["primitive target", "detail={foo}", { detail: "text" }, false],
  ],

  "Primitive values": [
    ["String equality", "foo=bar", { foo: "bar" }, true],
    ["String inequality", "foo=bar", { foo: "baz" }, false],
    ["Number against number", "foo=42", { foo: 42 }, true],
    ["Number against string", "foo=42", { foo: "42" }, true],
    ["String against number", "foo='42'", { foo: 42 }, true],
    ["Boolean true", "foo=true", { foo: true }, true],
    ["Boolean false", "foo=false", { foo: false }, true],
    ["Boolean against string", "foo=true", { foo: "true" }, true],
    ["Null against null", "foo=null", { foo: null }, true],
    ["Null against string", "foo=null", { foo: "null" }, true],
    ["Zero", "foo=0", { foo: 0 }, true],
    ["Negative number", "foo=-42", { foo: -42 }, true],
    ["Floating-point number", "foo=3.14", { foo: 3.14 }, true],
    ["Empty value", "foo=", { foo: "" }, true],
    ["Empty value against non-empty", "foo=", { foo: "bar" }, false],
    ["Missing property with value", "foo=bar", {}, false],
  ],

  "Quoted strings": [
    ["Single-quoted string", "foo='hello'", { foo: "hello" }, true],
    ["Double-quoted string", 'foo="hello"', { foo: "hello" }, true],
    ["Single-quoted empty string", "foo=''", { foo: "" }, true],
    ["Double-quoted empty string", 'foo=""', { foo: "" }, true],
    [
      "Single-quoted comma",
      "foo='hello, world'",
      { foo: "hello, world" },
      true,
    ],
    [
      "Double-quoted comma",
      'foo="hello, world"',
      { foo: "hello, world" },
      true,
    ],
    ["Single-quoted equals", "foo='a=b'", { foo: "a=b" }, true],
    ["Double-quoted equals", 'foo="a=b"', { foo: "a=b" }, true],
    ["Single-quoted brackets", "foo='[1,2]'", { foo: "[1,2]" }, true],
    ["Single-quoted braces", "foo='{a=1}'", { foo: "{a=1}" }, true],
    ["Double-quoted brackets", 'foo="[1,2]"', { foo: "[1,2]" }, true],
    ["Double-quoted braces", 'foo="{a=1}"', { foo: "{a=1}" }, true],
  ],

  Objects: [
    ["Simple object", "foo={bar=1}", { foo: { bar: 1 } }, true],
    ["Nested object", "foo={bar={baz=1}}", { foo: { bar: { baz: 1 } } }, true],
    [
      "Object with multiple properties",
      "foo={a=1,b=2}",
      { foo: { a: 1, b: 2 } },
      true,
    ],
    [
      "Object with extra target properties",
      "foo={a=1}",
      { foo: { a: 1, b: 2 } },
      true,
    ],
    [
      "Object missing target property",
      "foo={a=1,b=2}",
      { foo: { a: 1 } },
      false,
    ],
    [
      "Nested object mismatch",
      "foo={a={b=1}}",
      { foo: { a: { b: 2 } } },
      false,
    ],
    ["Empty object", "foo={}", { foo: { a: 1 } }, true],
    ["Empty object against empty object", "foo={}", { foo: {} }, true],
    ["Object with empty value", "foo={a=}", { foo: { a: "" } }, true],
  ],

  Arrays: [
    ["Empty array", "foo=[]", { foo: [] }, true],
    ["Empty array against non-empty array", "foo=[]", { foo: [1, 2, 3] }, true],
    ["Single-element array", "foo=[1]", { foo: [1] }, true],
    ["Multiple elements", "foo=[1,2,3]", { foo: [1, 2, 3] }, true],
    ["Array prefix matching", "foo=[1,2]", { foo: [1, 2, 3] }, true],
    ["Array target too short", "foo=[1,2,3]", { foo: [1, 2] }, false],
    ["Array element mismatch", "foo=[1,2]", { foo: [1, 3] }, false],
    ["Array string coercion", "foo=[1,2]", { foo: ["1", "2"] }, true],
    [
      "Nested arrays",
      "foo=[[1,2],[3,4]]",
      {
        foo: [
          [1, 2],
          [3, 4],
        ],
      },
      true,
    ],
    [
      "Nested array prefix matching",
      "foo=[[1,2]]",
      {
        foo: [
          [1, 2, 3],
          [4, 5],
        ],
      },
      true,
    ],
    [
      "Array containing objects",
      "foo=[{a=1},{b=2}]",
      { foo: [{ a: 1, extra: true }, { b: 2 }] },
      true,
    ],
    [
      "Array containing nested arrays",
      "foo=[[1,2],[3,4]]",
      {
        foo: [
          [1, 2, 3],
          [3, 4, 5],
        ],
      },
      true,
    ],
    [
      "Mixed array values",
      "foo=[1,'hello',true,null]",
      { foo: [1, "hello", true, null] },
      true,
    ],
  ],

  Truthiness: [
    ["Truthy string", "foo", { foo: "hello" }, true],
    ["Truthy number", "foo", { foo: 42 }, true],
    ["Truthy true", "foo", { foo: true }, true],
    ["Truthy object", "foo", { foo: {} }, true],
    ["Truthy array", "foo", { foo: [] }, true],
    ["Falsy false", "foo", { foo: false }, false],
    ["Falsy zero", "foo", { foo: 0 }, false],
    ["Falsy empty string", "foo", { foo: "" }, false],
    ["Falsy null", "foo", { foo: null }, false],
    ["Falsy undefined", "foo", { foo: undefined }, false],
  ],

  "Nested truthiness": [
    ["Nested truthy property", "foo={bar}", { foo: { bar: "hello" } }, true],
    ["Nested falsy property", "foo={bar}", { foo: { bar: false } }, false],
    ["Nested missing property", "foo={bar}", { foo: {} }, false],
    [
      "Multiple nested truthy properties",
      "foo={bar,baz}",
      { foo: { bar: true, baz: 1 } },
      true,
    ],
    [
      "One nested property falsy",
      "foo={bar,baz}",
      { foo: { bar: true, baz: 0 } },
      false,
    ],
    [
      "Deeply nested truthiness",
      "foo={bar={baz}}",
      { foo: { bar: { baz: "yes" } } },
      true,
    ],
    [
      "Deeply nested falsiness",
      "foo={bar={baz}}",
      { foo: { bar: { baz: "" } } },
      false,
    ],
  ],

  "Mixed nesting": [
    [
      "Object containing array",
      "foo={bar=[1,2,3]}",
      { foo: { bar: [1, 2, 3] } },
      true,
    ],
    ["Array containing object", "foo=[{bar=1}]", { foo: [{ bar: 1 }] }, true],
    [
      "Multiple levels of nesting",
      "foo={bar=[{baz={qux=42}}]}",
      { foo: { bar: [{ baz: { qux: 42 } }] } },
      true,
    ],
    [
      "Nested commas",
      "foo={bar='hello, world',baz=[1,2]}",
      { foo: { bar: "hello, world", baz: [1, 2] } },
      true,
    ],
    ["Nested equals signs", "foo={bar='a=b'}", { foo: { bar: "a=b" } }, true],
    [
      "Multiple independent nested values",
      "a={b=1,c=[2,3]},d=[{e=4}]",
      { a: { b: 1, c: [2, 3] }, d: [{ e: 4 }] },
      true,
    ],
    [
      "Whitespace inside nested structures",
      "foo = { bar = [ 1, 2, 3 ] }",
      { foo: { bar: [1, 2, 3] } },
      true,
    ],
    [
      "Deeply nested mixed structures",
      "a=[{b=[{c={d='hello, world'}}]}]",
      { a: [{ b: [{ c: { d: "hello, world" } }] }] },
      true,
    ],
  ],
};

for (const [category, tests] of Object.entries(cases)) {
  describe(category, () => {
    it.each(tests)("%s", (_name, pattern, target, expected) => {
      expect(matchObject(pattern, target)).toBe(expected);
    });
  });
}
