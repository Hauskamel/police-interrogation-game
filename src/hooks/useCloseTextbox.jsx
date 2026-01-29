export const useCloseTextbox = (setTextboxVisibililty, onClose) => {
    setTimeout(() => {
        onClose();
    }, 150);
    setTextboxVisibililty(false);
}