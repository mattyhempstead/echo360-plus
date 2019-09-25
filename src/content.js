/// This script essentially needs to create a chain of triggers to get 
/// the mutation code to execute at the right time.


// Information about the selected lecture
let lecInfo = {}


// Runs whenever a new element is inserted into DOM containing lectures
// This adds a trigger to every lecture which will update the current lecture info
// whenever a particular lecture is selected.
const contentElement = document.getElementsByClassName('contents-wrapper')[0]
contentElement.addEventListener('DOMNodeInserted', (evt) => {

  // Only add trigger if element is a lecture which has also finished uploading
  if (evt.target.className == 'class-row') {
    const openMenuElement = evt.target.getElementsByClassName('menu-opener')[0]
    openMenuElement.addEventListener('click', () => {

      // Store info about the particular lecture which has been clicked
      let lectureString = evt.target.getAttribute('aria-label')

      // Get unit of study (e.g. DATA1002)
      lecInfo.uos = lectureString.split('(')[1].split(' ')[0]

      // Decode date (not time) into javascript Date object
      let dateString = lectureString.split('-')[0]
      dateString = dateString.split(' ')
      dateString.pop()
      dateString = dateString.join(' ')
      dateString = new Date(dateString)
      lecInfo.date = dateString

    })
  } 
  
  // // Element is the pop menu which appears with a "Download Original" button
  // else if (evt.target.className == 'menu-items') {
  //   const downloadOriginalElement = evt.target.getElementsByTagName('li')[1]
  //   downloadOriginalElement.addEventListener('click', () => {
  //     console.log("downloading orignals")

  //     const modals = document.body.getElementsByClassName('modal ')
  //     for (modal of modals) {
  //       console.log(modal)
  //     }
  //     console.log(modals, modals.length, modals[2])
  //     x.push(modals)
  //   })


  // }

})


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
