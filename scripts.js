let bigWheel = document.getElementById('bigWheel');
let sentDisplay = document.getElementById('sentDisplay');
let spinBtn = document.querySelector('.spinBtn');
let wheelSpokes = document.querySelector('.wheelSpokes')
let spokesCount
let angle
let countup
let group = []
let picker
let rotateValue = 0
let slicesNum = 0
let oneSlice = 0

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
console.log(combinedStory)

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
            newDiv.style.transform = "rotate(calc(" + oneSlice +"deg * var(--i)))"
            newDiv.style.background = "hsl(" + (randHue) + " 100% " + (40 - Math.ceil(Math.random()*20)) + "%)"

            percentProp = 100 * oneSlice / 90
            deduct = (100 - percentProp) / 2 + 3
            newDiv.style.clipPath = "polygon(" + deduct + "% 0%, 50% 100%, " + (100 - deduct) + "% 0%)"

            newSpan = document.createElement('span')
            newSpan.innerText = arr[i]
            newSpan.classList.add("slice-text")

            newDiv.append(newSpan)
            bigWheel.append(newDiv)
        }
    }
}

populateWheel(combinedStory)

function spinTheWheel() {
    rotateValue += Math.ceil(Math.random()*slicesNum) * oneSlice + 360;
    //rotateValue += oneSlice
    bigWheel.style.transform = "rotate(" + rotateValue + "deg)"

    pickedIndex = (slicesNum - (((rotateValue + 120) / oneSlice) % slicesNum)) % slicesNum
    
    console.log(rotateValue, (rotateValue) / oneSlice, pickedIndex)
    setTimeout(() => {
        sentDisplay.innerText = combinedStory[pickedIndex]
    }, 1000)
    return pickedIndex
}

window.addEventListener('keydown', (e) =>{
    switch(e.key){
        case 'ArrowDown':
            groupCollapse();
        
        case 'Enter':
            spokesCount = bigWheel.children.length
            angle = 360 / spokesCount

            console.log("If the count is " + spokesCount + ", then each spoke will be " + angle + " degrees.")
            formGroup(spokesCount);
    }
})

function formGroup(n){
    countup = 0;
    group = [];
    while(countup < n){
        countup++
        tempArray = [countup]
        group.push(tempArray);
    }
    console.log(group)
}

function groupCollapse(){
    if(group.length > 1){
        picker = Math.floor((Math.random() * group.length), 1);
        console.log(picker);
        console.log((group[picker])[0])

        if(picker>1){
            group[picker-1].push((group[picker])[0]);
            group.splice(picker, picker);
            console.log(group)
        } else {
            group[picker+1].push((group[picker])[0]);
            group.splice(picker, picker);
            console.log(group)
        }
    }
}