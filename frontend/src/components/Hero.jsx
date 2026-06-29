import React from 'react'

function Hero(props) {
  return (
    <div className='hero'>
      <div className='left'>
        <p>{props.right}</p>

      </div>
      <div className='right'>
        <p>{props.left}</p>
      </div>
    </div>
  )
}

export default Hero