import type { Directive } from 'vue'

const isIntKey = (key: string) => {
  return /\d/.test(key)
}

const onKeydown = (event: KeyboardEvent) => {
  if (
    ['Backspace', 'Enter', 'Tab', 'ArrowRight', 'ArrowLeft', 'Delete'].includes(event.key) ||
    (event.ctrlKey && ['a', 'c', 'v', 'x'].includes(event.key))
  ) {
    return
  }
  if (!isIntKey(event.key)) {
    event.preventDefault()
  }
}

const onlyIntegers: Directive = {
  mounted(el: HTMLElement) {
    el.addEventListener('keydown', onKeydown)
  },

  beforeUnmount(el: HTMLElement) {
    el.removeEventListener('keydown', onKeydown)
  },
}

export default onlyIntegers
