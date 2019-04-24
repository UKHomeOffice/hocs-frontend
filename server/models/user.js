class user {
    constructor({ id, email, username, roles, groups, uuid }) {
        this.id = '968672ca-9fc1-491c-b2b9-d13c58b12d7a';
        this.email = email;
        this.username = username;
        this.roles = roles ? roles.split(',').map(p => p.trim()) : [];
        this.groups = groups ? groups.split(',').map(g => g.trim()) : [];
        this.uuid = '968672ca-9fc1-491c-b2b9-d13c58b12d7a';
    }

    static hasRole(user, role) {
        return user.roles.includes(role);
    }

    static hasGroup(user, group) {
        return user.groups.includes(group);
    }

    static createHeaders(user) {
        return {
            'X-Auth-UserId': '968672ca-9fc1-491c-b2b9-d13c58b12d7a',
            'X-Auth-Roles': user.roles.join(),
            'X-Auth-Groups': user.groups.join()
        };
    }
}

module.exports = user;
