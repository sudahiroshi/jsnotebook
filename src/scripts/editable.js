import { CodeElement } from './code-element';
import hljs from './highlight';

export class Editable extends CodeElement {
  constructor(elementNode) {
    super(elementNode);

    this.elementNode.setAttribute('contenteditable', 'true');
    this.elementNode.setAttribute('spellcheck', 'false');

    this.highlight();
  }

  listen() {
    super.listen();

    this.elementNode.addEventListener('blur', this.highlight.bind(this));
  }

  highlight() {
    this.code = this.code;
    hljs.highlightBlock(this.elementNode);
  }
}

export class EditableImmute extends Editable {
  constructor(elementNode) {
    super(elementNode);

    this.elementNode.setAttribute('contenteditable', 'false');
  }
}

export default Editable;
