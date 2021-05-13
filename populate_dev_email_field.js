// ==UserScript==
// @name         Populate dev email field
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Populate email field with a dev email address
// @author       Aaron Sargent
// @include      https://m.ishifts.com/*
// @include      https://m.servola.org:8080/*
// @include      https://www.ishifts.com/*
// @include      https://www.servola.org/*
// @run-at       document-end
// @require      https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/6.18.2/babel.js
// @match        http://*/*
// @grant        none
// ==/UserScript==

const password = '2014Ferries'

/* jshint ignore:start */
var inline_src = (<><![CDATA[
/* jshint ignore:end */
    /* jshint esnext: false */
    /* jshint esversion: 6 */

    const devData = [
      ["Aaron's Demo", "Aaron Sargent", "1482625@servola.org", "Demo site, site admin"],
      ["Aaron's Demo", "David Blake", "1482644@servola.org", "Demo site, manager"],
      ["Aaron's Demo", "Tatiana Tsukiji", "1482664@servola.org", "Demo site, coordinator (CNA, LPN)"],
      ["Aaron's Demo", "Becky Calkins", "1482671@servola.org", "Demo site, member"],
      ["Aaron's Demo", "Paul Allison", "1482651@servola.org", "Demo site, multi-level user"],
      ["Aaron's Demo", "Rolm Austin", "1482648@servola.org", "Demo site, member"],
      ["Aaron's Demo", "Lindsay Taylor", "1482649@servola.org", "Demo site, site admin, non-primary contact, no workgroups"],
      ["Aaron's Test Site", "Aaron Sargent", "1633950@servola.org", "Multiple sites, site admin"],
      ["Aaron's Test Site", "Aaron Sargent (old dev)", "774482@servola.org", "Multiple sites, site admin"],
      ["Aaron's Test Site", "Nacho Man", "787946@servola.org", "Manager and member"],
      ["Aaron's Test Site", "Taco Man", "867658@servola.org", "Member site"],
      ["Aaron's Test Site", "Burrito Man", "867664@servola.org", "Member site"],
      ["Aaron's Test Site", "Spoon Man", "867665@servola.org", "Member site"],
      ["Aaron's Test Site", "Taco Gal (Coordinator)", "1456900@servola.org", "Member site"],
      ["Aaron's Test Site", "I Stand Alone (Member, only on one team)", "953269@servola.org", "Member site"],
      ["Deb's Demo", "Deb Alverson", "1223151@servola.org", "Support user"],
      ["Steve Baylis", "Steve Baylis", "27676@servola.org", "Super user" ],
      ["HLSR Committee Scheduling", "Andy Sloan (site admin)", "148229@servola.org", "40k+ members, 400+ teams"],
      ["Wellness Corporate Solutions", "WCS Admin (site admin/contact)", "340335@servola.org", "369 teams, 7000+ users, heavy supported user"],
      ["Drive Shop, LLC", "Georgia Reynolds (site admin/contact)", "798368@servola.org", "4k users, most have photos, specialized Staff report"],
      ["FULL", "Ramya Jawahar (site admin)", "138014@servola.org", "Triple digit assigned", "unassigned shifts, default calendar view is Hour"],
      ["SXSW", "Sage Fly (site admin)", "1712844@servola.org", "Large client. Sage is a member of 5 sites - have to choose on login"],
      ["Bloodworks NW", "Catherine Trapp", "204101@servola.org", "Lots of scheduled shifts, local client"],
      ["KEXP", "Erin Waters (coordinator)", "23260@servola.org", "local account, coordinator login"],
      ["Varsity Views Central", "Varsity Views Central", "936194@servola.org", "Multiple sites to choose from"],
      ["Austin Regional Clinic", "Merlin Abraham", "1139963@servola.org", "Restricted account fields"],
      ["MLB", "Operation Armond Netherly", "541854@servola.org", "50+ Availability Entries"],
      ["Randstad", "Manager", "1422305@servola.org", "Randstad manager"],
      ["Randstad", "Coordinator", "2538629@servola.org", "Randstad coordinator, restricted account fields"],
      ["Randstad", "Member", "1700031@servola.org", "Randstad membmer, restrictred account fields"],
      ["Randstad", "Mixed Level User", "3769314@servola.org", "Randstad Manager and Member"],
      ["H2O", "Cassandra Serre", "1417353@servola.org", "IVR"],
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
          line-height: 14px;
        }
        {/* #devToolbar:hover {
          height: auto;
        } */}
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
        <div class="closeDevBar">hide</div>
      </div>`;

    document.body.insertAdjacentHTML('afterbegin', devContentCSS);
    devToolbarDiv.insertAdjacentHTML('afterbegin', devContent);
    document.body.appendChild(devToolbarDiv);

    const devClientInfo = document.querySelectorAll('.devClientInfo');

    // Set up event to work with React >=15.6
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;

    devClientInfo.forEach( clientInfo => {
      clientInfo.addEventListener(
        'click',
        x => {
          const element = x.currentTarget.querySelector('.devEmail');

          // email
          let emailElement;
          if (document.getElementsByName('email')[0]) {
            emailElement = document.getElementsByName('email')[0];
          } else if (document.getElementById('et_pb_email_1')) {
            emailElement = document.getElementById('et_pb_email_1');
          } else if (document.getElementsByName('auth_user')[0]) {
            emailElement = document.getElementsByName('auth_user')[0];
          }

          // password
          let passwordElement;
          if (document.getElementsByName('password')[0]) {
            passwordElement = document.getElementsByName('password')[0];
          } else if (document.getElementById('password_input')) {
            passwordElement = document.getElementById('password_input');
          } else if (document.getElementsByName('auth_password')[0]) {
            passwordElement = document.getElementsByName('auth_password')[0];
          }
          
          // Set field values
          // emailElement.value=element.textContent;
          // passwordElement.value=password;

          const inputEvent = new Event('input', { bubbles: true});

          // Email field: Set the input element's (emailElement) value to email.textContent
          nativeInputValueSetter.call(emailElement, element.textContent);
          emailElement.dispatchEvent(inputEvent);

          // Password field: Set the input element's (passwordElement) value to email.textContent
          nativeInputValueSetter.call(passwordElement, password);
          passwordElement.dispatchEvent(inputEvent);

          // Create a new 'change' event
          // let event = new Event('change', { bubbles: true });
          // event.simulated = true;

          // Dispatch it.
          // emailElement.dispatchEvent(event);

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
var c = Babel.transform(inline_src, { presets: [ "es2015", "es2016" ] });
eval(c.code);
/* jshint ignore:end */
