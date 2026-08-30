require('dotenv').config()

const express = require('express')
const morgan = require('morgan')
const Person = require('./models/person')

const app = express()

app.use(express.json())
app.use(express.static('dist'))
    
morgan.token('body', req => {
    return req.method === 'POST' ? JSON.stringify(req.body) : ''
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.get('/api/persons', (request, response, next) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
    .catch(error => next(error))
})

app.get('/info', (request, response, next) => {
    Person.countDocuments().then(count => {
        response.send(`
        <p>Phonebook has info for ${count} people</p>
        <p>${new Date()}</p>
        `)
    })
    .catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
        .then(person => {
            if (person) {
                response.json(person)
            } else {
                response.status(404).end()
            }
        })
        .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndDelete(request.params.id)
        .then(() => response.status(204).end())
        .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
    const body = request.body
    const name = body.name ? body.name.trim() : ''
    const number = body.number ? body.number.trim() : ''

    Person.findOne({ name })
        .then(existingPerson => {
            console.log(existingPerson)
            if (existingPerson) {
                return response.status(400)
                    .json({ error: 'name must be unique'})
            }

            const person = new Person({ name, number }) 

            return person.save()
                .then(savedPerson => {
                    response.json(savedPerson)
                })
        })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
    const { number } = request.body
    Person.findById(request.params.id)
        .then(person => {
            if (!person) {
                return response.status(404).end()
            }
            
            const updatedNumber = number ? number.trim() : ''

            if (updatedNumber === '') {
                return response.status(400).end()
            }

            person.number = updatedNumber

            return person.save().then(updatedPerson => {
                response.json(updatedPerson)
            })
        })
        .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
    response.status(404).json({ error: 'unknown endpoint'})
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
    console.log(error.message)

    if (error.name === 'CastError') {
        return response.status(400).json({ error: 'malformatted id'})
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message})
    }
    next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`server is now running at port ${PORT}`)
})