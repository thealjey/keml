const TRUTHY_KEY = Symbol.for("truthy");

/**
 * Splits a string by a specified character while respecting nested
 * structures and quoted strings.
 *
 * This function treats `{}` and `[]` as nested objects/arrays and
 * ignores delimiter characters inside them. It also ignores delimiter
 * characters inside single `'` or double `"` quoted strings,
 * properly handling escaped quotes.
 *
 * @param input - The string to split.
 * @param char - The character code (e.g., `44` for `,`) to split on.
 * @returns An array of substrings split by the given character, ignoring
 *          delimiters inside nested objects, arrays, or quoted strings.
 *
 * @example
 * ```ts
 * split("a=1,b={c=2,d=[3,4]},e='hello, world'", 44)
 * // Returns: ["a=1", "b={c=2,d=[3,4]}", "e='hello, world'"]
 * ```
 */
const split = (input: string, char: number) => {
  const result: string[] = [];
  const len = input.length;
  let start = 0;

  for (
    let i = 0, depthObj = 0, depthArr = 0, inString, c, escapeCount, j;
    i < len;
    ++i
  ) {
    c = input.charCodeAt(i);

    if (inString) {
      if (c === inString) {
        escapeCount = 0;
        j = i - 1;
        while (j >= 0 && input.charCodeAt(j) === 92) {
          ++escapeCount;
          --j;
        }
        if (escapeCount % 2 === 0) {
          inString = 0;
        }
      }
      continue;
    }

    switch (c) {
      case 34: // "
      case 39: // '
        inString = c;
        break;
      case 123: // {
        ++depthObj;
        break;
      case 125: // }
        --depthObj;
        break;
      case 91: // [
        ++depthArr;
        break;
      case 93: // ]
        --depthArr;
        break;
      default:
        if (c === char && depthObj === 0 && depthArr === 0 && !inString) {
          result.push(input.slice(start, i));
          start = i + 1;
        }
        break;
    }
  }

  result.push(input.slice(start, len));

  return result;
};

/**
 * Parses a string into a JavaScript value.
 *
 * This function attempts to interpret the input string in a way similar
 * to JSON, but with additional support for:
 * - Objects using `{key=value,...}` syntax (delegates to `parseObject`)
 * - Arrays using `[value1,value2,...]` syntax
 * - Strings wrapped in single quotes (`'...'`)
 * - Numbers, booleans, and `null` via `JSON.parse`
 *
 * If parsing fails, the input string is returned as-is.
 *
 * @param input - The string to parse.
 * @returns The parsed value, which may be an object, array, number,
 *          boolean, null, or string depending on the input.
 *
 * @example
 * ```ts
 * parseValue("{a=1,b=[2,3]}")
 * // Returns: { a: 1, b: [2, 3] }
 *
 * parseValue("[1,'two',3]")
 * // Returns: [1, 'two', 3]
 *
 * parseValue("'hello'")
 * // Returns: "hello"
 *
 * parseValue("42")
 * // Returns: 42
 * ```
 */
const parseValue = (input: string = ""): any => {
  input = input.trim();

  const lastIndex = input.length - 1;
  const first = input.charCodeAt(0);
  const last = input.charCodeAt(lastIndex);

  if (first === 39 && last === 39) {
    return input.slice(1, lastIndex);
  }
  if (first === 34 && last === 34) {
    return JSON.parse(input);
  }
  if (first === 123 && last === 125) {
    return parseObject(input.slice(1, lastIndex), TRUTHY_KEY);
  }
  if (first === 91 && last === 93) {
    const contents = input.slice(1, lastIndex);
    return contents ? split(contents, 44).map(parseValue) : [];
  }
  try {
    return JSON.parse(input);
  } catch {}
  return input;
};

/**
 * Parses a string into a flat or nested object using a flexible key-value
 * syntax.
 *
 * Supports:
 * - Comma-separated key-value pairs: `a=1,b=2`
 * - Nested objects using `{...}` syntax: `b={c=3,d=4}`
 * - Arrays using `[... ]` syntax: `arr=[1,2,3]`
 * - Single-quoted strings: `text='hello, world'`
 * - Keys without an equal sign are assigned the `missing` value
 *   (default `true`).
 *
 * @param input - The string to parse into an object.
 * @param missing - The value to assign for keys that are missing an equal sign.
 *                  Defaults to `true`.
 * @returns An object containing the parsed keys and values.
 *
 * @example
 * ```ts
 * parseObject("a=1,b=2")
 * // Returns: { a: 1, b: 2 }
 *
 * parseObject("a=1,b={c=2,d=[3,4]},e='hello'")
 * // Returns: { a: 1, b: { c: 2, d: [3,4] }, e: 'hello' }
 *
 * parseObject("flag")
 * // Returns: { flag: true }  // no equal sign → uses `missing`
 *
 * parseObject("empty=")
 * // Returns: { empty: '' }  // equal sign with no value → empty string
 * ```
 */
export const parseObject = (input: string, missing: any = true) => {
  const result: Record<string, any> = {};
  let key, val;

  for (const keyVal of split(input, 44)) {
    [key, val] = split(keyVal, 61);
    if ((key = key?.trim())) {
      if (val == null) {
        result[key] = missing;
      } else {
        result[key] = parseValue(val);
      }
    }
  }

  return result;
};

/**
 * Recursively checks whether a value pattern matches a target value.
 *
 * Matching rules:
 * - Primitive values are converted to strings before comparison.
 * - Arrays are matched element-wise; the target may contain additional elements.
 * - Objects are matched by their keys recursively; the target may have extra keys.
 * - Special "truthy" markers in the pattern only require the target value to be
 *   truthy.
 *
 * @param value - The pattern value to match. Can be a primitive, array, object,
 *                or special truthy marker.
 * @param target - The value to test against the pattern.
 * @returns `true` if the target matches the pattern, `false` otherwise.
 *
 * @example
 * ```ts
 * matchValue(5, "5") // true (values are compared as strings)
 * matchValue([1, 2], ["1", "2"]) // true
 * matchValue([1, 2], [1, 2, 3]) // true (target may contain additional elements)
 * matchValue({a: 1}, {a: "1", b: 2}) // true (target may have extra keys)
 * matchValue(TRUTHY_KEY, "non-empty string") // true
 * matchValue(TRUTHY_KEY, 0) // false
 * ```
 */
const matchValue = (value: any, target: any): boolean => {
  if (value === TRUTHY_KEY) {
    return Boolean(target);
  }

  if (value && typeof value === "object") {
    if (!target || typeof target !== "object") {
      return false;
    }
    for (const key in value) {
      if (!matchValue(value[key], target[key])) {
        return false;
      }
    }
    return true;
  }

  return value + "" === target + "";
};

/**
 * Checks whether a target object matches a pattern specified as a string.
 *
 * The pattern string uses a lightweight key-value syntax similar to:
 *   "key1=value1, key2, key3={nested=val}"
 *
 * Rules:
 * - Keys without a value (no `=`) are treated as requiring the target property
 *   to be truthy.
 * - Keys with an equal sign but no value are treated as empty strings.
 * - Nested objects and arrays are matched recursively.
 * - Arrays in the pattern are treated as prefixes: the target array can be
 *   longer.
 * - Extra keys in the target object are allowed.
 *
 * Examples:
 * ```ts
 * matchObject("a=1, b", { a: 1, b: true, c: 3 }) // true
 * matchObject("a=1, b", { a: 1, b: false })    // false
 * matchObject("arr=[1,2]", { arr: [1,2,3] })   // true (prefix match)
 * ```
 *
 * @param pattern - The pattern string to parse and match against.
 * @param target - The target object to test.
 * @returns True if the target matches the pattern; false otherwise.
 */
export const matchObject = (pattern: string, target: Record<string, any>) =>
  matchValue(parseObject(pattern, TRUTHY_KEY), target);
