const observer = new IntersectionObserver((e) => {
    e.forEach(element => {
        if (element.isIntersecting) {
            element.target.classList.add('show-category');
        } else {
            element.target.classList.remove('show-category');
        }
    });
});

const hiddenCategories = document.querySelectorAll('.hide-category');
hiddenCategories.forEach((el) => observer.observe(el))