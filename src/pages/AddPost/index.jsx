import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import SimpleMDE from 'react-simplemde-editor';

import 'easymde/dist/easymde.min.css';
import styles from './AddPost.module.scss';
import {useSelector} from "react-redux";
import {selectIsAuth} from "../../redux/slices/auth";
import {Navigate, useNavigate, useParams} from "react-router-dom";
import axios from "../../axios";


export const AddPost = () => {
  const {id} = useParams()
  const isEditing = Boolean(id)
  const navigate = useNavigate()
  const isAuth = useSelector(selectIsAuth)
  const [text, setText] = useState('');
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoadind] = useState(false);

  const inputFileRef = useRef(null)

    useEffect(()=>{
        if (id){
            axios.get(`/posts/${id}`)
                .then(({data}) => {
                    setTitle(data && data.title)
                    setText(data && data.text)
                    setImageUrl(data && data.imageURL)
                    setTags(data && data.tags)
                })
        }
    }, [])
  const handleChangeFile = async (event) => {
      try {
          const formData = new FormData()
          const file = event.target.files[0]
          formData.append('image', file)

          const {data} = await axios.post('/upload', formData)
          setImageUrl(data.url)
      }catch (err){
          console.warn(err)
          alert('ошибка при загрузке файла!')
      }
  };

  const onSubmit = async () =>{
      try {
        if (isEditing){
            setLoadind(true)
            const fields = {
                title,
                text,
                imageURL: imageUrl,
                tags: typeof tags === String ? tags.split(' '):tags.toString().split(' ')
            }

            const {data} = await axios.patch(`/posts/${id}`, fields)
            console.log(data)
            navigate(`/posts/${id}`)
        }else {
            setLoadind(true)
            const fields = {
                title,
                text,
                imageURL: imageUrl,
                tags: tags.split(' ')
            }

            const {data} = await axios.post('/posts', fields)
            const id = data.post._id
            navigate(`/posts/${id}`)
        }
      }catch (err){
          console.warn(err)
          alert('Ошибка при создании статьи!')
      }
  }

  const onClickRemoveImage = () => {
      setImageUrl('')
  };

  const onChange = useCallback((value) => {
    setText(value);
  }, []);

  const options = useMemo(
    () => ({
      spellChecker: false,
      maxHeight: '400px',
      autofocus: true,
      placeholder: 'Введите текст...',
      status: false,
      autosave: {
        enabled: true,
        delay: 1000,
      },
    }),
    [],
  );


  if (!localStorage.getItem('token') && !isAuth){
      return <Navigate to={'/'}/>
  }

  return (
    <Paper style={{ padding: 30 }}>
      <Button variant="outlined" size="large" onClick={()=> inputFileRef.current.click()}>
        Загрузить превью
      </Button>
      <input ref={inputFileRef} type="file" onChange={handleChangeFile} hidden />
      {imageUrl && (
          <>
        <Button variant="contained" color="error" onClick={onClickRemoveImage}>
          Удалить
        </Button>
          <img className={styles.image} src={`${process.env.REACT_APP_API_URL}${imageUrl}`} alt="Uploaded" />
          </>
      )}

      <br />
      <br />
      <TextField
        classes={{ root: styles.title }}
        variant="standard"
        placeholder="Заголовок статьи..."
        value={title}
        onChange={e => setTitle(e.target.value)}
        fullWidth
      />
      <TextField classes={{ root: styles.tags }}
                 variant="standard"
                 placeholder="укажите гэги без # через пробел"
                 fullWidth
                 value={tags}
                 onChange={e => setTags(e.target.value)}
      />
      <SimpleMDE className={styles.editor} value={text} onChange={onChange} options={options} />
      <div className={styles.buttons}>
        <Button onClick={onSubmit} size="large" variant="contained" type='submit'>
            {isEditing ? 'Редактировать' : 'Опубликовать'}
        </Button>
        <a href="/">
          <Button size="large">Отмена</Button>
        </a>
      </div>
    </Paper>
  );
};
