import React from 'react';
import sudfateam from '../images/sudfateam.jpg';

const WhoWeAre = props => (
  <div className="mt-2 container">
    <img src={sudfateam} class="img-fluid" alt="Sudfa Team"/>

    <div className="text-center mt-3">

    Made with <span style={{color: 'red'}}>❤</span> by


      <ul className="list-unstyled mt-2">
        <li>Oscar Chinellato (<a href="https://github.com/sickdevelopers" target="_blank" rel="noopener noreferrer">@sickDevelopers</a>)</li>
        <li>Shotokan (<a href="https://aitch.me/" target="_blank" rel="noopener noreferrer">31337</a>)</li>
        <li>Roberto Cecchi (<a href="https://www.robertocecchi.com/" target="_blank" rel="noopener noreferrer">portfolio</a>)</li>
        <li>Gianluca Pericoli (<a href="https://github.com/gpericol" target="_blank" rel="noopener noreferrer">@gpericol</a>)</li>
      </ul>
    </div>

  </div>
)

export default WhoWeAre;
