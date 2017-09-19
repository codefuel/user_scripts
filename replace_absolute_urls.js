// ==UserScript==
// @name         Replace absolute URLs
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Replace absolute URLs with relative URLs
// @author       Aaron Sargent
// @include      *
// @run-at       document-end
// @match
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const protocol = document.location.protocol;
    const host = document.location.host;

    // TODO: add more elements
    const elementTypes = [
      'a',
      'img',
      'link',
      'script',
      'form',
      'select',
      'option'
    ];

    // TODO: add more attributes
    const attributes = [
      'action',
      'data-url',
      'href',
      'src'
    ];

    // events
    const windowEvents = [
      'onafterprint',
      'onbeforeprint',
      'onbeforeunload',
      'onerror',
      'onhashchange',
      'onload',
      'onmessage',
      'onoffline',
      'ononline',
      'onpagehide',
      'onpageshow',
      'onpopstate',
      'onresize',
      'onstorage',
      'onunload'
    ];

    const formEvents = [
      'onblur',
      'onchange',
      'oncontextmenu',
      'onfocus',
      'oninput',
      'oninvalid',
      'onreset',
      'onsearch',
      'onselect',
      'onsubmit'
    ];

    const keyboardEvents = [
      'onkeydown',
      'onkeypress',
      'onkeyup'
    ];

    const mouseEvents = [
      'onclick',
      'ondblclick',
      'onmousedown',
      'onmousemove',
      'onmouseout',
      'onmouseover',
      'onmouseup',
      'onmousewheel',
      'onwheel'
    ];

    const dragEvents = [
      'ondrag',
      'ondragend',
      'ondragenter',
      'ondragleave',
      'ondragover',
      'ondragstart',
      'ondrop',
      'onscroll'
    ];

    const clipboardEvents = [
      'oncopy',
      'oncut',
      'onpaste'
    ];

    const mediaEvents = [
      'onabort',
      'oncanplay',
      'oncanplaythrough',
      'oncuechange',
      'ondurationchange',
      'onemptied',
      'onended',
      'onerror',
      'onloadeddata',
      'onloadedmetadata',
      'onloadstart',
      'onpause',
      'onplay',
      'onplaying',
      'onprogress',
      'onratechange',
      'onseeked',
      'onseeking',
      'onstalled',
      'onsuspend',
      'ontimeupdate',
      'onvolumechange',
      'onwaiting'
    ];

    const miscEvents = [
      'onshow',
      'ontoggle'
    ];

    const eventTypes = [windowEvents, formEvents, keyboardEvents, mouseEvents, dragEvents, clipboardEvents, mediaEvents, miscEvents];

    // go through each element array
    // check if event exists
    // replace absolute URL with relative URL

    replaceURL();

    function replaceURL() {
      // each elementType
      for (let i=0; i<elementTypes.length; i++) {
        // all elements of a particular type
        let elements = document.querySelectorAll(elementTypes[i]);

        for (let j=0; j<elements.length; j++) {
          let element = elements[j];

          // each event type per element
          for (let k=0; k<eventTypes.length; k++) {
            let events = eventTypes[k];

            // each event per event type per element
            for (let l=0; l<events.length; l++) {
              let event = events[l];

              // replace the absolute URL
              if (element.hasAttribute(event)) {
                replaceValue(element, event);
              }
            }
          }

          // each attribute we care about
          for (let k=0; k<attributes.length; k++) {
            let attribute = attributes[k];

            if (element.hasAttribute(attribute)) {
              replaceValue(element, attributes[k]);
            }
          }
        }
      }
    }

    function replaceValue(element, attribute) {
      let value = element.getAttribute(attribute);
      let newValue = value.replace(protocol + '//' + host, '');
      element.setAttribute(attribute, newValue);
    }
})();
