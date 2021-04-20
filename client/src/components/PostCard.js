import React from 'react'
import { Card, Image, Icon, Label, Button } from 'semantic-ui-react'
import moment from 'moment'
import { Link } from 'react-router-dom'

function PostCard({ post: { id, body, createdAt, username, likesCount, likes, commentsCount, comments } }) {

    function likePost() {
        console.log('Like Post');
    }

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
                <Button as='div' labelPosition='right'>
                    <Button color='teal' basic onClick={likePost}>
                        <Icon name='heart' />
                    </Button>
                    <Label as='a' basic color='teal' pointing='left'>
                        {likesCount}
                    </Label>
                </Button>
                <Button as='div' labelPosition='right'>
                    <Button color='blue' basic onClick={commentOnPost}>
                        <Icon name='comments' />
                    </Button>
                    <Label as='a' basic color='blue' pointing='left'>
                        {commentsCount}
                    </Label>
                </Button>
            </Card.Content>
        </Card>
    )
}

export default PostCard
