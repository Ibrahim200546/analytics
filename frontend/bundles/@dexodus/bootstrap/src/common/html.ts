export const calculateHtmlTextSize = (text: string): number => {
    const testSpan = document.createElement('span');
    testSpan.style.visibility = 'hidden';
    testSpan.style.position = 'absolute';
    testSpan.style.whiteSpace = 'pre';
    testSpan.textContent = text;
    document.body.appendChild(testSpan);
    const size = testSpan.offsetWidth;
    document.body.removeChild(testSpan);

    return size;
}
