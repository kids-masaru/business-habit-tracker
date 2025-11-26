// 色のマッピング: Tailwindのクラス名 → HEX色
export const COLOR_MAP: Record<string, string> = {
    'blue-500': '#3b82f6',
    'green-500': '#22c55e',
    'emerald-500': '#10b981',
    'lime-500': '#84cc16',
    'red-500': '#ef4444',
    'rose-500': '#f43f5e',
    'orange-500': '#f97316',
    'amber-500': '#f59e0b',
    'yellow-500': '#eab308',
    'purple-500': '#a855f7',
    'violet-500': '#8b5cf6',
    'fuchsia-500': '#d946ef',
    'pink-500': '#ec4899',
    'indigo-500': '#6366f1',
    'sky-500': '#0ea5e9',
    'teal-500': '#14b8a6',
    'cyan-500': '#06b6d4',
};

// HEXをRGBに変換する関数
export function hexToRgb(hex: string): string {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (result) {
        const r = parseInt(result[1], 16);
        const g = parseInt(result[2], 16);
        const b = parseInt(result[3], 16);
        return `${r}, ${g}, ${b}`;
    }
    return '209, 213, 219'; // デフォルトのグレー
}
