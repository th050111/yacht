import React, { useState } from 'react';


const Play = () => {
  const [dices, setDices] = useState([]);
  const [bottomScore, setBottomScore] = useState([]);
  const [topScore, setTopScore] = useState([]);

  const setScore = () => {
    const currentDices = [1, 2, 3, 4, 5];
    const { currentTopScore, cntNumber, totalNumber } = countDice(currentDices);
    const currentBottomScore = cntBottomScore(cntNumber, totalNumber);
    console.log(currentBottomScore);
  }


  const countDice = (currentDices) => {
    let currentTopScore = [0, 0, 0, 0, 0, 0];
    let cntNumber = [0, 0, 0, 0, 0];
    let totalNumber = 0;

    for (let i = 0; i < currentDices.length; i++) {
      const number = currentDices[i];
      totalNumber += number;
      cntNumber[number - 1]++;
      currentTopScore[number - 1] += number;
    }
    return { currentTopScore: currentTopScore, cntNumber: cntNumber, totalNumber: totalNumber };
  }

  const cntBottomScore = (cntNumber, totalNumber) => {
    let isSame = [false, false, false, false] // 같은수 2,3,4,5?
    const scoreName = {
      choice: 0,
      sameFour: 1,
      fullHouse: 2,
      smallStraight: 3,
      largeStraight: 4,
      yacht: 5,
    }
    let currentBottomScore = [0, 0, 0, 0, 0, 0];//state

    let chainCnt = 0;
    let isChain = false;
    let isFirst = true;

    //같은 다이스 
    for (let i = 0; i < cntNumber.length; i++) {
      for (let j = 0; j < isSame.length; j++)
        if (cntNumber[i] === (j + 2))
          isSame[j] = true;
    }
    if (isSame[0] && isSame[1]) // 같은수가 2,3이 true라면
      currentBottomScore[scoreName.fullHouse] = totalNumber;
    if (isSame[2])
      currentBottomScore[scoreName.sameFour] = totalNumber;
    if (isSame[3])
      currentBottomScore[scoreName.yacht] = 50;



    //연속된 다이스
    for (let i = 0; i < cntNumber.length; i++) {
      if (cntNumber[i] >= 1 && (isChain || isFirst)) {
        chainCnt++;
        isChain = true;
        isFirst = false;
      } else {

        isChain = false;
      }
    }
    if (chainCnt >= 4)
      currentBottomScore[scoreName.smallStraight] = 15;
    if (chainCnt === 5)
      currentBottomScore[scoreName.largeStraight] = 30;
    currentBottomScore[scoreName.choice] = totalNumber;
    return currentBottomScore;
  }

  return (
  	<button onClick={setScore}>hi</button>
	);
}

export default Play;