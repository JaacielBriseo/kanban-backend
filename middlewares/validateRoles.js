const { response, request } = require('express');

const isAdminRole = (req = request, res = response, next) => {
	if (!req.user) {
		return res.status(500).json({
			ok: false,
			msg: 'Validate token first.',
		});
	}
	const { role, name } = req.user;
	if (role !== 'ADMIN_ROLE') {
		return res.status(401).json({
			ok: false,
			msg: `${name} is not admin - Doesnt have permission to do this.`,
		});
	}
	next();
};
const hasRole = (...roles) => {
	return (req = request, res = response, next) => {
		if (!req.user) {
			return res.status(500).json({
				ok: false,
				msg: 'Validate token first.',
			});
		}
		if (!roles.includes(req.user.role)) {
			return res.status(401).json({
				ok: false,
				msg: `This services requires ${roles}`,
			});
		}
		next();
	};
};

module.exports = {
	isAdminRole,
	hasRole,
};
