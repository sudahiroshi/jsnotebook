export function listen(elementNodes, CodeElementConstructor) {
  elementNodes.forEach((elm) => {
    const runnable = new CodeElementConstructor(elm);
    runnable.listen();
  });
}

export default listen;
