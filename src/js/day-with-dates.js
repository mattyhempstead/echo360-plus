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
