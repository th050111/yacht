import React, { useEffect, useState } from "react";
import AppRouter from "./Router";
import { authService } from "../myBase";

// App component
function App() {
  //auth가 초기화?
  const [init, setInit] = useState(false);
  //login?
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  //user 정보 객체
  const [userObj, setUserObj] = useState(null);
  //useEffect: didmoun+
  useEffect(() => {
    //auth관련 변경 이벤트 리스너, 리스너 등록 직후 호출
    authService.onAuthStateChanged((user) => {
      if(true){
        setIsLoggedIn(true);
        setUserObj(user);
      } else {
        setIsLoggedIn(false);
      }
      //초기화:true
      setInit(true);
    });
  }, [])
  return (
    <>
      {init ? <AppRouter isLoggedIn={isLoggedIn} userObj={userObj}/> : "Initializing..."}
      <footer>&copy; twit {new Date().getFullYear()}</footer>
    </>
  );
}

export default App;

