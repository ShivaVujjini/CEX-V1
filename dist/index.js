import express from "express";
const app = express();
app.use(express.json());
app.post('/signup', (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    res.json({
        'message': 'signup done'
    });
});
app.listen(3000);
//# sourceMappingURL=index.js.map