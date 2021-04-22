const { AuthenticationError, UserInputError } = require('apollo-server')
const { subscribe } = require('graphql')
const Post = require('../../models/Post')
const checkAuth = require('../../util/check-auth')

module.exports = {
    Query: {
        async getPosts() {
            try {
                const posts = await Post.find().sort({ createdAt: -1 })
                return posts
            } catch (error) {
                throw new Error(error)
            }
        },
        async getPost(_, { postID }) {
            try {
                const post = await Post.findById(postID);
                if (post) {
                    return post
                } else {
                    throw new Error("Post not found")
                }
            } catch (error) {
                throw new Error(err)
            }
        }
    },
    Mutation: {
        async createPost(_, { body }, context) {
            const user = checkAuth(context)
            if (body.trim() === '') {
                throw new Error("Post body must not be empty");
            }
            const newPost = new Post({
                body,
                user: user._id,
                username: user.username,
                createdAt: new Date().toISOString()
            });

            const res = await newPost.save()
            context.pubSub.publish('NEW_POST', {
                newPost: res
            })
            return res

        },
        async deletePost(_, { postID }, context) {
            const user = checkAuth(context)
            try {
                const post = await Post.findById(postID)
                if (post.username === user.username) {
                    await post.delete();
                    return 'Post Deleted Successfully'
                } else {
                    throw new AuthenticationError('Action not allowed')
                }
            } catch (error) {
                throw new Error(error)
            }
        },
        likePost: async (_,
            { postId }, context) => {
            const { username } = checkAuth(context)
            const post = await Post.findById(postId);
            if (post) {
                if (post.likes.find(like => like.username === username)) {
                    //Post already Liked,unlike it
                    post.likes = post.likes.filter(like => like.username !== username)
                }
                else {
                    post.likes.unshift({
                        username,
                        createdAt: new Date().toISOString()
                    })
                }
                await post.save();
                return post
            }
            throw new Error('Post Not found')
        }
    },
    Subscription: {
        newPost: {
            subscribe: (_, __, { pubSub }) => {
                return pubSub.asyncIterator("NEW_POST")
            }
        }
    }
}
