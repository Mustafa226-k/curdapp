const {Sequelize} = require("sequelize");

const sequelize = new Sequelize("internship_db", "root","root",{
    host: "localhost",
    dialect: "mysql"
});

module.exports = sequelize;
