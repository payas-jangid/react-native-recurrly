const fs = require("fs");
const path = "lib/auth.ts";
let text = fs.readFileSync(path, "utf8");
const marker =
  "export const isClerkErrorCode = (error: any, code: string): boolean => {";
const idx = text.indexOf(marker);
if (idx === -1) {
  console.error("MARKER NOT FOUND");
  process.exit(1);
}
const insert = `export type RunClerkActionOptions = {\\n  setFormError: (message: string) => void;\\n  setStatusMessage?: (message: string) => void;\\n  defaultErrorMessage?: string;\\n};\\n\\nexport async function runClerkAction<T>(\\n  action: () => Promise<T>,\\n  {\\n    setFormError,\\n    setStatusMessage,\\n    defaultErrorMessage = 'An error occurred. Please try again.',\\n  }: RunClerkActionOptions,\\n): Promise<T | undefined> {\\n  try {\\n    return await action();\\n  } catch (error) {\\n    const message = formatAuthError(error) || defaultErrorMessage;\\n    setFormError(message);\\n    if (setStatusMessage) {\\n      setStatusMessage('');\\n    }\\n    return undefined;\\n  }\\n};\\n\\n`;
text = text.slice(0, idx) + insert + text.slice(idx);
fs.writeFileSync(path, text, "utf8");
console.log("PATCHED");
