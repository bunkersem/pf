window.addEventListener('load', () => {
    (function _iffyNavbar(): void {
        // do navbar stuff.
        const wrapper: Element = document.getElementById('wrapper');
        const nav: HTMLElement | null = document.getElementById('nav');
        var show: boolean = (nav && wrapper.classList.contains('navshow')) || false;
        var lockscroll = 0;
        var lscroll = 0;
        // use SetTimeout to not relief the UI/Browser rendering.
        window.addEventListener('scroll', (event) => setTimeout(function () {
            if (!show && (window.scrollY < 600 || window.scrollY < lscroll) && nav !== null) {
                wrapper.classList.add('shownav');
                show = true;
                lockscroll = window.scrollY + 5;
            }
            else if (show && window.scrollY > 600 && window.scrollY > lscroll && nav !== null) {
                wrapper.classList.remove('shownav');
                show = false;
            }

            lscroll = window.scrollY;
        }, 0));

    })();

    (function _iffyImageModal() {
        // Get the modal
        const modal = document.getElementById('imgmodal');

        if (modal === null)
            return;

        // Get the image and insert it inside the modal - use its "alt" text as a caption
        const modalImg = <HTMLImageElement>modal.querySelector("#modal-img");
        const captionText = modal.querySelector("#modal-caption");

        document.addEventListener('click', (e: Event) => {
            if ((<HTMLElement>e.target).classList.contains('modal-image')) {
                modal.style.display = "block";
                modal.setAttribute('aria-expanded', 'true');
                modalImg.setAttribute('style', `background-image: url(${(<HTMLImageElement>e.target).src})`);
                captionText.innerHTML = (<HTMLImageElement>e.target).alt;
            }
        });
        // Get the <span> element that closes the modal
        const span = <HTMLSpanElement>modal.querySelector('.close');

        // When the user clicks on <span> (x), close the modal
        span.onclick = e => {
            modal.style.display = "none";
            modal.setAttribute('aria-expanded', 'false');
        }
    })();

    (function _iffyWrapper(): void {
        // do Page stuff.
        const contentwrappers: HTMLCollectionOf<Element> = document.getElementsByClassName('contentwrapper');
        if (contentwrappers.length < 1) {
            console.log('cannot find contentwrapper');
            return;
        }
        // use SetTimeout to not relief the UI/Browser rendering.
        window.addEventListener('resize', (event) => setTimeout(function () {
            for (var i = 0; i < contentwrappers.length; i++) {
                (<any>contentwrappers[i]).style.width = (window.innerWidth - 35) + 'px';
            }
        }, 0));
    })();

}, false);
