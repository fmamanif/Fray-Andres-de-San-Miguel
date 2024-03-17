var CETEI = (function () {
  "use strict";

  var e = {
    namespaces: {
      tei: "http://www.tei-c.org/ns/1.0",
      teieg: "http://www.tei-c.org/ns/Examples",
      rng: "http://relaxng.org/ns/structure/1.0",
    },
    tei: {
      eg: ["<pre>", "</pre>"],
      ptr: ['<a href="$rw@target">$@target</a>'],
      ref: [["[target]", ['<a href="$rw@target">', "</a>"]]],
      graphic: function (e) {
        let t = new Image();
        return (
          (t.src = this.rw(e.getAttribute("url"))),
          e.hasAttribute("width") &&
            t.setAttribute("width", e.getAttribute("width")),
          e.hasAttribute("height") &&
            t.setAttribute("height", e.getAttribute("height")),
          t
        );
      },
      list: [
        [
          "[type=gloss]",
          function (e) {
            const t = e.ownerDocument;
            let i = t.createElement("dl");
            for (let n of Array.from(e.children))
              if (1 == n.nodeType) {
                if ("tei-label" == n.localName) {
                  let e = t.createElement("dt");
                  (e.innerHTML = n.innerHTML), i.appendChild(e);
                }
                if ("tei-item" == n.localName) {
                  let e = t.createElement("dd");
                  (e.innerHTML = n.innerHTML), i.appendChild(e);
                }
              }
            return i;
          },
        ],
      ],
      note: [
        [
          "[place=end]",
          function (e) {
            const t = e.ownerDocument;
            this.noteIndex ? this.noteIndex++ : (this.noteIndex = 1);
            let i = "_note_" + this.noteIndex,
              n = t.createElement("a");
            n.setAttribute("id", "src" + i),
              n.setAttribute("href", "#" + i),
              (n.innerHTML = this.noteIndex);
            let s = t.createElement("sup");
            s.appendChild(n);
            let r = t.querySelector("ol.notes");
            r ||
              ((r = t.createElement("ol")),
              r.setAttribute("class", "notes"),
              this.dom.appendChild(r));
            let o = t.createElement("li");
            return (o.id = i), (o.innerHTML = e.innerHTML), r.appendChild(o), s;
          },
        ],
        ["_", ["(", ")"]],
      ],
      teiHeader: function (e) {
        this.hideContent(e, !1);
      },
      title: [
        [
          "tei-titlestmt>tei-title",
          function (e) {
            const t = e.ownerDocument;
            let i = t.createElement("title");
            (i.innerHTML = e.innerText), t.querySelector("head").appendChild(i);
          },
        ],
      ],
    },
    teieg: {
      egXML: function (e) {
        let t = e.ownerDocument.createElement("pre"),
          i = this.serialize(e, !0).replace(/</g, "&lt;"),
          n = i.match(/^[\t ]+/);
        return (
          n && (i = i.replace(new RegExp("^" + n[0], "mg"), "")),
          (t.innerHTML = i),
          t
        );
      },
    },
  };
  function t(e) {
    const t = e.ownerDocument;
    let i = (e) => {
      let n;
      switch (e.nodeType) {
        case 1:
          n = t.createElement(e.nodeName);
          break;
        case 9:
          n = t.implementation.createDocument();
          break;
        case 11:
          n = t.createDocumentFragment();
          break;
        default:
          n = e.cloneNode(!0);
      }
      if (e.attributes)
        for (let t of Array.from(e.attributes))
          "data-processed" !== t.name && n.setAttribute(t.name, t.value);
      for (let t of Array.from(e.childNodes))
        if (1 == t.nodeType) {
          if (t.hasAttribute("data-original")) {
            for (let e of Array.from(t.childNodes)) {
              let t = n.appendChild(i(e));
              1 === t.nodeType &&
                t.hasAttribute("data-origid") &&
                (t.setAttribute("id", t.getAttribute("data-origid")),
                t.removeAttribute("data-origid"));
            }
            return n;
          }
          t.hasAttribute("data-origname") && n.appendChild(i(t));
        } else n.appendChild(t.cloneNode());
      return n;
    };
    return i(e);
  }
  function i(e) {
    return e.replace(/ .*$/, "");
  }
  function n(e, t = !0) {
    const i = e.ownerDocument;
    if (e.childNodes.length > 0) {
      let n = i.createElement("cetei-original");
      e.appendChild(n),
        n.setAttribute("hidden", ""),
        n.setAttribute("data-original", "");
      for (let t of Array.from(e.childNodes))
        if (t !== n) {
          if (1 === t.nodeType) {
            t.setAttribute("data-processed", "");
            for (let e of t.querySelectorAll("*"))
              e.setAttribute("data-processed", "");
          }
          n.appendChild(e.removeChild(t));
        }
      if (t)
        for (let e of Array.from(n.querySelectorAll("*")))
          e.hasAttribute("id") &&
            (e.setAttribute("data-origid", e.getAttribute("id")),
            e.removeAttribute("id"));
    }
  }
  function s(e, t, i) {
    let n = "";
    const r = (e) => !/[^\t\n\r ]/.test(e);
    if (
      ((9 !== e.nodeType && 11 !== e.nodeType) ||
        (n += '<?xml version="1.0" encoding="UTF-8"?>\n'),
      !t && 1 == e.nodeType)
    ) {
      (n += "string" == typeof i && "" !== i ? "\n" + i + "<" : "<"),
        (n += e.getAttribute("data-origname"));
      let t = e.hasAttribute("data-origatts")
        ? e.getAttribute("data-origatts").split(" ")
        : [];
      for (let i of Array.from(e.attributes))
        i.name.startsWith("data-") ||
          ["id", "lang", "class"].includes(i.name) ||
          (n +=
            " " +
            t.find(function (e) {
              return e.toLowerCase() == i.name;
            }) +
            '="' +
            i.value +
            '"'),
          "data-xmlns" == i.name && (n += ' xmlns="' + i.value + '"');
      e.childNodes.length > 0 ? (n += ">") : (n += "/>");
    }
    for (let o of Array.from(e.childNodes))
      switch (o.nodeType) {
        case 1:
          n += s(o, !1, "string" == typeof i ? i + "  " : i);
          break;
        case 7:
          (n += `<?${o.nodeName} ${o.nodeValue}?>`),
            (9 !== e.nodeType && 11 !== e.nodeType) || (n += "\n");
          break;
        case 8:
          (n += `\x3c!--${o.nodeValue}--\x3e`),
            (9 !== e.nodeType && 11 !== e.nodeType) || (n += "\n");
          break;
        default:
          if (
            (t && r(o.nodeValue) && (n += o.nodeValue.replace(/^\s*\n/, "")),
            "string" == typeof i && r(o.nodeValue))
          )
            break;
          n += o.nodeValue;
      }
    return (
      !t &&
        1 == e.nodeType &&
        e.childNodes.length > 0 &&
        ((n += "string" == typeof i ? "\n" + i + "</" : "</"),
        (n += e.getAttribute("data-origname") + ">")),
      (9 !== e.nodeType && 11 !== e.nodeType) || (n += "\n"),
      n
    );
  }
  function r(e) {
    return e.includes(":"), e.replace(/:/, "-").toLowerCase();
  }
  function o(e, t = null, i = !1) {
    try {
      window.customElements.define(
        r(e),
        class extends HTMLElement {
          constructor() {
            super(),
              this.matches(":defined") ||
                (t && (t.call(this), this.setAttribute("data-processed", "")));
          }
          connectedCallback() {
            this.hasAttribute("data-processed") ||
              (t && (t.call(this), this.setAttribute("data-processed", "")));
          }
        }
      );
    } catch (t) {
      i &&
        (console.log(
          r(e) + " couldn't be registered or is already registered."
        ),
        console.log(t));
    }
  }
  var a = Object.freeze({
    __proto__: null,
    getOrdinality: function (e, t) {
      let i = 1,
        n = e;
      for (
        ;
        n &&
        null !== n.previousElementSibling &&
        (!t || n.previousElementSibling.localName == t) &&
        (i++, (n = n.previousElementSibling), n.previousElementSibling);

      );
      return i;
    },
    copyAndReset: t,
    first: i,
    hideContent: n,
    normalizeURI: function (e) {
      return this.rw(this.first(e));
    },
    repeat: function (e, t) {
      let i = "";
      for (let n = 0; n < t; n++) i += e;
      return i;
    },
    resolveURI: function (e) {
      let t = this.prefixDefs[e.substring(0, e.indexOf(":"))];
      return e.replace(new RegExp(t.matchPattern), t.replacementPattern);
    },
    getPrefixDef: function (e) {
      return this.prefixDefs[e];
    },
    rw: function (e) {
      return e.match(/^(?:http|mailto|file|\/|#).*$/) ? e : this.base + i(e);
    },
    resetAndSerialize: function (e, i, n) {
      return s(t(e), i, n);
    },
    serialize: s,
    unEscapeEntities: function (e) {
      return e
        .replace(/&gt;/, ">")
        .replace(/&quot;/, '"')
        .replace(/&apos;/, "'")
        .replace(/&amp;/, "&");
    },
    tagName: r,
    defineCustomElement: o,
  });
  function l(e) {
    if (e.namespaces)
      for (let t of Object.keys(e.namespaces))
        this.namespaces.has(e.namespaces[t]) ||
          Array.from(this.namespaces.values()).includes(t) ||
          this.namespaces.set(e.namespaces[t], t);
    for (let t of this.namespaces.values())
      if (e[t])
        for (let i of Object.keys(e[t])) this.behaviors[`${t}:${i}`] = e[t][i];
    if (e.functions)
      for (let t of Object.keys(e.functions))
        this.utilities[t] = e.functions[t].bind(this.utilities);
    e.handlers && console.log("Behavior handlers are no longer used."),
      e.fallbacks && console.log("Fallback behaviors are no longer used.");
  }
  function d(e, t, i) {
    let n;
    if (e === Object(e))
      for (let t of Object.keys(e))
        this.namespaces.has(e[t]) || (this.namespaces.set(e[t], t), (n = t));
    else n = e;
    this.behaviors[`${n}:${t}`] = i;
  }
  function c(e, t) {
    let i;
    if (e === Object(e))
      for (let t of Object.keys(e))
        this.namespaces.has(e[t]) || (this.namespaces.set(e[t], t), (i = t));
    else i = e;
    delete this.behaviors[`${i}:${t}`];
  }
  class h {
    constructor(t) {
      (this.options = t || {}),
        (this.document = this.options.documentObject
          ? this.options.documentObject
          : void 0),
        void 0 === this.document &&
          ("undefined" != typeof window && window.document
            ? (this.document = window.document)
            : "undefined" != typeof global &&
              global.document &&
              (this.document = global.document)),
        (this.addBehaviors = l.bind(this)),
        (this.addBehavior = d.bind(this)),
        (this.removeBehavior = c.bind(this)),
        (this.utilities = {});
      for (const e of Object.keys(a))
        ["getPrefixDef", "rw", "resolveURI"].includes(e)
          ? (this.utilities[e] = a[e].bind(this))
          : (this.utilities[e] = a[e]);
      if (
        ((this.els = []),
        (this.namespaces = new Map()),
        (this.behaviors = {}),
        (this.hasStyle = !1),
        (this.prefixDefs = []),
        (this.debug = !0 === this.options.debug),
        (this.discardContent = !0 === this.options.discardContent),
        this.options.base)
      )
        this.base = this.options.base;
      else
        try {
          window &&
            (this.base = window.location.href.replace(/\/[^\/]*$/, "/"));
        } catch (e) {
          this.base = "";
        }
      this.options.omitDefaultBehaviors || this.addBehaviors(e),
        this.options.ignoreFragmentId &&
          window &&
          window.removeEventListener("ceteiceanload", h.restorePosition);
    }
    async getHTML5(e, t, i) {
      window &&
        window.location.href.startsWith(this.base) &&
        e.indexOf("/") >= 0 &&
        (this.base = e.replace(/\/[^\/]*$/, "/"));
      try {
        const n = await fetch(e);
        if (n.ok) {
          const e = await n.text();
          return this.makeHTML5(e, t, i);
        }
        console.log(
          `Could not get XML file ${e}.\nServer returned ${n.status}: ${n.statusText}`
        );
      } catch (e) {
        console.log(e);
      }
    }
    makeHTML5(e, t, i) {
      return (
        (this.XML_dom = new DOMParser().parseFromString(e, "text/xml")),
        this.domToHTML5(this.XML_dom, t, i)
      );
    }
    preprocess(e, t, i) {
      this.els = (function (e, t) {
        const i = e.documentElement;
        let n = 1,
          s = function (e) {
            return (
              t.has(e.namespaceURI ? e.namespaceURI : "") ||
                t.set(e.namespaceURI, "ns" + n++),
              t.get(e.namespaceURI ? e.namespaceURI : "") + ":" + e.localName
            );
          };
        const r = new Set(Array.from(i.querySelectorAll("*"), s));
        return r.add(s(i)), r;
      })(e, this.namespaces);
      let n = (t) => {
        let s;
        if (this.namespaces.has(t.namespaceURI ? t.namespaceURI : "")) {
          let e = this.namespaces.get(t.namespaceURI ? t.namespaceURI : "");
          s = this.document.createElement(`${e}-${t.localName.toLowerCase()}`);
        } else s = this.document.importNode(t, !1);
        for (let e of Array.from(t.attributes))
          "xmlns" == e.name
            ? s.setAttribute("data-xmlns", e.value)
            : s.setAttribute(e.name, e.value),
            "xml:id" == e.name && s.setAttribute("id", e.value),
            "xml:lang" == e.name && s.setAttribute("lang", e.value),
            "rendition" == e.name &&
              s.setAttribute("class", e.value.replace(/#/g, ""));
        if (
          (s.setAttribute("data-origname", t.localName),
          t.hasAttributes() &&
            s.setAttribute("data-origatts", t.getAttributeNames().join(" ")),
          0 == t.childNodes.length && s.setAttribute("data-empty", ""),
          "head" == t.localName)
        ) {
          let i = e.evaluate(
            "count(ancestor::*[tei:head])",
            t,
            function (e) {
              if ("tei" == e) return "http://www.tei-c.org/ns/1.0";
            },
            1,
            null
          );
          s.setAttribute("data-level", i.numberValue);
        }
        if ("tagsDecl" == t.localName) {
          let e = this.document.createElement("style");
          for (let i of Array.from(t.childNodes))
            if (
              1 == i.nodeType &&
              "rendition" == i.localName &&
              "css" == i.getAttribute("scheme")
            ) {
              let t = "";
              i.hasAttribute("selector")
                ? ((t +=
                    i
                      .getAttribute("selector")
                      .replace(/([^#, >]+\w*)/g, "tei-$1")
                      .replace(/#tei-/g, "#") + "{\n"),
                  (t += i.textContent))
                : ((t += "." + i.getAttribute("xml:id") + "{\n"),
                  (t += i.textContent)),
                (t += "\n}\n"),
                e.appendChild(this.document.createTextNode(t));
            }
          e.childNodes.length > 0 && (s.appendChild(e), (this.hasStyle = !0));
        }
        "prefixDef" == t.localName &&
          (this.prefixDefs.push(t.getAttribute("ident")),
          (this.prefixDefs[t.getAttribute("ident")] = {
            matchPattern: t.getAttribute("matchPattern"),
            replacementPattern: t.getAttribute("replacementPattern"),
          }));
        for (let e of Array.from(t.childNodes))
          1 == e.nodeType ? s.appendChild(n(e)) : s.appendChild(e.cloneNode());
        return i && i(s, t), s;
      };
      this.dom = this.document.createDocumentFragment();
      for (let t of Array.from(e.childNodes))
        1 == t.nodeType && this.dom.appendChild(n(t)),
          7 == t.nodeType &&
            this.dom.appendChild(this.document.importNode(t, !0)),
          8 == t.nodeType &&
            this.dom.appendChild(this.document.importNode(t, !0));
      if (((this.utilities.dom = this.dom.firstElementChild), !t))
        return (
          "undefined" != typeof window && window.dispatchEvent(u), this.dom
        );
      t(this.dom, this), window && window.dispatchEvent(u);
    }
    domToHTML5(e, t, i) {
      if (
        (this.preprocess(e, null, i),
        this.applyBehaviors(),
        (this.done = !0),
        !t)
      )
        return (
          "undefined" != typeof window && window.dispatchEvent(u), this.dom
        );
      t(this.dom, this), window && window.dispatchEvent(u);
    }
    processPage() {
      var e;
      (this.els =
        ((e = this.document),
        new Set(
          Array.from(
            e.querySelectorAll("*[data-origname]"),
            (e) =>
              e.localName.replace(/(\w+)-.+/, "$1:") +
              e.getAttribute("data-origname")
          )
        ))),
        this.applyBehaviors(),
        window && window.dispatchEvent(u);
    }
    unsetNamespace(e) {
      this.namespaces.delete(e);
    }
    setBaseUrl(e) {
      this.base = e;
    }
    append(e, t) {
      let i = this;
      if (!t || t.hasAttribute("data-processed"))
        return function () {
          if (!this.hasAttribute("data-processed")) {
            let t = e.call(i.utilities, this);
            t && i.appendBasic(this, t);
          }
        };
      {
        let n = e.call(i.utilities, t);
        n && i.appendBasic(t, n);
      }
    }
    appendBasic(e, t) {
      this.discardContent ? (e.innerHTML = "") : n(e, !0), e.appendChild(t);
    }
    bName(e) {
      return (
        e.tagName.substring(0, e.tagName.indexOf("-")).toLowerCase() +
        ":" +
        e.getAttribute("data-origname")
      );
    }
    childExists(e, t) {
      return (
        !(!e || e.nodeName != t) ||
        (e && e.nextElementSibling && this.childExists(e.nextElementSibling, t))
      );
    }
    decorator(e) {
      if (Array.isArray(e) && 0 == e.length) return function (e) {};
      if (Array.isArray(e) && !Array.isArray(e[0]))
        return this.applyDecorator(e);
      let t = this;
      return function (i) {
        for (let n of e)
          if (i.matches(n[0]) || "_" === n[0])
            return Array.isArray(n[1])
              ? t.decorator(n[1]).call(this, i)
              : n[1].call(this, i);
      };
    }
    applyDecorator(e) {
      let t = this;
      return function (i) {
        let n = [];
        for (let s = 0; s < e.length; s++) n.push(t.template(e[s], i));
        return t.insert(i, n);
      };
    }
    getFallback(e, t) {
      if (e[t]) return e[t] instanceof Function ? e[t] : this.decorator(e[t]);
    }
    getHandler(e, t) {
      if (e[t])
        return e[t] instanceof Function
          ? this.append(e[t])
          : this.append(this.decorator(e[t]));
    }
    insert(e, t) {
      let i = this.document.createElement("cetei-content");
      for (let t of Array.from(e.childNodes))
        1 !== t.nodeType ||
          t.hasAttribute("data-processed") ||
          this.processElement(t);
      if (t[0].match("<[^>]+>") && t[1] && t[1].match("<[^>]+>"))
        i.innerHTML = t[0] + e.innerHTML + (t[1] ? t[1] : "");
      else {
        (i.innerHTML = t[0]),
          i.setAttribute("data-before", t[0].replace(/<[^>]+>/g, "").length);
        for (let t of Array.from(e.childNodes)) i.appendChild(t.cloneNode(!0));
        t.length > 1 &&
          ((i.innerHTML += t[1]),
          i.setAttribute("data-after", t[1].replace(/<[^>]+>/g, "").length));
      }
      return i.childNodes.length < 2 ? i.firstChild : i;
    }
    processElement(e) {
      if (
        e.hasAttribute("data-origname") &&
        !e.hasAttribute("data-processed")
      ) {
        let t = this.getFallback(this.bName(e));
        t && (this.append(t, e), e.setAttribute("data-processed", ""));
      }
      for (let t of Array.from(e.childNodes))
        1 === t.nodeType && this.processElement(t);
    }
    template(e, t) {
      let i = e;
      if (e.search(/\$(\w*)(@([a-zA-Z:]+))/)) {
        let n,
          s = /\$(\w*)@([a-zA-Z:]+)/g;
        for (; (n = s.exec(e)); )
          i = t.hasAttribute(n[2])
            ? n[1] && this.utilities[n[1]]
              ? i.replace(n[0], this.utilities[n[1]](t.getAttribute(n[2])))
              : i.replace(n[0], t.getAttribute(n[2]))
            : i.replace(n[0], "");
      }
      return i;
    }
    applyBehaviors() {
      "undefined" != typeof window && window.customElements
        ? this.define.call(this, this.els)
        : this.fallback.call(this, this.els);
    }
    define(e) {
      for (let t of e) {
        o(t, this.getHandler(this.behaviors, t), this.debug);
      }
    }
    fallback(e) {
      for (let t of e) {
        let e = this.getFallback(this.behaviors, t);
        if (e)
          for (let i of Array.from(
            (this.dom && !this.done
              ? this.dom
              : this.document
            ).querySelectorAll(r(t))
          ))
            i.hasAttribute("data-processed") ||
              (this.append(e, i), i.setAttribute("data-processed", ""));
      }
    }
    static savePosition() {
      window.sessionStorage.setItem(
        window.location + "-scroll",
        window.scrollY
      );
    }
    static restorePosition() {
      if (window.location.hash)
        setTimeout(function () {
          let e = this.document.querySelector(
            window.decodeURI(window.location.hash)
          );
          e && e.scrollIntoView();
        }, 100);
      else {
        let e;
        (e = window.sessionStorage.getItem(window.location + "-scroll")) &&
          (window.sessionStorage.removeItem(window.location + "-scroll"),
          setTimeout(function () {
            window.scrollTo(0, e);
          }, 100));
      }
    }
  }
  try {
    if ("undefined" != typeof window) {
      (window.CETEI = h),
        window.addEventListener("beforeunload", h.savePosition);
      var u = new Event("ceteiceanload");
      window.addEventListener("ceteiceanload", h.restorePosition);
    }
  } catch (e) {
    console.log(e);
  }
  return h;
})();
