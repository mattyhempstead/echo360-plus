/// This script essentially needs to create a chain of triggers to get the mutation code to execute at the right time.
console.log('Running day with dates script')

// Runs whenever a new element is inserted into DOM containing lectures
// This adds a trigger to every lecture which will update the current lecture info
// whenever a particular lecture is selected.
document.getElementsByClassName('contents-wrapper')[0].addEventListener('DOMNodeInserted', (evt) => {

  // Only add trigger if element is a lecture
  if (evt.target.className && evt.target.className.indexOf('class-row') !== -1) {
    const dateElement = evt.target.getElementsByClassName('date')[0]

    // Only add a day if it has not been added already
    if (dateElement.getElementsByClassName("day").length === 0) {
      const day = new Date(dateElement.innerHTML).toString().substr(0,3)
      dateElement.innerHTML = `<span class="day" style="color: grey">${day}</span>, ${dateElement.innerHTML}`  
    }
  } 
  
})
