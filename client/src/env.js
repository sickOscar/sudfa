
const DOMAIN_WITH_PROTOCOL = `${window.location.protocol}//${window.location.hostname}`

const Env = {
  DOMAIN_WITH_PROTOCOL,
  API_HOST: process.env.NODE_ENV === 'development'
    ? `${DOMAIN_WITH_PROTOCOL}:5000`
    : `${DOMAIN_WITH_PROTOCOL}/api`
};

export default Env;
