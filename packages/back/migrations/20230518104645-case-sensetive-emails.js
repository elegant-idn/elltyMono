module.exports = {
  async up(db, client) {
    const usersCol = db.collection('users');
    const duplicateUsers = await usersCol.aggregate([
      {
        '$lookup': {
          'from': 'usertemplates',
          'localField': '_id',
          'foreignField': 'user',
          'as': 'templates',
          'pipeline': [
            {
              '$sort': {
                'createdAt': -1
              }
            }, {
              '$limit': 1
            }, {
              '$project': {
                'createdAt': 1
              }
            }
          ]
        }
      }, {
        '$group': {
          '_id': {
            '$toLower': '$email'
          },
          'count': {
            '$sum': 1
          },
          'docs': {
            '$push': '$$ROOT'
          },
        }
      }, {
        '$match': {
          'count': {
            '$gt': 1
          }
        }
      }
    ], { allowDiskUse: true }).toArray();

    const userIdsToNotDelete = [];
    const allDuplicateUserIds = [];

    duplicateUsers.forEach(dupResult => {
      let userToNotDelete = dupResult.docs[0];

      dupResult.docs.forEach(user => {
        allDuplicateUserIds.push(user._id);

        if (userToNotDelete.plan === 'pro') return;

        if (user.plan === 'pro') {
          userToNotDelete = user;
          return;
        }

        const latestUserTemplate = user.templates[0];

        if (!latestUserTemplate) return;

        if (latestUserTemplate?.createdAt?.getTime() > userToNotDelete?.templates[0]?.createdAt?.getTime()) {
          userToNotDelete = user;
        }
      })

      userIdsToNotDelete.push(userToNotDelete._id);
    })

    const userIdsToDelete = allDuplicateUserIds.filter(uid => !userIdsToNotDelete.includes(uid))

    await usersCol.deleteMany({ _id: { $in: userIdsToDelete }, plan: { $ne: "pro" } });
    const usersToRename = await usersCol.find({ "email": { $regex: /[A-Z]/ } }).toArray();

    await Promise.allSettled(
      usersToRename.map(async (user, index) => {
        console.log(`Resolving ${index} of ${usersToRename.length}`)
        try {
          await usersCol.updateOne({ _id: user._id, }, { $set: { email: user.email.toLowerCase() } });
          console.log(`Resolved ${index} of ${usersToRename.length}`)
        } catch (e) {
          console.log(user._id, e)
        }
      })
    )
  },

  async down(db, client) {
  }
};
