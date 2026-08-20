const Total = (props) => {
  const parts = props.parts;
  console.log(parts)
  const total = parts.reduce((s, p) => {
    return s + p.exercises
  }, 0);

  return (
    <div>
      <p><b>Total of {total} exercises</b></p>
    </div>
  )
}

export default Total