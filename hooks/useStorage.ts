const IS_BROWSER =
  typeof window !== "undefined" &&
  typeof navigator !== "undefined" &&
  typeof document !== "undefined";

export default function useStorage(key: string) {
  if (!IS_BROWSER) {
    return [{}, () => {}];
  }
  
  const cache = window.localStorage.getItem(key);

  return [
    JSON.parse(cache),
    (val) => window.localStorage.setItem(key, JSON.stringify(val)),
  ];
}
