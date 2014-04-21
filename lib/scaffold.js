/**
 * fis.baidu.com
 */

var path = require('path');
var querystring = require('querystring');

module.exports = {
    //download a package from lightjs.duapp.com
    download: function(m, dist, options, cb) {
        var _url = options.url || 'http://lightjs.duapp.com';
        var Client = require('fis-repo-client');
        var handle = new Client(_url);

        var comp = {
            name: m,
            version: 'latest'
        };

        var cur = process.cwd();

        options = fis.util.merge({
            include: /.*/i,
            exclude: /package\.json|README\.md/i
        }, options||{});

        var that = this;
        
        handle.install(cur, comp, {deps: true, overwrite: true}, function (err, installed) {
            if (err) {
                fis.log.error(err);
                return;
            }
            var paths = [];
            for (var i = 0, len = installed.length; i < len; i++) {
                var tmp_dir = path.resolve(cur, installed[i].name);
                var dist_dir = path.resolve(dist, installed[i].name);
                if (tmp_dir != dist_dir) {
                    that.mv(tmp_dir, dist_dir, null, options.exclude);
                } else {
                    fis.util.del(tmp_dir, options.exclude);
                }
                paths.push(dist_dir);
            }
            
            cb && cb(paths);
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
    },
    mv: function (source, dist, include, exclude) {
        fis.util.copy(source, dist, include, exclude);
        fis.util.del(source);
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