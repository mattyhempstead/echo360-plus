// This script adds custom file names to downloaded lectures

(() => {
  console.log('Echo360+ - custom file names');

  // Information about the selected lecture
  let lecInfo = {};
  lecInfo.uos = document.querySelector('.course-section-header h1').innerText.split(" ")[0];


  // Listen for any new elements to DOM and filter for "class-row"
  new MutationObserver((mutationsList, obsvr) => {
    for (let mutation of mutationsList) {
      for (let node of mutation.addedNodes) {
        // "class-row" elements
        if (node.className == 'class-row')
          addListenerToLectureRow(node);
      
        // "class-row" elements in groups
        if (node.getElementsByClassName)
          Array.from(node.getElementsByClassName('class-row'))
            .map(addListenerToLectureRow);
      }
    }
  }).observe(document.body, {childList:true, subtree:true});


  /**
   * Adds a click listener to a given lecture row element
   * This allows the script to store information on whichever lecture the user has selected
   * @param {HTMLElement} rowElement - The HTML element representing a row in the lecture list
   */
  function addListenerToLectureRow(rowElement) {
    const openMenuElement = rowElement.getElementsByClassName('menu-opener')[0];
    if (!openMenuElement) return;

    // Clicking on lecture will store current date
    openMenuElement.addEventListener('click', () => {
      const dateElement = rowElement.querySelector('span.date');
      if (!dateElement) {
        lecInfo.date = new Date(0);   // Use 0000-00-00 if no date exists
      } else {
        lecInfo.date = new Date(dateElement.innerText);
      }
    })
  }


  // A listener for when a model is opened
  // This will change the link for the "Download" button
  let observer
  document.body.addEventListener('DOMNodeInserted', (evt) => {
    // Update Download button DOM when a modal is added
    if (evt.target.className == 'modal ') {
      // Remove old observer when a new modal is opened
      if (observer) observer.disconnect();

      const downloadBtnElement = document.getElementsByClassName('downloadBtn')[0];

      observer = new MutationObserver((mutations) => {
        for (mutation of mutations) {
          // Only apply change if not already updated
          if (!downloadBtnElement.getAttribute('href').endsWith('custom')) {
            updateBtnHref(downloadBtnElement);
          }
        }
      });

      observer.observe(downloadBtnElement, { attributes: true })
    }
  })


  // Updates the href of the download button to have custom file name
  function updateBtnHref(btn) {
    // Modify download link to give custom name to file
    let fileExtension = btn.getAttribute('href').split('.').pop();

    const isValidDate = lecInfo.date.getTime() != 0;
    const year = isValidDate ? lecInfo.date.getFullYear() : '0000';
    const month = isValidDate ? ((lecInfo.date.getMonth()+1)+'').padStart(2, '0') : '00';
    const day = isValidDate ? (lecInfo.date.getDate()+'').padStart(2, '0') : '00';

    let customFileName = `${lecInfo.uos}-${year}-${month}-${day}.${fileExtension}`;

    let url = new URL(btn.href);
    url.searchParams.set('fileName', customFileName);
    btn.setAttribute('href', url.toString() + '&custom');
  }

})()
