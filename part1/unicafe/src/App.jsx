import { useState } from "react";

const Button = (props) => {
  return (
    <button onClick={props.onClick}>{props.text}</button>
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
      <p>Good: {good}</p>
      <p>Neutral: {neutral}</p>
      <p>Bad: {bad}</p>
      <p>Total: {total}</p>
      <p>Average: {average/total}</p>
      <p>Positive: {good/total * 100}%</p>
    </div>
  )
}

export default App