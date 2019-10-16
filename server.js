const express = require('express');
const mongoDB = require('./config/db')

const app = express();

mongoDB()
app.use(express.json({ extend:false }))

app.get('/', (req, res) => {
    res.send("App runing")
})



//routes
app.use('/api/users', require('./api/users'))
app.use('/api/profile', require('./api/profile'))
app.use('/api/auth', require('./api/auth'))


const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=> {
    console.log(`server runing ond port :${PORT}`);
})
