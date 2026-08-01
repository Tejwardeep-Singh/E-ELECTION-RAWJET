require('dotenv').config();

const mongoose = require('mongoose');

async function migrateVoters() {
  await mongoose.connect(process.env.MONGO_URI, { dbName: 'E-Election' });

  const voters = mongoose.connection.collection('voters');
  const result = await voters.updateMany({}, [
    {
      $set: {
        epicNumber: {
          $toUpper: {
            $trim: {
              input: {
                $convert: {
                  input: '$epicNumber',
                  to: 'string',
                  onError: '',
                  onNull: '',
                },
              },
            },
          },
        },
        address: {
          area: { $ifNull: ['$address.area', '$area'] },
          city: { $ifNull: ['$address.city', '$city'] },
          state: { $ifNull: ['$address.state', '$state'] },
        },
        photoUrl: { $ifNull: ['$photoUrl', '$photo'] },
        mustChangePassword: { $ifNull: ['$mustChangePassword', true] },
        status: { $ifNull: ['$status', 'active'] },
        createdAt: { $ifNull: ['$createdAt', '$$NOW'] },
        updatedAt: '$$NOW',
      },
    },
    { $unset: ['area', 'city', 'state', 'photo'] },
  ]);
  await mongoose.disconnect();
}

migrateVoters().catch(async (error) => {
  console.error('Voter migration failed:', error);
  await mongoose.disconnect();
  process.exitCode = 1;
});
