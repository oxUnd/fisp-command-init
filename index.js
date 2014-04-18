/**
 * fis.baidu.com
 */

'use strict';
var os = require('os');
var spawn = require('child_process').spawn;

var path = require('path');

fis.scaffold = require('./lib/scaffold.js');

exports.name = 'init';
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
                    if (typeof(cmd) == 'undefined') {
                        init_env();
                        return;
                    }
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

//安装fis-conf.js里面配置的插件
function init_env() {
    var conf = get_conf();
    if (conf) {
        //只获取用户配置文件中的插件
        fis.config.set('modules', {});
        require(conf);
        var modules = fis.config.get('modules');
        var requires = [];
        fis.util.map(modules, function (type, info) {
            if (['parser', 'preprocessor', 'postprocessor', 'test', 'lint', 'optimizer'].indexOf(type) != -1) {
                fis.util.map(info, function (ext, reqs) {
                    requires = fis.util.merge(requires, get_reqs(type, reqs));
                });
            } else if (['prepackager', 'packager', 'postpackager', 'spriter'].indexOf(type) != -1) {
                var reqs = info;
                requires = fis.util.merge(requires, get_reqs(type, reqs));
            }
        });
        var need_install = check_env(requires);
        for (var i = 0, len = need_install.length; i < len; i++) {
            //npm 安装需要的插件
            npm_install(need_install[i]);
        }
    }
}

function check_env(requires) {
    var need = [];
    for (var i = 0, len = requires.length; i < len; i++) {
        try {
            require(requires[i]);
        } catch (e) {
            need.push(requires[i]);
        }
    }
    return need;
}

function get_reqs(type, reqs) {
    if (fis.util.is(reqs, 'String')) {
        reqs = reqs.split(',');
    }

    var requires = [];

    for (var i = 0, len = reqs.length; i < len; i++) {
        requires.push('fis-'+type+'-'+reqs[i]);
    }

    return requires;
}

//获取fis-conf.js
function get_conf() {
    var root = fis.util.realpath(process.cwd()), filename="fis-conf.js", conf;

    //try to find fis-conf.js
    var cwd = root, pos = cwd.length;
    do {
        cwd  = cwd.substring(0, pos);
        conf = cwd + '/' + filename;
        if(fis.util.exists(conf)){
            root = cwd;
            break;
        } else {
            conf = false;
            pos = cwd.lastIndexOf('/');
        }
    } while(pos > 0);

    return conf;
}

function npm_install(comp) {

    var cmd = os.platform == 'win32' ? 'npm.cmd' : 'npm';

    var npm = spawn(cmd, ['install', comp, '-g'], {detach: true});

    npm.stderr.on('data', function (chunk) {
        process.stdout.write(chunk.toString());
    });

}