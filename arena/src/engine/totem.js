function Totem(totemType) {

  let health = 1;
  let id = Math.random().toString(36).substr(2);
  let duration = 3;
  const type = totemType || 'attack';

  const getHealth = () => health;
  const getId = () => id;
  const getDuration = () => duration;
  const getType = () => type;
  const getName = () => `${type} totem`;
  const getStatus = () => ['OK'];

  const setDuration = (v) => duration = v;
  const setHealth = (v) => health = v;

  return {
    getId,
    getDuration,
    getHealth,
    getType,
    getName,
    getStatus,

    setDuration,
    setHealth
  }
}

module.exports = Totem;
