import React, {useEffect, useState} from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Grid from '@mui/material/Grid';

import { Post } from '../components/Post';
import { TagsBlock } from '../components/TagsBlock';
import { CommentsBlock } from '../components/CommentsBlock';
import {useDispatch, useSelector} from "react-redux";
import {fetchLastComments, fetchPopularPosts, fetchPosts, fetchTags} from "../redux/slices/post";

export const Home = () => {
    const dispatch = useDispatch()
    const { posts, tags, popularPosts, comments } = useSelector(state => state.posts)
    const isPostsLoading = posts.status === 'loading'
    const isTagsLoading = tags.status === 'loading'
    const userData = useSelector((state) => state.auth.data)
    const [isPopular, setIsPopular] = useState(false)
    const [tabsValue, setTabsValue] = useState(0)

    useEffect(() => {
        dispatch(fetchPosts())
        dispatch(fetchTags())
        dispatch(fetchPopularPosts())
        dispatch(fetchLastComments())
    }, [dispatch])

  return (
    <>
      <Tabs style={{ marginBottom: 15 }} value={tabsValue} aria-label="basic tabs example">

          <Tab onClick={(event) => {

              setIsPopular(false)
              setTabsValue(0)

          }} label="Новые"/>
          <Tab onClick={() => {

              setIsPopular(true)
              setTabsValue(1)

          }} label="Популярные"/>
      </Tabs>
      <Grid container spacing={4}>
        <Grid xs={8} item>
          {!isPopular ? (isPostsLoading  ?  [...Array(5)] : posts.items).map((obj, index) => isPostsLoading ? <Post key={index} isLoading={isPostsLoading}/> :
              (
                  //сортировка по дате от новых к старым
                  <Post
                      _id={obj._id}
                      title={obj.title}
                      imageUrl={obj.imageURL && `http://localhost:5000${obj.imageURL}`}
                      user={{
                          fullName:obj.user.userName,
                          avatarUrl:obj.user.avatarURL
                      }}
                      createdAt={obj.createdAt}
                      viewsCount={obj.viewsCount}
                      commentsCount={obj.comments.length}
                      tags={obj.tags}
                      isLoading={isPostsLoading}
                      isEditable={userData?._id === obj.user._id}
                  />
              )
          ): (isPostsLoading  ?  [...Array(5)] : popularPosts.items).map((obj, index) => isPostsLoading ? <Post key={index} isLoading={isPostsLoading}/> :
              (
                  //соритровка по просмотрам
                  <Post
                      _id={obj._id}
                      title={obj.title}
                      imageUrl={obj.imageURL && `http://localhost:5000${obj.imageURL}`}
                      user={{
                          fullName:obj.user.userName,
                          avatarUrl:obj.user.avatarURL
                      }}
                      createdAt={obj.createdAt}
                      viewsCount={obj.viewsCount}
                      commentsCount={3}
                      tags={obj.tags}
                      isLoading={isPostsLoading}
                      isEditable={userData?._id === obj.user._id}
                  />
              )) }

        </Grid>
        <Grid xs={4} item>
          <TagsBlock items={tags.items} isLoading={false} />
          <CommentsBlock
            items={comments.items}
            isLoading={false}
          />
        </Grid>
      </Grid>
    </>
  );
};
