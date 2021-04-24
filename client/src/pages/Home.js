import React, { useContext, useState, useEffect } from "react";
import { useQuery } from "@apollo/react-hooks";
import { Grid, GridColumn, GridRow, Transition } from "semantic-ui-react";
import { AuthContext } from "../context/auth";
import PostForm from "../components/PostForm";
import { FETCH_POSTS_QUERY } from "../util/graphql";
import PostCard from "../components/PostCard";

function Home() {
  const { user } = useContext(AuthContext);
  const { loading, data, error } = useQuery(FETCH_POSTS_QUERY);
  const [allPosts, setAllPosts] = useState([]);

  const updatePosts = (updatedPosts) => {
    setAllPosts([...updatedPosts]);
  };

  useEffect(() => {
    if (data?.getPosts.length > 0) {
      setAllPosts(data?.getPosts);
    }
  }, [data?.getPosts]);

  if (loading) return <p>LOADING...</p>;
  if (error) return <p>ERROR</p>;
  if (!data) return <p>Not found</p>;

  return (
    <Grid columns={3}>
      <GridRow className="page-title">
        <h1>Recent Posts</h1>
      </GridRow>
      <Grid.Row>
        {user && (
          <GridColumn>
            <PostForm updatePosts={updatePosts} />
          </GridColumn>
        )}
        {loading ? (
          <h1>Loading Posts</h1>
        ) : (
          <Transition.Group>
            {allPosts.map((post) => (
              <Grid.Column key={post.id} style={{ marginBottom: 20 }}>
                <PostCard post={post} />
              </Grid.Column>
            ))}
          </Transition.Group>
        )}
      </Grid.Row>
    </Grid>
  );
}

export default Home;
