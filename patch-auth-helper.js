const fs = require("fs");
const path = "lib/auth.ts";
let text = fs.readFileSync(path, "utf8");
const oldPattern =
  "return 'An error occurred. Please try again.';\\n};\\n\\n/**\\n * Check if an error is a specific Clerk error code\\n */\\nexport const isClerkErrorCode = (error: any, code: string): boolean => {\\n";
const insertText =
  "return 'An error occurred. Please try again.';\\n};\\n\\nexport type RunClerkActionOptions = {\\n  setFormError: (message: string) => void;\\n  setStatusMessage?: (message: string) => void;\\n  defaultErrorMessage?: string;\\n};\\n\\nexport async function runClerkAction<T>(\\n  action: () => Promise<T>,\\n  {\\n    setFormError,\\n    setStatusMessage,\\n    defaultErrorMessage = 'An error occurred. Please try again.',\\n  }: RunClerkActionOptions,\\n): Promise<T | undefined> {\\n  try {\\n    return await action();\\n  } catch (error) {\\n    const message = formatAuthError(error) || defaultErrorMessage;\\n    setFormError(message);\\n    if (setStatusMessage) {\\n      setStatusMessage('');\\n    }\\n    return undefined;\\n  }\\n};\\n\\n/**\\n";

const idx = text.indexOf(oldPattern);
if (idx === -1) {
  console.error("PATTERN_NOT_FOUND");
  console.error(
    "idx_formatAuthError",
    text.indexOf("export const formatAuthError = (error: any): string => {"),
  );
  process.exit(1);
}
text = text.slice(0, idx) + insertText + text.slice(idx + oldPattern.length);
fs.writeFileSync(path, text, "utf8");
console.log("PATCHED");
