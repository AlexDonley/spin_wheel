const bigWheel          = document.getElementById('bigWheel')
const targDisplay       = document.getElementById('targDisplay')
const speechDisplay     = document.getElementById('speechDisplay')
const spinBtn           = document.querySelector('.spinBtn')
const wheelSpokes       = document.querySelector('.wheelSpokes')
const punchButton       = document.getElementById('punchButton')

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

let listenBool = true

let targetArr = []
let utterArr = []

const story3A = [
    "Look at the store. It's clean!",
    "Wow! There are new toys on the table. ",
    "Oh! There's a lamp on the table.",
    "Hmm... there's a hole in the window.",
    "Shh!"
]
const story3B = [
    "Good morning. How's the weather?",
    "It's cloudy and windy.",
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
        
        targDisplay.innerHTML = ''

        targetArr = omitPunctuation(combinedStory[pickedIndex]).toLowerCase().split(" ")
        console.log(targetArr)
        targDisplayArr = combinedStory[pickedIndex].split(" ")
        targDisplayArr.forEach(word => {
            const wordSpan = document.createElement('span')
            wordSpan.classList.add("one-word")
            wordSpan.innerText = word

            targDisplay.append(wordSpan)
        })
        
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
            spinTheWheel()
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


// - - - SPEECH RECOGNITION SNIPPET - - - //

window.SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

const recognition = new SpeechRecognition();
recognition.interimResults = true;

function setLanguage(str) {
  targetLang = str
  recognition.lang = targetLang
  //langDisplay.innerText = str
}

setLanguage('en');

recognition.addEventListener("result", (e) => {
  
  const text = Array.from(e.results)
    .map((result) => result[0])
    .map((result) => result.transcript)
    .join("")

  // wordlist = processStrToArr(text)
  utterArr = omitPunctuation(text).toLowerCase().split(' ')
  wordlist = text.split(' ')

  speechDisplay.innerHTML = ""
  n = 0

  wordlist.forEach((element) => {
    const wordSpan = document.createElement('span')
    wordSpan.setAttribute('id', ('utter' + n))
    wordSpan.innerText = element + " "

    speechDisplay.appendChild(wordSpan)
    n++
  })

  if (e.results[0].isFinal) {
    console.log(utterArr)
    compareArrays(targetArr, utterArr, "PERCENTAGE");
    // compareArrays(utterArr, targetArr, "PERCENTAGE");
  }
})

recognition.addEventListener("end", () => {
  if(listenBool){
    recognition.start();
  }
})

// - - - END OF SPEECH RECOGNITION SNIPPET - - - //

// - - - STRING PARSING SNIPPING - - - //

function omitPunctuation(str) {
    noPunct = str.replace(/[.。…—,，\/#!$%\^&\*;；{}=_`~()[\]?]/g,"")
                .replace(/\s+/g, " ");
    return noPunct;
}

// - - - END OF STRING PARSING SNIPPING - - - //

function compareArrays(targetArrLocal, utterArrLocal, mode) {
    if (mode == "PERCENTAGE") {
        let targetOccs = {}
        let utterOccs = {}

        let revisedUtter = []
        let clustersMap = []
        
        const arrIntersect = targetArrLocal.filter(value => utterArrLocal.includes(value));
        console.log(arrIntersect)

        for (const word of targetArrLocal) {
            targetOccs[word] = targetOccs[word] ? targetOccs[word] + 1 : 1;
        }
        console.log(targetOccs)

        // for (const word of utterArrLocal) {
        //     if (utterOccs[word]) {
        //         if (utterOccs[word] < targetOccs[word]){
        //             utterOccs[word] += 1
        //             revisedUtter.push(word)
        //         }
                
        //     } else {
        //         if (arrIntersect.includes(word)) {
        //             utterOccs[word] = 1
        //             revisedUtter.push(word)
        //         }
        //     }
        // }
        // console.log(utterOccs, revisedUtter)

        utterArrLocal.forEach(word => {
            if (arrIntersect.includes(word)) {
                revisedUtter.push(word)
            }
        })
        console.log(revisedUtter)

        // this code will need some revision but it works for now

        for (const word in targetArrLocal) {
            clustersMap.push(null)
        }

        for (let i = 0; i < targetArrLocal.length; i++) {
            let clusterCount = 1

            if (
                    revisedUtter.indexOf(targetArrLocal[i]) >= 0
                    && clustersMap[i] == null
                ) 
            {
                clustersMap[i] = "x"
                indexOffset = revisedUtter.indexOf(targetArrLocal[i]) - i

                for (let j = 1; i + j < targetArrLocal.length; j++) {
                    if (targetArrLocal[i + j] == revisedUtter[indexOffset + i + j]) {
                    //if (revisedUtter.indexOf(targetArrLocal[i+j]) > (indexOffset + i + j)){
                        clusterCount += 1
                        clustersMap[i + j] = "x"
                    }    
                }
    
                for (let k = 0; k < clustersMap.length; k++) {
                    if (clustersMap[k] == "x") {
                        clustersMap[k] = clusterCount
                    }
                }
                console.log(clustersMap)
            }
        }
        


        // clear visual entirely
            
        Array.from(targDisplay.children).forEach(element => {
            element.classList = "one-word"
        })


        // find maximum in clustersMap

        let maxCluster = Math.max(...clustersMap)

        if (revisedUtter.length > 0 && !(maxCluster == null)) {
            
            let minCluster = Math.min(...clustersMap)

            if (maxCluster < clustersMap.length && minCluster == maxCluster) {
                Array.from(targDisplay.children).forEach(element => {
                    element.classList.add("right-word")
                })
            } else {
                for (let n = 0; n < clustersMap.length; n++) {
                    if (clustersMap[n] > 0) {
                        targDisplay.children[n].classList.add("right-word")
                        if (clustersMap[n] == maxCluster) {
                            targDisplay.children[n].classList.add("right-place")
                        }
                    }
                }
            }
        }


        // //update visual
        // arrIntersect.forEach(word => {
        //     findIndex = targetArrLocal.indexOf(word)
        //     targDisplay.children[findIndex].classList.add('right-word')
        // })


        return arrIntersect
    }
}

function secondSmallestElement(arr) {
    let smallest = Infinity;
    let secondSmallest = Infinity;
    
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] < smallest) {
            secondSmallest = smallest;
            smallest = arr[i];
        } else if (arr[i] < secondSmallest && arr[i] !== smallest) {
            secondSmallest = arr[i];
        }
    }
    
    return secondSmallest;
}