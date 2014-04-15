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
            fis.util.copy(tmp_dir, dist, options.include, options.exclude);
            fis.util.del(tmp_dir);
            cb && cb();
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