import app from "./app.js";


app.get("/",(req,resp)=>{
    try {
        resp.status(200).send("Hello World")
    } catch (error) {
        console.log(error)
    }
})


const PORT=process.env.PORT
// console.log(PORT)
app.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`)
})