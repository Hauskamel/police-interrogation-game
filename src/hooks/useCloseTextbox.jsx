// TODO: Nochmal nachschauen, ob das nicht auch eine Hook anstelle einer HelperFunction ist -> hat ein setTextboxVisiblity -> ist das nicht ein Anzeichen für eine Hook?s

export const closeTextbox = (setTextboxVisibililty, onClose) => {
    setTimeout(() => {
        onClose();
    }, 150);
    setTextboxVisibililty(false);
}