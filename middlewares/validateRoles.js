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

module.exports = {
	isAdminRole,
};
