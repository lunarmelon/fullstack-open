import { useState } from "react";

const Button = (props) => {
  return (
    <button onClick={props.onClick}>{props.text}</button>
  )
}

const StatisticLine = (props) => {
  return (
    <p>{props.text}: {props.value}</p>
  )
}

const Statistics = (props) => {
  if (props.total === 0) {
    return (
      <div>
        No feedback given
      </div>
    )
  }
  return (
    <div>
      <StatisticLine text="Good" value={props.good} />
      <StatisticLine text="Bad" value={props.bad} />
      <StatisticLine text="Total" value={props.total} />
      <StatisticLine text="Average" value={props.average / props.total} />
      <StatisticLine text="Positive" value={`${props.good / props.total * 100}%`} />
    </div>
  )
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad,setBad] = useState(0)
  const [total, setTotal] = useState(0)
  const [average, setAverage] = useState(0)

  const handleGood = () => {
    const updatedGood = good + 1;
    setGood(updatedGood);
    setAverage(average + 1);
    setTotal(updatedGood + neutral + bad);
  }

  const handleNeutral = () => {
    const updatedNeutral = neutral + 1;
    setNeutral(updatedNeutral);
    setTotal(good + updatedNeutral + bad);
    setAverage(average);
  } 
  
  const handleBad = () => {
    const updatedBad = bad + 1;
    setBad(updatedBad);
    setTotal(good + neutral + updatedBad);
    setAverage(average - 1);
  }

  return (
    <div>
      <h1>Give feedback</h1>
      <Button onClick={handleGood} text={"positive"} />
      <Button onClick={handleNeutral} text={"neutral"}/>
      <Button onClick={handleBad} text={"bad"}/>
      <h1>Statistics</h1>
      <Statistics good={good} neutral={neutral} bad={bad} total={total} average={average} />
    </div>
  )
}

export default App