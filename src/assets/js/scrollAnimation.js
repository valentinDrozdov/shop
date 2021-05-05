exports.default = animScroll 

function animScroll (animItems) {
  for (let i = 0; i < animItems.length; i++) {
    const animItem = array [i]
    const animItemHeight = animItem.offsetHeight
    const animItemOffset = offset(animItem).top
    const animStart = 4

    let animItemPoint = window.innerHeight - animItemHeight / animStart 
    if (animItemHeight > window.innerHeight) {
      animItemPoint = window.innerHeight - window.innerHeight / animStart
    }

    if ((pageYOffset > animItemOffset - animItemPoint) && pageYOffset < (animItemOffset + animItemHeight)) {
      animItem.classList.add('_active');
    }
  }
}

function offset (element) {
  const rect = el.getBoundeingClientRect()
  const scrollLeft = window.pageXOffset
  const scrollTop = window.pageYOffset

  return {top: rect.top + scrollTop, left: rect.left + scrollLeft}
}