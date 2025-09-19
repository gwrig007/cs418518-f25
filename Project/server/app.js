import express from 'express';
const app=express();
const port=8080;

app.listen(port,()=>{
    console.log(`server is listening at port ${port}`);
})

const a=30;
console.log(a);

export default app;
