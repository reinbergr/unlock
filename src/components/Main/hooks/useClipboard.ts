
export const useClipboard = () => {
  const copyToClipboard = async (text: string) => {
    if ("clipboard" in navigator) return await navigator.clipboard.writeText(text);
    else document.execCommand("copy", true, text);
  }
  return [copyToClipboard];
}