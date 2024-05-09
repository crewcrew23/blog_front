import React from 'react';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';

import styles from './Login.module.scss';
import {useDispatch, useSelector} from "react-redux";
import {fetchRegister, selectIsAuth,} from "../../redux/slices/auth";
import {useForm} from "react-hook-form";
import {Navigate} from "react-router-dom";

export const Registration = () => {
    const isAuth = useSelector(selectIsAuth)
    const dispath = useDispatch()
    const {register, handleSubmit, setError, formState:{errors, isValid}} = useForm({
        defaultValues:{
            name:'',
            secondName:'',
            userName:'',
            email:'',
            password:'',
        },
        mode:'onChange'
    })

    const onSubmit = async (values) =>{
        const data = await dispath(fetchRegister(values)).catch((err) => console.log(err))
        if (!data.payload){
            return  alert('Не удалось создать аккаунт!')
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
        Создание аккаунта
      </Typography>
      <div className={styles.avatar}>
        <Avatar sx={{ width: 100, height: 100 }} />
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
          <TextField className={styles.field}
                     label="Имя"
                     fullWidth
                     error={Boolean(errors.name?.message)}
                     helperText={errors.email?.message}
                     {...register('name', { required: 'Укажите ваше Имя' })}

          />
          <TextField className={styles.field}
                     label="Фамилий"
                     fullWidth
                     error={Boolean(errors.secondName?.message)}
                     helperText={errors.secondName?.message}
                     {...register('secondName', { required: 'Укажите вашу фамилию' })}
          />
          <TextField className={styles.field}
                     label="Имя пользователя"
                     fullWidth
                     error={Boolean(errors.userName?.message)}
                     helperText={errors.userName?.message}
                     {...register('userName', { required: 'Придумайте ваше имя пользователья' })}
          />
          <TextField className={styles.field}
                     label="E-Mail"
                     fullWidth
                     error={Boolean(errors.email?.message)}
                     helperText={errors.email?.message}
                     {...register('email', { required: 'Укажите почту' })}
          />
          <TextField className={styles.field}
                     label="Пароль"
                     type='password'
                     fullWidth
                    error={Boolean(errors.password?.message)}
                     helperText={errors.password?.message}
                     {...register('password', { required: 'Укажите ваш пароль' })}
          />
          <Button disabled={!isValid} type='submit' size="large" variant="contained" fullWidth>
              Зарегистрироваться
          </Button>
      </form>
    </Paper>
  );
};
