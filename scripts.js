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
let teamPick = 0
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

window.addEventListener('keydown', (e) =>{
    switch(e.key){
        case 'ArrowDown':
            break
        
        case 'Enter':
            break
    }
})
