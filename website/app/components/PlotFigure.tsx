import * as Plot from '@observablehq/plot';
import { createElement as h, ReactElement } from 'react';

// For client-side rendering, see https://codesandbox.io/s/plot-react-csr-p4cr7t?file=/src/PlotFigure.jsx
// Based on https://github.com/observablehq/plot/blob/main/docs/components/PlotRender.js

export default function PlotFigure({
  width,
  options,
}: {
  width: number;
  options: Plot.PlotOptions;
}) {
  return (
    <div style={{ overflow: 'auto' }}>
      <div style={{ width, margin: '0 auto' }}>
        {(
          Plot.plot({
            ...options,
            document: new ServerDocument() as unknown as Document,
          }) as unknown as ServerElement
        ).toReactElement()}
      </div>
    </div>
  );
}

class ServerDocument {
  documentElement: ServerElement;
  constructor() {
    this.documentElement = new ServerElement(this, 'html');
  }

  createElementNS(namespace: string | null, tagName: string) {
    return new ServerElement(this, tagName);
  }
  createElement(tagName: string) {
    return new ServerElement(this, tagName);
  }
  createTextNode(value: string) {
    return new TextNode(this, value);
  }
  querySelector() {
    return null;
  }
  querySelectorAll() {
    return [];
  }
}

class Style {
  properties: Record<string, string> = {};

  setProperty(name: string, value: string) {
    this.properties[name] = value;
  }
  removeProperty(name: string) {
    delete this.properties[name];
  }

  get fontFamily() {
    return this.properties['font-family'];
  }
  set fontFamily(value) {
    this.properties['font-family'] = value;
  }
  get fontSize() {
    return this.properties['font-size'];
  }
  set fontSize(value) {
    this.properties['font-size'] = value;
  }
}

class ServerElement {
  ownerDocument: ServerDocument;
  tagName: string;
  attributes: Record<string, string>;
  children: (ServerElement | TextNode)[];
  parentNode: ServerElement | null;
  style: Style;

  constructor(ownerDocument: ServerDocument, tagName: string) {
    this.ownerDocument = ownerDocument;
    this.tagName = tagName;
    this.attributes = {};
    this.children = [];
    this.parentNode = null;
    this.style = new Style();
  }

  setAttribute(name: string, value: string) {
    this.attributes[name] = String(value);
  }
  setAttributeNS(namespace: string, name: string, value: string) {
    this.setAttribute(name, value);
  }
  getAttribute(name: string) {
    return this.attributes[name];
  }
  getAttributeNS(namespace: string, name: string) {
    return this.getAttribute(name);
  }
  hasAttribute(name: string) {
    return name in this.attributes;
  }
  hasAttributeNS(namespace: string, name: string) {
    return this.hasAttribute(name);
  }
  removeAttribute(name: string) {
    delete this.attributes[name];
  }
  removeAttributeNS(namespace: string, name: string) {
    this.removeAttribute(name);
  }
  addEventListener() {
    // ignored; interaction needs real DOM
  }
  removeEventListener() {
    // ignored; interaction needs real DOM
  }
  dispatchEvent() {
    // ignored; interaction needs real DOM
  }
  append(...children: ServerElement[]) {
    for (const child of children) {
      this.appendChild(
        child?.ownerDocument ? child : this.ownerDocument.createTextNode(child),
      );
    }
  }
  appendChild(child: ServerElement) {
    this.children.push(child);
    child.parentNode = this;
    return child;
  }
  insertBefore(child: ServerElement, after: ServerElement | null) {
    if (after == null) {
      this.children.push(child);
    } else {
      const i = this.children.indexOf(after);
      if (i < 0) throw new Error('insertBefore reference node not found');
      this.children.splice(i, 0, child);
    }
    child.parentNode = this;
    return child;
  }
  querySelector() {
    return null;
  }
  querySelectorAll() {
    return [];
  }
  set textContent(value: string) {
    this.children = [this.ownerDocument.createTextNode(value)];
  }
  toReactElement(): ReactElement {
    const {
      class: className,
      ['stroke-opacity']: strokeOpacity,
      ['font-family']: fontFamily,
      ['font-size']: fontSize,
      ['font-variant']: fontVariant,
      ['text-anchor']: textAnchor,
      ...attributes
    } = this.attributes;
    return h(
      this.tagName,
      {
        ...attributes,
        className,
        strokeOpacity,
        fontFamily,
        fontSize,
        fontVariant,
        textAnchor,
        style: Object.fromEntries(
          Object.entries(this.style.properties).map(([key, value]) => [
            key.replace(/(?!^)-(.)/g, (_, m) => m.toUpperCase()),
            value,
          ]),
        ),
      },
      this.children.map((c) => c.toReactElement()),
    );
  }
}

class TextNode {
  ownerDocument: ServerDocument;
  nodeValue: string;
  constructor(ownerDocument: ServerDocument, nodeValue: string) {
    this.ownerDocument = ownerDocument;
    this.nodeValue = String(nodeValue);
  }
  toReactElement() {
    return this.nodeValue;
  }
}
