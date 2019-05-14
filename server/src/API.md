## APIS

### game

- ``getCurrentSoldier()``: get the current soldier
- ``getEnemyTeam()``: reference to the enemy team
- ``getMyTeam()``: reference to your team

### Team API

- ``getFirstSoldier()``: get the first soldier
- ``getLastSoldier()``: get the last soldier
- ``getStrongestSoldier()``: get the soldier with the highest attack
- ``getWeakestSoldier()``: get the soldier with the lowes attack
- ``getMostDamagedSoldier()``: get the soldier with the lowest health
- ``getHealer()``: get one soldier who can heal

### Your Soldier API

- ``hit(target)``: attacks a target (must be an enemy soldier)
- ``heal(target)``: heals a target (must be one of your soldiers)
- ``cast()``: cast a spell on all enemies
- ``canHeal()``: check if soldier can heal
- ``canCast()``: check if soldier can case
- ``getMotto()``: return soldier motto
- ``getType()``: return soldier type
- ``getHealth()``: return soldier health
- ``getAttack()``: return soldier attack
- ``getName()``: return soldier name
- ``getId()``: return soldier id
- ``getMaxHealth()``: return soldier max health
- ``getStatus()``: return soldier status

### Enemy Soldier Api

- ``getHealth()``: return soldier health
- ``getAttack()``: return soldier attack
- ``getName()``: return soldier name
- ``getId()``: return soldier id
- ``getMaxHealth()``: return soldier max health
- ``getStatus()``: return soldier status
