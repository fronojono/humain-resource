import React from "react"
const withData = data => Comp => {
  const wrappered = props => <Comp {...props} data={data} />
  wrappered.displayName = `WithData(${Comp})`
  return wrappered
}
export default withData
