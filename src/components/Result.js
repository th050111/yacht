import React, { useEffect, useState } from "react";
import { dbService } from "../myBase";



const Result = ({roomId, userObj, reEnterRoom }) => {
	const [winner,setWinner] = useState({})
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
			setWinner({
				[players[0]]: "win",
				[players[1]]: "lose"
			})
		} else if(scoreArray[players[0]].totalScore.total === scoreArray[players[1]].totalScore.total)
		{
			setWinner({
				[players[0]]: "draw",
				[players[1]]: "draw"
			})
		} else if(scoreArray[players[0]].totalScore.total < scoreArray[players[1]].totalScore.total)
		{
			setWinner({
				[players[0]]: "lose",
				[players[1]]: "win"
			})
		}
	},[])
	useEffect(()=>{
		setInit(true);
	},[winner])
	
	return (
		<>
			<span style={
				{
					fontSize:"100px",
					position:"absolute",
					left:"50%",
					top:"50%",
					transform:"translate(-50%,-50%)"
				}
			}>{winner[userObj.uid]}</span>
			<div className="re-enter" style={{
				backgroundColor:"white",
				height:"150px",
				width:"150px",
				fontSize:"20px",
				position:"absolute",
				border:"3px solid black",
				left:"90%",
				top:"85%",
				transform:"translate(-50%,-50%)",
				lineHeight:"150px",
				textAlign:"center"
			}}
				onClick={reEnterRoom}
			>
				Enter Room
			</div>
		</>
	)
}





export default Result;