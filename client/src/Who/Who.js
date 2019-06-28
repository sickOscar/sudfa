import React from 'react';
import sudfateam from '../images/sudfateam.jpg';

const WhoWeAre = props => (
  <div className="mt-2">
    <img src={sudfateam} class="img-fluid" alt="Sudfa Team"/>

    <div className="text-center mt-3">

    Sudfa is made with <span style={{color: 'red'}}>❤</span> by


      <ul className="list-unstyled mt-2">
        <li>Oscar Chinellato</li>
        <li>Shotokan</li>
        <li>Roberto Cecchi</li>
        <li>Gianluca Pericoli</li>
      </ul>
    </div>

  </div>
)

export default WhoWeAre;
