import React, { useContext } from 'react'
import { useQuery } from '@apollo/react-hooks'
import { Grid, GridColumn, GridRow } from 'semantic-ui-react'
import { AuthContext } from '../context/auth'
import PostForm from '../components/PostForm'
import { FETCH_POSTS_QUERY } from '../util/graphql'
import PostCard from '../components/PostCard'

function Home() {
    const { user } = useContext(AuthContext)
    const { loading, data, error } = useQuery(FETCH_POSTS_QUERY)

    return (
        <Grid columns={3}>
            <GridRow className="page-title">
                <h1>Recent Posts</h1>
            </GridRow>
            <Grid.Row>
                {user && (
                    <GridColumn>
                        <PostForm />
                    </GridColumn>
                )}
                {loading
                    ? (<h1>Loading Posts</h1>)
                    : (
                        data.getPosts &&
                        data.getPosts.map((post) => (
                            <Grid.Column key={post.id} style={{ marginBottom: 20 }}>
                                <PostCard post={post} />
                            </Grid.Column>
                        ))
                    )
                }
            </Grid.Row>
        </Grid>
    )
}

export default Home
