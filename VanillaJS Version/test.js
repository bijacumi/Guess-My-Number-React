let i = 0 
let j = 0
while (j<=2){
    tutorialClues.rows[2].cells[j].innerText = sumOfCenteredDisplaced[1] - Number(tutorialClues.rows[0].cells[j].innerText)
    let temporarySum = 0 
    for (let i = 0; i<=2; i++) { 
        temporarySum += Number(tutorialClues.rows[i].cells[j].innerText)
    }
    tutorialClues.rows[3].cells[j].innerText = 5 - temporarySum
    if ((Number(tutorialClues.rows[2].cells[j].innerText) > 2) || (Number(tutorialClues.rows[3].cells[j].innerText) < 0)) {
        for (let z = 0; z<=3; z++) {
            tutorialClues.rows[z].cells[j].classList.add("vertical-line")
        }
        crossOuts ++
    }   
    j++
} 

for (let j=0; j<=2; j++) {
    tutorialClues.rows[2].cells[j].innerText = sumOfCenteredDisplaced[1] - Number(tutorialClues.rows[0].cells[j].innerText)
    let temporarySum = 0 
    for (let i = 0; i<=2; i++) { 
        temporarySum += Number(tutorialClues.rows[i].cells[j].innerText)
    }
    tutorialClues.rows[3].cells[j].innerText = 5 - temporarySum
    if ((Number(tutorialClues.rows[2].cells[j].innerText) > 2) || (Number(tutorialClues.rows[3].cells[j].innerText) < 0)) {
        for (let z = 0; z<=3; z++) {
            tutorialClues.rows[z].cells[j].classList.add("vertical-line")
        }
        crossOuts ++
    } 
}