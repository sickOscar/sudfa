function Totem(totemType) {

  let health = 1;
  let id = Math.random().toString(36).substr(2);
  let duration = 3;
  const type = totemType || 'attack';

  const getHealth = () => health;
  const getId = () => id;
  const getDuration = () => duration;
  const getType = () => type;

  const setDuration = (v) => duration = v;

  return {
    getId,
    getDuration,
    getHealth,
    getType,

    setDuration
  }
}

module.exports = Totem;
