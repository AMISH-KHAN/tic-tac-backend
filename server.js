
const express = require("express")
const { createServer } = require("http")
const { join } = require("path")
const { Server } = require("socket.io")

const PORT=process.env.PORT||3000

const app = express()

const server = createServer(app)

const io = new Server(server)

app.use(express.static(join(__dirname, "../frontend/public")));

app.get("/", (req, res) => {
    res.sendFile(join(__dirname,"../frontend/public/index.html"))
})

let count = 0;
let players=[]
let playersArray=[]
io.on("connection", (socket) => {
    
    socket.on("login", (data) => {
        // io.emit("login",name)
        console.log(players)
        if (data.name !== null) {
            players.push(data.name)
        }
        if (players.length === 2) {
            let obj1 = {
                p1name: players[0],
                p1value: "X",
                p1move:""
            }
            let obj2 = {
                p2name: players[1],
                p2value: "O",
                p2move:""
            }

            let obj = {
                p1: obj1,
                p2:obj2
            }
            playersArray.push(obj)
            players.splice(0,2)
            io.emit("login",playersArray)

        }
    })

    socket.on("move", (data) => {
        
        
        // chance of player 1
        if (data.name === playersArray[0].p1.p1name && count % 2 == 0) {
            newobj = {
                name: data.name,
                count: count,
                value: playersArray[0].p1.p1value,
                index:data.index,
                square:data.squares
            }
            count++
            console.log("chla")
            
        }
        else if(data.name === playersArray[0].p2.p2name && count%2!=0) {
            newobj = {
                name: data.name,
                count: count,
                value: playersArray[0].p2.p2value,
                index:data.index,
                square:data.squares
            }
            count++
            
            
        }
        else {
        newobj = {
                name: data.name,
                count: count,
                index:data.index,
                square:data.squares
            }
        }
        console.log(newobj)
        io.emit("move",newobj)
    })
    
    socket.on("gameOver", (data) => {
        count = 9
        console.log("gameover data: ",data)
    })
    
    socket.on("reset", (data) => {
        count = 0
        socket.emit("reset",data)
    })
})

io.on("disconnect", () => {
    console.log("disconnected")
    playersArray.pop()
    console.log(playersArray)
})

server.listen(PORT, () => {
    console.log(`Server runing at http://localhost:${PORT}`)
})