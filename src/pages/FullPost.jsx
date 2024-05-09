import React, {useEffect, useState} from "react";

import { Post } from "../components/Post";
import { Index } from "../components/AddComment";
import { CommentsBlock } from "../components/CommentsBlock";
import {useParams} from "react-router-dom";
import axios from "../axios";
import {useDispatch, useSelector} from "react-redux";
import {fetchUser} from "../redux/slices/post";
import ReactMarkdown from "react-markdown";

export const FullPost = () => {
    const [data, setData] = useState()
    const [isLoading, setIsLoading] = useState(true)
    const {id} = useParams()
    const dispath = useDispatch()
    const { user} = useSelector(state => state.posts)
    const isPostsLoading = user.status === 'loading'

    const getUser = async (id)=>{
        dispath(fetchUser(id))
    }

    useEffect( ()=>{
        axios.get(`/posts/${id}`)
            .then(res => {
                setData(res.data)
                setIsLoading(false)
            })
        getUser(id)
    }, [])



    if (isLoading){
        return <Post isLoading={isLoading} isFullPost/>
    }
  return (
    <>
      <Post
          id={data._id}
          title={data.title}
          imageUrl={data.imageURL && `${process.env.REACT_APP_API_URL}${data.imageURL}`}
          user={{
              fullName:isPostsLoading ? 'loading': user.items.userName,
              avatarUrl:isPostsLoading ? 'loading': user.items.avatarURL
          }}
          createdAt={data.createdAt}
          viewsCount={data.viewsCount}
          commentsCount={3}
          tags={data.tags}
        isFullPost
      >
        <ReactMarkdown children={data.text} />
      </Post>
      <CommentsBlock
        items={data.comments}
        isLoading={false}
      >
        <Index />
      </CommentsBlock>
    </>
  );
};
