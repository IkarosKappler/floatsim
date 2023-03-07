// index.tsx

(globalThis as any)["define"] = (...args: any) => {
  console.log("DEFINE", args);
};
