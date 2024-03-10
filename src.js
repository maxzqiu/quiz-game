let TIME_LIMIT=30
const URL = "https://opentdb.com/api.php?"
const QUESTION = document.querySelector("#question")
const BUTTON1 = document.querySelector("#choice-1")
const BUTTON2 = document.querySelector("#choice-2")
const BUTTON3 = document.querySelector("#choice-3")
const BUTTON4 = document.querySelector("#choice-4")
const TIMER = document.querySelector("#timer")
const QUIZ_OPTIONS = document.querySelector("#quiz-options-container")
const DIFFICULTY = document.querySelector("#difficulty")
const START = document.querySelector("#start")
const NUMBER = document.querySelector("#num-problems")

const BUTTONS = [BUTTON1, BUTTON2, BUTTON3, BUTTON4]
const QUIZ_CONTAINER = document.querySelector("#quiz-container")

// Fisher-Yates Shuffle
function shuffle(list){
    // A B C D E
    // Step 1: choose random from first 5
    // C was chosen, swap it with 5th item - ABEDC
    //Step 2: choose random from first 4
    // A was chosen, swap it with 4th item - DBEAC
    // Repeat until you to get to 0
    for (i=list.length;i>0;i-=1){
        random=Math.random()
        let n = i
        random=random*i
        random=Math.floor(random)
        swap=list[random]
        list[random]=list[i-1]
        list[i-1]=swap
    }
}

function updateQuestions(data){
    let correct_i=Math.random()
    correct_i=correct_i*4
    correct_i=Math.floor(correct_i)
    // Math.floor(Math.random()*(y-x)+x)
    console.log(correct_i)
    let incorrect=[]
    for (let i=0;i<4;i+=1){
        if (i!==correct_i){
            incorrect.push(BUTTONS[i])
           
        }
    }
    for (i=0;i<3;i+=1){
        incorrect[i].innerHTML=data["incorrect_answers"][i]
    }
    BUTTONS[correct_i].innerHTML=data["correct_answer"]

    QUESTION.innerHTML = data["question"]
}

function displayScore(data,selected_choices){
    let score=0      
    let len=selected_choices.length  
    for (let i=0;i<len;i+=1){
        let answer=data["results"][i]["correct_answer"]
        if (answer===selected_choices[i]){
            score+=1
        }
    }
    QUIZ_CONTAINER.replaceChildren();
    let score_display=document.createElement("p")
    score_display.textContent="Your Score: "+ score.toString() + " / " + len.toString();
    QUIZ_CONTAINER.appendChild(score_display)
    console.log(selected_choices)
}

function start_countdown(time,data,selected_choices){
    time_limit=time

    function countdown(ID){
        time_limit=time_limit-1
        TIMER.innerHTML=(time_limit)
        if (time_limit===0){
            clearInterval(ID)
            displayScore(data,selected_choices)
        }
        console.log(time_limit)

    }
    
    let ID = setInterval(()=>countdown(ID), 1000)

}


async function getQuestion(amount, difficulty) {
    let query = new URLSearchParams({
        type:"multiple",
        amount:amount,
        difficulty:difficulty,
    });

    let res = await fetch(URL+query, { mode: 'cors', method: 'GET' })
    let data = await res.json();
    let question_number=0
    let selected_choices=[];
    console.log(data["results"])
    
    updateQuestions(data["results"][question_number])
    start_countdown(TIME_LIMIT,data,selected_choices)
    for (let button of BUTTONS){
        button.onclick = () => {
            question_number+=1
            selected_choices.push(button.textContent);
            if (question_number===amount){
                displayScore(data,selected_choices);
            } else{
                updateQuestions(data["results"][question_number])
            }
            
        }
    }
    
}

START.onclick = () => {
    if (isNaN(NUMBER.value)===true || NUMBER.value<1 || NUMBER.value>50){
        alert("Input is not valid. ")
        return;
    }
    getQuestion(NUMBER.value, DIFFICULTY.value)
    QUIZ_CONTAINER.classList.remove("hidden")
    QUIZ_OPTIONS.classList.add("hidden")
}