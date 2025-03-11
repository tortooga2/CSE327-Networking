import { Users } from './model.user.js';
import { Data } from './model.data.js';

//This handy file lets us create associations between Models while avoiding initialization errors
//Notes: Realizing I needed this took me way too long :(

//This section defines a One-to-Many association between Users and Data
//Makes the owner column in Data a foreign from Users
Users.hasMany(Data, {
    foreignKey: 'owner',
    sourceKey: 'profile_id',
});

Data.belongsTo(Users, {
    foreignKey: 'owner',
    targetKey: 'profile_id',
});