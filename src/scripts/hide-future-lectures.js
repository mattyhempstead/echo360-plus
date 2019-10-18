// This script hides the display for lectures that haven't yet been released

(() => {
    console.log('Echo360+ - hide future lectures')

    // The div which hold all the lectures
    const lectureContainer = document.getElementsByClassName('contents-wrapper')[0]

    // As lectures are loaded asyncronously after page loads, we need a listener to check
    // whenever a new element is inserted into the DOM element which contains the lectures.
    lectureContainer.addEventListener('DOMNodeInserted', (evt) => {
        // Lectures which don't contain a video have the additional 'future' class name.
        if (evt.target.className === 'class-row future') {
            // Instead of removing the node, we stop displaying it, as there are many side effects 
            //  that can arise from simply removing it from the page.
            evt.target.style = 'display: none'
        }
    })


})()
