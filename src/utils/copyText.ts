/**
 * 复制字符串到剪贴板
 * @param {string} text - 需要复制的字符串
 * @returns {Promise<boolean>} 返回复制是否成功的 Promise
 */
export default function copyText(text) {
    // 现代浏览器推荐方案
    if (navigator.clipboard && window.isSecureContext) {
        return navigator.clipboard.writeText(text)
            .then(() => true)
            .catch((error) => {
                console.error('现代API复制失败:', error);
                return false;
            });
    }

    // 传统兼容方案
    return new Promise((resolve) => {
        try {
            // 创建临时文本域
            const textarea = document.createElement('textarea');
            textarea.value = text;

            // 防止屏幕闪烁的样式
            textarea.style.position = 'fixed';
            textarea.style.left = '-9999px';
            textarea.style.top = '10px';
            textarea.style.fontSize = '16px'; // 防止 iOS 缩放

            // 添加到 DOM
            document.body.appendChild(textarea);

            // 选择并复制
            textarea.select();
            const success = document.execCommand('copy');

            // 清理 DOM
            document.body.removeChild(textarea);

            // 处理结果
            if (success) {
                resolve(true);
            } else {
                console.warn('传统复制方法失败');
                resolve(false);
            }
        } catch (error) {
            console.error('复制操作异常:', error);
            resolve(false);
        }
    });
}