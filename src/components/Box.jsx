function Box({ color, onClick }) {
  return (
    <div
      className="box"
      style={{ backgroundColor: color }}
      onClick={onClick}
    />
  )
}

export default Box