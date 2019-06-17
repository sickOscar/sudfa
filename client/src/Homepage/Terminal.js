import React from 'react';
import './Terminal.scss';


const Terminal = (props) => (
  <div className="window">
    <div className="title-bar">
      <div className="controls">
        <div className="control close"></div>
        <div className="control minimize"></div>
        <div className="control maximize"></div>
      </div>
      <div className="title">Your code</div>
    </div>
    <div className="code-content">
      <code>
        <pre>
          {`
const enemyTeam = this.game.getEnemyTeam();

const target = enemyTeam.getMostDamagedSoldier();
soldier.attack(target);
        `}
        </pre>
      </code>
    </div>
  </div>
)

export default Terminal;
