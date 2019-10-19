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

    // Place the checkbox element on the info bar
    infoBar.appendChild(document.createTextNode('Hide future lectures'))
    infoBar.appendChild(toggleFutureLectures)


    // The div which hold all the lectures
    const lectureContainer = document.getElementsByClassName('contents-wrapper')[0]

    // Store all the lectures that we hide, so we can bring them back.
    let futureLectures = []

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
