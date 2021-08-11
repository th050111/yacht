import React, {useState} from "react";
import { dbService } from "../myBase";

const Twit = ({ chatObj, isOwner, dbChat}) => {

  return (
    <div>
        <h4>{chatObj.text}</h4>
    </div>
  )
}

export default Twit;