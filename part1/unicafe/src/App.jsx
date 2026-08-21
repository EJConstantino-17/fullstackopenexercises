import { useState } from 'react'

const Button = ({onClick, text}) => <button onClick={onClick}>{text}</button>

const Statistics = ({statistics}) => {
  const {good, neutral, bad, total, average, positive} = statistics
  if (total === 0) return <div>no feedback given</div>
  return (
    <table>
      <tbody>
        <StatisticLine text='good' value={good} />
        <StatisticLine text='neutral' value={neutral} />
        <StatisticLine text='bad' value={bad} />
        <StatisticLine text='all' value={total} />
        <StatisticLine text='average' value={average} />
        <StatisticLine text='positive' value={positive}/>
      </tbody>
    </table>
  )
}

const StatisticLine = ({text, value}) => {
  return (
    <tr>
      <td>{text}</td>
      <td>{value}</td>
    </tr>
  )
}

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const total = good + neutral + bad
  const average = total === 0 ? 0 : ((good - bad)/total).toFixed(1) 
  const positive = total === 0 ? '0%': `${(good/total * 100).toFixed(1)}%`

  const goodClick = () => setGood(good + 1)
  const neutralClick = () => setNeutral(neutral + 1)
  const badClick = () => setBad(bad + 1)

  const statistics = { good, neutral, bad, total, average, positive }

  return (
    <div>
      <h1>give feedback</h1>
      <Button onClick={goodClick} text='good' />
      <Button onClick={neutralClick} text='neutral' />
      <Button onClick={badClick} text='bad' />
      <h1>statistics</h1>
      <Statistics statistics={statistics}/>
    </div>
  )
}

export default App
