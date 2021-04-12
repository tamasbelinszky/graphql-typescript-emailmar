const { AuthenticationError } = require("apollo-server");
const { argsToArgsConfig } = require("graphql/type/definition");

const Post = require("../../models/Post");
const checkAuth = require("../../util/check-auth");

module.exports = {
	Query: {
		async getPosts() {
			console.log("getPosts");
			try {
				const posts = await Post.find().sort({ createdAt: -1 });
				return posts;
			} catch (err) {
				throw new Error(err);
			}
		},
		async getPost(_, { postId }) {
			console.log("getPost");
			try {
				const post = await Post.findById(postId);
				if (post) {
					return post;
				} else {
					throw new Error("post not found");
				}
			} catch (err) {
				throw new Error(err);
			}
		},
	},
	Mutation: {
		async createPost(_, { body }, context) {
			console.log("createPost");
			//get error if something missing, and cant move towards
			const user = checkAuth(context);

			if (body.trim() === "") {
				throw new Error("Post body must not be empty");
			}

			const newPost = new Post({
				body,
				user: user.id,
				username: user.username,
				createdAt: new Date().toISOString(),
			});

			const post = await newPost.save();

			context.pubsub.publish("NEW_POST", {
				newPost: post,
			});

			return post;
		},
		async deletePost(_, { postId }, context) {
			console.log("deletePost");
			const user = checkAuth(context);

			try {
				const post = await Post.findById(postId);
				//user.username? typeerr
				if (user.username === post.username) {
					await post.delete();
					return "Post deleted successfully";
				} else {
					throw new AuthenticationError("Action not allowed");
				}
			} catch (err) {
				throw new Error(err);
			}
		},
	},
	Subscription: {
		newPost: {
			subscribe: (_, __, { pubsub }) => pubsub.asyncIterator("NEW_POST"),
		},
	},
};