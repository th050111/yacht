import React, { useEffect, useState } from "react";
import { Redirect } from "react-router-dom";
import { dbService } from "../myBase";
import { authService } from "../myBase";





const Profile = ({userObj}) => {
	const [currentName,setCurrentName] = useState("");
  const [newName,setNewName] = useState("");

  useEffect(async() => {
     const userData = await dbService.collection("users").doc(`${userObj.uid}`).get();
	  setCurrentName(userData.data().name)
    }, [])
	
	
	const onChange = (event) => {
    //event.target의 value를 value로
    const { target: { value } } = event;
    setNewName(value);
  	}
	
	const onSubmit = async (event) => {
    event.preventDefault();
    //컬렉션에 추가(객체)
    await dbService.collection("users").doc(`${userObj.uid}`).update({
	 	name: newName,
	 })
    setNewName("");
  };

	const onLogOutClick = async () => {
	await dbService.collection("users").doc(`${userObj.uid}`).update({
        online: false,
      })
	authService.signOut()};
	return <div className="profile-ground">
			<>
			<h4>현재이름: {currentName}</h4>
      <form onSubmit={onSubmit}>
        <input type="text" value={newName} onChange={onChange} placeholder = "your new name"/>
		  <input type="submit" value="save"/>
      </form>
		<button onClick={onLogOutClick}>Log Out</button>
    </>
		</div>
	
}










const CreateRoom = ({ userObj, createComplete, loggedId, loggedChange}) => {
  const [roomName, setRoomName] = useState("");
  const [isCreated, setIsCreated] = useState(false)
  const [createNewRoom, setCreateNewRoom] = useState(false);
  const [error, setError] = useState("");
  const [reload, setReload] = useState(false)
  const [userId,setUserId] = useState([])
  const [onlineUserData,setOnlineUserData] = useState([])
  const [profileOpen,setProfileOpen] = useState(false)

	useEffect(async () => {
	if(userObj === null || userObj === undefined)
		return;
	const userData = await dbService.collection("users").doc(`${userObj.uid}`).get()
	if(userData.data() === undefined)
	{
		await dbService.collection("users").doc(`${userObj.uid}`).set({
      online: false,
		id:`${userObj.uid}`,
		loginAt:`${Date.now()}`,
		name:"익명"
    	})
	}
	if(userObj.uid != loggedId)
	{
		console.log("hi",userObj.uid)
		await dbService.collection("users").doc(`${userObj.uid}`).update({
      online: true,
    })
	 loggedChange(userObj.uid)
	}
    dbService.collection("users").onSnapshot(async (snapshot)=>{
      const array = snapshot.docs.map((doc)=>doc.data());
      const onlineId = array.map((id)=>{
        if(id.online)
          return id.id
      })
		const userData =await Promise.all(onlineId.map(async (id)=>{
			if(id != undefined)
			{
				const data = await dbService.collection("users").doc(`${id}`).get();
				console.log(await data.data())
				return await data.data();
			}
		}))
		console.log(onlineId)
		console.log(await userData)
		setOnlineUserData(userData)
		setUserId(onlineId)
    })
	},[userObj])
  useEffect(async () => {
    window.onbeforeunload = async () => {
      setTimeout(() => {
        setTimeout(() => setReload(true), 500)
      }, 1)
      await dbService.collection("users").doc(`${userObj.uid}`).update({
        online: false,
      })
    }
  }, [])

  useEffect(async () => {
    if (reload) {
      await dbService.collection("users").doc(`${userObj.uid}`).update({
        online: true,
      })
    }
    setReload(false)
  })
  const onChange = (event) => {
    const { target: { name, value } } = event;
    if (name === "roomName") {
      setRoomName(value)
    }
  }
  const onSubmit = async (event) => {
    event.preventDefault();
    const data = await checkEmpty();
    const dbRoom = dbService.collection("rooms").doc(`${roomName}`);
    const dbGame = dbRoom.collection("game");
    const dbChat = dbRoom.collection("chats");
    const dbGameDocs = {
      rule: dbGame.doc("rule"),
      score: dbGame.doc("score"),
    }
    const checkPlay = await dbGameDocs.rule.get()
    if (createNewRoom) {
      if (data.data() != undefined) {
        alert("already exist");
      }
      else {
        await dbRoom.set(
          {
            playerId: [userObj.uid],
            name: roomName,
            playerLimit: 2,
            cntPlayer: 1,
          }
        );
        await dbGameDocs.rule.set(
          {
            turn: 0,
            round: 1,
            isPlay: false,
          }
        )
        await dbGameDocs.score.set(
          {
            soore: 0,
          }
        )
        //await dbService.collection
        setIsCreated(true);
		  console.log("HIHI")
      }
    }
    else {//방 입장
      if (data.data() != undefined) {
		console.log("hiH")
        if (checkPlay.data().isPlay) {
          alert("이미 플레이중인 방입니다!")
          return;
        }
        if (data.data().cntPlayer >= data.data().playerLimit) {
          alert("정원을 넘은 방입니다!")
          return;
        }
        const idArray = [...data.data().playerId].filter((element) => element !== userObj.uid)
        idArray.unshift(userObj.uid)
        const cnt = idArray.length;
        await dbRoom.update(
          {
            playerId: idArray,
            name: roomName,
            cntPlayer: cnt,
          })
        setRoomName(data.data().name);
        setIsCreated(true);
      } else {
        alert("empty room!")
      }
    }
  }

  const checkEmpty = async () => {
    const data = await dbService.collection("rooms").doc(`${roomName}`).get();
    return data;
  }
  const toggleRoom = () => setCreateNewRoom((prev) => !prev);
  const profileClick = () => setProfileOpen((prev) => !prev);
  return (
    <>
      <div>
        {isCreated ?
          (
            <>
              {createComplete(roomName)}
            </>
          ) : (
            <>
              <form onSubmit={onSubmit}>
                <input required name="roomName" type="text" placeholder="Room Name" required value={roomName} onChange={onChange} />
                <input type="submit" value={createNewRoom ? "Create Room" : "Enter Room"} />
                {error}
              </form>
              <span onClick={toggleRoom}>{createNewRoom ? "enter" : "Create"}</span>
            </>)
        }
      </div>
		<button onClick={profileClick}>profile</button>
		{profileOpen && <Profile userObj={userObj} />}
      <div>
        {onlineUserData.map((data, index) => <div key={index}>{(data != undefined) && data.name}</div>)}
      </div>
    </>
  )
}

export default CreateRoom;