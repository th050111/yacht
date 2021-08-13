import React, { useEffect, useState } from "react";
import { dbService } from "../myBase";



const Result = ({roomId}) => {
	const [winner,setWinner] = useState("")
	const [init,setInit] = useState(false)
	
	const dbRoom = dbService.collection("rooms").doc(`${roomId}`);
  const dbGame = dbRoom.collection("game");
  const dbChat = dbRoom.collection("chats");
  const dbGameDocs = {
    rule: dbGame.doc("rule"),
    score: dbGame.doc("score"),
  }
  
	useEffect(async ()=>{
		const dbRooms = await dbRoom.get(); 
		const players = dbRooms.data().playerId;
		const firstPlayer = players[0]
		const  dbScore = await dbGameDocs.score.get();
		const scoreArray = dbScore.data();
		console.log(firstPlayer, scoreArray[firstPlayer])
		if(scoreArray[players[0]].totalScore.total > scoreArray[players[1]].totalScore.total)
		{
			setWinner(players[0])
		} else if(scoreArray[players[0]].totalScore.total === scoreArray[players[1]].totalScore.total)
		{
			setWinner("draw")
		} else if(scoreArray[players[0]].totalScore.total < scoreArray[players[1]].totalScore.total)
		{
			setWinner(players[1])
		}
	},[])
	useEffect(()=>{
		setInit(true);
	},[winner])
	
	return <div>{winner}</div>
}





export default Result;