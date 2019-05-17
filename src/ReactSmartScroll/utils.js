export const calcStartIndex = (actualHeights, top = 0) => {
    const len = actualHeights.length;
    if (top === 0 || len < 2) return 0;
    let totalHeight = actualHeights[0];
    for (let i = 1; i < len; i++) {
        totalHeight += actualHeights[i];
        if (top <= totalHeight) {
            return i - 1;
        }
    }
    return 0;
};

export const calcEndIndex = (actualHeights, visibleHeight, startIndex) => {
    const len = actualHeights.length;
    if (len < 2) return len;
    let totalHeight = -actualHeights[startIndex];
    for (let i = startIndex; i < len - 1; i++) {
        totalHeight += actualHeights[i];
        if (totalHeight > visibleHeight + actualHeights[i + 1]) {
            return i;
        }
    }
    return len - 1;
};

export const sumRange = (array, start, end) =>
    array.slice(start, end + 1).reduce((acc, val) => acc + val, 0);
