export class Store extends EventTarget {
  constructor() {
    super();
    this.on = this.addEventListener;
  }

  dispatch({ type, data }) {
    this.dispatchEvent(new CustomEvent(type, { detail: data }));
  }
}
