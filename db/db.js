import mongoose from "mongoose";

mongoose.connect(process.env.MONGO_DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log("Database connection successful")
})
.catch((e) => console.log(e.message))

const client = mongoose.connection;
client.on("error", (e) => console.log(e.message))
export default client;