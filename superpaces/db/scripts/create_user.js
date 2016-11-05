use admin;
db.dropAllUsers();
db.createUser({
    user: 'admin',
    pwd: 'admin',
    roles: [{
        role: "root",
        db: "admin"
    }]
});

use superpaces;
db.dropAllUsers();
db.createUser({
    user: 'superpaces',
    pwd: 'superpaces',
    roles: [{
        role: "readWrite",
        db: "superpaces"
    }]
});