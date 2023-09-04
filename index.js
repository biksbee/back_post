import express from 'express';

import { postRouter, userRouter } from "./routes/index.js";
import { checkAuth } from "./utils/checkAuth.js";

const app = express();

import multer from 'multer'

const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        cb(null, 'uploads')
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname)
    },
});

const upload = multer({ storage });

app.use(express.json())
app.use('/upload', express.static('uploads'))

app.use('/api', userRouter)
app.use('/api', postRouter)
app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
    res.json({
        url: `/upload/${req.file.originalname}`
    })
})


app.listen(4444, (err) => {
    if(err){
        return console.log(err);
    }

    console.log('Server was started!');
});