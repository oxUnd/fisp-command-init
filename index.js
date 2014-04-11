/**
 * fis.baidu.com
 */

'use strict';

fis.scaffold = require('./lib/scaffold.js');

exports.name = 'scf';
exports.desc = 'A awesome scaffold of fis';
exports.register = function(commander) {
    var info = commander.parse(process.argv);
    var argv = info.args;

    var command = argv[1];

    function outputHelp() {
        console.log(
            'Please choose a generator below.\n\n'+
            'pc\n'+
            '  pc:module\n'+
            '  pc:widget\n'
        );
    }

    if (fis.util.is(command, 'String')) {
        //scf module
        //scf specail:module
        var p = command.indexOf(':');
        var type = '';
        var help = false;
        if (p != -1) {
            type = command.substr(p+1);
            command = command.substr(0, p);
        } else {
            help = true;
        }

        var scaffold = fis.require('scaffold', command);

        if (help) {
            console.log(scaffold.help());
        } else {
            scaffold(type, process.argv);
        }

    } else {
        outputHelp();
    }
};