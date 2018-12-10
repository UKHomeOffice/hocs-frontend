const logger = require('../libs/logger');

class user {
    constructor({ id, email, username, roles, groups, uuid }) {
        this.id = id;
        this.email = email;
        this.username = username;
        this.roles = roles ? roles.toUpperCase().split(',').map(p => p.trim()) : [];
        this.groups = groups ? groups.toUpperCase().split(',').map(g => g.trim()) : [];
        this.uuid = uuid;
        logger.info({ event: 'DEBUG', roles, groups, uuid });
    }

    static hasRole(user, role) {
        return user.roles.includes(role);
    }

    static hasGroup(user, group) {
        return user.groups.includes(group);
    }

    static createHeaders(user) {
        return {
            'X-Auth-UserId': user.id,
            'X-Auth-Roles': user.roles.join(),
            'X-Auth-Groups': user.groups.join()
        };
    }
}

module.exports = user;
