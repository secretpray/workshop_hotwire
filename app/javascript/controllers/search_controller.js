import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="search"
export default class extends Controller {
  static targets = [ 
    'form',
    'input',
    "results",
    'clearBtn',
   ]

  connect() {
    this.resetTimeout();
    this.clearInput();
    this.handlerCloseBtn();
    this.keyupListener = event => {
      if (event.code === 'Escape' || event.keyCode == 27) {
        this.removeResults();
      }
    };
    document.addEventListener('keyup', this.keyupListener);
  }

  resetTimeout() {
    if (!this.timeout) return;

    clearTimeout(this.timeout);
  }

  clearInput() {
    if (!this.hasInputTarget || this.inputTarget.value === '') return;

    this.inputTarget.value = ''
  }

  removeResults() {
    if (!this.hasResultsTarget) return;
    
    this.element.querySelector('turbo-frame#results').src = ''
    this.resultsTarget.remove()
  }

  clearAfter() {
    this.removeResults()
    this.clearInput()
    this.handlerCloseBtn()
  }

  handlerCloseBtn() {
    if (!this.hasClearBtnTarget) return;

    if (this.hasInputTarget && !this.inputTarget.value.length == 0) {
      this.clearBtnTarget.classList.remove('hidden')
    } else {
      this.clearBtnTarget.classList.add('hidden')
    }
  }

  inputChange() {
    this.handlerCloseBtn()
    if (this.inputTarget.value.length < 3) return;

    this.resetTimeout();
    
    this.timeout = setTimeout(() => {
      this.submit();
    }, 300);
  }

  submit() {
    this.formTarget.requestSubmit();
  }

  disconnect() {
    this.resetTimeout();
    this.handlerCloseBtn();
    // ? this.clearInput();
    document.removeEventListener('keyup', this.keyupListener);
  }
}
