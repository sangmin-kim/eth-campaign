require("dotenv").config();

module.exports = {
    env: {
        MNEMONIC: process.env.MNEMONIC,
        INFURA_PROJECT: process.env.INFURA_PROJECT
    }
}