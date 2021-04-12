import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import {
	ApolloClient,
	ApolloProvider,
	createHttpLink,
	InMemoryCache,
} from "@apollo/client";

import reportWebVitals from "./reportWebVitals";
import App from "./App";
import { setContext } from "apollo-link-context";

const httpLink = createHttpLink({
	uri: "http://localhost:5000/",
});

const authLink = setContext(() => {
	const token = localStorage.getItem("jwtToken");
	return {
		headers: {
			Authorization: token ? `Bearer ${token}` : "",
		},
	};
});

const client = new ApolloClient({
	link: authLink.concat(httpLink),
	cache: new InMemoryCache(),
});

ReactDOM.render(
	<React.StrictMode>
		<ApolloProvider client={client}>
			<App />
		</ApolloProvider>
	</React.StrictMode>,
	document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();