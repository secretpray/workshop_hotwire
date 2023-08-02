import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="password-visibility"
export default class extends Controller {
  static targets = ['input', 'icon']
  static classes = ['hidden']

  connect() {
    this.hidden = this.inputTarget.type === 'password'
    this.class = this.hasHiddenClass ? this.hiddenClass : 'hidden'
  }

  toggle(event) {
    event.preventDefault()

    this.inputTarget.type = this.hidden ? 'text' : 'password'
    this.hidden = !this.hidden

    this.iconTargets.forEach(icon => icon.classList.toggle(this.class))
  }
}
