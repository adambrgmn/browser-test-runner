export function createElement(kind: string, attributes: Record<string, string | boolean>, children: string) {
  let element = document.createElement(kind);
  element.innerText = children;

  for (let [key, value] of Object.entries(attributes)) {
    if (typeof value === 'string') {
      element.setAttribute(key, value);
    } else {
      element.toggleAttribute(key, value);
    }
  }

  return element;
}
