exports.getVersionInfo = () => {
  const { version: devCliVersion } = require(`../../package.json`)
  return `AcmeKit Dev CLI version: ${devCliVersion}`
}
