/*jslint node: true */
module.exports = (function () {
	'use strict';

	var /**
		 *	@property Object nconf Instance du module nconf.
		 */
		nconf = require('nconf'),

		/**
		 *	@property Object logger Instance du logger.
		 */
		logger = null,

		/**
		 *	Chargement des configuration dans l'ordre de préférence.
		 *	Dans l'ordre:
		 *	1. Paramètres console
		 *	2. Variables d'environnement
		 *	3. Fichier de configuration (défaut: config.json)
		 *	4. Valeures par défaut
		 *
		 *	@param Object config Tableau de configuration.
		 *			{logger}: Instance de log
		 *	@returns this
		 */
		load = function (config) {
			config = config || {};
			logger = config.logger || null;

			if (logger) {
				logger.info('Chargement du module de configuration');
			}

			/**
			 *	Paramètres console et variables d'environnement.
			 */
			nconf.argv().env();

			/**
			 *	Définit le fichier de config par défaut, si aucun fournis par avant.
			 */
			if (!nconf.get('config_file')) {
				nconf.defaults({'config_file': 'config.json'});
			}

			/**
			 *	Lecture de la configuration de l'utilisateur (Fichier fournis ou config.json).
			 */
			nconf.add('user', {
				type: 'file',
				file: nconf.get('config_file')
			});

			/**
			 *	Configuration global, ou par défaut: defaults.json.
			 */
			nconf.add('global', {
				type: 'file',
				file: 'defaults.json'
			});

			if (logger !== null) {
				logger.info('Configuration chargée');
			}

			return this;
		},

		/**
		 *	Récupère une valeure de configuration par sa clef.
		 *
		 *	@param String Clef
		 *	@returns La valeure
		 */
		get = function (key) {
			var value = nconf.get(key);
			if (logger) {
				logger.debug({config_value: value}, 'Get: "%s"', key);
			}

			return value;
		};

	/**
	 *	Expisition des attributs publiques.
	 */
	return {
		load:		load,
		get:		get
	};
}());
