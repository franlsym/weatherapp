// backend/index.js
import { Elysia } from 'elysia'
import { cors } from '@elysiajs/cors'

const app = new Elysia()
  .use(cors({
    origin: '*'
  }))

// Mock user database
const users = [
  { username: 'user', password: 'password' }
]

// Mock weather data
const getWeatherData = (lat, lon) => {
  return {
    temperature: Math.round(Math.random() * 30),
    condition: ['Sunny', 'Cloudy', 'Rainy', 'Windy'][Math.floor(Math.random() * 4)]
  }
}

app.post('/login', ({ body }) => {
  const { username, password } = body
  const user = users.find(u => u.username === username && u.password === password)
  if (user) {
    return { success: true, message: 'Login successful' }
  } else {
    return { success: false, message: 'Invalid credentials' }
  }
})

app.get('/weather', ({ query }) => {
  const { lat, lon } = query
  if (!lat || !lon) {
    return { error: 'Latitude and longitude are required' }
  }
  return getWeatherData(lat, lon)
})

app.listen(3000)

console.log('Server is running on http://localhost:3000')
