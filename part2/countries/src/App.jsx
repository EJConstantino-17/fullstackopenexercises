import { useState, useEffect } from "react"
import countryService from './services/countries'
import weatherService from './services/weather'

const App = () => {
  const [name, setName] = useState('')
  const [countries, setCountries] = useState([])
  const [weather, setWeather] = useState(null)

  useEffect(() => {
    console.log('Use effect now running')
    console.log('Name has value')
      countryService
        .getAll()
        .then(allCountries => {
          console.log(allCountries)
          setCountries(allCountries)
        })
        .catch(error => {
          console.log(error)
        })
  }, [])

  const handleChange = event => {
    setName(event.target.value)
  }

  const exactMatch = countries.find(
    country => country.name.common.toLowerCase() === name.trim().toLowerCase()
  )

  const onSearch = exactMatch 
  ? [exactMatch]
  : countries.filter(country => country.name.common.toLowerCase().includes(name.trim().toLowerCase()))

  const countryToDisplay = onSearch.length === 1 ? onSearch[0] : null

  const capitalLatLng = countryToDisplay?.capitalInfo?.latlng || countryToDisplay?.latlng

  useEffect(() => {
    if (capitalLatLng) {
      const [lat, long] = capitalLatLng
      weatherService
      .getAll(lat, long)
      .then(data => {
        setWeather(data.current_weather)
      })
      .catch(error => {
        console.log(error)
      })
    }
  }, [capitalLatLng?.[0], capitalLatLng?.[1]])

  const renderCountries = () => {
    if (onSearch.length > 10) {
      return <div>Too many matches, specify another filter</div> 
    }

    return onSearch.map(country => (
        <div key={country.cca3}>
          <div>{country.name.common}<button onClick={() => {setName(country.name.common)}}>show</button></div>
        </div>
      )
    )
  }

  const renderCountry = () => {
    const country = onSearch[0]
    const {temperature, windspeed} = weather || {}
    if (!country) return null
    return (
      <div>
        <h1>{country.name.common}</h1>
        <div>Capital: {country.capital}</div>
        <div>Area: {country.area}</div>
        <h2>Languages</h2>
        <ul>
          { country.languages ?
            Object.values(country.languages).map(element => <li key={element}>{element}</li>) 
            : null
          }
        </ul>
        <img src={country.flags.png} alt={country.name.common} />
        <h2>Weather in {country.capital}</h2>
        <div>Temperature {temperature} Celcius</div>
        <div>Wind {windspeed} m/s</div>
      </div>
    )
  }

  return (
    <div>
      find countries <input value={name} onChange={handleChange}/>
      <div>
        {onSearch.length === 1 ? renderCountry() : renderCountries()}
      </div>
    </div>
  )
}

export default App