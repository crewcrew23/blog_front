import React, {useEffect} from "react";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";

import styles from "./Login.module.scss";
import {useForm} from "react-hook-form";
import {useDispatch, useSelector} from "react-redux";
import {fetchAuth, selectIsAuth} from "../../redux/slices/auth";
import {Navigate} from "react-router-dom";

export const Login = () => {
    const isAuth = useSelector(selectIsAuth)
    const dispath = useDispatch()
    const {register, handleSubmit, setError, formState:{errors, isValid}} = useForm({
        defaultValues:{
            email:'test@ru',
            password:'123456',
        },
        mode:'onChange'
    })


    const onSubmit = async (values) =>{
        const data = await dispath(fetchAuth(values))
        if (!data.payload){
            return  alert('Не удавлось авторизоватся!')
        }

        if ('token' in data.payload){
            window.localStorage.setItem('token', data.payload.token)
        }

    }

    if (isAuth){
       return <Navigate to={'/'}/>
    }

  return (

      <Paper classes={{ root: styles.root }}>
          <Typography classes={{ root: styles.title }} variant="h5">
              Вход в аккаунт
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
                  <TextField
                      className={styles.field}
                      label="E-Mail"
                      error={Boolean(errors.email?.message)}
                      helperText={errors.email?.message}
                      {...register('email', { required: 'Укажите почту' })}
                      fullWidth
                      type='email'
                  />
                  <TextField className={styles.field}
                             type='password'
                             label="Пароль" fullWidth
                             helperText={errors.password?.message}
                             error={Boolean(errors.password?.message)}
                             {...register('password', { required: 'Введите пароль' })}
                  />
                  <Button type='submit' size="large" variant="contained" fullWidth>
                      Войти
                  </Button>

          </form>
      </Paper>

  );
};
