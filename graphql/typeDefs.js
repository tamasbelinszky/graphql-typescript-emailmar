const { gql } = require("apollo-server");

module.exports = gql`
	type Survey {
		id: ID!
		title: String!
		subject: String!
		body: String!
		recipients: [Recipient]
		username: String!
		createdAt: String!
	}
	type Recipient {
		email: String!
		responded: Boolean!
	}

	type Post {
		id: ID!
		body: String!
		username: String!
		createdAt: String!
		comments: [Comment]!
		likes: [Like]!
		likeCount: Int!
		commentCount: Int!
	}
	type Comment {
		id: ID!
		createdAt: String!
		username: String!
		body: String!
	}
	type Like {
		id: ID!
		createdAt: String!
		username: String!
	}
	type User {
		id: ID!
		email: String!
		token: String!
		username: String!
		createdAt: String!
	}
	input RegisterInput {
		username: String!
		password: String!
		confirmPassword: String!
		email: String!
	}
	input SurveyInput {
		title: String!
		subject: String!
		body: String!
		recipients: String!
	}
	type Query {
		getPosts: [Post]
		getPost(postId: ID!): Post
		getSurveys: [Survey]
		getSurvey(surveyId: ID!): Survey
		getSurveysByUser: [Survey]
	}
	type Mutation {
		register(registerInput: RegisterInput): User!
		login(username: String!, password: String!): User!

		createPost(body: String!): Post!
		deletePost(postId: ID!): String!
		createComment(postId: String!, body: String!): Post!
		deleteComment(postId: ID!, commentId: ID!): Post!
		likePost(postId: ID!): Post!

		createSurvey(surveyInput: SurveyInput): Survey!
		deleteSurvey(surveyId: ID!): String!
		editSurvey(surveyInput: SurveyInput, surveyId: ID!): Survey
	}
	type Subscription {
		newPost: Post!
	}
`;
