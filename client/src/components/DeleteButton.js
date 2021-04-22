import React, { useState } from 'react'
import { useMutation } from '@apollo/react-hooks'
import { Button, Icon, Confirm } from 'semantic-ui-react'
import { FETCH_POSTS_QUERY } from '../util/graphql'
import gql from 'graphql-tag'
import MyPopup from '../util/MyPopup'
function DeleteButton({ postID, callback, commentID }) {
    const [confirmOpen, setConfirmOpen] = useState(false)

    const mutation = commentID ? DELETE_COMMENT_QUERY : DELETE_POST_QUERY
    const [deletePostOrComment] = useMutation(mutation, {
        update(proxy) {
            setConfirmOpen(false);
            if (!commentID) {
                const data = proxy.readQuery({ query: FETCH_POSTS_QUERY })
                data.getPosts = data.getPosts.filter(post => post.id !== postID)
                proxy.writeQuery({
                    query: FETCH_POSTS_QUERY, data
                })
            }
            if (callback) callback()

        },
        variables: {
            postId: postID,
            commentId: commentID

        }
    })
    return (
        <>
            <MyPopup
                content={commentID ? 'Delete Comment' : 'Delete Post'}>
                <Button as="div" color="red" floated="right" onClick={() => setConfirmOpen(true)}>
                    <Icon name="trash" style={{ margin: 0 }} />
                </Button>
            </MyPopup>
            <Confirm
                open={confirmOpen}
                onCancel={() => setConfirmOpen(false)}
                onConfirm={deletePostOrComment} />
        </>
    )
}

const DELETE_POST_QUERY = gql`
    mutation deletePost($postID: ID!){
        deletePost(postID : $postID)
    }
`
const DELETE_COMMENT_QUERY = gql`
    mutation deleteComment($postId: ID! $commentId: ID!){
        deleteComment(postId:$postId commentId: $commentId){
            id
            comments{
                id 
                createdAt
                username
                body
            }
            commentsCount
        }
    }
`
export default DeleteButton