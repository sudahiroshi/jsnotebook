export class Console {
  constructor() {
    this.elementNode = document.createElement('pre');
    this.elementNode.classList.add('console');
  }

  get element() {
    return this.elementNode;
  }

  log(s) {
    const span = this.constructor.createMessageSpan(s);
    const br = document.createElement('br');
    this.elementNode.appendChild(span);
    this.elementNode.appendChild(br);

    // eslint-disable-next-line no-console
    console.log(s);
  }

  error(e) {
    const span = this.constructor.createMessageSpan(e.message);
    const br = document.createElement('br');
    span.classList.add('err');
    this.elementNode.appendChild(span);
    this.elementNode.appendChild(br);

    // eslint-disable-next-line no-console
    // console.error(e);
  }

  static createMessageSpan(message) {
    const span = document.createElement('span');
    span.textContent = message;
    return span;
  }
}

export default Console;
