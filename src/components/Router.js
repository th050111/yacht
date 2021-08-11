import React, { useState } from "react";
import { HashRouter as Router, Redirect, Route, Switch } from "react-router-dom";
import Auth from "../routes/Auth";
import CreateRoom from "../routes/CreateRoom";
import Room from "../routes/Room";

const AppRouter = ({ isLoggedIn, userObj }) => {
  const [roomId, setRoomId] = useState("hi");
  return (
    <Router>
      {/* isLoggedIn이 참이라면 뒤의 문장 실행 */}
      <Switch>
        {isLoggedIn ? (
          <>
            <Route exact path="/">
              <CreateRoom userObj={userObj} />
            </Route>
            <Route exact path="/profile">
              <Room userObj={userObj} roomId={roomId}/>
            </Route>
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