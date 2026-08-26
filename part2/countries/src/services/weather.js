import axios from "axios"
const baseURL = 'https://api.open-meteo.com/v1/forecast'

const getAll = (latitude, longitude) => {
    const request = axios.get(`${baseURL}?latitude=${latitude}&longitude=${longitude}&current_weather=true`)
    return request.then(response => response.data)
}

export default { getAll }