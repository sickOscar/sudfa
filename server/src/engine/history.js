
class History {

	constructor() {
		this.state = {
			players: [],
			turns: [],
			exit: {}
		}
	}


	setPlayers(player1, player2) {


		const p1 = {
			name: player1.team.name,
			troop: player1.team.troop.map(soldier => soldier.info())
		};

		const p2 = {
			name: player2.team.name,
			troop: player2.team.troop.map(soldier => soldier.info())
		};

		this.state.players.push(p1, p2);
	}

	addTurn(turn, state) {
		this.state.turns.push( {turn, state});
	}

	setExit(winner, by) {
		this.state.exit = {winner, by}
	}

	reset() {
		this.state = {
			players: [],
			turns: [],
			exit: {}
		}
	}

}


module.exports = (function() {

	let instance = null;

	const getInstance = () => {
		if (!instance) {
			instance = new History()
		}
		return instance;
	};

	return {
		getInstance
	}

}());
