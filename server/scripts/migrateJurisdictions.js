require('dotenv').config();
const mongoose = require('mongoose');

async function migrateJurisdictions() {
  await mongoose.connect(process.env.MONGO_URI, { dbName: 'E-Election' });
  const candidates = mongoose.connection.collection('candidates');
  const admins = mongoose.connection.collection('admins');

  const result = await candidates.updateMany({}, [
    {
      $set: {
        address: {
          state: { $ifNull: ['$address.state', '$state'] },
          city: { $ifNull: ['$address.city', '$city'] },
          area: { $ifNull: ['$address.area', '$area'] },
        },
      },
    },
    { $unset: ['state', 'city', 'area'] },
  ]);

  const unassignedAdmins = await admins.countDocuments({
    $or: [
      { 'address.state': { $exists: false } },
      { 'address.city': { $exists: false } },
      { 'address.area': { $exists: false } },
    ],
  });

  console.log(`Migrated ${result.modifiedCount} candidate record(s).`);
  console.log(`${unassignedAdmins} existing admin(s) require a Head-assigned jurisdiction.`);
  await mongoose.disconnect();
}

migrateJurisdictions().catch(async (error) => {
  console.error('Jurisdiction migration failed:', error);
  await mongoose.disconnect();
  process.exitCode = 1;
});
