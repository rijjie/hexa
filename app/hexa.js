'use strict';

var App = {

	init: function init() {

		var DEFAULT_DICES_NUMBER = 8; // valeur par défaut, moyenne d'une main
		var hexa_nb_succes;
		var hexa_detail_lancer;
		var ns = new Nonsense();
		var nb_des = DEFAULT_DICES_NUMBER;
		var el_output = document.getElementById('output');
		var el_hexa_detail_lancer = document.getElementById('hexa_detail_lancer');
		var el_hexa_lancer = document.getElementById('hexa_lancer');
		var el_hexa_nb_succes = document.getElementById('hexa_nb_succes');
		var el_hexa_nb_des = document.getElementById('hexa_nb_des');
		var el_hexa_moins = document.getElementById('hexa_moins');
		var el_hexa_plus = document.getElementById('hexa_plus');

		function lancer_un_de(nb_relance) {

			if (undefined === nb_relance)
				nb_relance = 0;

			if (!hexa_detail_lancer[nb_relance]) {
				hexa_detail_lancer[nb_relance] = [];
			}

			// var de = Math.floor((Math.random() * 6) + 1);
			var de = ns.integerInRange(1,7);
			if(7 === de) de = 6;

			hexa_detail_lancer[nb_relance][hexa_detail_lancer[nb_relance].length] = de;

			if (2 < de) {
				hexa_nb_succes++;
			}

			if (6 === de) {
				lancer_un_de(nb_relance + 1);
			}

			return de;
		}

		function lancer_les_des(e) {

			if (undefined !== e)
				e.preventDefault();

			var html = '';

			hexa_nb_succes = 0;
			hexa_detail_lancer = [];

			for (i = 1; i <= nb_des; i++) {
				lancer_un_de();
			}

			for (var i = 0, l = hexa_detail_lancer.length; i < l; i++) {
				if (0 === i) html += '<span class="detail_lancer_texte">1<sup>er</sup> lancer</span>';
				else html += '<span class="detail_lancer_texte">relance</span>';

				for (var j = 0; j < hexa_detail_lancer[i].length; j++) {
					if (2 < hexa_detail_lancer[i][j])
						html += '<b>' + hexa_detail_lancer[i][j] + '</b>';
					else
						html += hexa_detail_lancer[i][j];
					html += ' ';
				}

				html += '<br />';
			}

			el_output.style.visibility = 'visible';
			el_hexa_detail_lancer.innerHTML = html;

			el_hexa_lancer.style.opacity = 0;
			el_output.style.opacity = 0;
			fade();

			el_hexa_nb_succes.innerHTML = hexa_nb_succes;
		}

		function fade() {

			var o = parseFloat(el_output.style.opacity);
			o += 0.1;
			el_output.style.opacity = o;
			el_hexa_lancer.style.opacity = o * 2;

			if (o <= 1)
				setTimeout(fade, 40);
		}

		el_hexa_nb_des.innerHTML = nb_des;

		function click_on_moins(e) {
			e.preventDefault();
			nb_des--;
			el_hexa_nb_des.innerHTML = nb_des;
		}

		function click_on_plus(e) {
			e.preventDefault();
			nb_des++;
			el_hexa_nb_des.innerHTML = nb_des;
		}

		el_hexa_moins.addEventListener('touchstart', click_on_moins);
		el_hexa_moins.addEventListener('mousedown', click_on_moins);
		el_hexa_moins.addEventListener('MSPointerDown', click_on_moins);

		el_hexa_plus.addEventListener('touchstart', click_on_plus);
		el_hexa_plus.addEventListener('mousedown', click_on_plus);
		el_hexa_plus.addEventListener('MSPointerDown', click_on_plus);

		el_hexa_lancer.addEventListener('touchstart', lancer_les_des);
		el_hexa_lancer.addEventListener('mousedown', lancer_les_des);
		el_hexa_lancer.addEventListener('MSPointerDown', lancer_les_des);

		if (window.applicationCache) {
		  window.applicationCache.addEventListener('updateready', function() {
		      if (confirm('Une nouvelle version de cette application est disponible. \rSouhaitez-vous la charger dès maintenant ?')) {
		          window.location.reload();
		      }
		  });
		}

		addToHomescreen({
			skipFirstVisit: true,
			maxDisplayCount: 2
		});
	}
};

module.exports = App;
