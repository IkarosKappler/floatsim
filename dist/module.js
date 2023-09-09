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
// globalThis.module = globalThis;
globalThis.exports = globalThis.export = globalThis;
// globalThis.exports = globalThis.exports || {};
var require = (globalThis.require = function (...args) {
  // console.log(args[0], args);
  var itemName = args[0];
  var itemNameStart = itemName.lastIndexOf("/");
  var itemNameEnd = itemName.lastIndexOf(".");
  if (itemNameStart !== -1) {
    if (itemNameEnd < itemNameStart) {
      itemNameEnd = itemName.length;
    }
    if (itemNameEnd > itemNameStart + 1) {
      itemName = itemName.substring(itemNameStart + 1, itemNameEnd);
    }
  }
  console.log("itemName", itemName);
  if (itemName === "jsx-runtime") {
    console.log("[module] Requiring pract jsx-runtime", jsxRuntime);
    return jsxRuntime;
  } else if (itemName === "hooks") {
    console.log("[module] Requiring preact hooks", preactHooks);
    return preactHooks;
  } else if (["three", "OrbitControls"].indexOf(itemName) !== -1) {
    // console.log("[module] requiring special library", itemName, globalThis[itemName]);
    return globalThis[itemName]; // [args[0]];
  } else {
    return globalThis;
  }
});

console.log("[module] module.js typeof module", typeof module);
console.log("[module] module.js typeof exports", typeof exports);
