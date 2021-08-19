import { dbService } from "../myBase";
import React, { useEffect, useState } from "react";
import Play from "../components/Play";
import Chat from "../components/Chat";
import {Redirect} from "react-router-dom";


const Room = ({ roomId, userObj, leaveR}) => {
  const [isStart, setIsStart] = useState(false);
  //작성중인 twit
  const [chat, setChat] = useState("");
  //저장된 twit들
  const [chats, setChats] = useState([]);
  const [isPlay, setIsPlay] = useState(false);
  const [gameEnd,setGameEnd] = useState(false);
  const [leave,setLeave] = useState(false);
  const [newPlayerArray,setNewPlayerArray] = useState([]);
  const [reload, setReload] = useState(false)

  const dbRoom = dbService.collection("rooms").doc(`${roomId}`);
  const dbGame = dbRoom.collection("game");
  const dbChat = dbRoom.collection("chats");
  const dbGameDocs = {
    rule: dbGame.doc("rule"),
    score: dbGame.doc("score"),
  }

  useEffect(async () => {
  console.log("enter!")
    const room = await dbRoom.get();
		const playerArray = room.data().playerId;
    const newArray = playerArray.filter((element) => element !==userObj.uid )
		setNewPlayerArray([...newArray])
    
    //해당컬렉션에대한 이벤트 리스너
    dbChat.orderBy('createAt', 'desc').limit(10).onSnapshot(snapshot => {
      //문서의 데이터와 id의 객체를 배열로 저장
      const chatArray = snapshot.docs.map(doc => (
        {
          id: doc.id,
          ...doc.data()
        }
      ))
      setChats(chatArray);
    })
    dbGameDocs.rule.onSnapshot((snapshot) => {
      setIsPlay(snapshot.data().isPlay);
    });
	 return async () => {
	 console.log("end")
	 	leaveRoom();
 	 }
  }, [])

  useEffect(() => {
    setTimeout(()=>setReload(true),100)
    window.onbeforeunload = async (e) => {
      setLeave(true)
      console.log([...newPlayerArray])
      if (newPlayerArray.length === 0) {
        await dbRoom.delete();
      }
      await dbRoom.update({
        playerId: newPlayerArray,
        cntPlayer: newPlayerArray.length
      })
      return '';
    }
  }, [newPlayerArray])

  
  const leaveRoom = async () => {
  //if(event)
  	const room = await dbRoom.get();
		const playerArray = room.data().playerId;
		const newArray = playerArray.filter((element) => element !==userObj.uid )
		await dbRoom.update({playerId:newArray})
		if(newArray.length === 0)
		{
			await dbRoom.delete();
		}
  }

  //twit이 submit 됐을 때
  const onSubmit = async (event) => {
    event.preventDefault();
    //컬렉션에 추가(객체)
    await dbChat.add({
      text: chat,
      createAt: Date.now(),
      creatorId: userObj.uid,
    });
    setChat("");
  };

  const onChange = (event) => {
    //event.target의 value를 value로
    const { target: { value } } = event;
    setChat(value);
  }

  const onStart = async () => {
    const cnt = await dbRoom.get()
  	if(!isPlay && cnt.data().cntPlayer >= 2)
    {
      await dbGameDocs.rule.update({isPlay: true});
    }
    else {
      alert("두명이상부터 가능합니다!")
    }
  }
  
  const onLeave = () => {
  leaveR();
    leaveRoom()
	setLeave(true);
  }

  const reEnterRoom = async () => {
    await dbGameDocs.rule.update({
      isPlay: false,
      round: 1,
      turn: 0,
    })
    await dbGameDocs.score.set({
      score:0
    })
  }

  return (
    <>
	 {leave && <Redirect from="*" to="/"/>}
      <div>
        {isPlay ?
          (
            <>
              <Play roomId={roomId} userObj={userObj} reEnterRoom={reEnterRoom}/>
            </>
          ) : (
            <>
            <div>
              <form onSubmit={onSubmit}>
                <input value={chat} onChange={onChange} type="text" placeholder="What's on your mind?" maxLength={120} />
                <input type="submit" value="twit" />
              </form>
              <div>
                {chats.map(chat =>
                  <Chat
                    key={chat.id}
                    chatObj={chat}
                    isOwner={chat.creatorId === userObj.uid}
                    dbChat={dbChat}
                  />
                )}
              </div>
            </div >
            <div>
              <button onClick={onStart}>start</button>
            </div>
				<div>
					<button onClick={onLeave}>leave</button>
				</div>
            </>
          )
        }
      </div>

    </>
  )
}

export default Room;







