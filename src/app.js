import express from 'express'
import cors from "cors"

const app = express()

app.use(cors({
  origin:"*",
  credential:true
}))


app.use(express.json({limit:'16kb'}))   // setting a limit of json , like how much json data can be sent to backend 
app.use(express.urlencoded({limit:"16kb"})) 

app.get("/" , (req , res)=>{
  return res.status(200).json({message:"Going good from audibly backend"})
})

export {app}