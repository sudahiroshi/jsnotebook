import EventEmitter from 'events';
import entities from 'entities';

export class CodeElement extends EventEmitter {
  constructor(elementNode) {
    super();

    this.elementNode = elementNode;
  }

  set code(html) {
    this.elementNode.innerHTML = entities.encodeHTML(html);
  }

  get code() {
    return entities.decodeHTML(this.elementNode.textContent);
  }

  listen() {
    ['keyup', 'paste', 'change'].forEach((name) => {
      this.elementNode.addEventListener(name, e => this.emit('change', e));
    });
  }
}

export default CodeElement;
