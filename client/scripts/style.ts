window.addEventListener('load', () => {
    (function _iffyNavbar ():void {
    // do navbar stuff.
    const nav: HTMLElement | null = document.getElementById('nav');
    var show: boolean = (nav && nav.classList.contains('show')) || false;
    var lockscroll = 0;
    var lscroll = 0;
    // use SetTimeout to not relief the UI/Browser rendering.
    window.addEventListener('scroll', (event) => setTimeout(function() {
        if (!show && (window.scrollY < 600 || window.scrollY < lscroll) && nav !== null) {
            nav.classList.add('show');
            show = true;
            lockscroll = window.scrollY + 5;
        }
        else if (show && window.scrollY > 600 && window.scrollY > lscroll && nav !== null) {
            nav.classList.remove('show');
            show = false;
        }
    
        lscroll = window.scrollY;
    }, 0))
})();

(function _iffyWrapper (): void {
    // do Page stuff.
    const contentwrappers:HTMLCollectionOf<Element> = document.getElementsByClassName('contentwrapper');
    if (contentwrappers.length < 1){
        console.log('cannot find contentwrapper');
        return;
    }
    // use SetTimeout to not relief the UI/Browser rendering.
    window.addEventListener('resize', (event) => setTimeout(function() {
        for (var i = 0; i < contentwrappers.length; i++) {
            (<any>contentwrappers[i]).style.width = window.innerWidth + 'px';
        }
    }, 0));
})();
}, false);
