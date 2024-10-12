const mongoose = require("mongoose")

const connectDB = async()=>{
    try{
      const connection = await mongoose.connect(`${process.env.MONGO_URI}/task-tracking-system`)
      console.log(`Mongodb connected: ${connection.connection.host}`)
    }
    catch(error){
      console.log(`Error: ${error.message}`)
      throw new Error("connection Problem")
    //   process.exit()
      
    }
}

module.exports = connectDB