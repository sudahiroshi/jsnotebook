
export function listen(codeElements, RunnableConstructor) {
  codeElements.forEach((elm) => {
    const runnable = new RunnableConstructor(elm);
    runnable.listen();
  });
}

export default listen;
