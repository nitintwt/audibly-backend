import express from 'express'
import cors from "cors"
import userRouter from './routes/user.route.js'

const app = express()

app.use(cors({
  origin:"*",
  credential:true
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.get("/" , (req , res)=>{
  return res.status(200).json({message:"Going good from audibly backend"})
})

app.use("/api/v1/user" , userRouter)

export {app}