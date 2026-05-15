/**
 * Determines whether a value is a FileList.
 *
 * @param value - Unknown runtime value
 * @returns True if the value is a FileList
 */
export const isFileList = (value: any): value is FileList =>
  Object.prototype.toString.call(value) === "[object FileList]";
