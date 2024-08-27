import express from 'express';
import userRouter from './router/user';
const app = express();
const PORT = 3000;
app.use(express.json());
app.use('/api/user/',userRouter)
app.listen(PORT,()=>{
    console.log(`The Port is Listing to ${PORT}`);
})