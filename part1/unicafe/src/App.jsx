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

  const handleGood = () => {
    const updatedGood = good + 1;
    setGood(updatedGood);
    console.log("good: " + updatedGood);
  }

  const handleNeutral = () => {
    const updatedNeutral = neutral + 1;
    setNeutral(updatedNeutral);
    console.log("neutral: " + updatedNeutral);
  } 
  
  const handleBad = () => {
    const updatedBad = bad + 1;
    setBad(updatedBad);
    console.log("bad: " + updatedBad);
  }
  return (
    <div>
      <h1>Give feedback</h1>
      <Button onClick={handleGood} text={"positive"} />
      <Button onClick={handleNeutral} text={"neutral"}/>
      <Button onClick={handleBad} text={"bad"}/>
      <h1>Statistics</h1>
      <p>good {good}</p>
      <p>neutral {neutral}</p>
      <p>bad {bad}</p>
    </div>
  )
}

export default App