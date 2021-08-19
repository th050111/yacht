import React, { useEffect, useState } from "react";
import AppRouter from "./Router";
import { authService, dbService } from "../myBase";
import "../css/App.css"

// App component
function App() {
  //auth가 초기화?
  const [init, setInit] = useState(false);
  //login?
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  //user 정보 객체
  const [userObj, setUserObj] = useState(null);
  const [currentZoom,setCurrentZoom] = useState(100);
 
  
  //useEffect: didmoun+
  useEffect(() => {
  	const zoom = localStorage.getItem("zoom") === null ? 100 : Number(localStorage.getItem("zoom"));
	setCurrentZoom(zoom);
    //auth관련 변경 이벤트 리스너, 리스너 등록 직후 호출
    authService.onAuthStateChanged((user) => {
      if (user) {
        setIsLoggedIn(true);
        setUserObj(user);
      } else {
        setIsLoggedIn(false);
      }
      //초기화:true
      setInit(true);
    });
  }, [])
  
  const zoomOutIn = (num) => {
  	const zoom = currentZoom + num;
  if (zoom < 120 && zoom > 50) {
    setCurrentZoom(zoom);
    localStorage.setItem("zoom", zoom);
  }
  }
  
  return (
    <>
      <div className="ground" style={{zoom:`${currentZoom}%`}}>
        {init ? <AppRouter isLoggedIn={isLoggedIn} userObj={userObj} /> : "Initializing..."}
      </div>
		<div className="zoom" onClick={()=>zoomOutIn(+10)}>+</div>
		<br/>
		<div className="zoom" onClick={()=>zoomOutIn(-10)}>-</div>
    </>
  );
}

export default App;

