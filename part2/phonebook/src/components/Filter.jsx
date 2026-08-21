const Filter = (props) => {
  return (
    <div>
      filter shown with <input value={props.search} onChange={props.handleSearchChange} />
    </div>
  )
}

export default Filter