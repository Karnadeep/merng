import React, { useContext } from 'react'
import { Card, Image, Icon, Label, Button } from 'semantic-ui-react'
import moment from 'moment'
import { Link } from 'react-router-dom'
import LikeButton from './LikeButton'
import DeleteButton from './DeleteButton'
import { AuthContext } from '../context/auth'
import MyPopup from '../util/MyPopup'

function PostCard({ post: { id, body, createdAt, username, likesCount, likes, commentsCount, comments } }) {
    const { user } = useContext(AuthContext)

    function commentOnPost() {
        console.log('Comment On post');
    }
    return (
        <Card fluid>
            <Card.Content>
                <Image
                    floated='right'
                    size='mini'
                    src='https://react.semantic-ui.com/images/avatar/large/molly.png'
                />
                <Card.Header>{username}</Card.Header>
                <Card.Meta as={Link} to={`/posts/${id}`}>{moment(createdAt).fromNow()}</Card.Meta>
                <Card.Description>
                    {body}
                </Card.Description>
            </Card.Content>
            <Card.Content extra>
                <LikeButton user={user} post={{ id, likesCount, likes }} />
                <MyPopup content='Comment on post'>
                    <Button labelPosition='right' as={Link} to={`/posts/${id}`}>
                        <Button color='blue' basic onClick={commentOnPost}>
                            <Icon name='comments' />
                        </Button>
                        <Label as='a' basic color='blue' pointing='left'>
                            {commentsCount}
                        </Label>
                    </Button>
                </MyPopup>
                {user && user.username === username && (
                    < DeleteButton postID={id} />
                )}
            </Card.Content>
        </Card>
    )
}

export default PostCard
