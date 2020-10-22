const buttons = document.querySelectorAll('.faq__show-more');
const listItems = document.querySelectorAll('.faq__item');

buttons.forEach((button, i) => {
    button.addEventListener('click', () => {
        // descr.forEach((item) => {
        //     item.classList.toggle('faq__descr--visible');
        // });
        listItems[i].classList.toggle('faq__item--visible');
    });
});
