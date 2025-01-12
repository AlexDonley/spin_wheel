let bigWheel = document.getElementById('bigWheel');
let sentDisplay = document.getElementById('sentDisplay');
let spinBtn = document.querySelector('.spinBtn');
let wheelSpokes = document.querySelector('.wheelSpokes')
const punchButton = document.getElementById('punchButton')

let rotateValue = 0
let slicesNum = 0
let oneSlice = 0
let randHue = 0
let thisSlice = null

let indexQueue = []
let shuffledQueue = []
let prevIndex = 0
let nowIndex = 0

const teamArr = ['red', 'blue']
let teamPick = -1
let spinMode = "SHUFFLE"

const story3A = [
    "Look at the store. It's clean!",
    "Wow! There are new toys on the table. ",
    "Oh! There's a lamp on the table.",
    "Hmm... there's a hole in the window.",
    "Shh!"
]
const story3B = [
    "Good morning. How's the weather?",
    "It's cloudy and windy. ",
    "Oh! There's a robot on the table. Wow! It can walk!",
    "Huh? Excuse me?",
    "Oh... Is there a flower behind the lamp?",
    "No, there isn't.",
    "Oh, excuse me! It's so windy."
]
const story4A = [
    "Welcome.",
    "These cars are shiny.",
    "That doll is cute!",
    "Wow! That ball is cool! ",
    "Ball? What ball?"
]

const combinedStory = story3B.concat(story4A)

function populateWheel(arr) {
    slicesNum = arr.length
    
    if (slicesNum < 4) {
        
        window.alert("Wheel must have at least 4 options")

    } else {
        bigWheel.innerHTML = ''
        randHue = Math.ceil(Math.random()*360)

        for (i = 0; i < arr.length; i++) {
            oneSlice = (360 / slicesNum)
            
            newDiv = document.createElement('span')
            newDiv.setAttribute("style", "--i:" + (i + 1))
            newDiv.classList.add('slice')
            newDiv.id = i + "_slice"
            newDiv.style.transform = "rotate(calc(" + oneSlice +"deg * var(--i)))"
            newDiv.style.background = "hsl(" + (randHue) + " 100% " + (40 - Math.ceil(Math.random()*20)) + "%)"

            percentProp = 100 * oneSlice / 90
            deduct = (100 - percentProp) / 2 + 3
            newDiv.style.clipPath = "polygon(" + deduct + "% 0%, 50% 100%, " + (100 - deduct) + "% 0%)"

            newSpan = document.createElement('span')
            newSpan.style.color = 'white'
            newSpan.innerText = arr[i]
            newSpan.classList.add("slice-text")

            newDiv.append(newSpan)
            bigWheel.append(newDiv)
        }
    }
}

function populateIndexQueue(arr) {
    indexQueue = []
    
    for (let i = 0; i < arr.length; i++) {
        indexQueue.push(i)
    }

    shuffledQueue = shuffle(indexQueue)
}

populateWheel(combinedStory)
populateIndexQueue(combinedStory)

function spinTheWheel() {
    if (thisSlice) {
        thisSlice.style.background = "hsl(" + (randHue) + " 100% " + (40 - Math.ceil(Math.random()*20)) + "%)"
        thisSlice.children[0].style.color = 'white'
    }
    
    if (spinMode == "RANDOM") {
        rotateValue += Math.ceil(Math.random()*slicesNum) * oneSlice + 360;
    } else if (spinMode == "SHUFFLE") {
        if (shuffledQueue.length > 0) {
            prevIndex = nowIndex

            nowIndex = shuffledQueue[0]
            shuffledQueue.shift()

            console.log(prevIndex, nowIndex)
            
            rotateValue += (nowIndex - prevIndex) * oneSlice + 360;
        }
    } else if (spinMode == "INCREMENT") {
        rotateValue += oneSlice + 360;
    }
    
    bigWheel.style.transform = "rotate(" + rotateValue + "deg)"

    pickedIndex = (slicesNum - (((rotateValue + 120) / oneSlice) % slicesNum)) % slicesNum
    
    setTimeout(() => {
        
        sentDisplay.innerText = combinedStory[pickedIndex]
        thisSlice = document.getElementById(pickedIndex + "_slice")
        //thisSlice.classList.add('highlight')
        thisSlice.style.background = 'white'
        thisSlice.children[0].style.color = 'black'

    }, 1000)
    
    nextTeam()

    return pickedIndex
}


function assignSliceToTeam() {
    thisSlice.style.background = teamArr[teamPick]
    thisSlice.children[0].style.color = 'white'

    thisSlice = null
}

function nextTeam() {
    if (teamPick < teamArr.length - 1) {
        teamPick++
    } else {
        teamPick = 0
    }

    punchButton.innerText = teamArr[teamPick]
    if (Array.from(punchButton.classList).length > 1) {
        punchButton.classList.remove(Array.from(punchButton.classList)[1])
    }
    punchButton.classList.add(teamArr[teamPick])
    
}

// shuffle array function

function shuffle(arr){
    let unshuffled = arr;
    let shuffled = [];
  
    unshuffled.forEach(word =>{
        randomPos = Math.round(Math.random() * shuffled.length);
  
        shuffled.splice(randomPos, 0, word);
    })
    
    // console.log(shuffled);
    return shuffled;
}


// controls for USB remote
// remote includes up, down, b, and enter

window.addEventListener('keydown', (e) =>{
    switch(e.key){
        case 'ArrowDown':
            nextTeam()
            break
        case 'ArrowUp':
            assignSliceToTeam()
            break
        case 'Enter':
            break
    }
})


// Speech recognition functionality
// Receive listener audio
// Await final utterance
// Compare utterance to target this way:

// Split target and utterance into arrays of lowercase words
// Process both arrays into dictionaries that correspond each word to its number of apperances
// e.g. "the" : 26, "field": 1, "big" : 4
// (tokenization with count)
// for each entry in the target dictionary, subtract the count of the same word from the utterance dictionary
// and store the result in a results array
// This tracks whether the utterance contains all of the target words, but does not account for word order
// Every included word is a "yellow"

// Now loop through each "yellow" word in the target array sequentially, 
// comparing every one to the corresponding and greater indeces of words in the utterance array.
// Something here about correct answers pushing the search index further
// it makes sense in my head, let's see if I can code it later.
// each yellow that has a correspondingly indexed word in the other array is a "green"
// yellows count as half completion and greens count as full completion
