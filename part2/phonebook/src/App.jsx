import './index.css'
import { useState, useEffect } from 'react'
import Notification from './components/Notifications'
import phonebookService from './services/phonebook'

const Filter = ({value, onChange}) => {
  return (
    <div>
      filter shown with <input value={value} onChange={onChange} />
    </div>
  )
}

const PersonForm = ({addName, newName, handleAddName, newNumber, handleAddNumber}) => {
  return (
    <form onSubmit={addName} >
      <div>
        name: <input value={newName} onChange={handleAddName}/>
      </div>
      <div>
        number: <input value={newNumber} onChange={handleAddNumber} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

const Persons = ({showFilter, handleDelete}) => {
  return (
    <>
      {showFilter.map(person => {
        return (
          <div key={person.id}>
            <div>{person.name} {person.number} <button onClick={() => handleDelete(person.id)}>Delete</button></div>
          </div>
        )
      })}
    </>
  )
}

const App = () => {
  const [persons, setPersons] = useState([]) 

  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [notification, setNotification] = useState(null)

  useEffect(() => {
    phonebookService
      .getAll()
      .then(initialPersons => {
        console.log('Promise fulfilled')
        setPersons(initialPersons)
      })
  }, [])

  if (!persons) return null

  const addName = event => {
    event.preventDefault()
    const trimmedName = newName.trim()
    const trimmedNumber = newNumber.trim()
    if (!trimmedName || !trimmedNumber) return

    const person = persons.find(p => p.name.toLowerCase() === trimmedName.toLowerCase())

    if (person) {
      if (confirm(`${newName} is already added to phonebook, replace the old number with the new one?`)) {
        const personObject = {
          ...person,
          number: trimmedNumber,
        }
        phonebookService
          .update(person.id, personObject)
          .then(updatedPerson => {
            setPersons(persons.map(p => p.id === person.id ? updatedPerson : p))
            setNotification({
              message: `Number of ${trimmedName} is changed`,
              type: 'success'
            })
            setTimeout(()=> {
              setNotification(null)
            }, 5000)
            setNewName('')
            setNewNumber('')
          })
          .catch(() => {
            setNotification({
              message: `Unable to update ${person.name}'s number. Please try again.`,
              type: 'error'
            })
            setTimeout(() => {
              setNotification(null)
            }, 5000)
          })
      }

    } else {
        const personObject = {
          name: trimmedName,
          number: trimmedNumber,
        }
        phonebookService
          .create(personObject)
          .then(returnedPerson => {
            setPersons(persons.concat(returnedPerson))
            setNewName('')
            setNewNumber('')
            setNotification({
              message: `Added ${trimmedName}`,
              type: 'success'
            })
            setTimeout(() => {
              setNotification(null)
            }, 5000)
          })
          .catch(() => {
            setNotification({
              message: `Unable to add ${trimmedName}. Please try again.`,
              type: 'error'
            })
            setTimeout(()=> {
              setNotification(null)
            }, 5000)
          })
      }
    
  }

  const handleDelete = id => {
    const person = persons.find(person => person.id === id)

    if (!person) return

    if (window.confirm(`Delete ${person.name}?`)) {
      phonebookService
        .remove(id)
        .then(() => {
          setPersons(persons.filter(person => person.id !== id))
        })
        .catch(error => {
          console.error(error)
          setNotification({
            message: `Information of ${person.name} was already been removed from the server`,
            type: 'error'
          })
          setTimeout(() => {
            setNotification(null)
          }, 5000)
          setPersons(persons.filter(person => person.id !== id))
        })
    }
  }

  const handleAddName = event => { 
    setNewName(event.target.value)
  }

  const handleAddNumber = event => {
    setNewNumber(event.target.value)
  }

  const handleFilter = event => {
    setFilter(event.target.value)
  }
  
  const showFilter = persons.filter(person => person.name.toLowerCase().includes(filter))

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification notification={notification}/>
      <Filter value={filter} onChange={handleFilter} />
      <h3>Add a new</h3>
      <PersonForm addName={addName} newName={newName} handleAddName={handleAddName} newNumber={newNumber} handleAddNumber={handleAddNumber}/>
      <h3>Numbers</h3>
      <Persons showFilter={showFilter} handleDelete={handleDelete}/>
    </div>
  )
}

export default App