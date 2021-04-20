const Post = require('../../models/Post')
const { AuthenticationError, UserInputError } = require('apollo-server')
const checkAuth = require('../../util/check-auth')

module.exports = {
    Mutation: {
        createComment: async (
            _,
            { postId, body },
            context
        ) => {
            const { username } = checkAuth(context)
            if (body.trim() === "") {
                throw new UserInputError('Empty Comment', {
                    errors: {
                        body: "Comment body must not be Empty"
                    }
                })
            }
            const post = await Post.findById(postId)
            if (post) {
                post.comments.unshift({
                    body,
                    username,
                    createdAt: new Date().toISOString()
                });
                await post.save();
                return post
            } else {
                throw new Error('Post no Found ')
            }
        },
        deleteComment: async (
            _,
            { postId, commentId },
            context
        ) => {
            const { username } = checkAuth(context);
            console.log('commentId :>> ', commentId);
            console.log('username :>> ', username);
            const post = await Post.findById(postId)
            if (post) {
                console.log('post :>> ', post);
                const commentIndex = post.comments.findIndex(comment => comment.id === commentId)
                console.log('commentIndex :>> ', commentIndex);
                if (post.comments[commentIndex].username === username) {
                    post.comments.splice(commentIndex, 1)
                    await post.save();
                    console.log('post :>> ', post);
                    return post
                } else {
                    throw new AuthenticationError('Action not allowed')
                }
            }
            else {
                throw new UserInputError('Post no Found ')
            }
        }
    }
}