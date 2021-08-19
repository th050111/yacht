import React, { useState, useEffect } from 'react';
import "../css/Display.css"





const Display = ({ dices, change, currentScore, confirmedScore, confirmBtn, totalScore, myTurn, noChance, otherScore}) => {
  useEffect(()=>{
    console.log(otherScore)
  },[])

  return (
    <div>
      {myTurn && <DisplayDice dices={dices} change={change} noChance={noChance} />}
      <DisplayScore currentScore={currentScore} confirmedScore={confirmedScore}
        confirmBtn={confirmBtn}
        totalScore={totalScore}
        myTurn={myTurn}
        otherScore={otherScore}
      />
    </div>
  )
}


const DisplayDice = ({ dices, change, noChance}) => {
  const [isSelected, setIsSelected] = useState([false, false, false, false, false]);
  const [opacity, setOpacity] = useState(Array(5).fill(0.3));

  const toggleDice = (index) => {
    const selectArray = [...isSelected];
    selectArray[index] = !selectArray[index];
    setIsSelected(selectArray);
  }
  useEffect(() => {
    setIsSelected([false, false, false, false, false]);
  }, [dices])
  useEffect(() => {
    let opacitArray = [...opacity]
    opacitArray = opacitArray.map((opac, index) => {
      return isSelected[index] ? 1 : 0.3;
    })
    if (!noChance)
      setOpacity(opacitArray)
  }, [isSelected]);
  useEffect(() => {
    if (noChance) {
      const opacitArray = Array(5).fill(1)
      setOpacity(opacitArray);
    }
  }, [noChance])
  return (
    <>
      <div className="dice-ui">
        <div className="dice-ground">
          {
            dices.map((dice, index) => {
              return (
                <div key={index} style={{
					 	opacity: `${opacity[index]}`,
						backgroundImage: `url(/img/dice/dice_${dice}.png)`,
						backgroundSize: "cover"
                }}
                  onClick={() => toggleDice(index)}
                  className="dice">
                </div>
              )
            })
          }
        </div>
        <div className="change-dice" onClick={() => change(isSelected)}>
          change
        </div>
      </div>
    </>
  )
}


const DisplayScore = ({ currentScore, confirmedScore, confirmBtn, totalScore, myTurn, otherScore}) => {
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
    if (confirmedScore[index] != 0) {
      alert("이미 고른 점수입니다!")
      console.log(myTurn)
      return;
    }
    confirmBtn(index, currentScore.topScore[index], topScoreName[index]);
  }
  const onClickBottom = (event, index) => {
    if (confirmedScore[index + 6] != 0) {
      alert("이미 고른 점수입니다!")
      return;
    }
    confirmBtn(index + 6, currentScore.bottomScore[index], bottomScoreName[index]);
    console.log(confirmedScore)
  }
  return (
    <>
      <div className="confirm-score" id="confirm-left">
        <div className="score">
          <table>
            <tbody>
              {
                confirmedScore.map((score, index) => {
                  if (index <= 5)
                    return <tr key={index}><td className="name-td">{topScoreName[index]}</td><td className="score-td">{score}</td></tr>
                })
              }
            </tbody>
          </table>
          <table>
            <tbody>
              <tr>
                <td className="total-name">Bonus</td>
                <td className="total-score">{totalScore.bonus}</td>
                <td className="total-name">Total</td>
                <td className="total-score">{totalScore.topTotal}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="score">
          <table>
            <tbody>
              {
                confirmedScore.map((score, index) => {
                  if (index >= 6)
                    return (
                      <tr key={index}>
                        <td className="name-td">{bottomScoreName[index - 6]}</td>
                        <td className="score-td">{score}</td>
                      </tr>
                    )
                })
              }
              <tr>
                <td className="total">Total</td>
                <td>{totalScore.bottomTotal}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div className="confirm-score" id="confirm-right">
        <div className="score">
          <table>
            <tbody>
              {
                (otherScore!=null?otherScore.score:Array(12).fill(0)).map((score, index) => {
                  if (index <= 5)
                    return <tr key={index}><td className="name-td">{topScoreName[index]}</td><td className="score-td">{score}</td></tr>
                })
              }
            </tbody>
          </table>
          <table>
            <tbody>
              <tr>
                <td className="total-name">Bonus</td>
                <td className="total-score">{(otherScore!=null?otherScore.totalScore.bonus:0)}</td>
                <td className="total-name">Total</td>
                <td className="total-score">{(otherScore!=null?otherScore.totalScore.topTotal:0)}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="score">
          <table>
            <tbody>
              {
                (otherScore!=null?otherScore.score:Array(12).fill(0)).map((score, index) => {
                  if (index >= 6)
                    return (
                      <tr key={index}>
                        <td className="name-td">{bottomScoreName[index - 6]}</td>
                        <td className="score-td">{score}</td>
                      </tr>
                    )
                })
              }
              <tr>
                <td className="total">Total</td>
                <td>{(otherScore!=null?otherScore.totalScore.bottomTotal:0)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      {myTurn &&
        <div className="current-score">
          <div className="choose-score">
            <table>
              <tbody>
                {
                  currentScore.topScore.map((score, index) => {
                    return (
                      <tr key={index} onClick={(event) => onClickTop(event, index)}>
                        <td className="name-td">{topScoreName[index]}</td>
                        <td className="score-td">{score}</td>
                      </tr>
                    )
                  })
                }
              </tbody>
            </table>
          </div>
          <div className="choose-score">
            <table>
              <tbody>
                {
                  currentScore.bottomScore.map((score, index) => {
                    return (
                      <tr key={index} onClick={(event) => onClickBottom(event, index)}>
                        <td className="name-td">{bottomScoreName[index]}</td>
                        <td className="score-td">{score}</td>
                      </tr>
                    )
                  })
                }
              </tbody>
            </table>
          </div>
        </div>
      }
    </>
  );
}


export default Display;
