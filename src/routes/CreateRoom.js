import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import { dbService } from "../myBase";


const CreateRoom = ({ userObj, createComplete }) => {
  const [roomName, setRoomName] = useState("");
  const [isCreated, setIsCreated] = useState(false)
  const [createNewRoom, setCreateNewRoom] = useState(false);
  const [error, setError] = useState("");

  const onChange = (event) => {
    const { target: { name, value } } = event;
    if (name === "roomName") {
      setRoomName(value)
    }
  }
  const onSubmit = async (event) => {
    event.preventDefault();
    const data = await checkEmpty();
    if (createNewRoom) {
      if (data.data() != undefined) {
        alert("already exist");
      }
      else {
        await dbService.collection("rooms").doc(`${roomName}`).set(
          {
            playerId: userObj.uid,
            name: roomName,
          }
        );
        setIsCreated(true);
      }
    } else {
      if (data.data() != undefined) {
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
  return (
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
  )
}

export default CreateRoom;