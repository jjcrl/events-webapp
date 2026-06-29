import React from 'react'

function SignUpBanner(props) {
  return (
    <div className='banner'>
      <div className='left'>
        <p>{props.left}</p>
      </div>
      <div className='right'>
        <p>{props.right}</p>
      </div>
    </div>
  )
}

export default SignUpBanner