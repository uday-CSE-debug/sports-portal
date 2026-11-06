const User = require('./models/User');
const { sequelize } = require('./config/db');

async function test() {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');

        const users = await User.findAll({
            attributes: { exclude: ['password_hash'] }
        });
        console.log('Users found:', JSON.stringify(users, null, 2));
    } catch (error) {
        console.error('Unable to perform operation:', error);
    } finally {
        await sequelize.close();
    }
}

test();
