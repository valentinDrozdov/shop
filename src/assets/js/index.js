import animScroll from './scrollAnimation'

const header = document.querySelector('.header')
const burger = document.querySelector('.burger')

function menu(scroll) {
  if (scroll + 40 > offsetBottom(intro)) {
      header.classList.add('fixed')
      header.style = 'opacity: 1; transform: translate(0, 0);'
  } else if (scroll == header.offsetTop) {
      header.classList.remove('fixed')
      header.style = 'opacity: 1; transform: translate(0, 0);'
  } else {
      header.style = 'opacity: 0; transform: translate(0, -100%);'
  }
}

function openMenu() {
  body.classList.toggle('menu-opened')
}

burger.addEventListener('click', openMenu)