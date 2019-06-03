## What is it?

Super Ultra Dev Fight Arena (SUDFA) is an AI programming game.

## How does it work?
The game lets you code your bots and challenge all other players 
in a giant royal rumble arena, where only the best AI can thrive. 

## How does a fight work?
Each bot is made up of a team of three characters, which can be combined as required between the available classes.

A league fight takes place in 2 rounds,
so that each team has a chance to start first.

A round is a series of alternating rounds (maximum 100), where the components of the 
two teams alternate and may perform **only one action per turn**. 
If you have played a JRPG in the past, you will surely already be aware of the system.

It is not possible to change the order of the soldiers on the field at runtime, so be careful not only 
to whom you choose, but also to the order in which you arrange them! 

## Team code

A bot is a Javascript class (node version > 11). It must have a constructor and a `run()`method. 
The constructor is executed only once at the start of the match; the run method instead is performed 
at each player's turn. The available APIs allow you to have 
references to your own team and to the opposing team and to perform all actions
necessary to win the fight. 

### Creation of the team
Within the constructor you need to define a `team` object that must contain the name and shape of the team.

```
constructor(game) {

  // ref to the game object
  this.game = game;
  
  
  this.team = {
    name: 'Team name', // the name, you can change it anytime you want it
    troops: [
      game.Dev(), // 
      game.Pm(),  // max 3 soldiers
      game.Mktg() // 
    ]
  }

}
```

### Turn execution
At each turn of one of your team's soldiers, the `run()`method will be launched. 
In it you have to put the execution code of the turn: you have to analyze the 
state of your team and that of the opponent, identify the action to be 
taken and finally perform the action chosen. You can only do one action per 
turn: if you try to do two or more actions, the entire turn will be cancelled 
and you will pass the hand to the opponent.


#### Remember: it is a Javascript class like all the others 
(note also the final `module.exports` syntax. which is mandatory). 
You can use all the tools provided by the language, so don't be afraid 
to create new methods and fields in the class to help you.


### Test the code
Before you send your team to fight furiously in the arena against all the 
other teams of other players, you have 2 possibilities to test your code:

- You can fight against bots programmed by the arena organizers. They are 
some bots of increasing difficulty. Nothing unbeatable, but don't hope to 
emerge victorious from the arena if your bot can't overcome all the enemies we've prepared.

- You can fight against the bots of other players: select your enemy and test 
your bot against it. You can test only one of the two fights that will take 
place in the arena, which is where you're first to go. In any case, you will 
have the opportunity to test your team with the top guys in the leaderboard. 
Don't get down if at the  beginning it will seem to you an unbeatable challenge, 
with time you will surely be able to improve


## Classes

### Developer
The Developer is a war machine. Its powerful attacks will make your opponents tremble with fear. It has many health points and the most powerful attack between classes. His actions are: 

- Hit: Hits the target by inflicting 3 damage (physical attack).
- Protect (target): Protects one of your companions for a turn. The protected companion may not suffer damage of any kind.

### Project Manager
The project manager is your team's brain. Even if he has a discreet attack (2 damage) his main role is to heal his teammates and block the attacks of the opposing team. His actions are:
 
 - hit: hits the target by inflicting 2 damage (physical attack)
 - heal(target): Cure a teammate of 5 health points
 - blind (target): blinds an enemy to prevent him from making a physical attack in his next turn
 - silence(target): silence an enemy, in his next turn he cannot use a magic ability (cast or cure)

### Marketing
The marketer is a smart and powerful character. Despite being the weakest and his physical attack is derisory (1dmg), he has magical abilities! He can hit all his enemies or use the poison to inflict a considerable amount of damage over a long period of time. His skills are:

- Hit: Hits the target by inflicting 1 damage (physical attack).
- cast(): hits the entire opposing team, inflicting 2 damage on all members
- Poison (target): Poisons a member of the opposing team, inflicting 2 damage suffered and 4 damage distributed over the next 2 rounds. If the target is protected, it does not suffer the initial damage but extends the poisoning period.



  

