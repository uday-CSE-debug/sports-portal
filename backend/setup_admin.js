const User = require('./models/User');
const { sequelize } = require('./config/db');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function setupAdmin() {
    try {
        await sequelize.authenticate();
        console.log('✅ Connected to DB');

        const adminId = 'ADMIN01';
        const adminPass = 'admin123';
        const adminEmail = 'admin@vignan.ac.in';
        const adminName = 'Master Admin';

        let user = await User.findOne({ where: { roll_no: adminId } });

        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(adminPass, salt);

        if (user) {
            console.log(`Found existing Admin: ${user.full_name}. Resetting password and ensuring role...`);
            user.password_hash = password_hash;
            user.role = 'admin';
            user.status = 'approved';
            await user.save();
            console.log('✅ Admin account updated.');
        } else {
            console.log('Admin account not found. Creating new Master Admin...');
            await User.create({
                roll_no: adminId,
                email: adminEmail,
                password_hash: password_hash,
                full_name: adminName,
                role: 'admin',
                status: 'approved'
            });
            console.log('✅ Master Admin account created.');
        }

        console.log('\n--- MASTER ADMIN CREDENTIALS ---');
        console.log(`ID: ${adminId}`);
        console.log(`Password: ${adminPass}`);
        console.log('--------------------------------\n');

    } catch (err) {
        console.error('Setup Failed:', err);
    } finally {
        process.exit();
    }
}

setupAdmin();
