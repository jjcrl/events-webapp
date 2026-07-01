import React from 'react'

function Hero({ left, right }) {
  return (
    <section className="hero">
      <div className="hero-left">
        {left}
      </div>

      <div className="hero-right">
        {right}
      </div>
    </section>
  );
}

export default Hero;