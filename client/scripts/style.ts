window.addEventListener('load', () => {
    (function _iffyNavbar () {
    // DO navbar stuff.
    const nav: HTMLElement | null = document.getElementById('nav');
    var show: boolean = (nav && nav.classList.contains('show')) || false;
    // Use SetTimeout to not relief the UI/Browser rendering.
    window.addEventListener('scroll', (event) => setTimeout(function() {
        if (show && window.scrollY > 600 && nav !== null) {
            nav.classList.remove('show');
            show = false;
        }
        else if (!show && window.scrollY < 600 && nav !== null) {
            nav.classList.add('show');
            show = true;
        }
    }, 0))
})();

(function _iffyWrapper () {
    // DO Page stuff.
    const contentwrappers = document.getElementsByClassName('contentwrapper');
    if (contentwrappers.length < 1){
        console.log('cannot find contentwrapper');
        return;
    }
    // Use SetTimeout to not relief the UI/Browser rendering.
    window.addEventListener('resize', (event) => setTimeout(function() {
        for (var i = 0; i < contentwrappers.length; i++) {
            (<any>contentwrappers[i]).style.width = window.innerWidth + 'px';
        }
    }, 0))
})();
}, false);
