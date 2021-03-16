// Sort Function
let sort_by;

(function() {
    // utility functions
    var default_cmp = function(a, b) {
        if (a===b) return 0;
        return a < b ? -1 : 1;
    },
    getCmpFunc = function(primer, reverse) {
        var cmp = default_cmp;
        if (primer) {
            cmp = function(a, b) {
                return default_cmp(primer(a), primer(b));
            };
        }
        if (reverse) {
            return function(a, b) {
                return -1 * cmp(a, b);
            };
        }
        return cmp;
    };

    // actual implementation
    sort_by = function() {
        var fields = [],
            n_fields = arguments.length,
            field, name, cmp;
            // field, name, reverse, cmp;

        // preprocess sorting options
        for (var i = 0; i < n_fields; i++) {
            field = arguments[i];
            if (typeof field === 'string') {
                name = field;
                cmp = default_cmp;
            } else {
                name = field.name;
                cmp = getCmpFunc(field.primer, field.reverse);
            }

            fields.push({
                name: name,
                cmp: cmp
            });
        }

        return function(A, B) {
            var name, cmp, result;
            // var a, b, name, cmp, result;
            for (var i = 0, l = n_fields; i < l; i++) {
                result = 0;
                field  = fields[i];
                name   = field.name;
                cmp    = field.cmp;

                result = cmp(A[name], B[name]);
                if (result !== 0) break;
            }
            return result;
        }
    }
}());

module.exports = sort_by;