const { Types } = require('mongoose');

module.exports = {
  async up(db, client) {
    const subscriptions = await db.collection('yookassasubscriptions').find({}).toArray();

    for (const subscription of subscriptions) {
      const user = await db.collection('users').findOne({ _id: Types.ObjectId(subscription.userId) });

      await db.collection('yookassasubscriptions').updateOne({ _id: subscription._id }, { $set: { email: user.email } });
    }
  },

  async down(db, client) {
    await db.collection('yookassasubscriptions').updateMany({}, { $unset: { email: '' } });
  }
};
