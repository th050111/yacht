import React,{useState} from "react";
import {Redirect} from "react-router-dom";

const CreateRoom = () => {
	const [isCreate,setCreateRoom] = useState(true);
	return (
		<div>
			{isCreate?
			(<><Redirect from="/"to="/profile" /></>):(<>"hi"</>)}
		</div>
	)
}

export default CreateRoom;