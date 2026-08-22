import { useState, useEffect } from 'react'
import personService from './services/persons'
import PersonForm from './components/PersonForm'
import Filter from './components/Filter'
import Persons from './components/Persons'

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [search, setSearch] = useState('')

  const getPersons = () => {
    personService
      .getAll()
      .then(initialPersons =>   {
        setPersons(initialPersons)
      })
  }

  useEffect(getPersons, [])

  const addPerson = (event) => {
    event.preventDefault()
    const personObject = {
      name: newName,
      number: newNumber
    }
    if (persons.some(person => person.name === personObject.name)) {
      alert(`${personObject.name} is already added to the phonebook`)
      setNewName('')
      setNewNumber('')
    }
    else {
      personService
        .create(personObject)
        .then(person => {
          setPersons(persons.concat(person))
          setNewName('')
          setNewNumber('')
        }) 
    } 
  }

  const deletePerson = (id) => {
    const person = persons.find(person => person.id === id)
    if (window.confirm(`Delete ${person.name}?`)) {
      personService.deleteItem(id)
      .then(() => {
        setPersons(persons.filter(person => person.id !== id))
      })
    }
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleSearchChange = (event) => {
    console.log(event.target.value)
    setSearch(event.target.value)
  }

  const personsToShow = search
    ? persons.filter(person => person.name.toLowerCase().includes(search.toLowerCase()))
    : persons 

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter search={search} handleSearchChange={handleSearchChange} />
      <h2>add a new</h2>
      <PersonForm
        addPerson={addPerson}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      /> 
      <h2>Numbers</h2>
      <Persons personsToShow={personsToShow} deletePerson={deletePerson} />
    </div>
  )
}

export default App