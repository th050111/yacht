import React, { useState, useEffect } from 'react';


const DisplayDice = ({ dices, change }) => {
  const [isSelected, setIsSelected] = useState([false, false, false, false, false]);
  const toggleDice = (index) => {
    const selectArray = [...isSelected];
    selectArray[index] = !selectArray[index];
    setIsSelected(selectArray);
  }
  useEffect(() => {
    setIsSelected([false, false, false, false, false]);
  }, [dices])
  useEffect(() => { }, [isSelected]);
  return (
    <>
      {dices.map((dice, index) => {
        return <div key={index} onClick={() => toggleDice(index)}>{dice}{isSelected[index] ? ": selected" : ""}</div>
      })}
      <button onClick={() => change(isSelected)}>change</button>
    </>
  )
}

const DisplayScore = ({ currentScore, confirmedScore, confirmBtn }) => {
  const topScoreName = {
    0: "Aces",
    1: "Twos",
    2: "Threes",
    3: "Fours",
    4: "Fives",
    5: "Sixes",
  }
  const bottomScoreName = {
    0: "Choice",
    1: "4 of a Kind",
    2: "Full House",
    3: "Small Staraight",
    4: "Large Straight",
    5: "Yacht",
  }
  const onClickTop = (event, index) => {
    if (confirmedScore[index] != 0)
      console.log("error");
    confirmBtn(index, currentScore.topScore[index], topScoreName[index]);
  }
  const onClickBottom = (event, index) => {
    if (confirmedScore[index + 6] != 0)
      console.log("error");
    confirmBtn(index + 6, currentScore.bottomScore[index], bottomScoreName[index]);
  }
  return (
    <>
      <div>
        {currentScore.topScore.map((score, index) => <div key={index} >{topScoreName[index]}: {score}     <button onClick={(e) => onClickTop(e, index)}>confirm</button></div>)
        }
        {currentScore.bottomScore.map((score, index) => <div key={index} >{bottomScoreName[index]}: {score}     <button onClick={(e) => onClickBottom(e, index)}>confirm</button></div>
        )}
      </div>
      <br />
      <br />
      <br />
      <h3>confirmedScore</h3>
      {confirmedScore.map((score, index) => <div key={index}>{index <= 5 ? topScoreName[index] : bottomScoreName[index - 6]}: {score}</div>
      )}
    </>
  );
}

const Play = () => {
  const [dices, setDices] = useState(Array(5).fill(0));
  const [bottomScore, setBottomScore] = useState([]);
  const [topScore, setTopScore] = useState([]);
  const [confirmedScore, setConfirmedScore] = useState(Array(12).fill(0));
  const [cntChange, setCntChange] = useState(0);
  const [round, setRound] = useState(1);

  useEffect(() => {
    setScore();
  }, [])

  const confirm = (index, score, name) => {
    console.log(index, score, name);
    const confirmArray = [...confirmedScore];
    confirmArray[index] = score;
    setConfirmedScore(confirmArray);
    setCntChange(0);
    setScore(Array(5).fill(true), 0);
    setRound((prev) => prev + 1)
  }

  const setScore = (isSelected = [true, true, true, true, true], cnt = 1) => {
    console.log(isSelected)
    if (cntChange >= 3 && cnt != 0)
      return;
    const currentDices = randomDice(isSelected);
    const { currentTopScore, cntNumber, totalNumber } = countDice(currentDices);
    const currentBottomScore = cntBottomScore(cntNumber, totalNumber);
    setBottomScore(currentBottomScore);
    setTopScore(currentTopScore);
    setDices(currentDices);
  }

  const randomDice = (isSelected) => {
    let isChange = false;
    isSelected.forEach(is => {
      if (is)
        isChange = true;
    })
    if (isChange) {
      setCntChange((prev) => (prev + 1))
      console.log("hi");
    }
    return dices.map((dice, index) => isSelected[index] ? (Math.floor(Math.random() * 6) + 1) : dice
    );
  }

  const countDice = (currentDices) => {
    let currentTopScore = new Array(6).fill(0);
    let cntNumber = new Array(6).fill(0);
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
    let currentBottomScore = new Array(6).fill(0);//state

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
    <>
      <h3>Current Round: {round}</h3>
      <button onClick={() => setScore()}>set</button>
      <DisplayDice dices={dices} change={setScore} />
      <DisplayScore currentScore={{ topScore: topScore, bottomScore: bottomScore }} confirmedScore={confirmedScore}
        confirmBtn={confirm}
      />
    </>
  );
}

export default Play;