/**
 * fis.baidu.com
 */

var http = require('http');
var url = require('url');
var querystring = require('querystring');

module.exports = {
    //download a package from lightjs.duapp.com
    download: function(m, dist, options, cb) {

        var _url = fis.config.get('scaffold.url') || 'http://lightjs.duapp.com';
        var Client = require('fis-repo-client');
        var handle = new Client(_url);

        var comp = {
            name: m,
            version: 'latest'
        };

        var dir = process.cwd();

        options = fis.util.merge({
            include: /.*/i,
            exclude: /package\.json/i
        }, options||{});

        handle.install(dir, comp, {}, function (err, log) {
            if (err) {
                fis.log.error(err);
                return;
            }
            var tmp_dir = dir + '/' + m;
            var deps_queue = {};
            var package_info = JSON.parse(fis.util.read(tmp_dir + '/package.json'));

            var deps = package_info['dependencies'];

            function next() {
                fis.util.copy(tmp_dir, dist, options.include, options.exclude);
                fis.util.del(tmp_dir);
                cb && cb();
            }

            if (!deps) {
                next();
            } else {
                var comper = '';
                fis.util.map(deps, function (comp, version) {
                    deps_queue[comp] = 0;
                    comper += '1';
                });
                
                comper = parseInt(comper);

                fis.util.map(deps, function (comp, version) {
                    handle.install(tmp_dir, {
                        name: comp,
                        version: version
                    }, {}, function () {
                        deps_queue[comp] = 1;
                        var pkg = JSON.parse(fis.util.read(tmp_dir + '/' + comp + '/package.json'));
                        
                        if (pkg['require_name']) {
                            //alias
                            fis.util.copy(tmp_dir+'/'+comp, tmp_dir+'/'+pkg['require_name']);
                            fis.util.del(tmp_dir+'/'+comp);
                        }

                        if (comper - parseInt(values(deps_queue)) == 0) {
                            next();
                        }
                    })
                });

            }

        });
    },
    
    prompt: function (dir, options) {
        var keyword_reg = options && options.keyword_reg || /\{\{-(\w*?)-\}\}/ig;
        var files = fis.util.find(dir);
        var prompts = {};
        var cache = {};

        fis.util.map(files, function (index, filepath) {
            var content = fis.util.fs.readFileSync(filepath, {
                encoding: 'utf8'
            });
            content.replace(keyword_reg, function(m, $1) {
                if (prompts[$1]) {
                    prompts[$1].push(filepath);
                } else {
                    prompts[$1] = [filepath];
                }
                return m;
            });
            cache[filepath] = content;
        });

        var prompt_handle = require('prompt');
        var opts = [];
        fis.util.map(prompts, function (k, v) {
            opts.push({
                name: k,
                required: true
            });
        });

        prompt_handle.start();
        prompt_handle.get(opts, function (err, result) {
            fis.util.map(result, function (k, v) {
                var process_files = prompts[k];
                fis.util.map(process_files, function (index, filepath) {
                    var con = cache[filepath].replace(keyword_reg, function (m, $1) {
                        if ($1 == k) {
                            m = v;
                        }
                        return m;
                    });

                    fis.util.fs.writeFileSync(filepath, con);
                    
                    cache[filepath] = con;
                });
            });
        });
    }
};


function values(o) {
    var vals = [];
    for (var i in o) {
        if (o.hasOwnProperty(i)) {
            vals.push(o[i]);
        }
    }
    return vals;
}