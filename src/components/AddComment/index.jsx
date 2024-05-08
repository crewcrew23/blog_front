import React, {useEffect, useState} from "react";

import styles from "./AddComment.module.scss";

import TextField from "@mui/material/TextField";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import {useDispatch, useSelector} from "react-redux";
import axios from "../../axios";
import {useNavigate, useParams} from "react-router-dom";
import {authReducer, fetchAuthMe} from "../../redux/slices/auth";
import {Post} from "../Post";

export const Index = () => {
  const dispath = useDispatch()
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()
  const { user} = useSelector(state => state.posts)
  const initialState = useSelector(state => state.auth)

  const [text, setText] = useState('')
  const {id} = useParams()

  useEffect(()=>{
    dispath(fetchAuthMe()).then(() => setIsLoading(false))
  }, [])

  if (isLoading){
    return <Post isLoading={isLoading} isFullPost/>
  }

  const submit = async () =>{
    const comment = {
      comment:text,
      owner:user.items
    }

    await axios.post(`/addComment/${id}`, comment)
    window.location.reload()

  }
  return (
    <>
      <div className={styles.root}>
        <Avatar
          classes={{ root: styles.avatar }}
          src={initialState.data.avatarURL || ''}
        />
        <div className={styles.form}>
          <TextField
            label="Написать комментарий"
            variant="outlined"
            maxRows={10}
            value={text}
            onChange={e => setText(e.target.value)}
            multiline
            fullWidth
          />
          <Button onClick={submit} type='submit' variant="contained">Отправить</Button>
        </div>
      </div>
    </>
  );
};
