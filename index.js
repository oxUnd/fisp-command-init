/**
 * fis.baidu.com
 */

'use strict';

fis.scaffold = require('./lib/scaffold.js');

exports.name = 'scf';
exports.desc = 'A awesome scaffold of fis';
exports.register = function(commander) {
    commander
        .option('-s, --scaffold <scaffold>', '', String, 'pc')
        .option('-d, --dir <name>', 'create to dir', require('path').resolve, process.cwd())
        .option('--with-plugin', 'if create a module, whether include `plugin`', Boolean, false)
        .action(function () {
            var args = Array.prototype.slice.call(arguments);
            var options = args.pop();
            var cmd = args.shift();

            var generator_handle = fis.require('scaffold', options.scaffold)(options);

            switch(cmd) {
                case 'module':
                    generator_handle.module();
                    break;
                case 'widget':
                    generator_handle.widget();
                    break;
                default:
                    fis.scaffold.download(cmd, options.dir);
                    break;
            }
        });

    commander
        .command('module')
        .description('create a module');

    commander
        .command('widget')
        .description('create a widget');        
};