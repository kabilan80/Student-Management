export const log = (scope: string, message: string, extra?: unknown) => {
  if (!import.meta.env.DEV) return;
  if (extra === undefined) console.debug(`[${scope}] ${message}`);
  else console.debug(`[${scope}] ${message}`, extra);
};