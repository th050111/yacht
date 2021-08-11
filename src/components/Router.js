import React, { useState } from "react";
import { HashRouter as Router, Redirect, Route, Switch } from "react-router-dom";
import Auth from "../routes/Auth";
import CreateRoom from "../routes/CreateRoom";
import Room from "../routes/Room";



const AppRouter = ({ isLoggedIn, userObj }) => {
  const [roomId, setRoomId] = useState("mmm");
  const [isEnter, setIsEnter] = useState(false);
  
  const enterRoom = (roomName) => {
  	setRoomId(roomName)
	setIsEnter(true);
  }
  
  return (
    <Router>
      {/* isLoggedIn이 참이라면 뒤의 문장 실행 */}
      <Switch>
        {isLoggedIn ? (
          <>
            <Route exact path="/">
              <CreateRoom userObj={userObj} createComplete={(roomName)=>{enterRoom(roomName)}}/>
            </Route>
            <Route exact path={`/${roomId}`}>
              <Room userObj={userObj} roomId={roomId} />
            </Route>
				{isEnter ? <Redirect from="/" to={`${roomId}`} />:<Redirect from="*" to="/" />}
          </>) : (
            <>
              <Route exact path="/">
                <Auth />
              </Route>
              <Redirect from="*" to="/" />
            </>
          )
        }
      </Switch>
    </Router>
  )
}

export default AppRouter;