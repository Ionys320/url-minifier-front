export const copy = (text: string, showConfirmation?: boolean) => {
    return new Promise<void>(resolve => {
        navigator.clipboard.writeText(text)
            .then(_ => {
                if (showConfirmation)
                    alert('Copied to clipboard');
            })
            .catch(_ => alert('Failed to copy to clipboard'))
            .finally(() => resolve());
    });
}