/**
 * 剪貼簿工具
 */

/**
 * 複製文字到剪貼簿，含 fallback 機制
 * @param {string} text - 要複製的文字
 * @returns {Promise<boolean>} 是否複製成功
 */
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (_err) {
    // Fallback for iframe environments
    try {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      return true;
    } catch (_fallbackErr) {
      console.error("[clipboard] Failed to copy text");
      return false;
    }
  }
};
