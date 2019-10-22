// This script adds custom file names to downloaded lectures

(() => {
  /// This script essentially needs to create a chain of triggers to get 
  /// the mutation code to execute at the right time.
  console.log('Echo360+ - custom file names')

  // Information about the selected lecture
  let lecInfo = {}

  // The div which hold all the lectures
  const lectureContainer = document.getElementsByClassName('contents-wrapper')[0]

  // Sometimes lecture rows load before the script is executed
  // This can occur when the page is opened in a new tab yet the user does not have the tab open
  // Thus we should begin the script by adding listeners to all existing lecture elements
  for (rowElement of lectureContainer.getElementsByClassName('class-row')) {
    // Only execute for lectures with class name exactly 'class-row'
    // This will ensure the modification is only applied to uploaded lectures
    if (rowElement.className === 'class-row') addListenerToLectureRow(rowElement)
  }


  // Runs whenever a new element is inserted into DOM containing lectures
  // This adds a trigger to every lecture which will update the current lecture info
  // whenever a particular lecture is selected.
  lectureContainer.addEventListener('DOMNodeInserted', (evt) => {
    // Only add trigger if element is a lecture which has also finished uploading
    if (evt.target.className === 'class-row') {
      addListenerToLectureRow(evt.target)
    } 
  })


  /**
   * Adds a click listener to a given lecture row element
   * This allows the script to store information on whichever lecture the user has selected
   * @param {HTMLElement} rowElement - The HTML element representing a row in the lecture list
   */
  function addListenerToLectureRow(rowElement) {
    const openMenuElement = rowElement.getElementsByClassName('menu-opener')[0]
    openMenuElement.addEventListener('click', () => {

      // Store info about the particular lecture which has been clicked
      let lectureString = rowElement.getAttribute('aria-label')

      // Get unit of study (e.g. DATA1002)
      lecInfo.uos = lectureString.split('(').slice(-1)[0].split(' ')[0]

      // Decode date (not time) into javascript Date object
      let dateString = lectureString.split('-')[0]
      dateString = dateString.split(' ')
      dateString.pop()
      dateString = dateString.join(' ')
      dateString = new Date(dateString)
      lecInfo.date = dateString

    })
  }


  // A listener for when a model is opened
  // This will change the link for the "Download" button
  let observer
  document.body.addEventListener('DOMNodeInserted', (evt) => {
    // Update Download button DOM when a modal is added
    if (evt.target.className == 'modal ') {
      // Remove old observer when a new modal is opened
      if (observer) observer.disconnect()

      const downloadBtnElement = document.getElementsByClassName('downloadBtn')[0]

      observer = new MutationObserver((mutations) => {
        for (mutation of mutations) {
          // Only apply change if not already updated
          if (!downloadBtnElement.getAttribute('href').endsWith('custom')) {
            updateBtnHref(downloadBtnElement)
          }
        }
      });

      observer.observe(downloadBtnElement, { attributes: true })
    }
  })


  // Updates the href of the download button to have custom file name
  function updateBtnHref(btn) {
    // Modify download link to give custom name to file
    let fileExtension = btn.getAttribute('href').split('.').pop()
    let customFileName = `${lecInfo.uos}-${lecInfo.date.getFullYear()}-${lecInfo.date.getMonth()+1}-${lecInfo.date.getDate()}.${fileExtension}`
    let url = new URL(btn.href)
    url.searchParams.set('fileName', customFileName)
    btn.setAttribute('href', url.toString() + '&custom')
  }

})()
