// This script adds day strings to each lecture on the list of lectures (e.g. Fri)

(() => {
  console.log('Echo360+ - day with dates')

  // The div which hold all the lectures
  const lectureContainer = document.getElementsByClassName('contents-wrapper')[0]

  // Sometimes lecture rows load before the script is executed
  // This can occur when the page is opened in a new tab yet the user does not have the tab open
  // Thus we should begin the script by adding days to all existing lecture elements
  for (rowElement of lectureContainer.getElementsByClassName('class-row')) {
    addDayStringToRow(rowElement)
  }

  // As lectures are loaded asyncronously after page loads, we need a listener to check
  // whenever a new element is inserted into the DOM element which contains the lectures.
  lectureContainer.addEventListener('DOMNodeInserted', (evt) => {
    // Only add trigger if element is a lecture
    if (evt.target.className && evt.target.className.indexOf('class-row') !== -1) {
      addDayStringToRow(evt.target)
    } 
  })

  /**
   * Adds a date string to a given lecture row element
   * @param {HTMLElement} rowElement - The HTML element representing a row in the lecture list
   */
  function addDayStringToRow(rowElement) {
    const dateElement = rowElement.getElementsByClassName('date')[0]

    // Only add a day if it has not been added already
    if (dateElement.getElementsByClassName("day").length === 0) {
      const day = new Date(dateElement.innerHTML).toString().substr(0,3)
      dateElement.innerHTML = `<span class="day" style="color: grey">${day}</span>, ${dateElement.innerHTML}`  
    }
  }

})()
