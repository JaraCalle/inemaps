var btn = document.getElementsByClassName('go-top-button');

window.onscroll = function () {

    if (document.documentElement.scrollTop >= ($(window).height() * 0.4)) {
        btn[0].classList.add('show');
    } else {
    btn[0].classList.remove('show');
    }
}
