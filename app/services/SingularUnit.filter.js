/**
 * @author Christian Matyas
 * 
 * Filter for units that return the singular form if the value is 1 and the singular form is available
 */

/*globals angular:true*/
;(function(){
    angular.module('biloAtlas')
    .filter('singularUnit', function() { 
        
        var units = {}
        units['Personen'] = 'Person  '
        units['Hochschulen'] = 'Hochschule '
        units['Schulen'] = 'Schule'
        units['Jahre'] = 'Jahr'

        return function(unit, value) {
            if(value == 1){
                if(units[unit.trim()] === undefined) return unit
                return units[unit.trim()]
            }

            return unit
        }
    })
})()
