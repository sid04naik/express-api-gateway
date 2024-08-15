module.exports = [
	{
		name: "api-notebook",
		path: "/api/v3/notebook",
		target: "http://localhost:8052",
		skip: true,
	},
	{
		name: "api-acl",
		path: "/api/v3/acl",
		target: "http://localhost:9001",
	},
	{
		name: "api-static",
		path: "/api/v3/static",
		target: "http://localhost:9002",
	},
	{
		name: "api-async",
		path: "/api/v3/async",
		target: "http://localhost:9003",
	},
	{
		name: "api-view",
		path: "/api/v3/views",
		target: "http://localhost:9011",
	},
	{
		name: "api-personalization",
		path: "/api/v3/personalization",
		target: "http://localhost:9012",
	},
	{
		name: "api-team",
		path: "/api/v3/teams",
		target: "http://localhost:9013",
	},
	{
		name: "api-note",
		path: "/api/v3/notes",
		target: "http://localhost:9014",
	},
	{
		name: "api-datatemplate",
		path: "/api/v3/datatemplates",
		target: "http://localhost:9015",
	},
	{
		name: "api-propertydata",
		path: "/api/v3/propertydata",
		target: "http://localhost:9016",
	},
];
