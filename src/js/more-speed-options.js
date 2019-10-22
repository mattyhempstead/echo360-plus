/*
  This script adds 4 custom playback speed options to the video streamer
*/

(() => {
  console.log('Echo360+ - custom speed options')

  const SPEED_OPTIONS = [2.25, 2.5, 2.75, 3]
  let selectedIndex = 2
  
  // Whenever user clicks on settings icon, this listener is triggered
  const settingsMenuElement = document.getElementsByClassName('video-menu settings-menu')[0]
  settingsMenuElement.addEventListener('DOMNodeInserted', (evt) => {
  
    // Only add speed options if new element is menu settings popup
    if (evt.target.className.startsWith('menu settings')) {
      // Get the element which holds the speed options
      const speedSelectElement = document.getElementById('speed-select')
  
      // Now add the various speed options
      for (speed of SPEED_OPTIONS) {
        const option = document.createElement('option')
        option.value = "" + speed
        option.innerHTML = speed
        speedSelectElement.appendChild(option)
      }
  
  
      /// Since the custom speed options don't exist each time we open the menu, the selectedIndex
      /// of the <select> element is too large for the list and so it is reset back to 0.
      /// Thus the code below will 'reload' the previously selected option
  
      // Store the selected option whenever it changes
      speedSelectElement.onchange = evt => {
        selectedIndex = evt.target.selectedIndex
      }
  
      // Select whichever speed was previous selected
      speedSelectElement.selectedIndex = selectedIndex
  
    }
  
  })  

})()
