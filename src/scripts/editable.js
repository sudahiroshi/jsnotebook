import EventEmitter from 'events';
import entities from 'entities';
import hljs from './highlight';

export class Editable extends EventEmitter {
  constructor(elementNode) {
    super();

    this.elementNode = elementNode;
    this.initialize();
  }

  set code(html) {
    this.elementNode.innerHTML = entities.encodeHTML(html);
  }

  get code() {
    return entities.decodeHTML(this.elementNode.textContent);
  }

  initialize() {
    this.elementNode.setAttribute('contenteditable', 'true');
    this.elementNode.setAttribute('spellcheck', 'false');

    this.highlight();
  }

  listen() {
    this.elementNode.addEventListener('blur', this.highlight.bind(this));
  }

  highlight() {
    this.code = this.code;
    hljs.highlightBlock(this.elementNode);
  }
}

export class EditableImmute extends Editable {
  initialize() {
    super.initialize();
    this.elementNode.setAttribute('contenteditable', 'false');
  }
}

export default Editable;
