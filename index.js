const express = require('express')
const generate = require('shortid').generate
const cors = require('cors')
const app = express()

app.use(express.json())
app.use(cors())

const PORT = 5000

let users = [
    { id: generate(), name: 'Tom', bio: 'Look im tom and i do things with the name tom' }
]

app.get('/api/users', (req, res) => {
    try {
        res.status(200).json(users)
    } catch (error) {
        res.status(500).json({ errorMessage: "The users information could not be retrieved." })
    }
})

app.post('/api/users', (req, res) => {
    const { name, bio } = req.body
    try {
        if (!name || !bio) {
            res.status(400).json({ errorMessage: "Please provide name and bio for the user." })
        } else {
            const newUser = { id: generate(), name, bio }
            users.push(newUser)
            res.status(201).json(newUser)
        }
    } catch (error) {
        res.status(500).json({ errorMessage: "There was an error while saving the user to the database" })
    }
})

app.get('/api/users/:id', (req, res) => {
    const { id } = req.params
    const user = users.find(user => user.id === id)
    try {
        if (!user) {
            res.status(404).json({ message: "The user with the specified ID does not exist." })
        } else {
            res.status(200).json(user)
        }
    } catch (error) {
        res.status(500).json({ errorMessage: "The user information could not be retrieved." })
    }
})

app.put('/api/users/:id', (req, res) => {
    const { id } = req.params
    const { name, bio } = req.body
    const indexOfUser = users.findIndex(user => user.id === id)
    try {
        if (!users.find(user => user.id === id)) {
            res.status(404).json({ message: "The user with the specified ID does not exist." })
        } else if (!name || !bio) {
            res.status(400).json({ errorMessage: "Please provide name and bio for the user." })
        }
        else if (indexOfUser !== -1) {
            users[indexOfUser] = { id, name, bio }
            res.status(200).json({ id, name, bio })
        }
    } catch (error) {
        res.status(500).json({ errorMessage: "The user information could not be modified." })
    }
})


app.delete('/api/users/:id', (req, res) => {
    const { id } = req.params
    try {
        if (!users.find(user => user.id === id)) {
            res.status(404).json({ message: "The user with the specified ID does not exist." })
        } else {
            users = users.filter(user => user.id !== id)
            res.status(200).json({ message: `User with id ${id} got deleted` })
        }
    } catch (error) {
        res.status(500).json({ errorMessage: "The user could not be removed" })
    }
})




app.use('*', (req, res) => {
    res.status(404).json({
        message: 'Nothing to see here!'
    })
})



app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`)
})