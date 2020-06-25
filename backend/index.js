const express = require("express");
const app = express();

app.get("/test", (req, res) => {
    res.send({ text: "backend is working" });
});

app.use(express.static("public"));

app.listen(5000, () => {
    console.log("server started on port 5000");
});