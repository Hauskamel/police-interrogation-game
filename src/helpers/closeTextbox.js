export const closeTextbox = (setTextboxVisibililty, onClose) => {
    setTimeout(() => {
        onClose();
    }, 150);
    setTextboxVisibililty(false);
}