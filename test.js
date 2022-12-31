/*
(function ($, window, undefined) {
    "use strict"; 
    $.fn.cleave = function (opts) { 
        var defaults = { autoUnmask: !1 
        }, 
    options = $.extend(defaults, opts || {}); 
    return this.each(function () { var cleave = new Cleave("#" + this.id, options), $this = $(this); $this.data("cleave-auto-unmask", options.autoUnmask); $this.data("cleave", cleave) }) 
    }; 
    
    var origGetHook, origSetHook; 
    if ($.valHooks.input) { 
        origGetHook = $.valHooks.input.get; 
        origSetHook = $.valHooks.input.set } 
    else { $.valHooks.input = {} }
    $.valHooks.input.get = function (el) { 
        var $el = $(el), cleave = $el.data("cleave"); 
        if (cleave) { 
            return $el.data("cleave-auto-unmask") ? cleave.getRawValue() : el.value 
        } else if (origGetHook) { 
            return origGetHook(el) 
        } else { return undefined } 
    }; 
    $.valHooks.input.set = function (el, val) { 
        var $el = $(el), cleave = $el.data("cleave"); 
        if (cleave) { 
            cleave.setRawValue(val); 
            return $el 
        } else if (origSetHook) { 
            return origSetHook(el) 
        } else { return undefined } 
    }})(jQuery, window); 

jQuery(function () { jQuery(".form_revenus input").cleave({ numeral: !0, numeralThousandsGroupStyle: "thousand", delimiter: " " }) }); jQuery(function () { jQuery(".form_revenus input, .form_revenus select").on("change", updateRevenus); jQuery(".form_compo input").on("change", updateCompo); jQuery("#total_revenus, #nb_unit").on("change", updatePouvoir); if (lfpt_localize.is_local) { updateCompo(); updateRevenus(); updatePouvoir(); NiveauDeVieCalc(); $("#Budgetdiv").show() } }); function updateRevenus() { jQuery("#total_revenu").text("0"); jQuery(".form_revenus tr:not(.header, .total)").each(function () { var val = jQuery(this).find("input").val().replace(/[^\d]/g, "") * jQuery(this).find("select").val(); jQuery("#total_revenu").text((parseInt(jQuery("#total_revenu").text().replace(/[^\d]/g, "")) + val).toLocaleString("fr-FR")).parent().show() }); updatePouvoir() }
function updateCompo() {
    var nb_units = 0; var nb_adults = parseInt(jQuery("#nb_parents").val()); if (nb_adults > 1) { nb_units++; nb_units += (nb_adults - 1) * 0.5 } else { if (nb_adults == 1) { nb_units++ } }
    nb_units += parseInt(jQuery("#nb_child_over_14").val()) * 0.5; nb_units += parseInt(jQuery("#nb_child_under_14").val()) * 0.3; jQuery("#nb_unit").text(nb_units.toLocaleString("fr-FR")); updatePouvoir()
}
function updatePouvoir() { var revenu = jQuery("#total_revenu").text().replace(/[^\d]/g, ""); var compo = jQuery("#nb_unit").text().replace(/,/, "."); if (revenu && compo) { jQuery("#pouvoir_achat, #pouvoir_achat_title").text(parseInt((revenu / compo).toFixed(0)).toLocaleString("fr-FR")).parent().show() } else { jQuery("#pouvoir_achat").parent().hide() } }
var myChart; function NiveauDeVieCalc() {
    updateCompo(); updateRevenus(); updatePouvoir(); if (parseInt(jQuery("#total_revenu").text().replace(/[^\d]/g, "")) > 999999) { alert("Etes-vous sur de vos revenus ? Notre calculateur fonctionne pour un revenu de 999 999 € annuel maximum, soit plus de 99 % de la population."); return !1 }
    if (parseInt(jQuery("#nb_unit").text().replace(/[^\d]/g, "")) < 1) { alert("Merci de renseigner la composition familiale de votre foyer."); return !1 }
    $("#Budgetdiv").hide(); var pouvoir_achat = parseInt(jQuery("#pouvoir_achat").text().replace(/[^\d]/g, "")); var niveau_de_vie = null; var labels = []; var data = []; var data_point = []; var colors = []; for (var i = 0; i <= 100; i++) { labels[i] = i + "%"; data[i] = null; data_point[i] = null }
    for (var i = 0; i < niveaux_de_vie.length; i++) { if (niveaux_de_vie[i]) { niveau_de_vie = niveaux_de_vie[i]; niveau_de_vie_idx = i; colors.push("#49728f"); labels[niveau_de_vie[0]] = niveau_de_vie[0] + " %"; data[niveau_de_vie[0]] = niveau_de_vie[1] } }
    var found = (data_point_x = !1); for (var i = 0; i < 23; i++) { niveau_de_vie = niveaux_de_vie[i]; if (pouvoir_achat < niveaux_de_vie[i][1]) { colors[i] = "#cacd26"; data_point_x = Math.ceil(((pouvoir_achat - niveaux_de_vie[i - 1][1]) / (niveaux_de_vie[i][1] - niveaux_de_vie[i - 1][1])) * (niveaux_de_vie[i][0] - niveaux_de_vie[i - 1][0])) + niveaux_de_vie[i - 1][0]; found = i; break } }
    if (!found) {
        if (pouvoir_achat > niveaux_de_vie[22][1]) { var pct = 100 } else { var pct = Math.round(((pouvoir_achat - niveaux_de_vie[21][1]) / (niveaux_de_vie[22][1] - niveaux_de_vie[21][1])) * 5) + 95 }
        var tmp = { 99: niveaux_de_vie[21][1], 100: niveaux_de_vie[22][1] }; tmp[pct] = pouvoir_achat; data_point_x = pct; data[pct] = pouvoir_achat; if (niveaux_de_vie[niveaux_de_vie.length - 1][0] != 100) { for (var i = 99; i < 100; i++) { data[i] = null; data_point[i] = null } }
        found = pct
    }
    data_point[data_point_x] = pouvoir_achat; delete data[data.length - 1]; jQuery("#Advicemsg p a").html(niveau_de_vie[2]).attr("href", niveau_de_vie[3]); var ctx = document.getElementById("chart").getContext("2d"); if (myChart) myChart.destroy(); myChart = new Chart(ctx, {
        type: "line", data: {
            labels: labels, datasets: [{ data: data, fill: !1, borderColor: "rgba(0, 0, 0, 0.25)", xAxisID: "A", datalabels: { display: !1 } }, {
                data: data_point, pointBackgroundColor: "#D2D82F", pointBorderColor: "#00000", pointBorderWidth: 1, pointHitRadius: 5, pointRadius: 5, fill: !1, xAxisID: "B", datalabels: {
                    color: "#FFF", backgroundColor: "#312F2F", borderRadius: 5, font: { size: 13, weight: "bold" }, textAlign: "center", align: function (context) { if (context.dataIndex > 90) return 180; if (context.dataIndex > 75) return 225; if (context.dataIndex > 15) return 269; return 290 }, offset: function (context) { if (context.dataIndex > 30) return 25; return 40 }, formatter: function (value, context) {
                        console.log(value, context); var pct = context.dataIndex; if (pct <= 50)
                            return (100 - pct + " % des Français ont \nun niveau de vie supérieur au vôtre"); if (pct > 50)
                            return (pct + " % des Français ont \nun niveau de vie inférieur au vôtre"); return value
                    }
                }
            }]
        }, options: {
            title: { display: !1, text: "Niveau de vie de chaque membre de votre ménage" }, legend: { display: !1 }, spanGaps: !0, responsive: !0, maintainAspectRatio: !1, aspectRatio: 16 / 9, scaleShowValues: !0, tooltips: { mode: "label" }, tooltips: {
                mode: "nearest", intersect: !0, titleFontSize: 13, titleFontStyle: "bold", filter: function (tooltip, data) { if (tooltip.index == data_point_x) return; return tooltip }, callbacks: {
                    label: function (tooltipItem, data) {
                        if (tooltipItem[0] && tooltipItem[0].datasetIndex == 1) { return tooltipItem.yLabel.toLocaleString("fr-FR") + " €" }
                        return null
                    }, title: function (tooltipItem, data) {
                        if (!tooltipItem[0]) return; var pct = tooltipItem[0].index; if (tooltipItem[0].datasetIndex == 1) {
                            if (pct <= 50)
                                return (100 - pct + " % des ménages ont \nun niveau de vie supérieur au vôtre"); if (pct > 50)
                                return (pct + " % des ménages ont \nun niveau de vie inférieur au vôtre")
                        }
                        if (pct >= 50)
                            return (pct + " % des Français ont \nun niveau de vie < " + tooltipItem[0].yLabel.toLocaleString("fr-FR") + " €"); if (pct < 50)
                            return (100 - pct + " % des Français ont \nun niveau de vie > " + tooltipItem[0].yLabel.toLocaleString("fr-FR") + " €")
                    }
                }
            }, scales: { yAxes: [{ type: "linear", ticks: { userCallback: function (tick) { return tick.toLocaleString("fr-FR") + " €" }, suggestedMax: pouvoir_achat * 1.1 }, scaleLabel: { labelString: "Niveau de vie de chaque membre de votre ménage", display: !0 } }], xAxes: [{ id: "A", scaleLabel: { display: !0, labelString: "Répartition de la population des plus modestes aux plus aisés" }, position: "bottom", ticks: { maxTicksLimit: 10, min: 0, max: 100, stepSize: 5 } }, { id: "B", display: !1, gridLines: { drawOnChartArea: !1 }, scaleLabel: { display: !0, labelString: "Répartition de la population des plus modestes aux plus aisés" }, position: "top" }] }
        }
    }); $("#Resultsdiv").show()
}
var niveaux_de_vie = [[0, 0, "Vous avez certainement besoin d’aide. Notre dossier sur les aides financières et sociales est là pour vous aider", "https://www.lafinancepourtous.com/pratique/vie-perso/aides-financieres-et-sociales/"], [5, 9090, "Certaines aides sociales pourraient vous aider.Par exemple des aides au logement", "https://www.lafinancepourtous.com/pratique/vie-perso/aides-financieres-et-sociales/logement/les-aides-de-la-caf/"], [10, 11190, "Notre article pour Mieux gérer son budget peut sans doute vous éviter des fins de mois trop difficiles", "https://www.lafinancepourtous.com/pratique/vie-perso/etablir-son-budget/mieux-gerer-son-budget/"], [15, 12710, "Un peu d’aide pour compléter vos revenus pourrait s’avérer utile. Notre dossier comporte quelques pistes", "https://www.lafinancepourtous.com/pratique/vie-perso/aides-financieres-et-sociales/emploi-chomage/"], [20, 14060, "Notre article Réduire ses dépenses peut vous permettre d'être un peu plus à l'aise avec votre budget", "https://www.lafinancepourtous.com/pratique/vie-perso/etablir-son-budget/reduire-ses-depenses/"], [25, 15290, "Si vous êtes chômeur, ce dossier est fait pour vous aider", "https://www.lafinancepourtous.com/pratique/vie-pro/chomage/"], [30, 16450, "Pourquoi ne pas commencer à mettre quelques sous de côté ? Les livrets réglementés sont un bon début pour y parvenir", "https://www.lafinancepourtous.com/pratique/placements/livrets-reglementes/"], [35, 17530, "Suis-je bien assuré en cas de coup dur ? Consultez ce dossier pour bien choisir votre contrat d’assurance", "https://www.lafinancepourtous.com/pratique/assurance/choisir-son-contrat-d-assurance/"], [40, 18610, "Et si je commençais à épargner pour m'acheter ma maison ? Notre article sur l'Epargne logement peut vous aider à vous orienter", "https://www.lafinancepourtous.com/pratique/placements/epargne-logement/"], [45, 19700, "Peut-être pensez-vous à emprunter pour un projet ? Attention cependant à faire les bons choix", "https://www.lafinancepourtous.com/pratique/credit/souscrire-un-credit/quelques-conseils-de-base-avant-demprunter/"], [50, 20820, "Je peux peut-être envisager d'acheter ma maison ? Mais entre acheter ou louer quel est le plus pertinent ? Notre réponse en image", "https://www.lafinancepourtous.com/pratique/immobilier/acheter-sa-residence-principale-ou-secondaire/acheter-ou-louer/"], [55, 21970, "J’ai un peu d’argent à placer. Quelles sont les bonnes questions à me poser avant de faire mon choix ? Des éléments de réponse dans ce dossier", "https://www.lafinancepourtous.com/pratique/placements/les-questions-clefs-avant-d-investir/"], [60, 23230, "Mon conseiller financier me propose d'épargner sur une assurance vie. Est-ce une bonne idée ? Retrouvez tous nos articles sur l'assurance vie", "https://www.lafinancepourtous.com/pratique/placements/assurance-vie/"], [65, 24630, "Un crédit à la consommation pour me faire plaisir, est-ce une bonne idée ? ", "https://www.lafinancepourtous.com/pratique/credit/credit-a-la-consommation/le-credit-a-la-consommation/"], [70, 26140, "J'ai reçu ma feuille d'impôt. Je ne m'y retrouve pas bien. Retrouvez notre article L'impôt sur le revenu.", "https://www.lafinancepourtous.com/pratique/impots/"], [75, 27940, "Je bénéficie de l’épargne salariale ? Comment la gérer au mieux ? Quelques éléments de réponse", "https://www.lafinancepourtous.com/pratique/vie-pro/epargne-salariale-2/la-gestion-de-mon-epargne/"], [80, 30270, "Et si j'épargnais un peu dans la finance durable ? Voici nos articles sur une finance pas comme les autres", "https://www.lafinancepourtous.com/pratique/placements/finance-durable/"], [85, 33500, "Quelques conseils dans ce dossier pour transmettre votre patrimoine", "https://www.lafinancepourtous.com/pratique/vie-perso/transmission-donation/"], [90, 38210, "Et si je diversifiais mon épargne en investissant sur les marchés boursiers ? Retrouvez nos articles sur les Produits de Gestion Collective", "https://www.lafinancepourtous.com/pratique/placements/produits-de-gestion-collective-opc/"], [95, 47650, "A quel barème de l'Impôt sur la Fortune Immobilière suis-je imposé ? Nos articles pour s'y retrouver dans l'IFI", "https://www.lafinancepourtous.com/pratique/impots/impot-sur-la-fortune-immobiliere-ifi/"], [99, 106210, "Et si je donnais une partie de ma fortune ? Tout savoir sur la fiscalité des dons dans ce dossier", "https://www.lafinancepourtous.com/pratique/impots/l-impot-sur-le-revenu/comment-diminuer-le-montant-de-son-impot-sur-le-revenu-en-toute-legalite/les-dons-pour-faire-rimer-generosite-et-fiscalite/"], [100, 1000000, "", ""]]; function RestorePage() { $("#Budgetdiv").show(); $("#Resultsdiv").hide() }
function checkNumeric(element) { if (isNaN(element.value) || element.value == "") { alert("Veuillez saisir uniquement des nombres."); element.value = 0; RestorePage() } }
*/