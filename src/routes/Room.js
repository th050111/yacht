import { dbService } from "../myBase";
import React, { useEffect, useState } from "react";
import Play from "../components/Play";
import Chat from "../components/Chat";

const Room = ({ roomId, userObj }) => {
  const [isStart, setIsStart] = useState(false);
  //작성중인 twit
  const [chat, setChat] = useState("");
  //저장된 twit들
  const [chats, setChats] = useState([]);
  const [isPlay, setIsPlay] = useState(false);

  const dbRoom = dbService.collection("rooms").doc(`${roomId}`);
  const dbGame = dbRoom.collection("game");
  const dbChat = dbRoom.collection("chats");
  const dbGameDocs = {
    rule: dbGame.doc("rule"),
    score: dbGame.doc("score"),
  }

  useEffect(() => {
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
      if(snapshot.data().isPlay != isPlay){
        setIsPlay(true);
      }
    });
  }, [])

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
  	if(!isPlay)
    {
      await dbGameDocs.rule.update({isPlay: true});
    }
  }

  return (
    <>
      <div>
        {isPlay ?
          (
            <>
              <Play roomId={roomId} userObj={userObj}/>
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
            </>
          )
        }
      </div>

    </>
  )
}

export default Room;







