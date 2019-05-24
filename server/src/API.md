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

#### DEV (24HP)
- **`hit(target)`**:*void* -> attacks (3dmg) a target (must be an enemy soldier)


#### PM (20 HP)
- **`hit(target)`**:*void* -> attacks (2dmg) a target (must be an enemy soldier)
- **`heal(target)`**:*void* -> heals (5HP) a target (must be one of your soldiers)
- **`silence(target)`**:*void* -> silence a target (can't cast or heal) for one turn
- **`blind(target)`**:*void* -> blinds a target, can't hit for one turn

#### MKTG (14 HP)
- **`hit(target)`**:*void* -> attacks (1dmg) a target (must be an enemy soldier)
- **`cast()`**:*void* -> cast a spell (2dmg) on all enemies
- **`poison(target)`**:*void* -> poison an enemy. Deals 2dmg, then 2dmg per turn for 2 turns. If the enemy is already poisoned, it doesn't deal initial damage but extends poison duration.

#### COMMON TO ALL SOLDIERS
- **`canHeal()`**:*boolean* -> check if soldier can heal
- **`canCast()`**:*boolean* -> check if soldier can cast
- **`canSilence()`**:*boolean* -> check if soldier can cast
- **`getMotto()`**:*string* -> return soldier motto
- **`getType()`**:*string* -> return soldier type
- **`getHealth()`**:*int* -> return soldier health
- **`getAttack()`**:*int* -> return soldier attack
- **`getName()`**:*string* -> return soldier name
- **`getId()`**:*string* -> return soldier id
- **`getMaxHealth()`**:*int* -> return soldier max health
- **`getStatus()`**:*Array* -> return soldier status


### Enemy Soldier Api

- **`getType()`**:string* -> return soldier type
- **`getHealth()`**:int* -> return soldier health
- **`getAttack()`**:int* -> return soldier attack
- **`getName()`**:string* -> return soldier name
- **`getId()`**:string* -> return soldier id
- **`getMaxHealth()`**:int* -> return soldier max health
- **`getStatus()`**:string* -> return soldier status
