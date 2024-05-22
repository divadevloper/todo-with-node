const express = require("express")
const mongoose = require("mongoose");
const app = express()
const ejs = require("ejs")

app.use(express.static("public"))
app.use(express.urlencoded({ extended: true }))

app.set("view engine", "ejs")


const TodoSchema = new mongoose.Schema({
    name: { type: String, required: [true, "Name field is required"] },
    todocontent: { type: String, unique: true, require: [true, "Name field is required"] }
})

let todoModel = mongoose.model("TodoModel", TodoSchema)

app.post("/", async (req, res) => {

    const { name, todocontent } = req.body
    if (!name || !todocontent) {
        console.log("todo is empyt");
        return
    } else {
        const todo = await todoModel.create(req.body)
        if (todo) {
            console.log("todo create succ");
            res.redirect("/")
        }
        console.log(todo)
    }




})

app.get("/", async (req, res) => {
    let gettodo = await todoModel.find();
    if (gettodo) {
        console.log("todo created suc")
    } else {
        console.log("todo not found");
    }
    res.render("index", { todo: gettodo })
})




app.post("/delete/:id", async (req, res) => {
    let id = req.params.id
    console.log(req.params.id);
    console.log(id);
    if (!id) {
        console.log("couldnt get id");
        return
    }
    try {
        const deletetodo = await todoModel.findByIdAndDelete({ _id: id })
        console.log(deletetodo);
        if (!deletetodo) {
            console.log("couldnt be delete");
        } else {
            console.log("todo successfully deleted");
        }
    } catch (error) {
        console.log(error);
    }
    res.redirect("/")
})


app.get("/edittodo/:id", async (req, res) => {
    let id = req.params.id
    console.log(req.params.id);
    if (!id) {
        console.log("couldnt get id");
        return
    } try {
        const gettodo = await todoModel.findById({ _id: id })
        console.log(gettodo);
        if (!gettodo) {
            console.log("couldnt be edit");
        } else {
            console.log("edit found");
            res.render("edit",{todo: gettodo })

        }
    } catch (error) {
            console.log(error);
    }


})

app.post("/edittodo/:id",async(req,res)=>{

    let id = req.params.id
    console.log(req.params.id);
    if (!id) {
        console.log("couldnt get id");
        return
    } 
    const { name, todocontent } = req.body
    if (!name || !todocontent) {
        console.log("todo is empyt");
        return
    }
    try {
     const updatetodo = await todoModel.findByIdAndUpdate({id},{name,todocontent})
     console.log(updatetodo);
     if (!updatetodo) {
        console.log("cant edit your todo");
     }else{
        console.log("Edit compeleted");
    res.redirect("index")

     }

    } catch (error) {
        console.log(error);
    }
})









const uri = "mongodb+srv://DevDiva:Daramola2000@cluster0.sjyczz0.mongodb.net/DevDiva?retryWrites=true&w=majority&appName=Cluster0"

const connect = () => {
    try {
        let connection = mongoose.connect(uri)
        if (connection) {
            console.log("connected to database");
        } else {
            console.log("error occurred");
        }
    } catch (error) {
        console.log(error);
    }

}
connect()

let port = 3005
app.listen(port, () => {
    console.log(`app started on port ${port}`);
})