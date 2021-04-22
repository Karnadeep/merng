import React, { useContext, useState, useRef } from 'react'
import { useQuery, useMutation } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import { Grid, Image, Card, Button, Icon, Label, CardContent, Form } from 'semantic-ui-react';
import moment from 'moment'
import LikeButton from '../components/LikeButton';
import DeleteButton from '../components/DeleteButton'
import { AuthContext } from '../context/auth.js'

function SinglePost(props) {
    const { user } = useContext(AuthContext)
    const postId = props.match.params.postId;
    const [comment, setComment] = useState('')
    const commentInputRef = useRef(null)

    const { data } = useQuery(FETCH_POST_QUERY, {
        variables: {
            postID: postId
        }
    })

    const [submitComment] = useMutation(SUBMIT_COMMENT_MUTATION, {
        update() {
            setComment('')
            commentInputRef.current.blur();
        },
        variables: {
            postId,
            body: comment
        }
    })

    function deletePostCallback() {
        props.history.push('/')
    }

    let postMarkup
    if (!data?.getPost) {
        postMarkup = <p>Loading post...</p>
    } else {
        const { id, body, username, createdAt, likes, likesCount, comments, commentsCount } = data.getPost
        postMarkup = (
            <Grid>
                <Grid.Row>
                    <Grid.Column width={2}>
                        <Image
                            floated='right'
                            size='small'
                            src='https://react.semantic-ui.com/images/avatar/large/molly.png'
                        />
                    </Grid.Column>
                    <Grid.Column width={10}>
                        <Card fluid>
                            <Card.Content>
                                <Card.Header>{username}</Card.Header>
                                <Card.Meta>{moment(createdAt).fromNow()}</Card.Meta>
                                <Card.Description>{body}</Card.Description>
                            </Card.Content>
                            <hr />
                            <Card.Content extra>
                                <LikeButton user={user} post={{ id, likesCount, likes }} />
                                <Button
                                    as="div"
                                    labelPosition="right"
                                    onClick={() => console.log('Comment on post')}>
                                    <Button basic color="blue">
                                        <Icon name="comments" />
                                    </Button>
                                    <Label basic color="blue" pointing="left">
                                        {commentsCount}
                                    </Label>
                                </Button>
                                {user && user.username === username && (
                                    <DeleteButton postID={id} callback={deletePostCallback} />
                                )}
                            </Card.Content>
                        </Card>
                        {user &&
                            (<Card fluid>
                                <CardContent>
                                    <Form>
                                        <div className="ui action input fluid">
                                            <input
                                                type="text"
                                                placeholder="Comment.."
                                                name="comment"
                                                value={comment}
                                                onChange={(event) => setComment(event.target.value)}
                                                ref={commentInputRef} />
                                            <button
                                                type="submit"
                                                className="ui button teal"
                                                disabled={comment.trim() === ''}
                                                onClick={submitComment}>
                                                Submit
                                            </button>
                                        </div>
                                    </Form>
                                </CardContent>
                            </Card>)}
                        {comments.map(comment => (
                            <Card fluid key={comment.id}>
                                <Card.Content>
                                    {user && user.username === comment.username &&
                                        (
                                            <DeleteButton postID={postId} commentID={comment.id} />
                                        )}
                                    <Card.Header>{comment.username}</Card.Header>
                                    <Card.Meta>{moment(createdAt).fromNow()}</Card.Meta>
                                    <Card.Description>{comment.body}</Card.Description>
                                </Card.Content>
                            </Card>
                        ))}
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        )
    }

    return postMarkup

}
const FETCH_POST_QUERY = gql`
       query getPost($postID : ID!){
            getPost(postID : $postID){
                id
                body
                username
                createdAt
                likes{
                    id username createdAt
                }
                likesCount
                comments{
                    id username createdAt body
                }
                commentsCount
            }
        }
`
const SUBMIT_COMMENT_MUTATION = gql`
    mutation createComment($postId:ID $body:String!){
        createComment(postId : $postId body:$body){
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
export default SinglePost