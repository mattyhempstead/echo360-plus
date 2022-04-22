// ==UserScript==
// @name         Echo360 Plus
// @namespace    ECHO360PLUS
// @version      1
// @description  
// @author       Kush Mittal adapted from Matty Hempstead
// @match        https://echo360.org/section/*
// @match        http://echo360.org/section/*
// @match        https://echo360.org.au/section/*
// @match        http://echo360.org.au/section/*
// @match        https://echo360.net.au/section/*
// @match        http://echo360.net.au/section/*
// @icon         https://www.umass.edu/it/sites/it/files/2017/06/27/Echo360AppIcon.png
// @grant        GM_addStyle
// @run-at       document-end
// ==/UserScript==

// This script adds custom file names to downloaded lectures

// (() => {
//   console.log('Echo360+ - custom file names');

//   // Information about the selected lecture
//   let lecInfo = {};
//   lecInfo.uos = document.querySelector('.course-section-header h1').innerText.split(" ")[0];


//   // Listen for any new elements to DOM and filter for "class-row"
//   new MutationObserver((mutationsList, obsvr) => {
//     for (let mutation of mutationsList) {
//       for (let node of mutation.addedNodes) {
//         // "class-row" elements
//         if (node.classList && node.classList.contains("class-row"))
//           addListenerToLectureRow(node);
      
//         // "class-row" elements in groups
//         if (node.getElementsByClassName)
//           Array.from(node.getElementsByClassName('class-row'))
//             .map(addListenerToLectureRow);
//       }
//     }
//   }).observe(document.body, {childList:true, subtree:true});


//   /**
//    * Adds a click listener to a given lecture row element
//    * This allows the script to store information on whichever lecture the user has selected
//    * @param {HTMLElement} rowElement - The HTML element representing a row in the lecture list
//    */
//   function addListenerToLectureRow(rowElement) {
//     const openMenuElement = rowElement.getElementsByClassName('menu-opener')[0];
//     if (!openMenuElement) return;

//     // Clicking on lecture will store current date
//     openMenuElement.addEventListener('click', () => {
//       const dateElement = rowElement.querySelector('span.date');
//       if (!dateElement) {
//         lecInfo.date = new Date(0);   // Use 0000-00-00 if no date exists
//       } else {
//         lecInfo.date = new Date(dateElement.innerText);
//       }
//     })
//   }


//   // A listener for when a model is opened
//   // This will change the link for the "Download" button
//   let observer
//   document.body.addEventListener('DOMNodeInserted', (evt) => {
//     // Update Download button DOM when a modal is added
//     if (evt.target.className == 'modal ') {

//       // Remove old observer when a new modal is opened
//       if (observer) observer.disconnect();

//       const downloadBtnElement = document.getElementsByClassName('downloadBtn')[0];

//       observer = new MutationObserver((mutations) => {
//         for (mutation of mutations) {
//           // Only apply change if not already updated
//           // if (!downloadBtnElement.getAttribute('href').endsWith('custom')) {
//           if (!downloadBtnElement.getAttribute('href').endsWith('custom')) {
//             updateBtnHref(downloadBtnElement);
//           }
//         }
//       });

//       observer.observe(downloadBtnElement, { attributes: true });
//     }
//   })


//   // Updates the href of the download button to have custom file name
//   const updateBtnHref = async btn => {
//     // Modify download link to give custom name to file
//     const oldUrl = btn.getAttribute('href');
//     const fileExtension = oldUrl.split('.').pop();

//     const isValidDate = lecInfo.date.getTime() != 0;
//     const year = isValidDate ? lecInfo.date.getFullYear() : '0000';
//     const month = isValidDate ? ((lecInfo.date.getMonth()+1)+'').padStart(2, '0') : '00';
//     const day = isValidDate ? (lecInfo.date.getDate()+'').padStart(2, '0') : '00';

//     const customFileName = `${lecInfo.uos}-${year}-${month}-${day}.${fileExtension}`;
  
//     // Url on button is a redirect to the download URL
//     // We fetch the redirect url, modify, and replace the old button href with the modified redirect url
//     const redirectUrl = (await fetch(oldUrl)).url;
//     const downloadUrl = redirectUrl.replace(/filename%3D%22.*%22/gi, 'filename%3D%22' + customFileName + '%22');
//     btn.setAttribute('href', downloadUrl + '&custom');
//   }

// })()
  
// This script adds day strings to each lecture on the list of lectures (e.g. Fri)

(() => {
  console.log('Echo360+ - day with dates');

  // Listen for any new elements to DOM and filter for "class-row"
  new MutationObserver((mutationsList, obsvr) => {
    for (let mutation of mutationsList) {
      for (let node of mutation.addedNodes) {

        // "class-row" elements
        if (node.classList && node.classList.contains("class-row"))
          addDayStringToRow(node);
      
        // "class-row" elements in groups
        if (node.getElementsByClassName)
          Array.from(node.getElementsByClassName('class-row'))
            .map(addDayStringToRow);
      }
    }
  }).observe(document.body, {childList:true, subtree:true});

  /**
   * Adds a date string to a given lecture row element
   * @param {HTMLElement} rowElement - The HTML element representing a row in the lecture list
   */
  function addDayStringToRow(rowElement) {
    const dateElement = rowElement.querySelector('span.date');
    if (!dateElement) return;

    // Only add a day if it has not been added already
    if (dateElement.getElementsByClassName("day").length === 0) {
      const day = new Date(dateElement.innerText).toString().substr(0,3);
      dateElement.innerHTML = `<span class="day" style="color: grey">${day}</span>, ${dateElement.innerHTML}`;
    }
  }

})()

// Reposition-popup
GM_addStyle(`
.menu.centered .menu-items:after {
  margin-left: 100% !important;
  left: -19px !important;
}

.menu.centered .menu-items {
  -webkit-transform: translateX(50%) !important;
  transform: translateX(0%) !important;
}
`);

/*
  This script hides the display for lectures that haven't yet been released.
  It also sets the default sorting method to Newest to accompany this feature.
  This will ensure the newest released lectures will always remain at the top and are easily accessible
*/

(() => {
  console.log('Echo360+ - hide future lectures')

  // Set the default sorting method to "Newest"
  // This is done by just clicking the dropdown and Newest option elements in order
  document.getElementsByClassName("selection-value")[0].click()
  document.getElementsByClassName("active-result")[1].click()

  
  // Reference to info the info bar, which also displays the sort-by dropdown.
  const infoBar = document.getElementsByClassName('info-bar')[0]

  // Create a new checkbox element
  let toggleFutureLectures = document.createElement('input')
  toggleFutureLectures.type = 'checkbox'
  
  // This value can safely be altered to control the default visiblity of future lectures
  toggleFutureLectures.checked = true
  toggleFutureLectures.id = 'showFutureLectures'
  toggleFutureLectures.onchange = () => {
    for (lecture of futureLectures) {
      // For each future lecture, we toggle the state between hidden and not hidden
      lecture.style = toggleFutureLectures.checked ? 'display: none' : ''
    }
  }

  // Create a container element on the info bar to hold a toggle box for this feature
  const hideFutureDiv = document.createElement('div')
  infoBar.appendChild(hideFutureDiv)
  hideFutureDiv.className = 'hide-future'
  
  // Place a label in this container
  const label = document.createElement('label')
  label.textContent = "Hide future lectures"
  hideFutureDiv.appendChild(label)

  // Place the checkbox element in this container
  hideFutureDiv.appendChild(toggleFutureLectures)


  // The div which hold all the lectures
  const lectureContainer = document.getElementsByClassName('contents-wrapper')[0]

  // Store all the lectures that we hide, so we can bring them back.
  let futureLectures = Array.from(document.getElementsByClassName('class-row future'))
  
  // Hide any lectures which are already in the document before script loads
  toggleFutureLectures.onchange()

  // As lectures are loaded asyncronously after page loads, we need a listener to check
  // whenever a new element is inserted into the DOM element which contains the lectures.
  lectureContainer.addEventListener('DOMNodeInserted', (evt) => {
    // Lectures which don't contain a video have the additional 'future' class name.
    if (evt.target.className === 'class-row future') {
      // Instead of removing the node, we stop displaying it, as there are many side effects 
      //  that can arise from simply removing it from the page.
      if (document.getElementById('showFutureLectures').checked) {
        evt.target.style = 'display: none'
      }
      futureLectures.push(evt.target)
    }
  })

})()

GM_addStyle(`
.hide-future {
  display: inline;
  margin-left: 20px;
}

.hide-future label {
  line-height: 40px;
  vertical-align: top;
}

.hide-future input {
  margin-top: auto;
  margin-bottom: auto;
  height: 100%;
  margin-left: 10px;
}
`)
