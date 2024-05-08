import React, {useEffect} from 'react';
import Grid from "@mui/material/Grid";
import {CommentsBlock, Post, TagsBlock} from "../../components";
import {useDispatch, useSelector} from "react-redux";
import {useParams} from "react-router-dom";
import {fetchLastComments, fetchSelectedPostsByTags, fetchTags} from "../../redux/slices/post";


const TagsPage = () => {
    const { comments } = useSelector(state => state.posts)
    const dispath = useDispatch()
    const {params} = useParams()
    const {postByTag, tags } = useSelector(state => state.posts)
    const isPostsLoading = postByTag.status === 'loading'
    const userData = useSelector((state) => state.auth.data)

    useEffect(()=>{
        dispath(fetchSelectedPostsByTags(params))
        dispath(fetchTags())
        dispath(fetchLastComments())
    }, [])
    return (
        <>
            <Grid container spacing={4}>
                <Grid xs={8} item>
                    {(isPostsLoading  ?  [...Array(5)] : postByTag.items.posts).map((obj, index) => isPostsLoading ? <Post key={index} isLoading={isPostsLoading}/> :
                        (
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
                        )
                    )}
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

export default TagsPage;