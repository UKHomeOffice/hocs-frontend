const logger = require('../libs/logger');

class user {
    constructor({ token, id, email, username, roles, groups }) {
        this.token = token;
        this.id = id;
        this.email = email;
        this.username = username;
        this.roles = roles ? roles.toUpperCase().split(',').map(p => p.trim()) : [];
        this.groups = groups ? groups.toUpperCase().split(',').map(g => g.trim()) : [];
        logger.info({event: 'DEBUG', roles, groups});
    }

    static hasRole(user, role) {
        return user.roles.includes(role);
    }

    static hasGroup(user, group) {
        return user.groups.includes(group);
    }
}

module.exports = user;
