## APIS

### game

- **`getCurrentSoldier()`**:*Soldier* -> get the current soldier
- **`getEnemyTeam()`**:*Team* -> reference to the enemy team
- **`getMyTeam()`**:*Team* -> reference to your team

### Team API

- **`getAliveSoldiers()`**:*Array<Soldier>* -> get alive soldiers
- **`getFirstSoldier()`**:*Soldier* -> get the first soldier
- **`getLastSoldier()`**:*Soldier* -> get the last soldier
- **`getStrongestSoldier()`**:*Soldier* -> get the soldier with the highest attack
- **`getWeakestSoldier()`**:*Soldier* -> get the soldier with the lowes attack
- **`getMostDamagedSoldier()`**:*Soldier* -> get the soldier with the lowest health
- **`getHealer()`**:*Soldier* -> get one soldier who can heal

### Your Soldier API

- **`hit(target)`**:*void* -> attacks a target (must be an enemy soldier)
- **`heal(target)`**:*void* -> heals a target (must be one of your soldiers)
- **`cast()`**:*void* -> cast a spell on all enemies
- **`canHeal()`**:*boolean* -> check if soldier can heal
- **`canCast()`**:*boolean* -> check if soldier can cast
- **`getMotto()`**:*string* -> return soldier motto
- **`getType()`**:*string* -> return soldier type
- **`getHealth()`**:*int* -> return soldier health
- **`getAttack()`**:*int* -> return soldier attack
- **`getName()`**:*string* -> return soldier name
- **`getId()`**:*string* -> return soldier id
- **`getMaxHealth()`**:*int* -> return soldier max health
- **`getStatus()`**:*string* -> return soldier status

### Enemy Soldier Api

- **`getType()`**:string* -> return soldier type
- **`getHealth()`**:int* -> return soldier health
- **`getAttack()`**:int* -> return soldier attack
- **`getName()`**:string* -> return soldier name
- **`getId()`**:string* -> return soldier id
- **`getMaxHealth()`**:int* -> return soldier max health
- **`getStatus()`**:string* -> return soldier status
