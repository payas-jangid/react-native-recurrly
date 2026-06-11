const fs = require("fs");
const path = "lib/auth.ts";
const text = fs.readFileSync(path, "utf8");
const idx = text.indexOf("export const formatAuthError");
console.log("idx", idx);
console.log("length", text.length);
if (idx !== -1) {
  const snippet = text.slice(idx, idx + 320);
  console.log("snippet JSON:", JSON.stringify(snippet));
  console.log("----------");
  console.log(snippet);
}
const search =
  "return 'An error occurred. Please try again.';\n};\n\n/**\n * Check if an error is a specific Clerk error code\n */\nexport const isClerkErrorCode = (error: any, code: string): boolean => {\n";
console.log("search idx", text.indexOf(search));
console.log("search length", search.length);
