/**
 * Javacript modules transpiled from Typescript may contain
 * `export` and `require` directives, which are no native components
 * in most common browsers.
 *
 *  > Uncaught ReferenceError: exports is not defined
 *  > Uncaught ReferenceError: require is not defined
 *
 * These two instructions create fake 'require' and fake 'export'
 * which should fix these problems.
 *
 * @date 2020-04-01
 **/
globalThis.module = globalThis;
globalThis.exports = globalThis.export = globalThis;
var require = (globalThis.require = function (...args) {
  console.log(args[0], args);
  var itemName = args[0];
  var itemNameStart = itemName.lastIndexOf("/");
  var itemNameEnd = itemName.lastIndexOf(".");
  if (itemNameStart !== -1 && itemNameEnd > itemNameStart + 1) {
    itemName = itemName.substring(itemNameStart + 1, itemNameEnd);
    console.log("itemName", itemName);
  }
  if (["three", "OrbitControls"].indexOf(itemName) !== -1) {
    return globalThis[itemName]; // [args[0]];
  } else {
    return globalThis;
  }
});
