const generateRTDuration = () =>{

const numberOfDays = 7 //process.env
const currentDate = new Date()
let futureDate = new Date(currentDate)

futureDate.setDate(futureDate.getDate() + numberOfDays)

return futureDate.toISOString()
}

module.exports = {generateRTDuration}

