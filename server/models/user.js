class user {
    constructor({token, id, email, username, roles, groups}) {
        this.token = token;
        this.id = id;
        this.email = email;
        this.username = username;
        this.roles = roles ? roles.split(',') : [];
        this.groups = groups ? groups.split(',') : [];
    }

    static hasRole(user, role) {
        return user.roles.includes(role);
    }

    static hasGroup(user, group) {
        return user.groups.includes(group);
    }
}

module.exports = user;