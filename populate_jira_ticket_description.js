// ==UserScript==
// @name         Populate Jira fields
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Populate various Jira fields
// @author       Aaron Sargent
// @include      https://shiftboard.atlassian.net/*
// @run-at       document-end
// @require      https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/6.18.2/babel.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/babel-polyfill/6.16.0/polyfill.js
// @match        http://*/*
// @grant        none
// ==/UserScript==

/* jshint ignore:start */
let inline_src = (<><![CDATA[
/* jshint ignore:end */
    /* jshint esnext: false */
    /* jshint esversion: 6 */

    const descriptionSelector = "#description-wiki-edit #description"

    // ['Jira Feature', 'Field', 'Description', 'Selector', 'Content']
    const devData = [
      [ "Create Ticket:",
        "Description Field",
        "Staging User: 1633950@servola.org (manager)",
        descriptionSelector,
        "URL: http://m.ishifts.com\nUser: 1633950@servola.org\nSite: Aaron's Test Site Shiftboard\n\n",
      ],
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
          z-index: 3000;
          overflow: hidden;
          line-height: 14px;
        }
        #devToolbar:hover {
          height: auto;
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
          right: 50px;
          font-size: 0.75em;
          cursor: pointer;
        }
        .closeDevBar {
          position: absolute;
          top: 4px;
          right: 10px;
          font-size: 0.75em;
          cursor: pointer;
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
        <div>${data[2]}</div>
        <div class="jira-selector">${data[3]}</div>
        <div class="content">${data[4]}</div>
      </div>`;
    });

    const devContent = `
      <div class="devContentContainer">
        <div class="devClientContainer">
          ${devDataContent.join("\n")}
        </div>
        <div class="toggleContentContainer">Toggle</div>
        <div class="closeDevBar">hide</div>
      </div>`;

    document.body.insertAdjacentHTML('afterbegin', devContentCSS);
    devToolbarDiv.insertAdjacentHTML('afterbegin', devContent);
    document.body.appendChild(devToolbarDiv);

    const devClientInfo = document.querySelectorAll('.devClientInfo');
    devClientInfo.forEach( clientInfo => {
      clientInfo.addEventListener(
        'click',
        x => {
          const jiraSelector = x.currentTarget.querySelector('.jira-selector').innerHTML
          const content = x.currentTarget.querySelector('.content').innerHTML

          const element = document.querySelector(jiraSelector)
          element.value += content

          // Create a new 'change' event
          let event = new Event('change', { bubbles: true });
          event.simulated = true;

          // Dispatch it.
          element.dispatchEvent(event);

          document.querySelector('#devToolbar').setAttribute('style', `height: ${devToolbarHeight}`);
        },
        false );
    });

    const devContentContainer = document.querySelector('.toggleContentContainer');
    devContentContainer.addEventListener(
      'click',
      x => {
        const el = document.querySelector('#devToolbar');

        if (el.offsetHeight > parseInt(devToolbarHeight)) {
          el.setAttribute('style', `height: ${devToolbarHeight}`);
        } else {
          el.setAttribute('style', 'height:auto');
        }
      },
      false );

    const closeDevBarElement = document.querySelector('.closeDevBar');
    closeDevBarElement.addEventListener(
      'click',
      x => {
        document.querySelector('#devToolbar').setAttribute('style', 'display: none;');
      },
      false );
        

/* jshint ignore:start */
]]></>).toString();
const c = Babel.transform(inline_src, { presets: [ "es2015", "es2016" ] });
eval(c.code);
/* jshint ignore:end */
