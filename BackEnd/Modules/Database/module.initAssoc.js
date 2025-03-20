export const initAssoc = (tables) => {
    //This handy file lets us create associations between Models while avoiding initialization errors
    //Notes: Realizing I needed this took me way too long :(

    //This section defines a One-to-Many association between Users and Data
    //Makes the owner column in Data a foreign from Users
    tables.Users.hasMany(tables.Data, {
        foreignKey: 'owner_id',
        sourceKey: 'profile_id',
    });

    //Creates foreign key "owner_id" from User's "user_id"
    tables.Data.belongsTo(
        tables.Users,
        {
            foreignKey: "owner_id",
            targetKey: "profile_id",
            allowNull: true,
        },
        {
            timestamps: false,
        }
    );

}
