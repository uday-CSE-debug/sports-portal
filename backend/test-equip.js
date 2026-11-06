const Equipment = require('./models/Equipment');
const { sequelize } = require('./config/db');

async function test() {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');

        const equipment = await Equipment.findAll();
        console.log('Equipment found:', JSON.stringify(equipment, null, 2));
    } catch (error) {
        console.error('Unable to perform operation:', error);
    } finally {
        await sequelize.close();
    }
}

test();
