import React, { useState, useEffect } from 'react';






const Display = ({dices, change, currentScore, confirmedScore, confirmBtn}) => {
	return (
		<div>
		<DisplayDice dices={dices} change={change} />
		<br />
		<DisplayScore currentScore={currentScore} confirmedScore={confirmedScore}
        confirmBtn={confirmBtn}
      />
		</div>
	)
}


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


export default Display;
