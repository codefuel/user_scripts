// ==UserScript==
// @name         Populate dev email field
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Populate email field with a dev email address
// @author       Aaron Sargent
// @include      https://m.ishifts.com/*
// @include      https://m.servola.org:8080/*
// @run-at       document-end
// @require      https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/6.18.2/babel.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/babel-polyfill/6.16.0/polyfill.js
// @match        http://*/*
// @grant        none
// ==/UserScript==

/* jshint ignore:start */
var inline_src = (<><![CDATA[
/* jshint ignore:end */
    /* jshint esnext: false */
    /* jshint esversion: 6 */

    const devData = [
    ];

    const devToolbarDiv = document.createElement('div');
    const devToolbarHeight = '20px';

    devToolbarDiv.setAttribute('id', 'devToolbar');

    const devContentCSS = `
      <style>
        #devToolbar {
          position: fixed;
          top: 0;
          display: flex;
          background: lightgray;
          width: 100%;
          height: ${devToolbarHeight};
          z-index: 1000;
          overflow: hidden;
        }
        .devContentContainer {
          display: flex;
          flex-direction: row;
          position: relative;
          width: 100%;
        }
        .toggleContentContainer {
          position: absolute;
          top: 4px;
          right: 10px;
          font-size: 0.75em;
        }
        .devClientInfo {
          display: flex;
          flex-direction: row;
          font-size: 0.75em;
          cursor: pointer;
        }
        .devClientInfo:hover {
          background: lightgoldenrodyellow;
        }
        .devClientInfo > div {
          padding: 0.31em 0.5em;
        }
      </style>`;

    const devDataContent = devData.map( data => {
      return `      <div class="devClientInfo">
        <div>${data[0]}</div>
        <div>${data[1]}</div>
        <div class="devEmail">${data[2]}</div>
        <div>${data[3]}</div>
      </div>`;
    });

    const devContent = `
      <div class="devContentContainer">
        <div class="devClientContainer">
          ${devDataContent.join("\n")}
        </div>
        <div class="toggleContentContainer">Toggle</div>
      </div>`;

    document.body.insertAdjacentHTML('afterbegin', devContentCSS);
    devToolbarDiv.insertAdjacentHTML('afterbegin', devContent);
    document.body.appendChild(devToolbarDiv);

    const devClientInfo = document.querySelectorAll('.devClientInfo');
    devClientInfo.forEach( clientInfo => {
      clientInfo.addEventListener(
        'click',
        x => {
          const element = x.currentTarget.querySelector('.devEmail');
          const emailElement = document.getElementsByName('email')[0];

          emailElement.value=element.textContent;

          // Create a new 'change' event
          let event = new Event('change', { bubbles: true });
          event.simulated = true;

          // Dispatch it.
          emailElement.dispatchEvent(event);

          document.querySelector('#devToolbar').setAttribute('style', `height: ${devToolbarHeight}`);
        },
        false );
    });

    const devContentContainer = document.querySelector('.toggleContentContainer');
    devContentContainer.addEventListener(
      'click',
      x => {
        document.querySelector('#devToolbar').setAttribute('style', 'height:auto');
      },
      false );
        

/* jshint ignore:start */
]]></>).toString();
var c = Babel.transform(inline_src, { presets: [ "es2015", "es2016" ] });
eval(c.code);
/* jshint ignore:end */
