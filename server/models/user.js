class user {
    constructor({ id, email, username, roles, groups, uuid, tenant }) {
        this.id = id;
        this.email = email;
        this.username = username;
        this.roles = roles ? roles.split(',').map(p => p.trim()) : [];
        this.groups = groups ? groups.split(',').map(g => g.trim()) : [];
        this.uuid = uuid;
        this.tenant = tenant;
    }

    static hasRole(user, role) {
        return user.roles.includes(role);
    }

    static hasGroup(user, group) {
        return user.groups.includes(group);
    }

    static createHeaders(user) {
        return {
            'X-Auth-UserId': user.uuid,
            'X-Auth-Roles': user.roles.join(),
            'X-Auth-Groups': user.groups.join(),
            'X-Auth-Tenant': user.tenant
        };
    }
}

module.exports = user;
