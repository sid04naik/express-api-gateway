require("dotenv").config();
const app = require("./src/app");

const PORT = process.env.PORT || 8002;

app.listen(PORT, () => {
	console.log(`Express API Gateway running on port ${PORT}`);
});
