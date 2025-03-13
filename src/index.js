import { app } from "./app.js";
import dotenv from 'dotenv'

const PORT = 3000

dotenv.config({
  path:'./.env'
})


app.listen(PORT , ()=>{
  console.log("Server is running properly on" , PORT)
})