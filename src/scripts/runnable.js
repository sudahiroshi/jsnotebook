import EventEmitter from 'events';
import uuid from 'uuid/v1';
import entities from 'entities';
import { Console } from './console';

export class Runnable extends EventEmitter {
  constructor(elementNode) {
    super();

    this.elementNode = elementNode;
    this.console = new Console();
    this.button = this.constructor.createButton();
    this.buttonLabel = 'Run';

    this.deploy();
  }

  set buttonLabel(label) {
    this.button.textContent = label;
  }

  get buttonLabel() {
    return this.button.textContent;
  }

  get code() {
    return entities.decodeHTML(this.elementNode.textContent);
  }

  deploy() {
    const parent = this.elementNode.parentNode;
    parent.appendChild(this.button);

    if (this.elementNode.classList.contains('console')) {
      parent.appendChild(this.console.element);
    }

    // move to css class
    parent.style.background = '#f8fcfc';
    parent.style.border = 'solid 1px #80a0a0';
  }

  listen() {
    this.button.addEventListener('click', () => {
      this.run();
    });
  }

  run() {
    const { code } = this.spyLogger();

    try {
      this.constructor.eval(code);
      this.emit('done');
    } catch (e) {
      this.console.error(e);
      this.emit('error', e);
    }
  }

  spyLogger() {
    const { code } = this;
    const consoleName = `console-log-${uuid()}`.replace(/-/g, '_');

    window[consoleName] = this.console.log.bind(this.console);

    return {
      code: entities.decodeHTML(code.replace(/console\.log\(/g, `${consoleName}(`)),
    };
  }

  static eval(code) {
    // eslint-disable-next-line no-eval, no-console
    eval.call(window, code); // Magic.1: indirect eval call. evaluates code on global scope.
  }

  static createButton() {
    const button = document.createElement('button');
    button.contentEditable = false;
    return button;
  }
}

export class RunnableOnce extends Runnable {
  constructor(elementNode) {
    super(elementNode);

    this.buttonLabel = 'Once';
    this.on('done', () => this.button.setAttribute('disabled', 'disabled'));
  }
}

export class RunnableSandbox extends Runnable {
  constructor(elementNode) {
    super(elementNode);

    this.buttonLabel = 'Sandbox';
  }

  static eval(code) {
    // eslint-disable-next-line no-eval, no-console
    eval(code); // Magic.2: direct eval call. evaluates code as in current scope.
  }
}

export default Runnable;
