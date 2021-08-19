import React, { useState, useEffect } from 'react';
import Display from './Display';
import Result from './Result';
import { dbService } from "../myBase";
import "../css/Play.css";


const Play = ({ roomId, userObj, reEnterRoom}) => {

  const [dices, setDices] = useState(Array(5).fill(0)); // 현재 다이스
  const [bottomScore, setBottomScore] = useState([]);  //bottom 점수
  const [topScore, setTopScore] = useState([]);  //top 점수
  const [confirmedScore, setConfirmedScore] = useState(Array(12).fill(0));   //확정된 점수
  const [cntChange, setCntChange] = useState(0);   //현재 다시 돌린 횟수
  const [round, setRound] = useState(1);   //현재 라운드
  const [myTurn, setMyTurn] = useState(false);   //자신의 턴인지
  const [totalScore, setTotalScore] = useState(  //최종점수 객체
    {
      topTotal: 0,
      bottomTotal: 0,
      bonus: 0,
      total: 0
    })
  const [gameEnd, setGameEnd] = useState(false)  //게임이 끝났는지
  const [noChance, setNoChance] = useState(false);
  const [otherScore, setOtherScore] = useState(null);

  //db값들 위치 저장
  const dbRoom = dbService.collection("rooms").doc(`${roomId}`);
  const dbGame = dbRoom.collection("game");
  const dbChat = dbRoom.collection("chats");
  const dbGameDocs = {
    rule: dbGame.doc("rule"),
    score: dbGame.doc("score"),
  }
  //처음 시작할때 실행
  useEffect(() => {
    setScore();

    dbGameDocs.score.onSnapshot(async (snapshot) => {
      const playerArray = await dbRoom.get()
      const otherId = playerArray.data().playerId.filter((id) => (id != userObj.uid))[0]
      let score = snapshot.data()[otherId];
      console.log(score);
      setOtherScore(score)
    })
    //rule에서 변경 => 정보 가져오기
    dbGameDocs.rule.onSnapshot(async (snapshot) => {
      const turn = snapshot.data().turn;
      const round = snapshot.data().round;
      const playerId = await dbRoom.get();

      //라운드가 12보다 크면 게임 끝
      if (round > 12) {
        setGameEnd(true);
        setMyTurn(false);
      }
      else {
        //게임 끝이 아닐경우 정보 저장
        setRound(round)
        if (await playerId.data().playerId[turn] === userObj.uid) {
          //console.log("Your Turn!!")//3번출력, 버그수정 필요
          setMyTurn(true);
        } else {
          setMyTurn(false);
        }
      }
    })
  }, [])

  //점수가 변경될시 db업데이트
  useEffect(async () => {
    await dbGameDocs.score.update({
      [userObj.uid]: {
        score: confirmedScore,
        totalScore: totalScore,
      }
    })
  }, [totalScore])


  //최종점수 얻기
  const getTotal = (confirmedScore) => {
    const score = {
      bottomTotal: 0,
      topTotal: 0,
      total: 0,
    }
    for (let i = 0; i < 6; i++) {
      score.topTotal += confirmedScore[i]
    }
    for (let i = 0; i < 6; i++) {
      score.bottomTotal += confirmedScore[i + 6]
    }
    score.total = score.bottomTotal + score.topTotal;
    console.log(score)
    setTotalScore(score);
  }

  //점수 선택시
  const confirm = async (index, score, name) => {
    //db에서 확정된 점수 가져오기
    const confirmArray = [...confirmedScore];
    confirmArray[index] = score;
    setConfirmedScore(confirmArray)
    getTotal(confirmArray)

    setCntChange(0);
    setScore(Array(5).fill(true), 0);
    setNoChance(false);

    //턴 바꾸기
    const ruleObj = await dbGameDocs.rule.get();
    console.log(await ruleObj.data())
    if (ruleObj.data().turn >= 1) {
      await dbGameDocs.rule.update({ turn: 0, round: ruleObj.data().round + 1 });
    } else {
      await dbGameDocs.rule.update({ turn: ruleObj.data().turn + 1 });
    }
  }

  //주사위 설정
  const setScore = (isSelected = Array(5).fill(true), cnt = 1) => {
    if (cntChange >= 2 && cnt != 0) {
      setNoChance(true);
    }
    //횟수 소진 => 불가
    if (cntChange >= 3 && cnt != 0) {
      return;
    }
    const currentDices = randomDice(isSelected);
    const { currentTopScore, cntNumber, totalNumber } = countDice(currentDices);
    const currentBottomScore = cntBottomScore(cntNumber, totalNumber);
    setBottomScore(currentBottomScore);
    setTopScore(currentTopScore);
    setDices(currentDices);
  }

  //선택된 다이스만 돌리기
  const randomDice = (isSelected) => {
    console.log("change")
    let isChange = false;
    isSelected.forEach(is => {
      if (is)
        isChange = true;
    })
    if (isChange) {
      setCntChange((prev) => (prev + 1))
    }
    //주사위 굴리기
    return dices.map((dice, index) => isSelected[index] ? (Math.floor(Math.random() * 6) + 1) : dice
    );
  }

  //주사위의 눈의 수 구하기
  const countDice = (currentDices) => {
    let currentTopScore = new Array(6).fill(0);
    let cntNumber = new Array(6).fill(0);
    let totalNumber = 0;

    //주사위의 눈의 수 구하기
    for (let i = 0; i < currentDices.length; i++) {
      const number = currentDices[i];
      totalNumber += number;
      cntNumber[number - 1]++;
      currentTopScore[number - 1] += number;
    }

    //top점수, 눈의 수, 총 점수 반환
    return { currentTopScore: currentTopScore, cntNumber: cntNumber, totalNumber: totalNumber };
  }

  //아래 점수 구하기
  const cntBottomScore = (cntNumber, totalNumber) => {
    let isSame = [false, false, false, false] // 같은수 2,3,4,5?

    //점수 이름
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

    //연속된 다이스가 4,5개라면
    if (chainCnt >= 4)
      currentBottomScore[scoreName.smallStraight] = 15;
    if (chainCnt === 5)
      currentBottomScore[scoreName.largeStraight] = 30;
    currentBottomScore[scoreName.choice] = totalNumber;
    return currentBottomScore;
  }
  return (
    <>
      {
        !gameEnd ? (
          <>
            <div className="game-status">
              <h3>Current Round: {round}</h3>
            </div>
            <Display
              noChance={noChance}
              dices={dices}
              change={setScore}
              currentScore={{
                topScore: topScore,
                bottomScore: bottomScore
              }}
              confirmedScore={confirmedScore}
              totalScore={totalScore}
              confirmBtn={confirm}
              myTurn={myTurn}
              otherScore={otherScore}
            />
          </>
        ) : (
          <div><Result roomId={roomId} userObj={userObj} reEnterRoom={reEnterRoom}/></div>
        )

      }
    </>
  );
}

export default Play;