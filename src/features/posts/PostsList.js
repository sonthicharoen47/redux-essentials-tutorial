import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import PostAuthor from './PostAuthor'
import ReactionButtons from './ReactionButtons'
import TimeAgo from './TimeAgo'

import {
  selectAllPosts,
  fetchPosts,
  selectPostIds,
  selectPostById,
} from './postsSlice'

let PostExcerpt = ({ postId }) => {
  const post = useSelector((state) => selectPostById(state, postId))
  return (
    <article className="post-excerpt" key={post.id}>
      <h3>{post.title}</h3>
      <p className="post-content">{post.content}</p>
      <PostAuthor userId={post.user} />
      <TimeAgo timestamp={post.date} />
      <br />
      <ReactionButtons post={post} />
      <Link to={`/posts/${post.id}`} className="button muted-button">
        View Post
      </Link>
    </article>
  )
}

PostExcerpt = React.memo(PostExcerpt)

const PostsList = () => {
  const dispatch = useDispatch()
  const orderedPostIds = useSelector(selectPostIds)

  const postStatus = useSelector((state) => state.posts.status)
  const error = useSelector((state) => state.posts.error)

  useEffect(() => {
    if (postStatus === 'idle') {
      dispatch(fetchPosts())
    }
  }, [postStatus, dispatch])

  let content

  if (postStatus === 'loading') {
    content = <div className="loader">Loading...</div>
  } else if (postStatus === 'successed') {
    content = orderedPostIds.map((postId) => (
      <PostExcerpt key={postId} postId={postId} />
    ))
  } else if (postStatus === 'error') {
    content = <div>{error}</div>
  }

  return (
    <section className="posts-list">
      <h2>Posts</h2>
      {content}
    </section>
  )
}

export default PostsList
