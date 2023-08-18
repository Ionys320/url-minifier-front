export const copy = (text: string, showConfirmation?: boolean) => {
    navigator.clipboard.writeText(text).then(
        () => {
            if (showConfirmation)
                alert('Content copied to clipboard');
        },
        () => {
            alert('Failed to copy content to clipboard')
        },
    );
}