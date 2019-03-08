import { listen } from './repl';
import { Runnable, RunnableOnce, RunnableSandbox } from './runnable';
import { Editable, EditableImmute } from './editable';

function main() {
  // activate runnable codes
  const runnables = Array.from(document.querySelectorAll('code.runnable'));
  listen(runnables, Runnable);

  // activate runnable-once codes
  const onces = Array.from(document.querySelectorAll('code.once'));
  listen(onces, RunnableOnce);

  // activate runnable-sandbox codes
  const sandboxes = Array.from(document.querySelectorAll('code.sandbox'));
  listen(sandboxes, RunnableSandbox);

  // activate editable codes
  const editables = Array.from(document.querySelectorAll('code.editable'));
  listen(editables, Editable);

  // activate highlight only codes
  const hls = Array.from(document.querySelectorAll('code.hl'));
  listen(hls, EditableImmute);
}

document.addEventListener('DOMContentLoaded', main);
