(function(){
/**
 * ╭─╮ ┬ ┬   ╭─╮    ┬ ╭─╮ ╭─╮ ╭╮╭ ╭─╮
 * ├┤  │ │   ├┤     │ │   │ │ │││ ╰─╮
 * ┴   ┴ ┴─╯ ╰─╯    ┴ ╰─╯ ╰─╯ ╯╰╯ ╰─╯
 * File specific icons for the browser
 * from Atom File-icons, https://github.com/file-icons/atom
 *
 * @link      https://github.com/file-icons/atom
 * @author    Daniel Brooker, <dan@nocturnalcode.com>
 * @author    Adnan M.Sagar, <adnan@websemantics.ca>
 */

;(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], function() { return (root.FileIcons = factory()) })
    } else if (typeof module === 'object' && module.exports) { module.exports = factory()
    } else { root.FileIcons = factory() }
}(this, function() {

    var root = this || global
    var cache = {
        directoryName: {},
        directoryPath: {},
        fileName: {},
        filePath: {},
        interpreter: {},
        scope: {},
        language: {},
        signature: {}
    }

    /* ---------------------------------------------------------------------------
     * Icon
     * ------------------------------------------------------------------------- */

    /**
     * Create Icon instance
     *
     * @param {Number}  index - Index of the icon's appearance in the enclosing array
     * @param {Array}   data - icon's data points that contains the following,
     *
     * @property {Icon} icon - Icon's CSS class (e.g., "js-icon")
     * @property {Array} colour - Icon's colour classes
     * @property {RegExp} match - Pattern for matching names or pathnames
     * @property {Numeric} [priority=1] -  priority that determined icon's order of appearance
     * @property {Boolean} [matchPath=false] - Match against system path instead of basename
     * @property {RegExp} [interpreter=null] -  to match executable names in hashbangs
     * @property {RegExp} [scope=null] -  to match grammar scope-names
     * @property {RegExp} [lang=null] -  to match alias patterns
     * @property {RegExp} [sig=null] -  to match file signatures
     *
     * @constructor
     */

    var Icon = function(index, data) {
        this.index = index
        this.icon = data[0]
        this.colour = data[1]
        this.match = data[2]
        this.priority = data[3] || 1
        this.matchPath = data[4] || false
        this.interpreter = data[5] || null
        this.scope = data[6] || null
        this.lang = data[7] || null
        this.signature = data[8] || null
    }

    /**
  	 * Return the CSS classes for displaying the icon.
  	 *
  	 * @param {Number|null} colourMode
  	 * @param {Boolean} asArray
  	 * @return {String}
  	 */

    Icon.prototype.getClass = function(colourMode, asArray) {

        colourMode = colourMode !== undefined ? colourMode : null
        asArray = asArray !== undefined ? asArray  : false

        // No colour needed or available
        if (colourMode === null || this.colour[0] === null)
            return asArray ? [this.icon] : this.icon

        return asArray
            ? [this.icon, this.colour[colourMode]]
            : this.icon + " " + this.colour[colourMode]
    }

    /* ---------------------------------------------------------------------------
     * IconTables
     * ------------------------------------------------------------------------- */

    /**
     * Create IconTables instance
     *
     * @param {Array}   data - Icons database
     *
     * @property {Array} directoryIcons - Icons to match directory-type resources.
     * @property {Array} fileIcons      - Icons to match file resources.
     * @property {Icon}  binaryIcon     - Icon for binary files.
     * @property {Icon}  executableIcon - Icon for executables.
     * @class
     * @constructor
     */

    var IconTables = function(data) {
        this.directoryIcons = this.read(data[0])
        this.fileIcons = this.read(data[1])
        this.binaryIcon = this.matchScope("source.asm")
        this.executableIcon = this.matchInterpreter("bash")
    }

    /**
     * Populate icon-lists from a icons data table.
     *
     * @param {Array} table
     * @return {Object}
     * @private
     */

    IconTables.prototype.read = function(table) {

        var icons = table[0]
        var indexes = table[1]

        icons = icons.map(function(icon, index) {
            return new Icon(index, icon)
        })

        // Dereference Icon instances from their stored offset
        indexes = indexes.map(function(index) {
            return index.map(function(offset) {
                return icons[offset]
            })
        })

        return {
            byName: icons,
            byInterpreter: indexes[0],
            byLanguage: indexes[1],
            byPath: indexes[2],
            byScope: indexes[3],
            bySignature: indexes[4]
        }
    }

    /**
     * Match an icon using a resource's basename.
     *
     * @param {String} name - Name of filesystem entity
     * @param {Boolean} [directory=false] - Match folders instead of files
     * @return {Icon}
     */
    IconTables.prototype.matchName = function(name, directory) {

        directory = directory !== undefined
            ? directory
            : false
        var cachedIcons = directory
            ? this.cache.directoryName
            : cache.fileName
        var icons = directory
            ? this.directoryIcons.byName
            : this.fileIcons.byName

        if (cachedIcons[name]) {
            return cachedIcons[name]
        }

        for (var i in icons) {
            var icon = icons[i]
            if (icon.match.test(name)) {
                return cachedIcons[name] = icon
            }
        }
        return null
    }

    /**
     * Match an icon using a resource's system path.
     *
     * @param {String} path - Full pathname to check
     * @param {Boolean} [directory=false] - Match folders instead of files
     * @return {Icon}
     */
    IconTables.prototype.matchPath = function(path, directory) {

        directory = directory !== undefined
            ? directory
            : false
        var cachedIcons = directory
            ? cache.directoryName
            : cache.fileName
        var icons = directory
            ? this.directoryIcons.byPath
            : this.fileIcons.byPath

        if (cachedIcons[name]) {
            return cachedIcons[name]
        }

        for (var i in icons) {
            var icon = icons[i]
            if (icon.match.test(path)) {
                return cachedIcons[path] = icon
            }
        }
        return null
    }

    /**
     * Match an icon using the human-readable form of its related language.
     *
     * Typically used for matching modelines and Linguist-language attributes.
     *
     * @example IconTables.matchLanguage("JavaScript")
     * @param {String} name - Name/alias of language
     * @return {Icon}
     */
    IconTables.prototype.matchLanguage = function(name) {

        if (cache.language[name]) {
            return cache.language[name]
        }

        for (var i in this.fileIcons.byLanguage) {
            var icon = this.fileIcons.byLanguage[i]
            if (icon.lang.test(name)) {
                return cache.language[name] = icon
            }
        }
        return null
    }

    /**
     * Match an icon using the grammar-scope assigned to it.
     *
     * @example IconTables.matchScope("source.js")
     * @param {String} name
     * @return {Icon}
     */
    IconTables.prototype.matchScope = function(name) {

        if (cache.scope[name]) {
            return cache.scope[name]
        }

        for (var i in this.fileIcons.byScope) {
            var icon = this.fileIcons.byScope[i]
            if (icon.scope.test(name)) {
                return cache.scope[name] = icon
            }
        }
        return null
    }

    /**
     * Match an icon using the name of an interpreter which executes its language.
     *
     * Used for matching interpreter directives (a.k.a., "hashbangs").
     *
     * @example IconTables.matchInterpreter("bash")
     * @param {String} name
     * @return {Icon}
     */
    IconTables.prototype.matchInterpreter = function(name) {

        if (cache.interpreter[name]) {
            return cache.interpreter[name]
        }

        for (var i in this.fileIcons.byInterpreter) {
            var icon = this.fileIcons.byInterpreter[i]
            if (icon.interpreter.test(name)) {
                return cache.interpreter[name] = icon
            }
        }
        return null
    }

    /**
     * Match an icon using a resource's file signature.
     *
     * @example IconTables.matchSignature("\x1F\x8B")
     * @param {String} data
     * @return {Icon}
     */
    IconTables.prototype.matchSignature = function(data) {}

    /* ---------------------------------------------------------------------------
     * Icons Database
     * ------------------------------------------------------------------------- */

    var icondb = [
    [[["arttext-icon",["dark-purple","dark-purple"],/\.artx$/i],
    ["atom-icon",["dark-green","dark-green"],/^\.atom$/],
    ["bower-icon",["medium-yellow","medium-orange"],/^bower[-_]components$/],
    ["dropbox-icon",["medium-blue","medium-blue"],/^(?:Dropbox|\.dropbox\.cache)$/],
    ["emacs-icon",["medium-purple","medium-purple"],/^\.emacs\.d$/],
    ["dylib-icon",[null,null],/\.framework$/i],
    ["git-icon",["medium-red","medium-red"],/\.git$/],
    ["github-icon",[null,null],/^\.github$/],
    ["meteor-icon",["dark-orange","dark-orange"],/^\.meteor$/],
    ["node-icon",["medium-green","medium-green"],/^node_modules$/],
    ["package-icon",[null,null],/^\.bundle$/i],
    ["svn-icon",[null,null],/^\.svn$/i],
    ["textmate-icon",[null,null],/\.tmBundle$/i],
    ["vagrant-icon",["medium-cyan","medium-cyan"],/\.vagrant$/i],
    ["appstore-icon",[null,null],/\.xcodeproj$/i]],
    [[],[],[],[],[]]],
    [[["binary-icon",["dark-green","dark-green"],/\.swp$/i,4],
    ["link-icon",["medium-blue","medium-blue"],/\.lnk$/i,3],
    ["angular-icon",["medium-red","medium-red"],/^angular[^.]*\.js$/i,2],
    ["ant-icon",["dark-pink","dark-pink"],/^ant\.xml$|\.ant$/i,2],
    ["apache-icon",["medium-red","medium-red"],/^(?:apache2?|httpd).conf$/i,2],
    ["apache-icon",["dark-green","dark-green"],/\.vhost$/i,2],
    ["apache-icon",["medium-green","medium-green"],/\.thrift$/i,2],
    ["appcelerator-icon",["medium-red","medium-red"],/^appcelerator\.js$/i,2],
    ["appveyor-icon",["medium-blue","medium-blue"],/^appveyor\.yml$/i,2],
    ["archlinux-icon",["dark-purple","dark-purple"],/^\.install$/,2],
    ["archlinux-icon",["dark-maroon","dark-maroon"],/^\.SRCINFO$/,2],
    ["archlinux-icon",["dark-yellow","dark-yellow"],/^pacman\.conf$/,2],
    ["archlinux-icon",["light-yellow","light-yellow"],/^pamac\.conf$/,2],
    ["archlinux-icon",["dark-cyan","dark-cyan"],/^PKGBUILD$/,2],
    ["archlinux-icon",["light-yellow","light-yellow"],/yaourtrc$/i,2],
    ["backbone-icon",["dark-blue","dark-blue"],/^backbone(?:[-.]min|dev)?\.js$/i,2],
    ["boot-icon",["medium-green","dark-green"],/^Makefile\.boot$/i,2],
    ["bootstrap-icon",["medium-yellow","dark-yellow"],/^(?:custom\.)?bootstrap\S*\.js$/i,2],
    ["bootstrap-icon",["medium-blue","medium-blue"],/^(?:custom\.)?bootstrap\S*\.css$/i,2],
    ["bootstrap-icon",["dark-blue","dark-blue"],/^(?:custom\.)?bootstrap\S*\.less$/i,2],
    ["bootstrap-icon",["light-pink","light-pink"],/^(?:custom\.)?bootstrap\S*\.scss$/i,2],
    ["bootstrap-icon",["medium-green","medium-green"],/^(?:custom\.)?bootstrap\S*\.styl$/i,2],
    ["bower-icon",["medium-yellow","medium-orange"],/^(?:\.bowerrc|bower\.json|Bowerfile)$/i,2],
    ["brakeman-icon",["medium-red","medium-red"],/brakeman\.yml$/i,2],
    ["brakeman-icon",["dark-red","dark-red"],/^brakeman\.ignore$/i,2],
    ["broccoli-icon",["medium-green","medium-green"],/^Brocfile\./i,2],
    ["package-icon",["light-orange","light-orange"],/Cargo\.toml$/i,2],
    ["package-icon",["dark-orange","dark-orange"],/Cargo\.lock$/i,2],
    ["chai-icon",["medium-red","dark-red"],/^chai\.(?:[jt]sx?|es6?|coffee)$/i,2],
    ["chartjs-icon",["dark-pink","dark-pink"],/^Chart\.js$/i,2],
    ["circleci-icon",["medium-green","medium-green"],/^circle\.yml$/i,2],
    ["cc-icon",["medium-green","medium-green"],/\.codeclimate\.yml$/i,2],
    ["codecov-icon",["dark-pink","dark-pink"],/^codecov\.ya?ml$/i,2],
    ["coffee-icon",["medium-cyan","medium-cyan"],/\.coffee\.ecr$/i,2],
    ["coffee-icon",["medium-red","medium-red"],/\.coffee\.erb$/i,2],
    ["compass-icon",["medium-red","medium-red"],/^_?(?:compass|lemonade)\.scss$/i,2],
    ["composer-icon",["medium-yellow","medium-yellow"],/^composer\.(?:json|lock)$/i,2],
    ["composer-icon",["dark-blue","dark-blue"],/^composer\.phar$/i,2],
    ["cordova-icon",["light-blue","light-blue"],/^cordova(?:[^.]*\.|-(?:\d\.)+)js$/i,2],
    ["d3-icon",["medium-orange","medium-orange"],/^d3(?:\.v\d+)?[^.]*\.js$/i,2],
    ["database-icon",["medium-red","medium-red"],/^METADATA\.pb$/,2],
    ["database-icon",["medium-red","medium-red"],/\.git[\/\\](?:.*[\/\\])?(?:HEAD|ORIG_HEAD|packed-refs|logs[\/\\](?:.+[\/\\])?[^\/\\]+)$/,2,true],
    ["docker-icon",["dark-blue","dark-blue"],/^(?:Dockerfile|docker-compose)|\.docker(?:file|ignore)$/i,2,false,,/\.dockerfile$/i,/^Docker$/i],
    ["docker-icon",["dark-orange","dark-orange"],/^docker-sync\.yml$/i,2],
    ["dojo-icon",["light-red","light-red"],/^dojo\.js$/i,2],
    ["ember-icon",["medium-red","medium-red"],/^ember(?:\.|(?:-[^.]+)?-(?:\d+\.)+(?:debug\.)?)js$/i,2],
    ["eslint-icon",["medium-purple","medium-purple"],/\.eslint(?:cache|ignore)$/i,2],
    ["eslint-icon",["light-purple","light-purple"],/\.eslintrc(?:\.(?:js|json|ya?ml))?$/i,2],
    ["extjs-icon",["light-green","light-green"],/\bExtjs(?:-ext)?\.js$/i,2],
    ["fabfile-icon",["medium-blue","medium-blue"],/^fabfile\.py$/i,2],
    ["fuelux-icon",["medium-orange","dark-orange"],/^fuelux(?:\.min)?\.(?:css|js)$/i,2],
    ["gear-icon",["medium-blue","medium-blue"],/\.indent\.pro$/i,2],
    ["grunt-icon",["medium-yellow","medium-yellow"],/gruntfile\.js$/i,2],
    ["grunt-icon",["medium-maroon","medium-maroon"],/gruntfile\.coffee$/i,2],
    ["gulp-icon",["medium-red","medium-red"],/gulpfile\.js$|gulpfile\.babel\.js$/i,2],
    ["gulp-icon",["medium-maroon","medium-maroon"],/gulpfile\.coffee$/i,2],
    ["html5-icon",["medium-cyan","medium-cyan"],/\.html?\.ecr$/i,2],
    ["html5-icon",["medium-red","medium-red"],/\.(?:html?\.erb|rhtml)$/i,2,false,,/\.html\.erb$/i,/^HTML$/i],
    ["ionic-icon",["medium-blue","medium-blue"],/^ionic\.project$/,2],
    ["js-icon",["medium-cyan","medium-cyan"],/\.js\.ecr$/i,2],
    ["js-icon",["medium-red","medium-red"],/\.js\.erb$/i,2],
    ["jquery-icon",["dark-blue","dark-blue"],/^jquery(?:[-.](?:min|latest|\d\.\d+(?:\.\d+)?))*\.(?:[jt]sx?|es6?|coffee|map)$/i,2],
    ["jqueryui-icon",["dark-blue","dark-blue"],/^jquery(?:[-_.](?:ui[-_.](?:custom|dialog-?\w*)|effects)(?:\.[^.]*)?|[-.]?ui(?:-\d\.\d+(?:\.\d+)?)?(?:\.\w+)?)(?:[-_.]?min|dev)?\.(?:[jt]sx?|es6?|coffee|map|s?css|less|styl)$/i,2],
    ["karma-icon",["medium-cyan","medium-cyan"],/^karma\.conf\.js$/i,2],
    ["karma-icon",["medium-maroon","medium-maroon"],/^karma\.conf\.coffee$/i,2],
    ["knockout-icon",["medium-red","medium-red"],/^knockout[-.](?:\d+\.){3}(?:debug\.)?js$/i,2],
    ["leaflet-icon",["medium-green","medium-green"],/^leaflet\.(?:draw-src|draw|spin|coordinates-(?:\d+\.)\d+\.\d+\.src)\.(?:js|css)$|^wicket-leaflet\.js$/i,2],
    ["lein-icon",[null,null],/project\.clj$/i,2],
    ["manpage-icon",["dark-green","dark-green"],/^tmac\.|^(?:mmn|mmt)$/i,2],
    ["marko-icon",["medium-blue","medium-blue"],/\.marko$/i,2,false,/^marko$/,/\.marko$/i,/^mark[0o]$/i],
    ["marko-icon",["medium-maroon","medium-maroon"],/\.marko\.js$/i,2],
    ["materialize-icon",["light-red","light-red"],/^materialize(?:\.min)?\.(?:js|css)$/i,2],
    ["mathjax-icon",["dark-green","dark-green"],/^MathJax[^.]*\.js$/i,2],
    ["mocha-icon",["medium-maroon","medium-maroon"],/^mocha\.(?:[jt]sx?|es6?|coffee)$/i,2],
    ["mocha-icon",["medium-red","medium-red"],/^mocha\.(?:s?css|less|styl)$/i,2],
    ["mocha-icon",["light-maroon","light-maroon"],/mocha\.opts$/i,2],
    ["modernizr-icon",["medium-red","medium-red"],/^modernizr(?:[-\.]custom|-\d\.\d+)(?:\.\d+)?\.js$/i,2],
    ["mootools-icon",["medium-purple","medium-purple"],/^mootools[^.]*\d+\.\d+(?:.\d+)?[^.]*\.js$/i,2],
    ["neko-icon",["dark-orange","dark-orange"],/^run\.n$/,2],
    ["newrelic-icon",["medium-cyan","medium-cyan"],/^newrelic\.yml/i,2],
    ["nginx-icon",["dark-green","dark-green"],/^nginx\.conf$/i,2],
    ["shuriken-icon",["dark-cyan","dark-cyan"],/\.ninja\.d$/i,2],
    ["nodemon-icon",["medium-green","medium-green"],/^nodemon\.json$|^\.nodemonignore$/i,2],
    ["normalize-icon",["medium-red","medium-red"],/^normalize\.(?:css|less|scss|styl)$/i,2],
    ["npm-icon",["medium-red","medium-red"],/^(?:package\.json|\.npmignore|\.?npmrc|npm-debug\.log|npm-shrinkwrap\.json)$/i,2],
    ["postcss-icon",["medium-yellow","dark-yellow"],/\bpostcss\.config\.js$/i,2],
    ["protractor-icon",["medium-red","medium-red"],/^protractor\.conf\./i,2],
    ["pug-icon",["medium-orange","medium-orange"],/^\.pug-lintrc/i,2],
    ["raphael-icon",["medium-orange","medium-orange"],/^raphael(?:\.min|\.no-deps)*\.js$/i,2],
    ["react-icon",["dark-blue","dark-blue"],/^react(?:-[^.]*)?\.js$/i,2],
    ["react-icon",["medium-blue","dark-blue"],/\.react\.js$/i,2],
    ["book-icon",["medium-blue","medium-blue"],/^README(?:\b|_)|^(?:licen[sc]es?|(?:read|readme|click|delete|keep|test)\.me)$|\.(?:readme|1st)$/i,2],
    ["book-icon",["dark-blue","dark-blue"],/^(?:notice|bugs|changes|change[-_]?log(?:[-._]?\d+)?|contribute|contributing|contributors|copying|hacking|history|install|maintainers|manifest|more\.stuff|projects|revision|terms|thanks)$/i,2],
    ["requirejs-icon",["medium-blue","medium-blue"],/^require(?:[-.]min|dev)?\.js$/i,2],
    ["clojure-icon",["medium-maroon","dark-maroon"],/^riemann\.config$/i,2],
    ["rollup-icon",["medium-red","medium-red"],/^rollup\.config\./i,2],
    ["ruby-icon",["light-green","light-green"],/_spec\.rb$/i,2],
    ["scrutinizer-icon",["dark-blue","dark-blue"],/\.scrutinizer\.yml$/i,2],
    ["sencha-icon",["light-green","light-green"],/^sencha(?:\.min)?\.js$/i,2],
    ["snapsvg-icon",["medium-cyan","medium-cyan"],/^snap\.svg(?:[-.]min)?\.js$/i,2],
    ["sourcemap-icon",["medium-blue","medium-blue"],/\.css\.map$/i,2],
    ["sourcemap-icon",["medium-yellow","dark-yellow"],/\.js\.map$/i,2],
    ["stylelint-icon",["medium-purple","medium-purple"],/^\.stylelintrc(?:\.|$)/i,2],
    ["stylelint-icon",["medium-yellow","dark-yellow"],/^stylelint\.config\.js$/i,2],
    ["stylelint-icon",["dark-blue","dark-blue"],/\.stylelintignore$/i,2],
    ["toc-icon",["medium-cyan","dark-cyan"],/\.toc$/i,2,false,,/\.toc$/i,/^Table of Contents$/i],
    ["calc-icon",["medium-maroon","medium-maroon"],/\.8x[pk](?:\.txt)?$/i,2,false,,,,/^\*\*TI[789]\d\*\*/],
    ["travis-icon",["medium-red","medium-red"],/^\.travis/i,2],
    ["typedoc-icon",["dark-purple","dark-purple"],/^typedoc\.json$/i,2],
    ["typings-icon",["medium-maroon","medium-maroon"],/^typings\.json$/i,2],
    ["uikit-icon",["medium-blue","medium-blue"],/^uikit(?:\.min)?\.js$/i,2],
    ["webpack-icon",["medium-blue","medium-blue"],/webpack\.config\.|^webpackfile\.js$/i,2],
    ["wercker-icon",["medium-purple","medium-purple"],/^wercker\.ya?ml$/i,2],
    ["yarn-icon",["medium-blue","medium-blue"],/^yarn\.lock$/i,2],
    ["yeoman-icon",["medium-cyan","medium-cyan"],/\.yo-rc\.json$/i,2],
    ["yui-icon",["dark-blue","dark-blue"],/^(?:yahoo-|yui)[^.]*\.js$/i,2],
    ["emacs-icon",["medium-red","medium-red"],/\.gnus$/i,1.5],
    ["emacs-icon",["dark-green","dark-green"],/\.viper$/i,1.5],
    ["emacs-icon",["dark-blue","dark-blue"],/^Cask$/,1.5],
    ["emacs-icon",["medium-blue","medium-blue"],/^Project\.ede$/i,1.5],
    ["_1c-icon",["medium-red","medium-red"],/\.bsl$/i,,false,,/\.bsl$/i,/^1C$|^1[\W_ \t]?C[\W_ \t]?Enterprise$/i],
    ["_1c-icon",["dark-orange","dark-orange"],/\.sdbl$/i,,false,,/\.sdbl$/i,/^1C$|^1[\W_ \t]?C[\W_ \t]?Query$/i],
    ["_1c-icon",["dark-red","dark-red"],/\.os$/i],
    ["_1c-alt-icon",["medium-red","dark-red"],/\.mdo$/i],
    ["abap-icon",["medium-orange","medium-orange"],/\.abap$/i,,false,,/\.abp$/i,/^ABAP$/i],
    ["as-icon",["medium-blue","medium-blue"],/\.swf$/i],
    ["as-icon",["medium-red","medium-red"],/\.as$/i,,false,,/\.(?:flex-config|actionscript(?:\.\d+)?)$/i,/^ActionScript$|^(?:ActionScript\s*3|as3)$/i],
    ["as-icon",["medium-yellow","dark-yellow"],/\.jsfl$/i],
    ["as-icon",["dark-red","dark-red"],/\.swc$/i],
    ["ada-icon",["medium-blue","medium-blue"],/\.(?:ada|adb|ads)$/i,,false,,/\.ada$/i,/^Ada$|^(?:ada95|ada2005)$/i],
    ["ae-icon",["dark-pink","dark-pink"],/\.aep$/i],
    ["ae-icon",["dark-purple","dark-purple"],/\.aet$/i],
    ["ai-icon",["medium-orange","medium-orange"],/\.ai$/i],
    ["ai-icon",["dark-orange","dark-orange"],/\.ait$/i],
    ["indesign-icon",["dark-pink","dark-pink"],/\.indd$|\.idml$/i],
    ["indesign-icon",["medium-purple","medium-purple"],/\.indl$/i],
    ["indesign-icon",["dark-purple","dark-purple"],/\.indt$|\.inx$/i],
    ["indesign-icon",["dark-blue","dark-blue"],/\.indb$/i],
    ["psd-icon",["medium-blue","medium-blue"],/\.psd$/i,,false,,,,/^8BPS/],
    ["psd-icon",["dark-purple","dark-purple"],/\.psb$/i],
    ["premiere-icon",["dark-purple","dark-purple"],/\.prproj$/i],
    ["premiere-icon",["medium-maroon","medium-maroon"],/\.prel$/i],
    ["premiere-icon",["medium-purple","medium-purple"],/\.psq$/i],
    ["alloy-icon",["medium-red","medium-red"],/\.als$/i,,false,,/\.alloy$/i,/^Alloy$/i],
    ["alpine-icon",["dark-blue","dark-blue"],/(?:\.|^)APKBUILD$/],
    ["ampl-icon",["dark-maroon","dark-maroon"],/\.ampl$/i,,false,,/\.ampl$/i,/^AMPL$/i],
    ["sun-icon",["medium-yellow","dark-yellow"],/\.ansiweatherrc$/i],
    ["antlr-icon",["medium-red","medium-red"],/\.g$/i,,false,/^antlr$/,/\.antlr$/i,/^antlr$/i],
    ["antlr-icon",["medium-orange","medium-orange"],/\.g4$/i],
    ["apache-icon",["dark-red","dark-red"],/\.apacheconf$/i,,false,,/\.apache-config$/i,/^Apache$|^(?:aconf|ApacheConf)$/i],
    ["apache-icon",["medium-purple","medium-purple"],/apache2[\\\/]magic$/i,,true],
    ["api-icon",["medium-blue","medium-blue"],/\.apib$/i,,false,,/\.apib$/i,/^API Blueprint$/i],
    ["apl-icon",["dark-cyan","dark-cyan"],/\.apl$/i,,false,/^apl$/,/\.apl$/i,/^apl$/i],
    ["apl-icon",["medium-maroon","medium-maroon"],/\.apl\.history$/i],
    ["apple-icon",["medium-purple","medium-purple"],/\.(?:applescript|scpt)$/i,,false,/^osascript$/,/\.applescript$/i,/^Apple$|^[0o]sascript$/i],
    ["arc-icon",["medium-blue","medium-blue"],/\.arc$/i],
    ["arduino-icon",["dark-cyan","dark-cyan"],/\.ino$/i,,false,,/\.arduino$/i,/^Arduino$/i],
    ["asciidoc-icon",["medium-blue","medium-blue"],/\.(?:ad|adoc|asc|asciidoc)$/i,,false,,/\.asciidoc$/i,/^AsciiDoc$/i],
    ["asp-icon",["dark-blue","dark-blue"],/\.asp$/i,,false,,/\.asp$/i,/^[Aa][Ss][Pp][\W_ \t]?[Nn][Ee][Tt]$|^aspx(?:-vb)?$/],
    ["asp-icon",["medium-maroon","medium-maroon"],/\.asax$/i],
    ["asp-icon",["dark-green","dark-green"],/\.ascx$/i],
    ["asp-icon",["medium-green","medium-green"],/\.ashx$/i],
    ["asp-icon",["dark-cyan","dark-cyan"],/\.asmx$/i],
    ["asp-icon",["medium-purple","medium-purple"],/\.aspx$/i],
    ["asp-icon",["medium-cyan","medium-cyan"],/\.axd$/i],
    ["eclipse-icon",["medium-maroon","medium-maroon"],/\.aj$/i],
    ["binary-icon",["medium-red","medium-red"],/\.(?:l?a|[ls]?o|out|s|a51|n?asm|axf|elf|prx|puff|was[mt]|z80)$|\.rpy[bc]$/i,,false,,/(?:^|\.)(?:a[rs]m|x86|z80|lc-?3|cpu12|x86asm|m68k|assembly|avr(?:dis)?asm|dasm)(?:\.|$)/i,/^Assembly$|^n?asm$/i],
    ["binary-icon",["dark-blue","dark-blue"],/\.agc$|\.d-objdump$/i,,false,,/\.source\.agc$/i,/^Assembly$|^(?:Virtual\s*)?AGC$|^Apollo(?:[-_\s]*11)?\s*Guidance\s*Computer$/i],
    ["binary-icon",["dark-green","dark-green"],/\.ko$/i],
    ["binary-icon",["medium-blue","medium-blue"],/\.lst$/i,,false,/^lst-cpu12$/,/\.lst-cpu12$/i,/^Assembly$|^lst[\W_ \t]?cpu12$/i],
    ["binary-icon",["dark-orange","dark-orange"],/\.(?:(?:c(?:[+px]{2}?)?-?)?objdump|bsdiff|bin|dat|pak|pdb)$/i],
    ["binary-icon",["medium-orange","medium-orange"],/\.gcode|\.gco/i],
    ["binary-icon",["dark-purple","dark-purple"],/\.py[co]$/i],
    ["binary-icon",[null,null],/\.DS_Store$/i],
    ["ats-icon",["medium-red","medium-red"],/\.dats$/i,,false,,/\.ats$/i,/^ATS$|^ats2$/i],
    ["ats-icon",["medium-blue","medium-blue"],/\.hats$/i],
    ["ats-icon",["dark-yellow","dark-yellow"],/\.sats$/i],
    ["audacity-icon",["medium-yellow","medium-yellow"],/\.aup$/i],
    ["audio-icon",["medium-red","medium-red"],/\.mp3$/i,,false,,,,/^\xFF\xFB|^ID3/],
    ["audio-icon",["dark-yellow","dark-yellow"],/\.wav$/i,,false,,,,/^RIFF(?!.+WEBP)/],
    ["audio-icon",["dark-cyan","dark-cyan"],/\.(?:aac|ac3|m4p)$/i,,false,,,,/^\x0Bw/],
    ["audio-icon",["medium-purple","medium-purple"],/\.aif[fc]?$/i,,false,,,,/^FORM.{4}AIFF/],
    ["audio-icon",["medium-cyan","medium-cyan"],/\.au$/i,,false,,,,/^\.snd|^dns\./],
    ["audio-icon",["dark-red","dark-red"],/\.flac$/i,,false,,,,/^fLaC/],
    ["audio-icon",["medium-red","medium-red"],/\.f4[ab]$/i,,false,,,,/^FLV\x01\x04/],
    ["audio-icon",["medium-cyan","medium-cyan"],/\.m4a$/i,,false,,,,/^.{4}ftypM4A/],
    ["audio-icon",["dark-green","dark-green"],/\.(?:mpc|mp\+)$/i,,false,,,,/^MPCK/],
    ["audio-icon",["dark-orange","dark-orange"],/\.oga$/i],
    ["audio-icon",["dark-maroon","dark-maroon"],/\.opus$/i,,false,,,,/OpusHead/],
    ["audio-icon",["dark-blue","dark-blue"],/\.r[am]$/i,,false,,,,/^\.RMF/],
    ["audio-icon",["medium-blue","medium-blue"],/\.wma$/i],
    ["augeas-icon",["dark-orange","dark-orange"],/\.aug$/i],
    ["ahk-icon",["dark-blue","dark-blue"],/\.ahk$/i,,false,/^ahk$/,/\.ahk$/i,/^AutoHotkey$|^ahk$/i],
    ["ahk-icon",["dark-purple","dark-purple"],/\.ahkl$/i],
    ["autoit-icon",["medium-purple","medium-purple"],/\.au3$/i,,false,,/(?:^|\.)autoit(?:\.|$)/i,/^AutoIt$|^(?:AutoIt3|AutoItScript|au3)$/i],
    ["terminal-icon",["medium-blue","medium-blue"],/\.awk$/i,,false,/^awk$/,/\.awk$/i,/^awk$/i],
    ["terminal-icon",["medium-red","medium-red"],/\.gawk$/i,,false,/^gawk$/,/\.gawk$/i,/^AWK$|^gawk$/i],
    ["terminal-icon",["medium-maroon","medium-maroon"],/\.mawk$/i,,false,/^mawk$/,/\.mawk$/i,/^AWK$|^mawk$/i],
    ["terminal-icon",["dark-green","dark-green"],/\.nawk$/i,,false,/^nawk$/,/\.nawk$/i,/^AWK$|^nawk$/i],
    ["terminal-icon",["dark-cyan","dark-cyan"],/\.auk$/i],
    ["babel-icon",["medium-yellow","medium-yellow"],/\.(?:babelrc|languagebabel|babel)$/i],
    ["babel-icon",["dark-yellow","dark-yellow"],/\.babelignore$/i],
    ["bibtex-icon",["medium-red","dark-red"],/\.cbx$/i],
    ["bibtex-icon",["medium-orange","dark-orange"],/\.bbx$/i],
    ["bibtex-icon",["medium-yellow","dark-yellow"],/\.bib$/i,,false,/^bibtex$/,/\.bibtex$/i,/^bibtex$/i],
    ["bibtex-icon",["medium-green","dark-green"],/\.bst$/i],
    ["gnu-icon",["medium-red","medium-red"],/\.bison$/i,,false,,/\.bison$/i,/^Bison$/i],
    ["blender-icon",["medium-orange","medium-orange"],/\.blend$/i],
    ["blender-icon",["dark-orange","dark-orange"],/\.blend\d+$/i],
    ["blender-icon",["dark-blue","dark-blue"],/\.bphys$/i],
    ["bluespec-icon",["dark-blue","dark-blue"],/\.bsv$/i,,false,,/\.bsv$/i,/^Bluespec$/i],
    ["boo-icon",["medium-green","medium-green"],/\.boo$/i,,false,,/\.boo(?:\.unity)?$/i,/^Boo$/i],
    ["boot-icon",[null,null],/\.boot$/i],
    ["brain-icon",["dark-pink","dark-pink"],/\.bf?$/i,,false,,/\.(?:bf|brainfuck)$/i,/^Brainfuck$|^(?:bf|Brainf\**ck)$/i],
    ["brew-icon",["medium-orange","medium-orange"],/^Brewfile$/],
    ["bro-icon",["dark-cyan","dark-cyan"],/\.bro$/i,,false,,/\.bro$/i,/^Bro$/i],
    ["byond-icon",["medium-blue","medium-blue"],/\.dm$/i,,false,,/\.dm$/i,/^BYOND$|^(?:DM|Dream\s*Maker(?:\s*Script)?)$/i],
    ["c-icon",["medium-blue","medium-blue"],/\.c$/i,,false,/^tcc$/,/\.c$/i,/^C$/i],
    ["c-icon",["medium-purple","medium-purple"],/\.h$|\.cats$/i],
    ["c-icon",["medium-green","medium-green"],/\.idc$/i],
    ["c-icon",["medium-maroon","medium-maroon"],/\.w$/i],
    ["c-icon",["dark-blue","dark-blue"],/\.nc$/i],
    ["c-icon",["medium-cyan","medium-cyan"],/\.upc$/i],
    ["csharp-icon",["medium-blue","dark-blue"],/\.cs$/i,,false,,/\.cs$/i,/^C#$|^c\s*sharp$/i],
    ["csscript-icon",["dark-green","dark-green"],/\.csx$/i,,false,,/\.csx$/i,/^C#-Script$/i],
    ["cpp-icon",["medium-blue","dark-blue"],/\.c[+px]{2}$|\.cc$/i,,false,,/\.cpp$/i,/^C\+\+$|c[-_]?pp|cplusplus/i],
    ["cpp-icon",["medium-purple","dark-purple"],/\.h[+px]{2}$/i],
    ["cpp-icon",["medium-orange","dark-orange"],/\.[it]pp$/i],
    ["cpp-icon",["medium-red","dark-red"],/\.(?:tcc|inl)$/i],
    ["cabal-icon",["medium-cyan","medium-cyan"],/\.cabal$/i,,false,,/\.cabal$/i,/^Cabal$/i],
    ["cake-icon",["medium-yellow","medium-yellow"],/\.cake$/i,,false,,/\.cake$/i,/^Cake$/i],
    ["cakefile-icon",["medium-red","medium-red"],/^Cakefile$/],
    ["cakephp-icon",["medium-red","medium-red"],/\.ctp$/i],
    ["ceylon-icon",["medium-orange","medium-orange"],/\.ceylon$/i],
    ["chapel-icon",["medium-green","medium-green"],/\.chpl$/i,,false,,/\.chapel$/i,/^Chapel$|^chpl$/i],
    ["chrome-icon",["medium-red","medium-red"],/\.crx$/i,,false,,,,/^Cr24/],
    ["chuck-icon",["medium-green","medium-green"],/\.ck$/i,,false,,/\.chuck$/i,/^ChucK$/i],
    ["cirru-icon",["medium-pink","dark-pink"],/\.cirru$/i,,false,,/\.cirru$/i,/^Cirru$/i],
    ["clarion-icon",["medium-orange","medium-orange"],/\.clw$/i,,false,,/\.clarion$/i,/^Clarion$/i],
    ["clean-icon",["dark-cyan","dark-cyan"],/\.icl$/i,,false,/^clean$/,/\.clean$/i,/^clean$/i],
    ["clean-icon",["medium-cyan","medium-cyan"],/\.dcl$/i],
    ["clean-icon",["medium-blue","medium-blue"],/\.abc$/i],
    ["click-icon",["medium-yellow","medium-yellow"],/\.click$/i,,false,,/\.click$/i,/^Click$|^Click!$/i],
    ["clips-icon",["dark-green","dark-green"],/\.clp$/i,,false,,/\.clips$/i,/^CLIPS$/i],
    ["clojure-icon",["medium-blue","dark-blue"],/\.clj$/i,,false,/^clojure$/,/\.clojure$/i,/^cl[0o]jure$/i],
    ["clojure-icon",["medium-purple","dark-purple"],/\.cl2$/i],
    ["clojure-icon",["medium-green","dark-green"],/\.cljc$/i],
    ["clojure-icon",["medium-red","dark-red"],/\.cljx$|\.hic$/i],
    ["cljs-icon",["medium-blue","dark-blue"],/\.cljs(?:\.hl|cm)?$/i],
    ["cmake-icon",["medium-green","medium-green"],/\.cmake$/i,,false,/^cmake$/,/\.cmake$/i,/^cmake$/i],
    ["cmake-icon",["medium-red","medium-red"],/^CMakeLists\.txt$/],
    ["coffee-icon",["medium-maroon","medium-maroon"],/\.coffee$/i,,false,/^coffee$/,/\.coffee$/i,/^CoffeeScript$|^Coffee(?:-Script)?$/i],
    ["coffee-icon",["dark-maroon","dark-maroon"],/\.cjsx$/i],
    ["coffee-icon",["light-maroon","light-maroon"],/\.litcoffee$/i,,false,/^litcoffee$/,/\.litcoffee$/i,/^CoffeeScript$|^litc[0o]ffee$/i],
    ["coffee-icon",["medium-blue","medium-blue"],/\.iced$/i],
    ["cf-icon",["light-cyan","light-cyan"],/\.cfc$/i,,false,,/\.cfscript$/i,/^ColdFusion$|^(?:CFC|CFScript)$/i],
    ["cf-icon",["medium-cyan","medium-cyan"],/\.cfml?$/i,,false,,/\.cfml?$/i,/^ColdFusion$|^(?:cfml?|ColdFusion\s*HTML)$/i],
    ["khronos-icon",["medium-orange","medium-orange"],/\.dae$/i],
    ["cl-icon",["medium-orange","medium-orange"],/\.cl$/i,,false,/^(?:c?lisp|sbcl|[ec]cl)$/,/\.common-lisp$/i,/^Common Lisp$|^c?lisp$/i],
    ["cp-icon",["medium-maroon","medium-maroon"],/\.cp$/i],
    ["cp-icon",["dark-red","dark-red"],/\.cps$/i],
    ["zip-icon",[null,null],/\.(?:zip|z|xz)$/i,,false,,,,/^(?:\x50\x4B(?:\x03\x04|\x05\x06|\x07|\x08)|\x1F[\x9D\xA0]|BZh|RNC[\x01\x02]|\xD0\xCF\x11\xE0)/],
    ["zip-icon",["medium-blue","medium-blue"],/\.rar$/i,,false,,,,/^Rar!\x1A\x07\x01?\0/],
    ["zip-icon",["dark-blue","dark-blue"],/\.t?gz$|\.tar$|\.whl$/i,,false,,,,/^\x1F\x8B/],
    ["zip-icon",["medium-maroon","medium-maroon"],/\.(?:lzo?|lzma|tlz|tar\.lzma)$/i,,false,,,,/^LZIP/],
    ["zip-icon",["medium-maroon","medium-maroon"],/\.7z$/i,,false,,,,/^7z\xBC\xAF\x27\x1C/],
    ["zip-icon",["medium-red","medium-red"],/\.apk$|\.gem$/i],
    ["zip-icon",["dark-cyan","dark-cyan"],/\.bz2$/i],
    ["zip-icon",["medium-blue","medium-blue"],/\.iso$/i,,false,,,,/^\x45\x52\x02\0{3}|^\x8B\x45\x52\x02/],
    ["zip-icon",["medium-orange","medium-orange"],/\.xpi$/i],
    ["zip-icon",["medium-green","medium-green"],/\.epub$/i],
    ["zip-icon",["dark-pink","dark-pink"],/\.jar$/i],
    ["zip-icon",["medium-purple","medium-purple"],/\.war$/i],
    ["zip-icon",["dark-orange","dark-orange"],/\.xar$/i,,false,,,,/^xar!/],
    ["zip-icon",["light-orange","light-orange"],/\.egg$/i],
    ["config-icon",["medium-yellow","medium-yellow"],/\.(?:ini|desktop|directory|cfg|conf|prefs)$/i,,false,,/\.ini$/i,/^d[0o]sini$/i],
    ["config-icon",["medium-purple","medium-purple"],/\.properties$/i,,false,,/\.java-properties$/i],
    ["config-icon",["medium-green","medium-green"],/\.toml$|\.opts$/i],
    ["config-icon",["dark-red","dark-red"],/\.ld$/i],
    ["config-icon",["medium-red","medium-red"],/\.lds$|\.reek$/i],
    ["config-icon",["dark-blue","dark-blue"],/\.terminal$/i],
    ["config-icon",["medium-orange","medium-orange"],/^ld\.script$/i],
    ["config-icon",["dark-red","dark-red"],/\.git[\/\\](?:config|info[\/\\]\w+)$/,,true],
    ["config-icon",["dark-orange","dark-orange"],/^\/(?:private\/)?etc\/(?:[^\/]+\/)*[^\/]*\.(?:cf|conf|ini)(?:\.default)?$/i,,true],
    ["config-icon",["medium-maroon","medium-maroon"],/^\/(?:private\/)?etc\/(?:aliases|auto_(?:home|master)|ftpusers|group|gettytab|hosts(?:\.equiv)?|manpaths|networks|paths|protocols|services|shells|sudoers|ttys)$/i,,true],
    ["coq-icon",["medium-maroon","medium-maroon"],/\.coq$/i,,false,,/\.coq$/i,/^Coq$/i],
    ["creole-icon",["medium-blue","medium-blue"],/\.creole$/i,,false,,/\.creole$/i,/^Creole$/i],
    ["crystal-icon",["medium-cyan","medium-cyan"],/\.e?cr$/i,,false,/^crystal$/,/\.crystal$/i,/^Crystal$/i],
    ["csound-icon",["medium-maroon","medium-maroon"],/\.orc$/i,,false,,/\.csound$/i,/^Csound$|^cs[0o]und[\W_ \t]?[0o]rc$/i],
    ["csound-icon",["dark-orange","dark-orange"],/\.udo$/i],
    ["csound-icon",["dark-maroon","dark-maroon"],/\.csd$/i,,false,,/\.csound-document$/i,/^Csound$|^cs[0o]und[\W_ \t]?csd$/i],
    ["csound-icon",["dark-blue","dark-blue"],/\.sco$/i,,false,,/\.csound-score$/i,/^Csound$|^cs[0o]und[\W_ \t]?sc[0o]$/i],
    ["css3-icon",["medium-blue","medium-blue"],/\.css$/i,,false,/^css$/,/\.css$/i,/^css$/i],
    ["css3-icon",["dark-blue","dark-blue"],/\.less$/i,,false,/^less$/,/\.less$/i,/^CSS$|^less$/i],
    ["cucumber-icon",["medium-green","medium-green"],/\.feature$/i,,false,,/(?:^|\.)(?:gherkin\.feature|cucumber\.steps)(?:\.|$)/i,/^Cucumber$|^gherkin$/i],
    ["nvidia-icon",["medium-green","medium-green"],/\.cu$/i,,false,,/\.cuda(?:-c\+\+)?$/i,/^CUDA$/i],
    ["nvidia-icon",["dark-green","dark-green"],/\.cuh$/i],
    ["cython-icon",["medium-orange","medium-orange"],/\.pyx$/i,,false,,/\.cython$/i,/^Cython$|^pyrex$/i],
    ["cython-icon",["medium-blue","medium-blue"],/\.pxd$/i],
    ["cython-icon",["dark-blue","dark-blue"],/\.pxi$/i],
    ["dlang-icon",["medium-red","medium-red"],/\.di?$/i,,false,,/\.d$/i,/^D$/i],
    ["yang-icon",["medium-red","medium-red"],/\.dnh$/i,,false,,/\.danmakufu$/i,/^Danmakufu$/i],
    ["darcs-icon",["medium-green","medium-green"],/\.d(?:arcs)?patch$/i],
    ["dart-icon",["medium-cyan","medium-cyan"],/\.dart$/i,,false,/^dart$/,/\.dart$/i,/^Dart$/i],
    ["dashboard-icon",["medium-orange","medium-orange"],/\.s[kl]im$/i,,false,/^slim$/,/\.slim$/i,/^slim$/i],
    ["dashboard-icon",["medium-green","medium-green"],/\.cpuprofile$/i],
    ["database-icon",["medium-yellow","medium-yellow"],/\.(?:h|geo|topo)?json$/i],
    ["database-icon",["light-red","light-red"],/\.ya?ml$/i],
    ["database-icon",["medium-maroon","medium-maroon"],/\.cson$|\.ston$|^mime\.types$/i],
    ["database-icon",["dark-yellow","dark-yellow"],/\.json5$/i,,false,/^json5$/,/\.json5$/i,/^js[0o]n5$/i],
    ["database-icon",["medium-red","medium-red"],/\.http$|\.pot?$/i],
    ["database-icon",["medium-orange","medium-orange"],/\.ndjson$|\.pytb$/i,,false,,/\.python\.traceback$/i],
    ["database-icon",["light-blue","light-blue"],/\.fea$/i,,false,,/\.opentype$/i,/^afdk[0o]$/i],
    ["database-icon",["medium-purple","medium-purple"],/\.json\.eex$|\.edn$/i],
    ["database-icon",["dark-cyan","dark-cyan"],/\.proto$/i,,false,,/\.protobuf$/i,/^(?:protobuf|Protocol\s*Buffers?)$/i],
    ["database-icon",["dark-blue","dark-blue"],/\.pydeps$|\.rviz$/i],
    ["database-icon",["dark-purple","dark-purple"],/\.eam\.fs$/i],
    ["database-icon",["medium-pink","medium-pink"],/\.qml$/i],
    ["database-icon",["dark-pink","dark-pink"],/\.qbs$/i],
    ["database-icon",["medium-cyan","medium-cyan"],/\.ttl$/i,,false,,/\.turtle$/i],
    ["database-icon",["medium-blue","medium-blue"],/\.syntax$/i],
    ["database-icon",["dark-red","dark-red"],/[\/\\](?:magic[\/\\]Magdir|file[\/\\]magic)[\/\\][-.\w]+$|lib[\\\/]icons[\\\/]\.icondb\.js$/i,,true],
    ["dbase-icon",["medium-red","medium-red"],/\.dbf$/i],
    ["debian-icon",["medium-red","medium-red"],/\.deb$/i],
    ["debian-icon",["dark-cyan","dark-cyan"],/^control$/],
    ["debian-icon",["medium-cyan","medium-cyan"],/^rules$/],
    ["diff-icon",["medium-orange","medium-orange"],/\.diff$/i,,false,,/\.diff$/i,/^Diff$|^udiff$/i],
    ["earth-icon",["medium-blue","medium-blue"],/\.zone$/i],
    ["earth-icon",["medium-green","medium-green"],/\.arpa$/i],
    ["earth-icon",["dark-blue","dark-blue"],/^CNAME$/],
    ["doxygen-icon",["medium-blue","medium-blue"],/^Doxyfile$/,,false,,/\.doxygen$/i,/^Doxyfile$/i],
    ["dyalog-icon",["medium-orange","medium-orange"],/\.dyalog$/i,,false,/^dyalog$/],
    ["dylib-icon",["medium-cyan","medium-cyan"],/\.(?:dylib|bundle)$/i],
    ["e-icon",["medium-green","medium-green"],/\.E$/,,false,/^rune$/],
    ["eagle-icon",["medium-red","medium-red"],/\.sch$/i],
    ["eagle-icon",["dark-red","dark-red"],/\.brd$/i],
    ["ec-icon",["dark-blue","dark-blue"],/\.ec$/i,,false,/^ec$/,/\.ec$/i,/^ec$/i],
    ["ec-icon",["dark-purple","dark-purple"],/\.eh$/i],
    ["ecere-icon",["medium-blue","medium-blue"],/\.epj$/i],
    ["eclipse-icon",["dark-blue","dark-blue"],/\.c?project$/],
    ["eclipse-icon",["medium-red","medium-red"],/\.classpath$/i],
    ["editorconfig-icon",["medium-orange","medium-orange"],/\.editorconfig$/i,,false,,/\.editorconfig$/i,/^EditorConfig$/i],
    ["eiffel-icon",["medium-cyan","medium-cyan"],/\.e$/,,false,,/\.eiffel$/i,/^Eiffel$/i],
    ["elixir-icon",["dark-purple","dark-purple"],/\.ex$/i,,false,/^elixir$/,/\.elixir$/i,/^elixir$/i],
    ["elixir-icon",["medium-purple","medium-purple"],/\.(?:exs|eex)$/i],
    ["elixir-icon",["light-purple","light-purple"],/mix\.exs?$/i],
    ["elm-icon",["medium-blue","medium-blue"],/\.elm$/i,,false,,/\.elm$/i,/^Elm$/i],
    ["emacs-icon",["medium-purple","medium-purple"],/(?:^|\.)(?:el|_?emacs|spacemacs|emacs\.desktop|abbrev[-_]defs)$/i,,false,/^emacs$/,/\.emacs\.lisp$/i,/^Emacs Lisp$|^elisp$/i],
    ["emacs-icon",["dark-purple","dark-purple"],/(?:^|\.)(?:elc|eld)$/i,,false,,,,/^;ELC\x17\0{3}/],
    ["at-icon",["medium-red","dark-red"],/^(?:authors|owners)$/i],
    ["em-icon",["medium-red","medium-red"],/\.emberscript$/i,,false,,/\.ember(?:script)?$/i,/^EmberScript$/i],
    ["mustache-icon",["medium-blue","medium-blue"],/\.em(?:blem)?$/i,,false,,/\.emblem$/i,/^Emblem$/i],
    ["eq-icon",["medium-orange","medium-orange"],/\.eq$/i,,false,,/\.eq$/i,/^EQ$/i],
    ["erlang-icon",["medium-red","medium-red"],/\.erl$/i,,false,/^escript$/,/\.erlang$/i,/^Erlang$/i],
    ["erlang-icon",["dark-red","dark-red"],/\.beam$/i],
    ["erlang-icon",["medium-maroon","medium-maroon"],/\.hrl$/i],
    ["erlang-icon",["medium-green","medium-green"],/\.xrl$/i],
    ["erlang-icon",["dark-green","dark-green"],/\.yrl$/i],
    ["erlang-icon",["dark-maroon","dark-maroon"],/\.app\.src$/i],
    ["factor-icon",["medium-orange","medium-orange"],/\.factor$/i,,false,,/\.factor$/i,/^Factor$/i],
    ["factor-icon",["dark-orange","dark-orange"],/\.factor-rc$/i],
    ["factor-icon",["medium-red","medium-red"],/\.factor-boot-rc$/i],
    ["fancy-icon",["dark-blue","dark-blue"],/\.fy$/i,,false,/^fancy$/,/\.fancy$/i,/^fancy$/i],
    ["fancy-icon",["medium-blue","medium-blue"],/\.fancypack$/i],
    ["fancy-icon",["medium-green","medium-green"],/^Fakefile$/],
    ["fantom-icon",["medium-blue","medium-blue"],/\.fan$/i,,false,,/\.fan(?:tom)?$/i,/^Fantom$/i],
    ["fbx-icon",["medium-maroon","medium-maroon"],/\.fbx$/i],
    ["finder-icon",["medium-blue","medium-blue"],/^Icon\r$/],
    ["finder-icon",["dark-blue","dark-blue"],/\.rsrc$/i],
    ["flow-icon",["medium-orange","medium-orange"],/\.(?:flowconfig|js\.flow)$/i],
    ["flux-icon",["medium-blue","medium-blue"],/\.fx$/i],
    ["flux-icon",["dark-blue","dark-blue"],/\.flux$/i],
    ["font-icon",["dark-blue","dark-blue"],/\.woff2$/i,,false,,,,/^wOF2/],
    ["font-icon",["medium-blue","medium-blue"],/\.woff$/i,,false,,,,/^wOFF/],
    ["font-icon",["light-green","light-green"],/\.eot$/i,,false,,,,/^.{34}LP/],
    ["font-icon",["dark-green","dark-green"],/\.ttc$/i,,false,,,,/^ttcf/],
    ["font-icon",["medium-green","medium-green"],/\.ttf$/i,,false,,,,/^\0\x01\0{3}/],
    ["font-icon",["dark-yellow","dark-yellow"],/\.otf$/i,,false,,,,/^OTTO.*\0/],
    ["font-icon",["dark-red","dark-red"],/\.pfb$/i],
    ["font-icon",["medium-red","medium-red"],/\.pfm$/i],
    ["ff-icon",["medium-orange","medium-orange"],/\.pe$/i,,false,/^fontforge$/,/\.source\.fontforge$/i,/^FontForge$|^pfaedit$/i],
    ["ff-icon",["dark-blue","dark-blue"],/\.sfd$/i,,false,,/\.text\.sfd$/i,/^FontForge$/i],
    ["fortran-icon",["medium-maroon","medium-maroon"],/\.f$/i,,false,,/\.fortran\.?(?:modern|punchcard)?$/i,/^Fortran$/i],
    ["fortran-icon",["medium-green","medium-green"],/\.f90$/i,,false,,/\.fortran\.free$/i,/^Fortran$/i],
    ["fortran-icon",["medium-red","medium-red"],/\.f03$/i],
    ["fortran-icon",["medium-blue","medium-blue"],/\.f08$/i],
    ["fortran-icon",["medium-maroon","medium-maroon"],/\.f77$/i,,false,,/\.fortran\.fixed$/i,/^Fortran$/i],
    ["fortran-icon",["dark-pink","dark-pink"],/\.f95$/i],
    ["fortran-icon",["dark-cyan","dark-cyan"],/\.for$/i],
    ["fortran-icon",["dark-yellow","dark-yellow"],/\.fpp$/i],
    ["freemarker-icon",["medium-blue","medium-blue"],/\.ftl$/i,,false,,/\.ftl$/i,/^FreeMarker$|^ftl$/i],
    ["frege-icon",["dark-red","dark-red"],/\.fr$/i],
    ["fsharp-icon",["medium-blue","medium-blue"],/\.fs[xi]?$/i,,false,,/\.fsharp$/i,/^FSharp$|^f#$/i],
    ["gml-icon",["medium-green","medium-green"],/\.gml$/i],
    ["gams-icon",["dark-red","dark-red"],/\.gms$/i,,false,,/\.gams(?:-lst)?$/i,/^GAMS$/i],
    ["gap-icon",["medium-yellow","dark-yellow"],/\.gap$/i,,false,/^gap$/,/\.gap$/i,/^gap$/i],
    ["gap-icon",["dark-blue","dark-blue"],/\.gi$/i],
    ["gap-icon",["medium-orange","medium-orange"],/\.tst$/i],
    ["gdb-icon",["medium-green","dark-green"],/\.gdb$/i,,false,/^gdb$/,/\.gdb$/i,/^gdb$/i],
    ["gdb-icon",["medium-cyan","dark-cyan"],/gdbinit$/i],
    ["godot-icon",["medium-blue","medium-blue"],/\.gd$/i,,false,,/\.gdscript$/i,/^GDScript$/i],
    ["gear-icon",["medium-red","medium-red"],/^\.htaccess$|\.yardopts$/i],
    ["gear-icon",["medium-orange","medium-orange"],/^\.htpasswd$/i],
    ["gear-icon",["dark-green","dark-green"],/^\.env\.|\.pairs$/i],
    ["gear-icon",["dark-yellow","dark-yellow"],/^\.lesshintrc$/i],
    ["gear-icon",["medium-yellow","medium-yellow"],/^\.csscomb\.json$|\.csslintrc$|\.jsbeautifyrc$|\.jshintrc$|\.jscsrc$/i],
    ["gear-icon",["medium-maroon","medium-maroon"],/\.coffeelintignore$|\.codoopts$/i],
    ["gear-icon",["medium-blue","medium-blue"],/\.module$/i],
    ["gear-icon",["dark-blue","dark-blue"],/\.arcconfig$|\.python-version$/i],
    ["gear-icon",["dark-orange","dark-orange"],/\.lintstagedrc$/i],
    ["gears-icon",["dark-orange","dark-orange"],/\.dll$/i,,false,,,,/^PMOCCMOC/],
    ["code-icon",["medium-blue","medium-blue"],/\.xml$|\.config$|\.4th$|\.cocci$|\.dyl$|\.dylan$|\.ecl$|\.forth$|\.launch$|\.manifest$|\.menu$|\.srdf$|\.st$|\.ui$|\.wsf$|\.x3d$|\.xaml$/i,,false,,,,/^<\?xml /],
    ["code-icon",["dark-red","dark-red"],/\.rdf$|\.capnp$|\.dotsettings$|\.flex$|\.fsh$|\.fsproj$|\.prw$|\.xproj$/i,,false,,/\.capnp$/i],
    ["code-icon",["medium-blue","medium-blue"],/^_service$/],
    ["code-icon",["medium-red","medium-red"],/^configure\.ac$|\.ML$/],
    ["code-icon",["medium-green","medium-green"],/^Settings\.StyleCop$/],
    ["code-icon",["medium-green","medium-green"],/\.abnf$|\.ditaval$|\.storyboard$|\.xmi$|\.yacc$/i,,false,/^abnf$/,/\.abnf$/i,/^abnf$/i],
    ["code-icon",["medium-purple","medium-purple"],/\.aepx$|\.dita$|\.grace$|\.lid$|\.nproj$/i],
    ["code-icon",["dark-cyan","dark-cyan"],/\.agda$|\.plist$|\.wisp$|\.xlf$|\.xslt$/i,,false,,/\.plist$/i],
    ["code-icon",["medium-orange","medium-orange"],/\.appxmanifest$|\.befunge$|\.fun$|\.muf$|\.xul$/i],
    ["code-icon",["medium-cyan","medium-cyan"],/\.ash$|\.asn1?$|\.lagda$|\.lex$|\.props$|\.resx$|\.smt2$|\.vsh$|\.xsl$|\.yy$/i,,false,/^xsl$/,/\.xsl$/i],
    ["code-icon",["dark-blue","dark-blue"],/\.axml$|\.bmx$|\.brs$|\.ccxml$|\.clixml$|\.fth$|\.intr$|\.mdpolicy$|\.mtml$|\.myt$|\.xsd$/i,,false,/^brightscript$/,/\.brightscript$/i],
    ["code-icon",["medium-maroon","medium-maroon"],/\.bnf$|\.cbl$|\.cob$|\.cobol$|\.fxml$/i,,false,/^bnf$/,/\.bnf$/i,/^bnf$/i],
    ["code-icon",["dark-maroon","dark-maroon"],/\.ccp$|\.cpy$|\.mxml$/i],
    ["code-icon",["medium-red","medium-red"],/\.ch$|\.cw$|\.ebnf$|\.iml$|\.jflex$|\.m4$|\.mask$|\.mumps$|\.prg$|\.pt$|\.rl$|\.sml$|\.targets$|\.webidl$|\.wsdl$|\.xacro$|\.xliff$/i,,false,/^ebnf$/,/\.ebnf$/i],
    ["code-icon",["dark-pink","dark-pink"],/\.ct$|\.zcml$/i],
    ["code-icon",["dark-green","dark-green"],/\.cy$|\.eclxml$|\.ivy$|\.sed$|\.tml$|\.y$/i],
    ["code-icon",["dark-purple","dark-purple"],/\.ditamap$|\.frt$|\.lp$|\.omgrofl$|\.osm$|\.wxs$|\.xib$/i],
    ["code-icon",["medium-pink","medium-pink"],/\.filters$|\.lol$|\.pig$/i],
    ["code-icon",["dark-orange","dark-orange"],/\.grxml$|\.urdf$/i],
    ["code-icon",["medium-yellow","medium-yellow"],/\.jelly$/i],
    ["code-icon",["dark-yellow","dark-yellow"],/\.jsproj$|\.ohm$|\.sgml?$/i,,false,/^ohm$/,/\.ohm$/i],
    ["code-icon",["dark-blue","dark-blue"],/\.mq[45h]$/i,,false,,/(?:^|\.)mq[45](?=\.|$)/i],
    ["code-icon",["light-green","light-green"],/\.odd$/i],
    ["code-icon",["light-blue","light-blue"],/\.psc1$|\.smt$/i,,false,/boolector|cvc4|mathsat5|opensmt|smtinterpol|smt-rat|stp|verit|yices2|z3/,/\.smt$/i],
    ["code-icon",["light-cyan","light-cyan"],/\.scxml$/i],
    ["code-icon",["light-maroon","light-maroon"],/\.sig$|\.wxl$/i],
    ["code-icon",["light-orange","light-orange"],/\.ux$|\.wxi$/i],
    ["code-icon",["light-purple","light-purple"],/\.vxml$/i],
    ["genshi-icon",["medium-red","medium-red"],/\.kid$/i,,false,,/\.genshi$/i,/^Genshi$|^xml\+(?:genshi|kid)$/i],
    ["gentoo-icon",["dark-cyan","dark-cyan"],/\.ebuild$/i,,false,,/\.ebuild$/i,/^Gentoo$/i],
    ["gentoo-icon",["medium-blue","medium-blue"],/\.eclass$/i],
    ["git-icon",["medium-red","medium-red"],/^\.git|^\.keep$|\.mailmap$/i,,false,,/\.git-(?:commit|config|rebase)$/i,/^Git$/i],
    ["git-commit-icon",["medium-red","medium-red"],/^COMMIT_EDITMSG$/],
    ["git-merge-icon",["medium-red","medium-red"],/^MERGE_(?:HEAD|MODE|MSG)$/],
    ["glade-icon",["medium-green","medium-green"],/\.glade$/i],
    ["pointwise-icon",["medium-blue","medium-blue"],/\.glf$/i],
    ["glyphs-icon",["medium-green","medium-green"],/\.glyphs$/i],
    ["gn-icon",["dark-blue","dark-blue"],/\.gn$/i,,false,/^gn$/,/\.gn$/i,/^gn$/i],
    ["gn-icon",["medium-blue","medium-blue"],/\.gni$/i],
    ["gnu-icon",["medium-red","dark-red"],/\.(?:gnu|gplv[23])$/i],
    ["graph-icon",["medium-red","medium-red"],/\.(?:gp|plo?t|gnuplot)$/i,,false,/^gnuplot$/,/\.gnuplot$/i,/^Gnuplot$/i],
    ["go-icon",["medium-blue","medium-blue"],/\.go$/i,,false,,/\.go(?:template)?$/i,/^Go$/i],
    ["golo-icon",["medium-orange","medium-orange"],/\.golo$/i,,false,,/\.golo$/i,/^Golo$/i],
    ["gosu-icon",["medium-blue","medium-blue"],/\.gs$/i,,false,,/\.gosu(?:\.\d+)?$/i,/^Gosu$/i],
    ["gosu-icon",["medium-green","medium-green"],/\.gst$/i],
    ["gosu-icon",["dark-green","dark-green"],/\.gsx$/i],
    ["gosu-icon",["dark-blue","dark-blue"],/\.vark$/i],
    ["gradle-icon",["medium-blue","medium-blue"],/\.gradle$/i,,false,,/\.gradle$/i,/^Gradle$/i],
    ["gradle-icon",["dark-purple","dark-purple"],/gradlew$/i],
    ["gf-icon",["medium-red","medium-red"],/\.gf$/i],
    ["graphql-icon",["medium-pink","medium-pink"],/\.graphql$/i,,false,,/\.graphql$/i,/^GraphQL$/i],
    ["graphql-icon",["medium-purple","medium-purple"],/\.gql$/i],
    ["graphviz-icon",["medium-blue","medium-blue"],/\.gv$/i,,false,,/\.dot$/i,/^Graphviz$/i],
    ["graphviz-icon",["dark-cyan","dark-cyan"],/\.dot$/i],
    ["groovy-icon",["light-blue","light-blue"],/\.(?:groovy|grt|gtpl|gsp|gvy)$/i,,false,/^groovy$/,/\.groovy$/i,/^Groovy$|^gsp$/i],
    ["hack-icon",["medium-orange","medium-orange"],/\.hh$/i,,false,,/\.hack$/i,/^Hack$/i],
    ["haml-icon",["medium-yellow","medium-yellow"],/\.haml$/i,,false,/^haml$/,/\.haml$/i,/^haml$/i],
    ["haml-icon",["medium-maroon","medium-maroon"],/\.hamlc$/i,,false,/^hamlc$/,/\.hamlc$/i,/^Haml$|^hamlc$/i],
    ["harbour-icon",["dark-blue","dark-blue"],/\.hb$/i,,false,,/\.harbour$/i,/^Harbour$/i],
    ["hashicorp-icon",["dark-purple","dark-purple"],/\.hcl$/i,,false,,/(?:^|\.)(?:hcl|hashicorp)(?:\.|$)/i,/^Hashicorp Configuration Language$/i],
    ["haskell-icon",["medium-purple","medium-purple"],/\.hs$/i,,false,/^runhaskell$/,/\.source\.haskell$/i,/^Haskell$/i],
    ["haskell-icon",["medium-blue","medium-blue"],/\.hsc$/i,,false,,/\.hsc2hs$/i,/^Haskell$/i],
    ["haskell-icon",["dark-purple","dark-purple"],/\.c2hs$/i,,false,,/\.c2hs$/i,/^Haskell$|^C2hs(?:\s*Haskell)?$/i],
    ["haskell-icon",["dark-blue","dark-blue"],/\.lhs$/i,,false,,/\.latex\.haskell$/i,/^Haskell$|^(?:lhaskell|lhs|Literate\s*Haskell)$/i],
    ["haxe-icon",["medium-orange","medium-orange"],/\.hx(?:[sm]l|)?$/,,false,,/(?:^|\.)haxe(?:\.\d+)?$/i,/^Haxe$/i],
    ["heroku-icon",["medium-purple","medium-purple"],/^Procfile$/],
    ["heroku-icon",["light-purple","light-purple"],/\.buildpacks$/i],
    ["heroku-icon",["dark-purple","dark-purple"],/^\.vendor_urls$/],
    ["html5-icon",["medium-orange","medium-orange"],/\.x?html?$/i,,false,,/\.html\.basic$/i,/^HTML$|^(?:xhtml|htm)$/i],
    ["html5-icon",["medium-red","medium-red"],/\.cshtml$|\.latte$/i,,false,/^latte$/,/\.latte$/i],
    ["html5-icon",["medium-green","medium-green"],/\.ejs$|\.kit$|\.swig$/i,,false,/^swig$/,/\.swig$/i],
    ["html5-icon",["dark-blue","dark-blue"],/\.gohtml$|\.phtml$/i,,false,/^gohtml$/,/\.gohtml$/i,/^HTML$|^g[0o]html$/i],
    ["html5-icon",["medium-purple","medium-purple"],/\.html\.eex$|\.jsp$/i,,false,,/\.jsp$/i],
    ["html5-icon",["medium-cyan","medium-cyan"],/\.shtml$/i],
    ["html5-icon",["dark-red","dark-red"],/\.scaml$/i,,false,/^scaml$/,/\.scaml$/i,/^HTML$|^scaml$/i],
    ["html5-icon",["medium-red","medium-red"],/\.vash$/i,,false,/^vash$/,/\.vash$/i,/^HTML$|^vash$/i],
    ["html5-icon",["medium-blue","medium-blue"],/\.dtml$/i,,false,/^dtml$/,/\.dtml$/i,/^HTML$|^dtml$/i],
    ["hy-icon",["dark-blue","dark-blue"],/\.hy$/i,,false,,/\.hy$/i,/^Hy$|^hylang$/i],
    ["idl-icon",["medium-blue","medium-blue"],/\.dlm$/i,,false,,/\.idl$/i,/^IDL$/i],
    ["idris-icon",["dark-red","dark-red"],/\.idr$/i,,false,,/\.(?:idris|ipkg)$/i,/^Idris$/i],
    ["idris-icon",["medium-maroon","medium-maroon"],/\.lidr$/i],
    ["igorpro-icon",["dark-red","dark-red"],/\.ipf$/i],
    ["image-icon",["medium-orange","medium-orange"],/\.a?png$|\.svgz$/i,,false,,,,/^.PNG\r\n\x1A\n/],
    ["image-icon",["medium-yellow","medium-yellow"],/\.gif$|\.ora$|\.sgi$/i,,false,,,,/^GIF8[97]a/],
    ["image-icon",["medium-green","medium-green"],/\.jpg$/i,,false,,,,/^\xFF\xD8\xFF[\xDB\xE0\xE1]|(?:JFIF|Exif)\0|^\xCF\x84\x01|^\xFF\xD8.+\xFF\xD9$/],
    ["image-icon",["medium-blue","medium-blue"],/\.ico$/i,,false,,,,/^\0{2}\x01\0/],
    ["image-icon",["dark-blue","dark-blue"],/\.webp$|\.iff$|\.lbm$|\.liff$|\.nrrd$|\.pcx$|\.vsdx?$/i,,false,,,,/^RIFF.{4}WEBPVP8/],
    ["image-icon",["medium-red","medium-red"],/\.bmp$/i,,false,,,,/^BM/],
    ["image-icon",["medium-red","medium-red"],/\.bpg$/i,,false,,,,/^BPG\xFB/],
    ["image-icon",["medium-orange","medium-orange"],/\.cin$/i,,false,,,,/^\x80\x2A\x5F\xD7/],
    ["image-icon",["dark-green","dark-green"],/\.cd5$/i,,false,,,,/^_CD5\x10\0/],
    ["image-icon",["light-yellow","light-yellow"],/\.cpc$/i],
    ["image-icon",["medium-orange","medium-orange"],/\.cr2$/i,,false,,,,/^II\*\0\x10\0{3}CR/],
    ["image-icon",["medium-pink","medium-pink"],/\.dcm$|\.mpo$|\.pbm$/i,,false,,,,/^.{128}DICM/],
    ["image-icon",["dark-green","dark-green"],/\.dds$/i,,false,,,,/^DDS \|\0{3}/],
    ["image-icon",["medium-purple","medium-purple"],/\.djvu?$|\.pxr$/i,,false,,,,/^AT&TFORM/],
    ["image-icon",["dark-orange","dark-orange"],/\.dpx$|\.raw$/i,,false,,,,/^(?:SDPX|XPDS)/],
    ["image-icon",["light-blue","light-blue"],/\.ecw$|\.sct$/i],
    ["image-icon",["dark-yellow","dark-yellow"],/\.exr$/i,,false,,,,/^v\/1\x01/],
    ["image-icon",["medium-cyan","medium-cyan"],/\.fits?$|\.fts$/i,,false,,,,/^SIMPLE  =/],
    ["image-icon",["dark-red","dark-red"],/\.flif$|\.hdp$|\.heic$|\.heif$|\.jxr$|\.wdp$/i,,false,,,,/^FLIF/],
    ["image-icon",["medium-blue","medium-blue"],/\.hdr$/i,,false,,,,/^#\?RADIANCE\n/],
    ["image-icon",["medium-pink","medium-pink"],/\.icns$/i,,false,,,,/^icns/],
    ["image-icon",["dark-green","dark-green"],/\.(?:jp[f2xm]|j2c|mj2)$/i,,false,,,,/^\0{3}\fjP {2}/],
    ["image-icon",["dark-cyan","dark-cyan"],/\.jps$/i],
    ["image-icon",["medium-orange","medium-orange"],/\.mng$/i,,false,,,,/^.MNG\r\n\x1A\n/],
    ["image-icon",["light-red","light-red"],/\.pgf$/i],
    ["image-icon",["light-purple","light-purple"],/\.pict$/i],
    ["image-icon",["dark-orange","dark-orange"],/\.tga$/i,,false,,,,/TRUEVISION-XFILE\.\0$/],
    ["image-icon",["medium-red","medium-red"],/\.tiff?$/i,,false,,,,/^II\x2A\0|^MM\0\x2A/],
    ["image-icon",["dark-maroon","dark-maroon"],/\.wbm$/i],
    ["inform7-icon",["medium-blue","medium-blue"],/\.ni$/i,,false,,/\.inform-?7?$/i,/^Inform 7$|^i7$/i],
    ["inform7-icon",["dark-blue","dark-blue"],/\.i7x$/i],
    ["inno-icon",["dark-blue","dark-blue"],/\.iss$/i,,false,,/\.inno$/i,/^Inno Setup$/i],
    ["io-icon",["dark-purple","dark-purple"],/\.io$/i,,false,/^io$/,/^source\.io$/i,/^Io$/i],
    ["ioke-icon",["medium-red","medium-red"],/\.ik$/i,,false,/^ioke$/],
    ["isabelle-icon",["dark-red","dark-red"],/\.thy$/i,,false,,/\.isabelle\.theory$/i,/^Isabelle$/i],
    ["isabelle-icon",["dark-blue","dark-blue"],/^ROOT$/],
    ["j-icon",["light-blue","light-blue"],/\.ijs$/i,,false,/^jconsole$/,/\.j$/i,/^J$/i],
    ["jade-icon",["medium-red","medium-red"],/\.jade$/i,,false,,/\.jade$/i,/^Jade$/i],
    ["jake-icon",["medium-maroon","dark-maroon"],/^Jakefile$/],
    ["jake-icon",["medium-yellow","dark-yellow"],/\.jake$/i],
    ["java-icon",["medium-purple","medium-purple"],/\.java$/i,,false,,/\.java$/i,/^Java$/i],
    ["js-icon",["medium-yellow","dark-yellow"],/\.js$|\.es6$|\.es$/i,,false,/^(?:node|iojs)$/,/\.js$/i,/^JavaScript$|^(?:js|node)$/i],
    ["js-icon",["medium-orange","dark-orange"],/\._js$/i],
    ["js-icon",["medium-maroon","dark-maroon"],/\.jsb$|\.dust$/i],
    ["js-icon",["medium-blue","dark-blue"],/\.jsm$|\.mjs$|\.xsjslib$/i],
    ["js-icon",["medium-green","dark-green"],/\.jss$/i],
    ["js-icon",["medium-pink","dark-pink"],/\.sjs$/i],
    ["js-icon",["medium-red","dark-red"],/\.ssjs$/i],
    ["js-icon",["medium-purple","dark-purple"],/\.xsjs$/i],
    ["jenkins-icon",["medium-red","dark-red"],/^Jenkinsfile$/],
    ["jinja-icon",["dark-red","dark-red"],/\.jinja$/i,,false,,/\.jinja$/i,/^Jinja$|^(?:django|htmldjango|html\+django\/jinja|html\+jinja)$/i],
    ["jinja-icon",["medium-red","medium-red"],/\.jinja2$/i],
    ["jsonld-icon",["medium-blue","medium-blue"],/\.jsonld$/i],
    ["sql-icon",["medium-blue","medium-blue"],/\.jq$/i,,false,,/\.jq$/i,/^JSONiq$/i],
    ["jsx-icon",["medium-blue","dark-blue"],/\.jsx$/i,,false,,/\.jsx$/i,/^JSX$/i],
    ["julia-icon",["medium-purple","medium-purple"],/\.jl$/i,,false,,/\.julia$/i,/^Julia$/i],
    ["jupyter-icon",["dark-orange","dark-orange"],/\.ipynb$/i,,false,,/\.ipynb$/i,/^(?:ipynb|(?:Jupyter|IPython)\s*Notebook)$/i],
    ["jupyter-icon",["dark-cyan","dark-cyan"],/^Notebook$/],
    ["keynote-icon",["medium-blue","medium-blue"],/\.keynote$/i],
    ["keynote-icon",["dark-blue","dark-blue"],/\.knt$/i],
    ["kivy-icon",["dark-maroon","dark-maroon"],/\.kv$/i,,false,,/\.kv$/i,/^Kivy$/i],
    ["earth-icon",["medium-green","medium-green"],/\.kml$/i],
    ["kotlin-icon",["dark-blue","dark-blue"],/\.kt$/i,,false,/^kotlin$/,/\.kotlin$/i,/^k[0o]tlin$/i],
    ["kotlin-icon",["medium-blue","medium-blue"],/\.ktm$/i],
    ["kotlin-icon",["medium-orange","medium-orange"],/\.kts$/i],
    ["krl-icon",["medium-blue","medium-blue"],/\.krl$/i,,false,,/\.krl$/i,/^KRL$/i],
    ["labview-icon",["dark-blue","dark-blue"],/\.lvproj$/i],
    ["laravel-icon",["medium-orange","medium-orange"],/\.blade\.php$/i,,false,,/\.php\.blade$/i,/^Laravel$/i],
    ["lasso-icon",["dark-blue","dark-blue"],/\.lasso$|\.las$/i,,false,,/\.lasso$/i,/^Lasso$|^lass[0o]script$/i],
    ["lasso-icon",["medium-blue","medium-blue"],/\.lasso8$/i],
    ["lasso-icon",["medium-purple","medium-purple"],/\.lasso9$/i],
    ["lasso-icon",["medium-red","medium-red"],/\.ldml$/i],
    ["lean-icon",["dark-purple","dark-purple"],/\.lean$/i,,false,/^lean$/,/\.lean$/i,/^lean$/i],
    ["lean-icon",["dark-red","dark-red"],/\.hlean$/i],
    ["lfe-icon",["dark-red","dark-red"],/\.lfe$/i],
    ["lightwave-icon",["medium-red","medium-red"],/\.lwo$/i],
    ["lightwave-icon",["medium-blue","medium-blue"],/\.lws$/i],
    ["lisp-icon",["medium-red","medium-red"],/\.lsp$/i,,false,/^newlisp$/,/\.newlisp$/i,/^Lisp$|^newlisp$/i],
    ["lisp-icon",["dark-red","dark-red"],/\.lisp$/i,,false,/^lisp$/,/\.lisp$/i,/^lisp$/i],
    ["lisp-icon",["medium-maroon","medium-maroon"],/\.l$|\.nl$/i,,false,/picolisp|pil/],
    ["lisp-icon",["medium-blue","medium-blue"],/\.ny$|\.sexp$/i],
    ["lisp-icon",["medium-purple","medium-purple"],/\.podsl$/i],
    ["ls-icon",["medium-blue","medium-blue"],/\.ls$/i,,false,,/\.livescript$/i,/^LiveScript$|^(?:ls|live-script)$/i],
    ["ls-icon",["dark-blue","dark-blue"],/\._ls$/i],
    ["ls-icon",["medium-green","medium-green"],/^Slakefile$/],
    ["llvm-icon",["dark-green","dark-green"],/\.ll$/i,,false,/^llvm$/,/\.llvm$/i,/^llvm$/i],
    ["llvm-icon",["medium-yellow","dark-yellow"],/\.clang-format$/i],
    ["mobile-icon",["dark-blue","dark-blue"],/\.xm$/i,,false,/^logos$/,/\.logos$/i,/^l[0o]g[0o]s$/i],
    ["mobile-icon",["dark-red","dark-red"],/\.xi$/i],
    ["logtalk-icon",["medium-red","medium-red"],/\.(?:logtalk|lgt)$/i,,false,,/\.logtalk$/i,/^Logtalk$/i],
    ["lookml-icon",["medium-purple","medium-purple"],/\.lookml$/i],
    ["lsl-icon",["medium-cyan","medium-cyan"],/\.lsl$/i,,false,/^lsl$/,/\.lsl$/i,/^lsl$/i],
    ["lsl-icon",["dark-cyan","dark-cyan"],/\.lslp$/i],
    ["lua-icon",["medium-blue","medium-blue"],/\.lua$/i,,false,/^lua$/,/\.lua$/i,/^lua$/i],
    ["lua-icon",["dark-blue","dark-blue"],/\.pd_lua$/i],
    ["lua-icon",["dark-purple","dark-purple"],/\.rbxs$/i],
    ["lua-icon",["dark-red","dark-red"],/\.wlua$/i],
    ["checklist-icon",["medium-yellow","medium-yellow"],/^Makefile|^makefile$/,,false,/^make$/,/\.makefile$/i,/^Makefile$|^(?:bsdmake|make|mf)$/i],
    ["checklist-icon",["medium-yellow","medium-yellow"],/\.(?:mk|mak|make)$|^mkfile$/i],
    ["checklist-icon",["medium-red","medium-red"],/^BSDmakefile$|\.am$/i],
    ["checklist-icon",["medium-green","medium-green"],/^GNUmakefile$/i],
    ["checklist-icon",["medium-blue","medium-blue"],/^Kbuild$/],
    ["checklist-icon",["dark-blue","dark-blue"],/\.bb$/i],
    ["checklist-icon",["dark-blue","dark-blue"],/^DEPS$/],
    ["checklist-icon",["medium-blue","medium-blue"],/\.mms$/i],
    ["checklist-icon",["light-blue","light-blue"],/\.mmk$/i],
    ["checklist-icon",["dark-purple","dark-purple"],/\.pri$/i],
    ["mako-icon",["dark-blue","dark-blue"],/\.mak?o$/i,,false,,/\.mako$/i,/^Mako$/i],
    ["manpage-icon",["dark-green","dark-green"],/\.(?:1(?:[bcmsx]|has|in)?|[24568]|3(?:avl|bsm|3c|in|m|qt|x)?|7(?:d|fs|i|ipp|m|p)?|9[efps]?|chem|eqn|groff|man|mandoc|mdoc|me|mom|n|nroff|pic|tmac|tmac-u|tr|troff)$/i,,false,/man|mandoc|(?:[gnt]|dit)roff/i,/\.[gt]?roff$/i,/^Manual Page$|^(?:[gtn]?roff|manpage)$/i,/^\.TH[ \t]+(?:\S+)|^'\\" [tre]+(?=\s|$)/],
    ["manpage-icon",["dark-maroon","dark-maroon"],/\.(?:rnh|rno|roff|run|runoff)$/i,,false,/^runoff$/,/\.runoff$/i,/^Manual Page$|^run[0o]ff$/i],
    ["mapbox-icon",["medium-cyan","medium-cyan"],/\.mss$/i,,false,,/\.mss$/i,/^Mapbox$|^Carto(?:CSS)?$/i],
    ["markdown-icon",["medium-blue","medium-blue"],/\.(?:md|mdown|markdown|mkd|mkdown|mkdn|rmd|ron)$/i,,false,,/\.gfm$/i,/^Markdown$/i],
    ["mathematica-icon",["dark-red","dark-red"],/\.mathematica$|\.nbp$/i,,false,,/\.mathematica$/i,/^Mathematica$|^mma$/i],
    ["mathematica-icon",["medium-red","medium-red"],/\.cdf$/i],
    ["mathematica-icon",["medium-orange","medium-orange"],/\.ma$/i],
    ["mathematica-icon",["medium-maroon","medium-maroon"],/\.mt$/i],
    ["mathematica-icon",["dark-orange","dark-orange"],/\.nb$/i],
    ["mathematica-icon",["medium-yellow","medium-yellow"],/\.wl$/i],
    ["mathematica-icon",["dark-yellow","dark-yellow"],/\.wlt$/i],
    ["matlab-icon",["medium-yellow","medium-yellow"],/\.matlab$/i,,false,,/\.(?:matlab|octave)$/i,/^MATLAB$|^[0o]ctave$/i],
    ["max-icon",["dark-purple","dark-purple"],/\.maxpat$/i],
    ["max-icon",["medium-red","medium-red"],/\.maxhelp$/i],
    ["max-icon",["medium-blue","medium-blue"],/\.maxproj$/i],
    ["max-icon",["medium-purple","medium-purple"],/\.mxt$/i],
    ["max-icon",["medium-green","medium-green"],/\.pat$/i],
    ["maxscript-icon",["dark-blue","dark-blue"],/\.ms$/i,,false,,/\.maxscript$/i,/^MAXScript$/i],
    ["maxscript-icon",["dark-purple","dark-purple"],/\.mcr$/i],
    ["maxscript-icon",["medium-red","medium-red"],/\.mce$/i],
    ["maxscript-icon",["dark-cyan","dark-cyan"],/\.max$/i],
    ["maxscript-icon",["medium-cyan","medium-cyan"],/\.3ds$/i],
    ["maya-icon",["dark-cyan","dark-cyan"],/\.mb$/i],
    ["maya-icon",["dark-blue","dark-blue"],/\.mel$/i],
    ["maya-icon",["dark-purple","dark-purple"],/\.mcf[ip]$/i],
    ["mediawiki-icon",["medium-yellow","medium-yellow"],/\.mediawiki$/i,,false,/^mediawiki$/,/\.mediawiki$/i,/^mediawiki$/i],
    ["mediawiki-icon",["medium-orange","medium-orange"],/\.wiki$/i],
    ["bullhorn-icon",["medium-orange","medium-orange"],/^\.mention-bot$/i],
    ["mercury-icon",["medium-cyan","medium-cyan"],/\.moo$/i,,false,/^mmi$/,/\.mercury$/i,/^Mercury$/i],
    ["metal-icon",["dark-cyan","dark-cyan"],/\.metal$/i],
    ["access-icon",["dark-maroon","dark-maroon"],/\.accda$/i],
    ["access-icon",["medium-maroon","medium-maroon"],/\.accdb$/i],
    ["access-icon",["medium-green","medium-green"],/\.accde$/i],
    ["access-icon",["medium-red","medium-red"],/\.accdr$/i],
    ["access-icon",["dark-red","dark-red"],/\.accdt$/i],
    ["access-icon",["light-maroon","light-maroon"],/\.adn$|\.laccdb$/i],
    ["access-icon",["dark-purple","dark-purple"],/\.mdw$/i],
    ["excel-icon",["dark-orange","dark-orange"],/\.xls$/i],
    ["excel-icon",["dark-green","dark-green"],/\.xlsx$/i],
    ["excel-icon",["medium-green","medium-green"],/\.xlsm$/i],
    ["excel-icon",["medium-red","medium-red"],/\.xlsb$/i],
    ["excel-icon",["dark-cyan","dark-cyan"],/\.xlt$/i],
    ["onenote-icon",["dark-purple","dark-purple"],/\.one$/i],
    ["powerpoint-icon",["dark-red","dark-red"],/\.pps$/i],
    ["powerpoint-icon",["medium-orange","medium-orange"],/\.ppsx$/i],
    ["powerpoint-icon",["dark-orange","dark-orange"],/\.ppt$/i],
    ["powerpoint-icon",["medium-red","medium-red"],/\.pptx$/i],
    ["powerpoint-icon",["medium-maroon","medium-maroon"],/\.potm$/i],
    ["powerpoint-icon",["dark-green","dark-green"],/\.mpp$/i],
    ["word-icon",["medium-blue","medium-blue"],/\.doc$/i],
    ["word-icon",["dark-blue","dark-blue"],/\.docx$/i],
    ["word-icon",["medium-maroon","medium-maroon"],/\.docm$/i],
    ["word-icon",["dark-cyan","dark-cyan"],/\.docxml$/i],
    ["word-icon",["dark-maroon","dark-maroon"],/\.dotm$/i],
    ["word-icon",["medium-cyan","medium-cyan"],/\.dotx$/i],
    ["word-icon",["medium-orange","medium-orange"],/\.wri$/i],
    ["minecraft-icon",["dark-green","dark-green"],/^mcmod\.info$/i,,false,,/\.forge-config$/i,/^Minecraft$/i],
    ["mirah-icon",["medium-blue","medium-blue"],/\.dr?uby$/g,,false,/^mirah$/,/\.mirah$/i,/^mirah$/i],
    ["mirah-icon",["light-blue","light-blue"],/\.mir(?:ah)?$/g],
    ["model-icon",["medium-red","medium-red"],/\.obj$/i,,false,,/\.wavefront\.obj$/i],
    ["model-icon",["dark-blue","dark-blue"],/\.mtl$/i,,false,,/\.wavefront\.mtl$/i],
    ["model-icon",["dark-green","dark-green"],/\.stl$/i],
    ["model-icon",["medium-orange","medium-orange"],/\.u3d$/i],
    ["circle-icon",["light-red","light-red"],/\.mo$/i,,false,,/\.modelica(?:script)?$/i,/^Modelica$/i],
    ["modula2-icon",["medium-blue","medium-blue"],/\.mod$/i,,false,,/(?:^|\.)modula-?2(?:\.|$)/i,/^Modula-2$/i],
    ["modula2-icon",["medium-green","medium-green"],/\.def$/i],
    ["modula2-icon",["medium-red","medium-red"],/\.m2$/i],
    ["monkey-icon",["medium-maroon","medium-maroon"],/\.monkey$/i,,false,,/\.monkey$/i,/^Monkey$/i],
    ["moon-icon",["medium-yellow","medium-yellow"],/\.moon$/i,,false,/^moon$/,/\.moon$/i,/^MoonScript$/i],
    ["mruby-icon",["medium-red","medium-red"],/\.mrb$/i,,false,/^mruby$/],
    ["msql-icon",["medium-purple","medium-purple"],/\.dsql$/i],
    ["mupad-icon",["medium-red","medium-red"],/\.mu$/i],
    ["music-icon",["medium-orange","medium-orange"],/\.chord$/i],
    ["music-icon",["dark-blue","dark-blue"],/\.midi?$/i,,false,,,,/^MThd/],
    ["music-icon",["medium-green","medium-green"],/\.ly$/i,,false,,/\.(?:At)?lilypond-/i,/^Lily\s*Pond$/i],
    ["music-icon",["dark-green","dark-green"],/\.ily$/i],
    ["music-icon",["dark-red","dark-red"],/\.pd$/i],
    ["mustache-icon",["medium-orange","medium-orange"],/\.(?:hbs|handlebars|mustache)$/i,,false,,/(?:^|\.)(?:mustache|handlebars)(?:\.|$)/i,/^Mustache$|^(?:hbs|htmlbars|handlebars)$/i],
    ["nant-icon",["medium-orange","medium-orange"],/\.build$/i,,false,,/\.nant-build$/i,/^NAnt$/i],
    ["earth-icon",["medium-green","medium-green"],/\.ncl$/i,,false,,/\.ncl$/i,/^NCAR Command Language \(NCL\)$/i],
    ["neko-icon",["medium-orange","medium-orange"],/\.neko$/i,,false,/^neko$/,/\.neko$/i,/^nek[0o]$/i],
    ["amx-icon",["medium-blue","medium-blue"],/\.axs$/i],
    ["amx-icon",["dark-blue","dark-blue"],/\.axi$/i],
    ["netlogo-icon",["medium-red","medium-red"],/\.nlogo$/i],
    ["nginx-icon",["medium-green","medium-green"],/\.nginxconf$/i,,false,,/\.nginx$/i,/^NGINX$|^nginx[\W_ \t]?c[0o]nfigurati[0o]n[\W_ \t]?file$/i],
    ["nib-icon",["dark-orange","dark-orange"],/\.nib$/i],
    ["nimrod-icon",["medium-green","medium-green"],/\.nim(?:rod)?$/i,,false,,/\.nim$/i,/^Nimrod$/i],
    ["shuriken-icon",["medium-blue","medium-blue"],/\.ninja$/i,,false,/^ninja$/,/\.ninja$/i,/^ninja$/i],
    ["nit-icon",["dark-green","dark-green"],/\.nit$/i,,false,,/\.nit$/i,/^Nit$/i],
    ["nix-icon",["medium-cyan","medium-cyan"],/\.nix$/i,,false,,/\.nix$/i,/^Nix$|^nix[0o]s$/i],
    ["nmap-icon",["dark-blue","dark-blue"],/\.nse$/i,,false,,/\.nmap$/i,/^Nmap$/i],
    ["node-icon",["medium-green","medium-green"],/\.njs$|\.nvmrc$/i],
    ["node-icon",["dark-green","dark-green"],/\.node-version$/i],
    ["nsis-icon",["medium-purple","medium-purple"],/\.nsi$/i,,false,/^nsis$/,/\.nsis$/i,/^nsis$/i],
    ["nsis-icon",["dark-cyan","dark-cyan"],/\.nsh$/i],
    ["recycle-icon",["light-green","light-green"],/\.nu$/i,,false,/^nush$/,/\.nu$/i,/^Nu$|^nush$/i],
    ["recycle-icon",["dark-green","dark-green"],/^Nukefile$/],
    ["nuget-icon",["medium-blue","medium-blue"],/\.nuspec$/i],
    ["nuget-icon",["dark-purple","dark-purple"],/\.pkgproj$/i],
    ["numpy-icon",["dark-blue","dark-blue"],/\.numpy$/i],
    ["numpy-icon",["medium-blue","medium-blue"],/\.numpyw$/i],
    ["numpy-icon",["medium-orange","medium-orange"],/\.numsc$/i],
    ["nunjucks-icon",["dark-green","dark-green"],/\.(?:nunjucks|njk)$/i],
    ["objc-icon",["medium-blue","medium-blue"],/\.mm?$/i,,false,,/\.objc(?:pp)?$/i,/^Objective-C$|^(?:Obj-?C|ObjectiveC)(?:\+\+)?$/i],
    ["objc-icon",["dark-red","dark-red"],/\.pch$/i],
    ["objc-icon",["dark-green","dark-green"],/\.x$/i],
    ["objj-icon",["dark-orange","dark-orange"],/\.j$/i,,false,,/\.objj$/i,/^Objective-J$|^(?:Obj-?J|ObjectiveJ)$/i],
    ["objj-icon",["dark-red","dark-red"],/\.sj$/i],
    ["ocaml-icon",["medium-orange","medium-orange"],/\.ml$/i,,false,/ocaml(?:run|script)?/,/\.ocaml$/i,/^OCaml$/i],
    ["ocaml-icon",["dark-orange","dark-orange"],/\.mli$/i],
    ["ocaml-icon",["medium-red","medium-red"],/\.eliom$/i],
    ["ocaml-icon",["dark-red","dark-red"],/\.eliomi$/i],
    ["ocaml-icon",["medium-green","medium-green"],/\.ml4$/i],
    ["ocaml-icon",["dark-green","dark-green"],/\.mll$/i,,false,/^ocamllex$/,/\.ocamllex$/i,/^OCaml$|^[0o]camllex$/i],
    ["ocaml-icon",["dark-yellow","dark-yellow"],/\.mly$/i,,false,/^menhir$/,/\.menhir$/i,/^OCaml$|^menhir$/i],
    ["ooc-icon",["medium-green","medium-green"],/\.ooc$/i,,false,,/\.ooc$/i,/^OOC$/i],
    ["opa-icon",["medium-blue","medium-blue"],/\.opa$/i,,false,,/\.opa$/i,/^Opa$/i],
    ["opencl-icon",["medium-red","medium-red"],/\.opencl$/i,,false,,/\.opencl$/i,/^OpenCL$/i],
    ["progress-icon",["medium-red","medium-red"],/\.p$/i,,false,,/\.abl$/i,/^OpenEdge ABL$|^(?:progress|openedge|abl)$/i],
    ["openoffice-icon",["medium-blue","medium-blue"],/\.odt$/i],
    ["openoffice-icon",["dark-blue","dark-blue"],/\.ott$/i],
    ["openoffice-icon",["dark-purple","dark-purple"],/\.fodt$/i],
    ["openoffice-icon",["medium-green","medium-green"],/\.ods$/i],
    ["openoffice-icon",["dark-green","dark-green"],/\.ots$/i],
    ["openoffice-icon",["dark-cyan","dark-cyan"],/\.fods$/i],
    ["openoffice-icon",["medium-purple","medium-purple"],/\.odp$/i],
    ["openoffice-icon",["dark-pink","dark-pink"],/\.otp$/i],
    ["openoffice-icon",["medium-pink","medium-pink"],/\.fodp$/i],
    ["openoffice-icon",["medium-red","medium-red"],/\.odg$/i],
    ["openoffice-icon",["dark-red","dark-red"],/\.otg$/i],
    ["openoffice-icon",["dark-orange","dark-orange"],/\.fodg$/i],
    ["openoffice-icon",["medium-maroon","medium-maroon"],/\.odf$/i],
    ["openoffice-icon",["light-pink","light-pink"],/\.odb$/i],
    ["scad-icon",["medium-orange","medium-orange"],/\.scad$/i,,false,,/\.scad$/i,/^OpenSCAD$/i],
    ["scad-icon",["medium-yellow","medium-yellow"],/\.jscad$/i],
    ["org-icon",["dark-green","dark-green"],/\.org$/i],
    ["osx-icon",["medium-red","medium-red"],/\.dmg$/i,,false,,,,/^\x78\x01\x73\x0D\x62\x62\x60/],
    ["ox-icon",["medium-cyan","dark-cyan"],/\.ox$/i,,false,,/\.ox$/i,/^Ox$/i],
    ["ox-icon",["medium-green","dark-green"],/\.oxh$/i],
    ["ox-icon",["medium-blue","dark-blue"],/\.oxo$/i],
    ["oxygene-icon",["medium-cyan","dark-cyan"],/\.oxygene$/i,,false,,/\.oxygene$/i,/^Oxygene$/i],
    ["oz-icon",["medium-yellow","medium-yellow"],/\.oz$/i,,false,,/\.oz$/i,/^Oz$/i],
    ["pan-icon",["medium-red","medium-red"],/\.pan$/i],
    ["papyrus-icon",["medium-green","medium-green"],/\.psc$/i,,false,,/(?:^|\.)(?:papyrus\.skyrim|compiled-?papyrus|papyrus-assembly)(?:\.|$)/i,/^Papyrus$/i],
    ["parrot-icon",["medium-green","medium-green"],/\.parrot$/i,,false,/^parrot$/],
    ["parrot-icon",["dark-green","dark-green"],/\.pasm$/i,,false,,/\.parrot\.pasm$/i,/^Parrot$|^pasm$/i],
    ["parrot-icon",["dark-blue","dark-blue"],/\.pir$/i,,false,,/\.parrot\.pir$/i,/^Parrot$|^pir$/i],
    ["pascal-icon",["medium-purple","medium-purple"],/\.pas(?:cal)?$/i,,false,/pascal|instantfpc/,/\.pascal$/i,/^Pascal$/i],
    ["pascal-icon",["medium-blue","medium-blue"],/\.dfm$/i],
    ["pascal-icon",["dark-blue","dark-blue"],/\.dpr$/i],
    ["pascal-icon",["dark-purple","dark-purple"],/\.lpr$/i],
    ["patch-icon",["medium-green","medium-green"],/\.patch$/i],
    ["pawn-icon",["medium-orange","medium-orange"],/\.pwn$/i,,false,,/\.pwn$/i,/^PAWN$/i],
    ["pdf-icon",["medium-red","medium-red"],/\.pdf$/i,,false,,,,/^%PDF/],
    ["perl-icon",["medium-blue","medium-blue"],/\.p(?:er)?l$|\.t$/i,,false,/^perl$/,/\.perl$/i,/^perl$/i],
    ["perl-icon",["dark-purple","dark-purple"],/\.ph$/i],
    ["perl-icon",["medium-purple","medium-purple"],/\.plx$/i],
    ["perl-icon",["dark-blue","dark-blue"],/\.pm$/i],
    ["perl-icon",["medium-red","medium-red"],/\.(?:psgi|xs)$/i],
    ["perl6-icon",["medium-purple","medium-purple"],/\.pl6$/i,,false,/^perl6$/,/(?:^|\.)perl6(?:fe)?(?=\.|$)/,/^(?:pl6|Perl\s*6)$/i],
    ["perl6-icon",["light-blue","light-blue"],/\.[tp]6$|\.6pl$/i],
    ["perl6-icon",["dark-pink","dark-pink"],/\.(?:pm6|p6m)$/i],
    ["perl6-icon",["dark-cyan","dark-cyan"],/\.6pm$/i],
    ["perl6-icon",["dark-purple","dark-purple"],/\.nqp$/i],
    ["perl6-icon",["medium-blue","medium-blue"],/\.p6l$/i],
    ["perl6-icon",["dark-green","dark-green"],/\.pod6$/i],
    ["perl6-icon",["medium-green","medium-green"],/^Rexfile$/],
    ["phalcon-icon",["medium-cyan","medium-cyan"],/\.volt$/i,,false,,/\.volt$/i,/^Phalcon$/i],
    ["php-icon",["dark-blue","dark-blue"],/\.php(?:[st\d]|_cs)?$/i,,false,/^php$/,/\.php$/i,/^PHP$/i,/^<\?php/],
    ["php-icon",["dark-green","dark-green"],/^Phakefile/],
    ["pickle-icon",["dark-cyan","dark-cyan"],/\.pkl$/i],
    ["pike-icon",["dark-cyan","dark-cyan"],/\.pike$/i,,false,/^pike$/],
    ["pike-icon",["medium-blue","medium-blue"],/\.pmod$/i],
    ["sql-icon",["medium-red","medium-red"],/\.(?:pls|pck|pks|plb|plsql|pkb)$/i,,false,,/\.plsql(?:\.oracle)?(?:\.|$)/i,/^PLSQL$/i],
    ["pod-icon",["dark-blue","dark-blue"],/\.pod$/i],
    ["pogo-icon",["medium-orange","dark-orange"],/\.pogo$/i,,false,,/\.pogoscript$/i,/^PogoScript$/i],
    ["pony-icon",["light-maroon","light-maroon"],/\.pony$/i,,false,,/\.pony$/i,/^Pony$/i],
    ["postcss-icon",["dark-red","dark-red"],/\.p(?:ost)?css$/i,,false,/^postcss$/,/\.postcss$/i,/^p[0o]stcss$/i],
    ["postcss-icon",["dark-pink","dark-pink"],/\.sss$/i,,false,/^sugarss$/,/\.sugarss$/i,/^PostCSS$|^sugarss$/i],
    ["postcss-icon",["medium-orange","dark-orange"],/\.postcssrc$/i],
    ["postscript-icon",["medium-red","medium-red"],/\.ps$/i,,false,,/\.postscript$/i,/^PostScript$|^p[0o]stscr$/i,/^%!PS/],
    ["postscript-icon",["medium-orange","medium-orange"],/\.eps$/i],
    ["postscript-icon",["dark-blue","dark-blue"],/\.pfa$/i],
    ["postscript-icon",["medium-green","medium-green"],/\.afm$/i],
    ["povray-icon",["dark-blue","dark-blue"],/\.pov$/i],
    ["powerbuilder-icon",["medium-blue","medium-blue"],/\.pbl$|\.sra$/i],
    ["powerbuilder-icon",["dark-blue","dark-blue"],/\.pbt$/i],
    ["powerbuilder-icon",["medium-red","medium-red"],/\.srw$/i],
    ["powerbuilder-icon",["medium-orange","medium-orange"],/\.sru$/i],
    ["powerbuilder-icon",["medium-maroon","medium-maroon"],/\.srp$/i],
    ["powerbuilder-icon",["medium-purple","medium-purple"],/\.srj$/i],
    ["powershell-icon",["medium-blue","medium-blue"],/\.ps1$/i,,false,,/\.powershell$/i,/^PowerShell$|^p[0o]sh$/i],
    ["powershell-icon",["dark-blue","dark-blue"],/\.psd1$/i],
    ["powershell-icon",["medium-purple","medium-purple"],/\.psm1$/i],
    ["powershell-icon",["dark-purple","dark-purple"],/\.ps1xml$/i],
    ["print-icon",["dark-cyan","dark-cyan"],/\.ppd$/i],
    ["processing-icon",["dark-blue","dark-blue"],/\.pde$/i,,false,,/\.processing$/i,/^Processing$/i],
    ["prolog-icon",["medium-blue","medium-blue"],/\.pro$/i,,false,/^swipl$/,/\.prolog$/i,/^Prolog$/i],
    ["prolog-icon",["medium-cyan","medium-cyan"],/\.prolog$/i],
    ["prolog-icon",["medium-purple","medium-purple"],/\.yap$/i,,false,/^yap$/],
    ["propeller-icon",["medium-orange","medium-orange"],/\.spin$/i,,false,,/\.spin$/i,/^Propeller Spin$/i],
    ["pug-icon",["medium-red","medium-red"],/\.pug$/i,,false,,/\.pug$/i,/^Pug$/i],
    ["puppet-icon",["medium-purple","medium-purple"],/\.pp$/i,,false,/^puppet$/,/\.puppet$/i,/^puppet$/i],
    ["puppet-icon",["dark-blue","dark-blue"],/Modulefile$/i],
    ["purebasic-icon",["medium-red","medium-red"],/\.pb$/i,,false,/^purebasic$/,/\.purebasic$/i,/^purebasic$/i],
    ["purebasic-icon",["dark-orange","dark-orange"],/\.pbi$/i],
    ["purescript-icon",["dark-purple","dark-purple"],/\.purs$/i,,false,,/\.purescript$/i,/^PureScript$/i],
    ["python-icon",["dark-blue","dark-blue"],/\.py$|\.bzl$|\.py3$|\.?(?:pypirc|pythonrc|python-venv)$/i,,false,/python[\d.]*/,/\.python$/i,/^Python$|^rusth[0o]n$/i],
    ["python-icon",["medium-blue","medium-blue"],/\.ipy$/i],
    ["python-icon",["dark-green","dark-green"],/\.isolate$|\.gypi$|\.pyt$/i],
    ["python-icon",["medium-orange","medium-orange"],/\.pep$|\.pyde$/i,,false,/^pep8$/,/\.pep8$/i,/^Python$|^pep8$/i],
    ["python-icon",["medium-green","medium-green"],/\.gyp$/i],
    ["python-icon",["dark-purple","dark-purple"],/\.pyp$/i],
    ["python-icon",["medium-maroon","medium-maroon"],/\.pyw$/i],
    ["python-icon",["dark-pink","dark-pink"],/\.tac$/i],
    ["python-icon",["dark-red","dark-red"],/\.wsgi$/i],
    ["python-icon",["medium-yellow","dark-yellow"],/\.xpy$/i],
    ["python-icon",["medium-pink","medium-pink"],/\.rpy$/i,,false,,/\.renpy$/i,/^Python$|^Ren'?Py$/i],
    ["python-icon",["dark-green","dark-green"],/^(?:BUCK|BUILD|SConstruct|SConscript)$/],
    ["python-icon",["medium-green","medium-green"],/^(?:Snakefile|WATCHLISTS)$/],
    ["python-icon",["dark-maroon","dark-maroon"],/^wscript$/],
    ["r-icon",["medium-blue","medium-blue"],/\.(?:r|Rprofile|rsx|rd)$/i,,false,/^Rscript$/,/\.r$/i,/^R$|^(?:Rscript|splus|Rlang)$/i],
    ["racket-icon",["medium-red","medium-red"],/\.rkt$/i,,false,/^racket$/,/\.racket$/i,/^racket$/i],
    ["racket-icon",["medium-blue","medium-blue"],/\.rktd$/i],
    ["racket-icon",["light-red","light-red"],/\.rktl$/i],
    ["racket-icon",["dark-blue","dark-blue"],/\.scrbl$/i,,false,/^scribble$/,/\.scribble$/i,/^Racket$|^scribble$/i],
    ["raml-icon",["medium-cyan","medium-cyan"],/\.raml$/i,,false,,/\.raml$/i,/^RAML$/i],
    ["rascal-icon",["medium-yellow","medium-yellow"],/\.rsc$/i,,false,,/\.rascal$/i,/^Rascal$/i],
    ["rdoc-icon",["medium-red","medium-red"],/\.rdoc$/i,,false,,/\.rdoc$/i,/^RDoc$/i],
    ["xojo-icon",["medium-green","medium-green"],/\.rbbas$/i],
    ["xojo-icon",["dark-green","dark-green"],/\.rbfrm$/i],
    ["xojo-icon",["dark-cyan","dark-cyan"],/\.rbmnu$/i],
    ["xojo-icon",["medium-cyan","medium-cyan"],/\.rbres$/i],
    ["xojo-icon",["medium-blue","medium-blue"],/\.rbtbar$/i],
    ["xojo-icon",["dark-blue","dark-blue"],/\.rbuistate$/i],
    ["reason-icon",["medium-red","medium-red"],/\.re$/i,,false,/^reason$/,/\.reason$/i,/^reas[0o]n$/i],
    ["reason-icon",["medium-orange","medium-orange"],/\.rei$/i],
    ["rebol-icon",["dark-green","dark-green"],/\.reb(?:ol)?$/i,,false,/^rebol$/,/\.rebol$/i,/^reb[0o]l$/i],
    ["rebol-icon",["dark-red","dark-red"],/\.r2$/i],
    ["rebol-icon",["dark-blue","dark-blue"],/\.r3$/i],
    ["red-icon",["medium-red","medium-red"],/\.red$/i,,false,,/\.red$/i,/^Red$|^red\/?system$/i],
    ["red-icon",["light-red","light-red"],/\.reds$/i],
    ["red-hat-icon",["medium-red","medium-red"],/\.rpm$/i],
    ["red-hat-icon",["dark-red","dark-red"],/\.spec$/i],
    ["regex-icon",["medium-green","medium-green"],/\.regexp?$/i,,false,,/(?:\.|^)regexp?(?:\.|$)/i,/^RegExp$/i],
    ["android-icon",["dark-maroon","dark-maroon"],/\.rsh$/i],
    ["rst-icon",["dark-blue","dark-blue"],/\.re?st(?:\.txt)?$/i,,false,,/\.restructuredtext$/i,/^reStructuredText$|^re?st$/i],
    ["rexx-icon",["medium-red","medium-red"],/\.rexx?$/i,,false,/rexx|regina/i,/\.rexx$/i,/^REXX$/i],
    ["rexx-icon",["medium-blue","medium-blue"],/\.pprx$/i],
    ["riot-icon",["medium-red","medium-red"],/\.tag$/i,,false,,/\.riot$/i,/^RiotJS$/i],
    ["robot-icon",["medium-purple","medium-purple"],/\.robot$/i],
    ["clojure-icon",["medium-red","medium-red"],/\.rg$/i],
    ["rss-icon",["medium-orange","medium-orange"],/\.rss$/i],
    ["ruby-icon",["medium-red","medium-red"],/\.(?:rb|ru|ruby|erb|gemspec|god|mspec|pluginspec|podspec|rabl|rake|opal)$|^\.?(?:irbrc|gemrc|pryrc|rspec|ruby-(?:gemset|version))$/i,,false,/(?:mac|j)?ruby|rake|rbx/,/\.ruby$/i,/^Ruby$|^(?:rbx?|rake|jruby|macruby)$/i],
    ["ruby-icon",["medium-red","medium-red"],/^(?:Appraisals|(?:Rake|Gem|[bB]uild|Berks|Cap|Danger|Deliver|Fast|Guard|Jar|Maven|Pod|Puppet|Snap)file(?:\.lock)?)$|^rails$/],
    ["ruby-icon",["dark-red","dark-red"],/\.(?:jbuilder|rbuild|rb[wx]|builder)$/i],
    ["ruby-icon",["dark-yellow","dark-yellow"],/\.watchr$/i],
    ["rust-icon",["medium-maroon","medium-maroon"],/\.rs$/i,,false,/^rust$/,/\.rust$/i,/^rust$/i],
    ["rust-icon",["light-maroon","light-maroon"],/\.rlib$/i],
    ["sage-icon",["medium-blue","medium-blue"],/\.sage$/i,,false,/^sage$/,/\.sage$/i,/^sage$/i],
    ["sage-icon",["dark-blue","dark-blue"],/\.sagews$/i],
    ["saltstack-icon",["medium-blue","dark-blue"],/\.sls$/i,,false,,/\.salt$/i,/^SaltStack$|^Salt(?:State)?$/i],
    ["sas-icon",["medium-blue","medium-blue"],/\.sas$/i,,false,,/\.sas$/i,/^SAS$/i],
    ["sass-icon",["light-pink","light-pink"],/\.scss$/i,,false,/^scss$/,/\.scss$/i,/^Sass$|^scss$/i],
    ["sass-icon",["dark-pink","dark-pink"],/\.sass$/i,,false,/^sass$/,/\.sass$/i,/^sass$/i],
    ["sbt-icon",["dark-purple","dark-purple"],/\.sbt$/i],
    ["scala-icon",["medium-red","medium-red"],/\.(?:sc|scala)$/i,,false,/^scala$/,/\.scala$/i,/^Scala$/i],
    ["scheme-icon",["medium-red","medium-red"],/\.scm$/i,,false,/guile|bigloo|chicken/,/\.scheme$/i,/^Scheme$/i],
    ["scheme-icon",["medium-blue","medium-blue"],/\.sld$/i],
    ["scheme-icon",["medium-purple","medium-purple"],/\.sps$/i],
    ["scilab-icon",["dark-purple","dark-purple"],/\.sci$/i,,false,/^scilab$/,/\.scilab$/i,/^scilab$/i],
    ["scilab-icon",["dark-blue","dark-blue"],/\.sce$/i],
    ["scilab-icon",["dark-cyan","dark-cyan"],/\.tst$/i],
    ["secret-icon",[null,null],/\.secret$/i],
    ["self-icon",["dark-blue","dark-blue"],/\.self$/i,,false,,/\.self$/i,/^Self$/i],
    ["graph-icon",["light-red","light-red"],/\.csv$/i,,false,,/(?:^|\.)csv(?:\.semicolon)?(?:\.|$)/i],
    ["graph-icon",["light-green","light-green"],/\.(?:tab|tsv)$/i],
    ["graph-icon",["medium-green","medium-green"],/\.dif$/i],
    ["graph-icon",["medium-cyan","medium-cyan"],/\.slk$/i],
    ["sf-icon",["light-orange","light-orange"],/\.sfproj$/i],
    ["terminal-icon",["medium-purple","medium-purple"],/\.(?:sh|rc|bats|bash|tool|install|command)$/i,,false,/bash|sh|zsh|rc/,/\.shell$/i,/^(?:sh|shell|Shell-?Script|Bash)$/i],
    ["terminal-icon",["dark-purple","dark-purple"],/^(?:\.?bash(?:rc|[-_]?(?:profile|login|logout|history|prompt))|_osc|config|install-sh|PKGBUILD)$/i],
    ["terminal-icon",["dark-yellow","dark-yellow"],/\.ksh$/i],
    ["terminal-icon",["medium-yellow","dark-yellow"],/\.sh-session$/i,,false,,/\.shell-session$/i,/^(?:Bash|Shell|Sh)[-\s]*(?:Session|Console)$/i],
    ["terminal-icon",["medium-blue","medium-blue"],/\.zsh(?:-theme|_history)?$|^\.?(?:antigen|zpreztorc|zlogin|zlogout|zprofile|zshenv|zshrc)$|\.tmux$/i],
    ["terminal-icon",["medium-green","medium-green"],/\.fish$|^\.fishrc$|\.tcsh$/i,,false,/^fish$/,/\.fish$/i,/^fish$/i],
    ["terminal-icon",["medium-red","medium-red"],/\.inputrc$/i],
    ["terminal-icon",["medium-red","medium-red"],/^(?:configure|config\.(?:guess|rpath|status|sub)|depcomp|libtool|compile)$/],
    ["terminal-icon",["dark-purple","dark-purple"],/^\/(?:private\/)?etc\/(?:[^\/]+\/)*(?:profile$|nanorc$|rc\.|csh\.)/i,,true],
    ["terminal-icon",["medium-yellow","medium-yellow"],/\.csh$/i],
    ["shen-icon",["dark-cyan","dark-cyan"],/\.shen$/i],
    ["shopify-icon",["medium-green","medium-green"],/\.liquid$/i],
    ["sigils-icon",["dark-red","dark-red"],/\.sigils$/i],
    ["silverstripe-icon",["medium-blue","medium-blue"],/\.ss$/i,,false,,/(?:^|\.)ss(?:template)?(?:\.|$)/i,/^SilverStripe$/i],
    ["sketch-icon",["medium-orange","medium-orange"],/\.sketch$/i],
    ["slash-icon",["dark-blue","dark-blue"],/\.sl$/i,,false,,/\.slash$/i,/^Slash$/i],
    ["android-icon",["medium-green","medium-green"],/\.smali$/i,,false,,/\.smali$/i,/^Smali$/i],
    ["smarty-icon",["medium-yellow","dark-yellow"],/\.tpl$/i,,false,,/\.smarty$/i,/^Smarty$/i],
    ["snyk-icon",["dark-purple","dark-purple"],/\.snyk$/i],
    ["clojure-icon",["medium-yellow","dark-yellow"],/\.(?:sma|sp)$/i,,false,,/\.sp$/i,/^SourcePawn$|^s[0o]urcem[0o]d$/i],
    ["sparql-icon",["medium-blue","medium-blue"],/\.sparql$/i,,false,,/\.rq$/i,/^SPARQL$/i],
    ["sparql-icon",["dark-blue","dark-blue"],/\.rq$/i],
    ["sqf-icon",["dark-maroon","dark-maroon"],/\.sqf$/i,,false,/^sqf$/,/\.sqf$/i,/^sqf$/i],
    ["sqf-icon",["dark-red","dark-red"],/\.hqf$/i],
    ["sql-icon",["medium-orange","medium-orange"],/\.(?:my)?sql$/i,,false,/^sql$/,/\.sql$/i,/^sql$/i],
    ["sql-icon",["medium-blue","medium-blue"],/\.ddl$/i],
    ["sql-icon",["medium-green","medium-green"],/\.udf$/i],
    ["sql-icon",["dark-cyan","dark-cyan"],/\.viw$/i],
    ["sql-icon",["dark-blue","dark-blue"],/\.prc$/i],
    ["sql-icon",["medium-purple","medium-purple"],/\.db2$/i],
    ["sqlite-icon",["medium-blue","medium-blue"],/\.sqlite$/i],
    ["sqlite-icon",["dark-blue","dark-blue"],/\.sqlite3$/i],
    ["sqlite-icon",["medium-purple","medium-purple"],/\.db$/i],
    ["sqlite-icon",["dark-purple","dark-purple"],/\.db3$/i],
    ["squirrel-icon",["medium-maroon","medium-maroon"],/\.nut$/i,,false,,/\.nut$/i,/^Squirrel$/i],
    ["key-icon",["medium-yellow","medium-yellow"],/\.pub$/i],
    ["key-icon",["medium-orange","medium-orange"],/\.pem$/i],
    ["key-icon",["medium-blue","medium-blue"],/\.key$|\.crt$/i],
    ["key-icon",["medium-purple","medium-purple"],/\.der$/i],
    ["key-icon",["medium-red","medium-red"],/^id_rsa/],
    ["key-icon",["medium-green","medium-green"],/\.glyphs\d*License$|^git-credential-osxkeychain$/i],
    ["key-icon",["dark-green","dark-green"],/^(?:master\.)?passwd$/i],
    ["stan-icon",["medium-red","medium-red"],/\.stan$/i,,false,,/\.stan$/i,/^Stan$/i],
    ["stata-icon",["medium-blue","medium-blue"],/\.do$/i,,false,/^stata$/,/\.stata$/i,/^stata$/i],
    ["stata-icon",["dark-blue","dark-blue"],/\.ado$/i],
    ["stata-icon",["light-blue","light-blue"],/\.doh$/i],
    ["stata-icon",["medium-cyan","medium-cyan"],/\.ihlp$/i],
    ["stata-icon",["dark-cyan","dark-cyan"],/\.mata$/i,,false,/^mata$/,/\.mata$/i,/^Stata$|^mata$/i],
    ["stata-icon",["light-cyan","light-cyan"],/\.matah$/i],
    ["stata-icon",["medium-purple","medium-purple"],/\.sthlp$/i],
    ["storyist-icon",["medium-blue","medium-blue"],/\.story$/i],
    ["strings-icon",["medium-red","medium-red"],/\.strings$/i,,false,,/\.strings$/i,/^Strings$/i],
    ["stylus-icon",["medium-green","medium-green"],/\.styl$/i,,false,,/\.stylus$/i,/^Stylus$/i],
    ["sublime-icon",["medium-orange","medium-orange"],/\.(?:stTheme|sublime[-_](?:build|commands|completions|keymap|macro|menu|mousemap|project|settings|theme|workspace|metrics|session|snippet))$/i],
    ["sublime-icon",["dark-orange","dark-orange"],/\.sublime-syntax$/i],
    ["scd-icon",["medium-red","medium-red"],/\.scd$/i,,false,/sclang|scsynth/,/\.supercollider$/i,/^SuperCollider$/i],
    ["svg-icon",["dark-yellow","dark-yellow"],/\.svg$/i,,false,,/\.svg$/i,/^SVG$/i],
    ["swift-icon",["medium-green","medium-green"],/\.swift$/i,,false,,/\.swift$/i,/^Swift$/i],
    ["sysverilog-icon",["medium-blue","dark-blue"],/\.sv$/i],
    ["sysverilog-icon",["medium-green","dark-green"],/\.svh$/i],
    ["sysverilog-icon",["medium-cyan","dark-cyan"],/\.vh$/i],
    ["tag-icon",["medium-blue","medium-blue"],/\.?c?tags$/i],
    ["tag-icon",["medium-red","medium-red"],/\.gemtags/i],
    ["tcl-icon",["dark-orange","dark-orange"],/\.tcl$/i,,false,/tclsh|wish/,/\.tcl$/i,/^Tcl$/i],
    ["tcl-icon",["medium-orange","medium-orange"],/\.adp$/i],
    ["tcl-icon",["medium-red","medium-red"],/\.tm$/i],
    ["coffee-icon",["medium-orange","medium-orange"],/\.tea$/i,,false,,/\.tea$/i,/^Tea$/i],
    ["tt-icon",["medium-blue","medium-blue"],/\.tt2?$/i],
    ["tt-icon",["medium-purple","medium-purple"],/\.tt3$/i],
    ["tern-icon",["medium-blue","medium-blue"],/\.tern-project$/i],
    ["terraform-icon",["dark-purple","dark-purple"],/\.tf(?:vars)?$/i,,false,,/\.terra(?:form)?$/i,/^Terraform$/i],
    ["tex-icon",["medium-blue","dark-blue"],/\.tex$|\.ltx$|\.lbx$/i,,false,,/(?:^|\.)latex(?:\.|$)/i,/^TeX$|^latex$/i],
    ["tex-icon",["medium-green","dark-green"],/\.aux$|\.ins$/i],
    ["tex-icon",["medium-red","dark-red"],/\.sty$|\.texi$/i,,false,,/(?:^|\.)tex(?:\.|$)/i,/^TeX$/i],
    ["tex-icon",["medium-maroon","dark-maroon"],/\.dtx$/i],
    ["tex-icon",["medium-orange","dark-orange"],/\.cls$|\.mkiv$|\.mkvi$|\.mkii$/i],
    ["text-icon",["medium-blue","medium-blue"],/\.te?xt$|\.irclog$|\.uot$/i,,false,,,,/^\xEF\xBB\xBF|^\xFF\xFE/],
    ["text-icon",["medium-maroon","medium-maroon"],/\.log$|^Terminal[-_\s]Saved[-_\s]Output$|\.brf$/i],
    ["text-icon",["dark-red","dark-red"],/\.git[\/\\]description$/,,true],
    ["text-icon",["medium-red","medium-red"],/\.err$|\.no$|^(?:bug-report|fdl|for-release|tests)$/i],
    ["text-icon",["dark-red","dark-red"],/\.rtf$|\.uof$/i],
    ["text-icon",["dark-blue","dark-blue"],/\.i?nfo$/i],
    ["text-icon",["dark-purple","dark-purple"],/\.abt$|\.sub$/i],
    ["text-icon",["dark-orange","dark-orange"],/\.ans$/i],
    ["text-icon",["medium-yellow","medium-yellow"],/\.etx$/i],
    ["text-icon",["medium-orange","medium-orange"],/\.msg$/i],
    ["text-icon",["medium-purple","medium-purple"],/\.srt$|\.uop$/i],
    ["text-icon",["medium-cyan","medium-cyan"],/\.(?:utxt|utf8)$/i],
    ["text-icon",["medium-green","medium-green"],/\.weechatlog$|\.uos$/i],
    ["textile-icon",["medium-orange","medium-orange"],/\.textile$/i,,false,,/\.textile$/i,/^Textile$/i],
    ["textmate-icon",["dark-green","dark-green"],/\.tmcg$/i],
    ["textmate-icon",["dark-purple","dark-purple"],/\.tmLanguage$/i],
    ["textmate-icon",["medium-blue","medium-blue"],/\.tmCommand$/i],
    ["textmate-icon",["dark-blue","dark-blue"],/\.tmPreferences$/i],
    ["textmate-icon",["dark-orange","dark-orange"],/\.tmSnippet$/i],
    ["textmate-icon",["medium-pink","medium-pink"],/\.tmTheme$/i],
    ["textmate-icon",["medium-maroon","medium-maroon"],/\.tmMacro$/i],
    ["textmate-icon",["medium-orange","medium-orange"],/\.yaml-tmlanguage$/i],
    ["textmate-icon",["medium-purple","medium-purple"],/\.JSON-tmLanguage$/i],
    ["thor-icon",["medium-orange","medium-orange"],/\.thor$/i],
    ["thor-icon",["dark-orange","dark-orange"],/^Thorfile$/i],
    ["tsx-icon",["light-blue","light-blue"],/\.tsx$/i,,false,,/\.tsx$/i,/^TSX$/i],
    ["turing-icon",["medium-red","medium-red"],/\.tu$/i,,false,,/\.turing$/i,/^Turing$/i],
    ["twig-icon",["medium-green","medium-green"],/\.twig$/i,,false,,/\.twig$/i,/^Twig$/i],
    ["txl-icon",["medium-orange","medium-orange"],/\.txl$/i,,false,,/\.txl$/i,/^TXL$/i],
    ["ts-icon",["medium-blue","medium-blue"],/\.ts$/i,,false,,/\.ts$/i,/^(?:ts|Type[-\s]*Script)$/i],
    ["unity3d-icon",["dark-blue","dark-blue"],/\.anim$/i,,false,/^shaderlab$/,/\.shaderlab$/i,/^Unity3D$|^shaderlab$/i],
    ["unity3d-icon",["dark-green","dark-green"],/\.asset$/i],
    ["unity3d-icon",["medium-red","medium-red"],/\.mat$/i],
    ["unity3d-icon",["dark-red","dark-red"],/\.meta$/i],
    ["unity3d-icon",["dark-cyan","dark-cyan"],/\.prefab$/i],
    ["unity3d-icon",["medium-blue","medium-blue"],/\.unity$/i],
    ["unity3d-icon",["medium-maroon","medium-maroon"],/\.unityproj$/i],
    ["uno-icon",["dark-blue","dark-blue"],/\.uno$/i],
    ["unreal-icon",[null,null],/\.uc$/i,,false,,/\.uc$/i,/^UnrealScript$/i],
    ["link-icon",["dark-blue","dark-blue"],/\.url$/i],
    ["urweb-icon",["medium-maroon","medium-maroon"],/\.ur$/i,,false,,/\.ur$/i,/^UrWeb$|^Ur(?:\/Web)?$/i],
    ["urweb-icon",["dark-blue","dark-blue"],/\.urs$/i],
    ["vagrant-icon",["medium-cyan","medium-cyan"],/^Vagrantfile$/i],
    ["gnome-icon",["medium-purple","medium-purple"],/\.vala$/i,,false,/^vala$/,/\.vala$/i,/^vala$/i],
    ["gnome-icon",["dark-purple","dark-purple"],/\.vapi$/i],
    ["varnish-icon",["dark-blue","dark-blue"],/\.vcl$/i,,false,,/(?:^|\.)(?:varnish|vcl)(?:\.|$)/i,/^VCL$/i],
    ["verilog-icon",["dark-green","dark-green"],/\.v$/i,,false,/^verilog$/,/\.verilog$/i,/^veril[0o]g$/i],
    ["verilog-icon",["medium-red","medium-red"],/\.veo$/i],
    ["vhdl-icon",["dark-green","dark-green"],/\.vhdl$/i,,false,/^vhdl$/,/\.vhdl$/i,/^vhdl$/i],
    ["vhdl-icon",["medium-green","medium-green"],/\.vhd$/i],
    ["vhdl-icon",["dark-blue","dark-blue"],/\.vhf$/i],
    ["vhdl-icon",["medium-blue","medium-blue"],/\.vhi$/i],
    ["vhdl-icon",["dark-purple","dark-purple"],/\.vho$/i],
    ["vhdl-icon",["medium-purple","medium-purple"],/\.vhs$/i],
    ["vhdl-icon",["dark-red","dark-red"],/\.vht$/i],
    ["vhdl-icon",["dark-orange","dark-orange"],/\.vhw$/i],
    ["video-icon",["medium-blue","medium-blue"],/\.3gpp?$/i,,false,,,,/^.{4}ftyp3g/],
    ["video-icon",["dark-blue","dark-blue"],/\.(?:mp4|m4v|h264)$/i,,false,,,,/^.{4}ftyp/],
    ["video-icon",["medium-blue","medium-blue"],/\.avi$/i,,false,,,,/^MLVI/],
    ["video-icon",["medium-cyan","medium-cyan"],/\.mov$/i,,false,,,,/^.{4}moov/],
    ["video-icon",["medium-purple","medium-purple"],/\.mkv$/i,,false,,,,/^\x1AEß£\x93B\x82\x88matroska/],
    ["video-icon",["medium-red","medium-red"],/\.flv$/i,,false,,,,/^FLV\x01/],
    ["video-icon",["dark-blue","dark-blue"],/\.webm$/i,,false,,,,/^\x1A\x45\xDF\xA3/],
    ["video-icon",["medium-red","medium-red"],/\.mpe?g$/i,,false,,,,/^\0{2}\x01[\xB3\xBA]/],
    ["video-icon",["dark-purple","dark-purple"],/\.(?:asf|wmv)$/i,,false,,,,/^0&²u\x8EfÏ\x11¦Ù\0ª\0bÎl/],
    ["video-icon",["medium-orange","medium-orange"],/\.(?:ogm|og[gv])$/i,,false,,,,/^OggS/],
    ["vim-icon",["medium-green","medium-green"],/\.(?:vim|n?vimrc)$/i,,false,/Vim?/i,/\.viml$/i,/^(?:VimL?|NVim|Vim\s*Script)$/i],
    ["vim-icon",["dark-green","dark-green"],/^[gn_]?vim(?:rc|info)$/i],
    ["vs-icon",["medium-blue","medium-blue"],/\.(?:vba?|fr[mx]|bas)$/i,,false,,/\.vbnet$/i,/^Visual Studio$|^vb\.?net$/i],
    ["vs-icon",["medium-red","medium-red"],/\.vbhtml$/i],
    ["vs-icon",["medium-green","medium-green"],/\.vbs$/i],
    ["vs-icon",["dark-blue","dark-blue"],/\.csproj$/i],
    ["vs-icon",["dark-red","dark-red"],/\.vbproj$/i],
    ["vs-icon",["dark-purple","dark-purple"],/\.vcx?proj$/i],
    ["vs-icon",["dark-green","dark-green"],/\.vssettings$/i],
    ["vs-icon",["medium-maroon","medium-maroon"],/\.builds$/i],
    ["vs-icon",["medium-orange","medium-orange"],/\.sln$/i],
    ["vue-icon",["light-green","light-green"],/\.vue$/i,,false,,/\.vue$/i,/^Vue$/i],
    ["owl-icon",["dark-blue","dark-blue"],/\.owl$/i],
    ["windows-icon",["medium-purple","medium-purple"],/\.bat$|\.cmd$/i,,false,,/(?:^|\.)(?:bat|dosbatch)(?:\.|$)/i,/^(?:bat|(?:DOS|Win)?Batch)$/i],
    ["windows-icon",[null,null],/\.(?:exe|com|msi)$/i],
    ["windows-icon",["medium-blue","medium-blue"],/\.reg$/i],
    ["x10-icon",["light-maroon","light-maroon"],/\.x10$/i,,false,,/\.x10$/i,/^X10$|^xten$/i],
    ["x11-icon",["medium-orange","medium-orange"],/\.X(?:authority|clients|initrc|profile|resources|session-errors|screensaver)$/i],
    ["xmos-icon",["medium-orange","medium-orange"],/\.xc$/i],
    ["appstore-icon",["medium-blue","medium-blue"],/\.(?:pbxproj|pbxuser|mode\dv\3|xcplugindata|xcrequiredplugins)$/i],
    ["xojo-icon",["medium-green","medium-green"],/\.xojo_code$/i],
    ["xojo-icon",["medium-blue","medium-blue"],/\.xojo_menu$/i],
    ["xojo-icon",["medium-red","medium-red"],/\.xojo_report$/i],
    ["xojo-icon",["dark-green","dark-green"],/\.xojo_script$/i],
    ["xojo-icon",["dark-purple","dark-purple"],/\.xojo_toolbar$/i],
    ["xojo-icon",["dark-cyan","dark-cyan"],/\.xojo_window$/i],
    ["xpages-icon",["medium-blue","medium-blue"],/\.xsp-config$/i],
    ["xpages-icon",["dark-blue","dark-blue"],/\.xsp\.metadata$/i],
    ["xmos-icon",["dark-blue","dark-blue"],/\.xpl$/i],
    ["xmos-icon",["medium-purple","medium-purple"],/\.xproc$/i],
    ["sql-icon",["dark-red","dark-red"],/\.(?:xquery|xq|xql|xqm|xqy)$/i,,false,,/\.xq$/i,/^XQuery$/i],
    ["xtend-icon",["dark-purple","dark-purple"],/\.xtend$/i,,false,,/\.xtend$/i,/^Xtend$/i],
    ["yang-icon",["medium-yellow","medium-yellow"],/\.yang$/i,,false,,/\.yang$/i,/^YANG$/i],
    ["zbrush-icon",["dark-purple","dark-purple"],/\.zpr$/i],
    ["zephir-icon",["medium-pink","medium-pink"],/\.zep$/i],
    ["zimpl-icon",["medium-orange","medium-orange"],/\.(?:zimpl|zmpl|zpl)$/i],
    ["apple-icon",["medium-blue","medium-blue"],/^com\.apple\./,0.5],
    ["apache-icon",["medium-red","medium-red"],/^httpd\.conf/i,0],
    ["checklist-icon",["medium-yellow","medium-yellow"],/TODO/,0],
    ["config-icon",[null,null],/config|settings|option|pref/i,0],
    ["doge-icon",["medium-yellow","medium-yellow"],/\.djs$/i,0,false,,/\.dogescript$/i,/^Dogescript$/i],
    ["gear-icon",[null,null],/^\./,0],
    ["book-icon",["medium-blue","medium-blue"],/\b(?:changelog|copying(?:v?\d)?|install|read[-_]?me)\b|^licen[sc]es?[-._]/i,0],
    ["book-icon",["dark-blue","dark-blue"],/^news(?:[-_.]?[-\d]+)?$/i,0],
    ["v8-icon",["medium-blue","medium-blue"],/^(?:[dv]8|v8[-_.][^.]*|mksnapshot|mkpeephole)$/i,0]],
    [[69,147,152,154,169,192,195,196,197,198,204,217,239,244,249,251,253,258,287,292,293,303,304,309,331,333,336,343,347,353,362,380,395,398,416,420,421,422,424,431,434,448,451,465,467,468,471,480,481,482,485,486,487,525,526,529,534,555,565,570,571,572,578,580,584,586,590,601,602,626,629,658,669,670,681,688,694,696,709,714,715,745,748,755,760,769,772,778,779,798,800,803,805,808,811,822,823,826,836,838,848,854,858,860,864,865,867,868,871,881,886,903,905,924,928,936,944,987,1000,1003,1005,1023],[42,57,69,105,120,121,124,126,129,143,145,147,149,151,152,154,156,157,158,166,167,169,174,192,194,195,196,197,198,204,206,210,211,213,215,216,217,223,224,225,229,230,234,236,237,238,239,242,243,244,249,251,253,255,256,258,275,285,286,287,288,290,291,292,293,294,295,297,300,301,303,304,309,312,314,326,330,336,341,342,343,346,347,350,351,352,353,359,362,365,380,381,382,383,386,390,392,394,395,398,400,416,422,439,440,442,448,451,452,453,454,458,461,463,465,466,467,468,469,470,471,472,473,474,475,479,482,485,486,487,488,489,490,522,524,525,527,529,530,533,534,543,546,547,548,549,553,555,558,560,561,565,570,571,575,578,580,582,584,586,590,600,601,602,603,604,605,612,618,626,629,657,658,664,665,668,669,675,678,679,680,681,685,687,688,689,690,691,694,696,704,707,709,714,715,716,717,718,719,734,738,741,742,744,746,747,748,753,755,760,768,769,774,776,777,778,779,781,792,797,798,801,802,803,805,807,808,811,818,822,823,826,827,828,829,836,838,841,845,847,848,850,854,858,860,862,863,864,865,867,868,871,875,881,884,886,894,896,897,898,900,901,903,905,915,923,924,928,932,933,936,937,938,944,947,951,952,954,970,982,983,984,985,986,987,995,997,1000,1002,1003,1005,1023,1025,1034,1036,1039,1053,1054,1055,1063],[41,150,282,283,284,321,889,959],[42,57,69,105,120,121,124,126,129,143,145,147,149,151,152,154,156,157,158,166,167,169,174,192,194,195,196,197,198,204,206,210,211,213,215,216,217,223,224,225,229,230,234,236,237,238,239,242,243,244,249,251,253,255,256,258,275,276,285,286,287,288,290,291,292,293,294,295,297,300,301,303,304,309,311,312,314,319,326,330,336,341,342,343,346,347,350,351,352,353,359,362,365,380,381,382,383,386,390,392,394,395,398,400,412,416,418,420,421,422,424,431,432,434,439,440,442,448,451,452,453,454,458,461,463,465,466,467,468,469,470,471,472,473,474,475,479,480,481,482,483,485,486,487,488,489,490,522,524,525,527,529,530,533,534,543,546,547,548,549,553,555,558,560,561,565,570,571,575,578,580,582,584,586,590,600,601,602,603,604,605,612,618,626,629,657,658,660,661,664,665,668,669,675,678,679,680,681,685,687,688,689,690,691,694,696,704,707,709,714,715,716,717,718,719,734,738,741,742,744,746,747,748,753,755,760,768,769,774,776,777,778,779,781,792,797,798,801,802,803,805,807,808,811,818,822,823,826,827,828,829,836,838,841,845,847,848,850,854,858,860,862,863,864,865,867,868,871,875,876,881,884,886,894,896,897,898,900,901,903,905,915,923,924,928,932,933,936,937,938,944,947,951,952,954,970,982,983,984,985,986,987,995,997,1000,1002,1003,1005,1023,1025,1034,1036,1039,1053,1054,1055,1063],[106,138,178,179,180,181,182,183,184,185,186,188,189,235,261,262,263,264,265,268,273,348,372,373,374,375,376,377,410,411,493,494,495,496,497,498,499,500,501,503,504,505,506,507,509,510,511,512,513,514,516,519,520,601,674,737,754,769,781,957,1013,1014,1015,1016,1017,1018,1019,1020,1021,1022]]]
    ];

    /* ---------------------------------------------------------------------------
     * FileIcons
     * ------------------------------------------------------------------------- */

    /**
     * Create FileIcons instance
     *
     * @param {Array}   icondb - Icons database
     * @class
     * @constructor
     */

    var FileIcons = function(icondb) {
        this.db = new IconTables(icondb)
    }

    /**
     * Get icon class name of the provided filename. If not found, default to text icon.
     *
     * @param {string} name - file name
     * @return {string}
     * @public
     */

    FileIcons.prototype.getClass = function(name) {
        var match = this.db.matchName(name)
        return match ? match.getClass() : null
    }

    /**
     * Get icon class name of the provided filename with color. If not found, default to text icon.
     *
     * @param {string} name - file name
     * @return {string}
     * @public
     */

    FileIcons.prototype.getClassWithColor = function(name) {
        var match = this.db.matchName(name)
        return match ? match.getClass(0) : null
    }

    return new FileIcons(icondb)
}))

})();
//(function(){
///*! jQuery v3.0.0 | (c) jQuery Foundation | jquery.org/license */
//!function(a,b){"use strict";"object"==typeof module&&"object"==typeof module.exports?module.exports=a.document?b(a,!0):function(a){if(!a.document)throw new Error("jQuery requires a window with a document");return b(a)}:b(a)}("undefined"!=typeof window?window:this,function(a,b){"use strict";var c=[],d=a.document,e=Object.getPrototypeOf,f=c.slice,g=c.concat,h=c.push,i=c.indexOf,j={},k=j.toString,l=j.hasOwnProperty,m=l.toString,n=m.call(Object),o={};function p(a,b){b=b||d;var c=b.createElement("script");c.text=a,b.head.appendChild(c).parentNode.removeChild(c)}var q="3.0.0",r=function(a,b){return new r.fn.init(a,b)},s=/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,t=/^-ms-/,u=/-([a-z])/g,v=function(a,b){return b.toUpperCase()};r.fn=r.prototype={jquery:q,constructor:r,length:0,toArray:function(){return f.call(this)},get:function(a){return null!=a?0>a?this[a+this.length]:this[a]:f.call(this)},pushStack:function(a){var b=r.merge(this.constructor(),a);return b.prevObject=this,b},each:function(a){return r.each(this,a)},map:function(a){return this.pushStack(r.map(this,function(b,c){return a.call(b,c,b)}))},slice:function(){return this.pushStack(f.apply(this,arguments))},first:function(){return this.eq(0)},last:function(){return this.eq(-1)},eq:function(a){var b=this.length,c=+a+(0>a?b:0);return this.pushStack(c>=0&&b>c?[this[c]]:[])},end:function(){return this.prevObject||this.constructor()},push:h,sort:c.sort,splice:c.splice},r.extend=r.fn.extend=function(){var a,b,c,d,e,f,g=arguments[0]||{},h=1,i=arguments.length,j=!1;for("boolean"==typeof g&&(j=g,g=arguments[h]||{},h++),"object"==typeof g||r.isFunction(g)||(g={}),h===i&&(g=this,h--);i>h;h++)if(null!=(a=arguments[h]))for(b in a)c=g[b],d=a[b],g!==d&&(j&&d&&(r.isPlainObject(d)||(e=r.isArray(d)))?(e?(e=!1,f=c&&r.isArray(c)?c:[]):f=c&&r.isPlainObject(c)?c:{},g[b]=r.extend(j,f,d)):void 0!==d&&(g[b]=d));return g},r.extend({expando:"jQuery"+(q+Math.random()).replace(/\D/g,""),isReady:!0,error:function(a){throw new Error(a)},noop:function(){},isFunction:function(a){return"function"===r.type(a)},isArray:Array.isArray,isWindow:function(a){return null!=a&&a===a.window},isNumeric:function(a){var b=r.type(a);return("number"===b||"string"===b)&&!isNaN(a-parseFloat(a))},isPlainObject:function(a){var b,c;return a&&"[object Object]"===k.call(a)?(b=e(a))?(c=l.call(b,"constructor")&&b.constructor,"function"==typeof c&&m.call(c)===n):!0:!1},isEmptyObject:function(a){var b;for(b in a)return!1;return!0},type:function(a){return null==a?a+"":"object"==typeof a||"function"==typeof a?j[k.call(a)]||"object":typeof a},globalEval:function(a){p(a)},camelCase:function(a){return a.replace(t,"ms-").replace(u,v)},nodeName:function(a,b){return a.nodeName&&a.nodeName.toLowerCase()===b.toLowerCase()},each:function(a,b){var c,d=0;if(w(a)){for(c=a.length;c>d;d++)if(b.call(a[d],d,a[d])===!1)break}else for(d in a)if(b.call(a[d],d,a[d])===!1)break;return a},trim:function(a){return null==a?"":(a+"").replace(s,"")},makeArray:function(a,b){var c=b||[];return null!=a&&(w(Object(a))?r.merge(c,"string"==typeof a?[a]:a):h.call(c,a)),c},inArray:function(a,b,c){return null==b?-1:i.call(b,a,c)},merge:function(a,b){for(var c=+b.length,d=0,e=a.length;c>d;d++)a[e++]=b[d];return a.length=e,a},grep:function(a,b,c){for(var d,e=[],f=0,g=a.length,h=!c;g>f;f++)d=!b(a[f],f),d!==h&&e.push(a[f]);return e},map:function(a,b,c){var d,e,f=0,h=[];if(w(a))for(d=a.length;d>f;f++)e=b(a[f],f,c),null!=e&&h.push(e);else for(f in a)e=b(a[f],f,c),null!=e&&h.push(e);return g.apply([],h)},guid:1,proxy:function(a,b){var c,d,e;return"string"==typeof b&&(c=a[b],b=a,a=c),r.isFunction(a)?(d=f.call(arguments,2),e=function(){return a.apply(b||this,d.concat(f.call(arguments)))},e.guid=a.guid=a.guid||r.guid++,e):void 0},now:Date.now,support:o}),"function"==typeof Symbol&&(r.fn[Symbol.iterator]=c[Symbol.iterator]),r.each("Boolean Number String Function Array Date RegExp Object Error Symbol".split(" "),function(a,b){j["[object "+b+"]"]=b.toLowerCase()});function w(a){var b=!!a&&"length"in a&&a.length,c=r.type(a);return"function"===c||r.isWindow(a)?!1:"array"===c||0===b||"number"==typeof b&&b>0&&b-1 in a}var x=function(a){var b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u="sizzle"+1*new Date,v=a.document,w=0,x=0,y=ha(),z=ha(),A=ha(),B=function(a,b){return a===b&&(l=!0),0},C={}.hasOwnProperty,D=[],E=D.pop,F=D.push,G=D.push,H=D.slice,I=function(a,b){for(var c=0,d=a.length;d>c;c++)if(a[c]===b)return c;return-1},J="checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",K="[\\x20\\t\\r\\n\\f]",L="(?:\\\\.|[\\w-]|[^\x00-\\xa0])+",M="\\["+K+"*("+L+")(?:"+K+"*([*^$|!~]?=)"+K+"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|("+L+"))|)"+K+"*\\]",N=":("+L+")(?:\\((('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|((?:\\\\.|[^\\\\()[\\]]|"+M+")*)|.*)\\)|)",O=new RegExp(K+"+","g"),P=new RegExp("^"+K+"+|((?:^|[^\\\\])(?:\\\\.)*)"+K+"+$","g"),Q=new RegExp("^"+K+"*,"+K+"*"),R=new RegExp("^"+K+"*([>+~]|"+K+")"+K+"*"),S=new RegExp("="+K+"*([^\\]'\"]*?)"+K+"*\\]","g"),T=new RegExp(N),U=new RegExp("^"+L+"$"),V={ID:new RegExp("^#("+L+")"),CLASS:new RegExp("^\\.("+L+")"),TAG:new RegExp("^("+L+"|[*])"),ATTR:new RegExp("^"+M),PSEUDO:new RegExp("^"+N),CHILD:new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\("+K+"*(even|odd|(([+-]|)(\\d*)n|)"+K+"*(?:([+-]|)"+K+"*(\\d+)|))"+K+"*\\)|)","i"),bool:new RegExp("^(?:"+J+")$","i"),needsContext:new RegExp("^"+K+"*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\("+K+"*((?:-\\d)?\\d*)"+K+"*\\)|)(?=[^-]|$)","i")},W=/^(?:input|select|textarea|button)$/i,X=/^h\d$/i,Y=/^[^{]+\{\s*\[native \w/,Z=/^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,$=/[+~]/,_=new RegExp("\\\\([\\da-f]{1,6}"+K+"?|("+K+")|.)","ig"),aa=function(a,b,c){var d="0x"+b-65536;return d!==d||c?b:0>d?String.fromCharCode(d+65536):String.fromCharCode(d>>10|55296,1023&d|56320)},ba=/([\0-\x1f\x7f]|^-?\d)|^-$|[^\x80-\uFFFF\w-]/g,ca=function(a,b){return b?"\x00"===a?"\ufffd":a.slice(0,-1)+"\\"+a.charCodeAt(a.length-1).toString(16)+" ":"\\"+a},da=function(){m()},ea=ta(function(a){return a.disabled===!0},{dir:"parentNode",next:"legend"});try{G.apply(D=H.call(v.childNodes),v.childNodes),D[v.childNodes.length].nodeType}catch(fa){G={apply:D.length?function(a,b){F.apply(a,H.call(b))}:function(a,b){var c=a.length,d=0;while(a[c++]=b[d++]);a.length=c-1}}}function ga(a,b,d,e){var f,h,j,k,l,o,r,s=b&&b.ownerDocument,w=b?b.nodeType:9;if(d=d||[],"string"!=typeof a||!a||1!==w&&9!==w&&11!==w)return d;if(!e&&((b?b.ownerDocument||b:v)!==n&&m(b),b=b||n,p)){if(11!==w&&(l=Z.exec(a)))if(f=l[1]){if(9===w){if(!(j=b.getElementById(f)))return d;if(j.id===f)return d.push(j),d}else if(s&&(j=s.getElementById(f))&&t(b,j)&&j.id===f)return d.push(j),d}else{if(l[2])return G.apply(d,b.getElementsByTagName(a)),d;if((f=l[3])&&c.getElementsByClassName&&b.getElementsByClassName)return G.apply(d,b.getElementsByClassName(f)),d}if(c.qsa&&!A[a+" "]&&(!q||!q.test(a))){if(1!==w)s=b,r=a;else if("object"!==b.nodeName.toLowerCase()){(k=b.getAttribute("id"))?k=k.replace(ba,ca):b.setAttribute("id",k=u),o=g(a),h=o.length;while(h--)o[h]="#"+k+" "+sa(o[h]);r=o.join(","),s=$.test(a)&&qa(b.parentNode)||b}if(r)try{return G.apply(d,s.querySelectorAll(r)),d}catch(x){}finally{k===u&&b.removeAttribute("id")}}}return i(a.replace(P,"$1"),b,d,e)}function ha(){var a=[];function b(c,e){return a.push(c+" ")>d.cacheLength&&delete b[a.shift()],b[c+" "]=e}return b}function ia(a){return a[u]=!0,a}function ja(a){var b=n.createElement("fieldset");try{return!!a(b)}catch(c){return!1}finally{b.parentNode&&b.parentNode.removeChild(b),b=null}}function ka(a,b){var c=a.split("|"),e=c.length;while(e--)d.attrHandle[c[e]]=b}function la(a,b){var c=b&&a,d=c&&1===a.nodeType&&1===b.nodeType&&a.sourceIndex-b.sourceIndex;if(d)return d;if(c)while(c=c.nextSibling)if(c===b)return-1;return a?1:-1}function ma(a){return function(b){var c=b.nodeName.toLowerCase();return"input"===c&&b.type===a}}function na(a){return function(b){var c=b.nodeName.toLowerCase();return("input"===c||"button"===c)&&b.type===a}}function oa(a){return function(b){return"label"in b&&b.disabled===a||"form"in b&&b.disabled===a||"form"in b&&b.disabled===!1&&(b.isDisabled===a||b.isDisabled!==!a&&("label"in b||!ea(b))!==a)}}function pa(a){return ia(function(b){return b=+b,ia(function(c,d){var e,f=a([],c.length,b),g=f.length;while(g--)c[e=f[g]]&&(c[e]=!(d[e]=c[e]))})})}function qa(a){return a&&"undefined"!=typeof a.getElementsByTagName&&a}c=ga.support={},f=ga.isXML=function(a){var b=a&&(a.ownerDocument||a).documentElement;return b?"HTML"!==b.nodeName:!1},m=ga.setDocument=function(a){var b,e,g=a?a.ownerDocument||a:v;return g!==n&&9===g.nodeType&&g.documentElement?(n=g,o=n.documentElement,p=!f(n),v!==n&&(e=n.defaultView)&&e.top!==e&&(e.addEventListener?e.addEventListener("unload",da,!1):e.attachEvent&&e.attachEvent("onunload",da)),c.attributes=ja(function(a){return a.className="i",!a.getAttribute("className")}),c.getElementsByTagName=ja(function(a){return a.appendChild(n.createComment("")),!a.getElementsByTagName("*").length}),c.getElementsByClassName=Y.test(n.getElementsByClassName),c.getById=ja(function(a){return o.appendChild(a).id=u,!n.getElementsByName||!n.getElementsByName(u).length}),c.getById?(d.find.ID=function(a,b){if("undefined"!=typeof b.getElementById&&p){var c=b.getElementById(a);return c?[c]:[]}},d.filter.ID=function(a){var b=a.replace(_,aa);return function(a){return a.getAttribute("id")===b}}):(delete d.find.ID,d.filter.ID=function(a){var b=a.replace(_,aa);return function(a){var c="undefined"!=typeof a.getAttributeNode&&a.getAttributeNode("id");return c&&c.value===b}}),d.find.TAG=c.getElementsByTagName?function(a,b){return"undefined"!=typeof b.getElementsByTagName?b.getElementsByTagName(a):c.qsa?b.querySelectorAll(a):void 0}:function(a,b){var c,d=[],e=0,f=b.getElementsByTagName(a);if("*"===a){while(c=f[e++])1===c.nodeType&&d.push(c);return d}return f},d.find.CLASS=c.getElementsByClassName&&function(a,b){return"undefined"!=typeof b.getElementsByClassName&&p?b.getElementsByClassName(a):void 0},r=[],q=[],(c.qsa=Y.test(n.querySelectorAll))&&(ja(function(a){o.appendChild(a).innerHTML="<a id='"+u+"'></a><select id='"+u+"-\r\\' msallowcapture=''><option selected=''></option></select>",a.querySelectorAll("[msallowcapture^='']").length&&q.push("[*^$]="+K+"*(?:''|\"\")"),a.querySelectorAll("[selected]").length||q.push("\\["+K+"*(?:value|"+J+")"),a.querySelectorAll("[id~="+u+"-]").length||q.push("~="),a.querySelectorAll(":checked").length||q.push(":checked"),a.querySelectorAll("a#"+u+"+*").length||q.push(".#.+[+~]")}),ja(function(a){a.innerHTML="<a href='' disabled='disabled'></a><select disabled='disabled'><option/></select>";var b=n.createElement("input");b.setAttribute("type","hidden"),a.appendChild(b).setAttribute("name","D"),a.querySelectorAll("[name=d]").length&&q.push("name"+K+"*[*^$|!~]?="),2!==a.querySelectorAll(":enabled").length&&q.push(":enabled",":disabled"),o.appendChild(a).disabled=!0,2!==a.querySelectorAll(":disabled").length&&q.push(":enabled",":disabled"),a.querySelectorAll("*,:x"),q.push(",.*:")})),(c.matchesSelector=Y.test(s=o.matches||o.webkitMatchesSelector||o.mozMatchesSelector||o.oMatchesSelector||o.msMatchesSelector))&&ja(function(a){c.disconnectedMatch=s.call(a,"*"),s.call(a,"[s!='']:x"),r.push("!=",N)}),q=q.length&&new RegExp(q.join("|")),r=r.length&&new RegExp(r.join("|")),b=Y.test(o.compareDocumentPosition),t=b||Y.test(o.contains)?function(a,b){var c=9===a.nodeType?a.documentElement:a,d=b&&b.parentNode;return a===d||!(!d||1!==d.nodeType||!(c.contains?c.contains(d):a.compareDocumentPosition&&16&a.compareDocumentPosition(d)))}:function(a,b){if(b)while(b=b.parentNode)if(b===a)return!0;return!1},B=b?function(a,b){if(a===b)return l=!0,0;var d=!a.compareDocumentPosition-!b.compareDocumentPosition;return d?d:(d=(a.ownerDocument||a)===(b.ownerDocument||b)?a.compareDocumentPosition(b):1,1&d||!c.sortDetached&&b.compareDocumentPosition(a)===d?a===n||a.ownerDocument===v&&t(v,a)?-1:b===n||b.ownerDocument===v&&t(v,b)?1:k?I(k,a)-I(k,b):0:4&d?-1:1)}:function(a,b){if(a===b)return l=!0,0;var c,d=0,e=a.parentNode,f=b.parentNode,g=[a],h=[b];if(!e||!f)return a===n?-1:b===n?1:e?-1:f?1:k?I(k,a)-I(k,b):0;if(e===f)return la(a,b);c=a;while(c=c.parentNode)g.unshift(c);c=b;while(c=c.parentNode)h.unshift(c);while(g[d]===h[d])d++;return d?la(g[d],h[d]):g[d]===v?-1:h[d]===v?1:0},n):n},ga.matches=function(a,b){return ga(a,null,null,b)},ga.matchesSelector=function(a,b){if((a.ownerDocument||a)!==n&&m(a),b=b.replace(S,"='$1']"),c.matchesSelector&&p&&!A[b+" "]&&(!r||!r.test(b))&&(!q||!q.test(b)))try{var d=s.call(a,b);if(d||c.disconnectedMatch||a.document&&11!==a.document.nodeType)return d}catch(e){}return ga(b,n,null,[a]).length>0},ga.contains=function(a,b){return(a.ownerDocument||a)!==n&&m(a),t(a,b)},ga.attr=function(a,b){(a.ownerDocument||a)!==n&&m(a);var e=d.attrHandle[b.toLowerCase()],f=e&&C.call(d.attrHandle,b.toLowerCase())?e(a,b,!p):void 0;return void 0!==f?f:c.attributes||!p?a.getAttribute(b):(f=a.getAttributeNode(b))&&f.specified?f.value:null},ga.escape=function(a){return(a+"").replace(ba,ca)},ga.error=function(a){throw new Error("Syntax error, unrecognized expression: "+a)},ga.uniqueSort=function(a){var b,d=[],e=0,f=0;if(l=!c.detectDuplicates,k=!c.sortStable&&a.slice(0),a.sort(B),l){while(b=a[f++])b===a[f]&&(e=d.push(f));while(e--)a.splice(d[e],1)}return k=null,a},e=ga.getText=function(a){var b,c="",d=0,f=a.nodeType;if(f){if(1===f||9===f||11===f){if("string"==typeof a.textContent)return a.textContent;for(a=a.firstChild;a;a=a.nextSibling)c+=e(a)}else if(3===f||4===f)return a.nodeValue}else while(b=a[d++])c+=e(b);return c},d=ga.selectors={cacheLength:50,createPseudo:ia,match:V,attrHandle:{},find:{},relative:{">":{dir:"parentNode",first:!0}," ":{dir:"parentNode"},"+":{dir:"previousSibling",first:!0},"~":{dir:"previousSibling"}},preFilter:{ATTR:function(a){return a[1]=a[1].replace(_,aa),a[3]=(a[3]||a[4]||a[5]||"").replace(_,aa),"~="===a[2]&&(a[3]=" "+a[3]+" "),a.slice(0,4)},CHILD:function(a){return a[1]=a[1].toLowerCase(),"nth"===a[1].slice(0,3)?(a[3]||ga.error(a[0]),a[4]=+(a[4]?a[5]+(a[6]||1):2*("even"===a[3]||"odd"===a[3])),a[5]=+(a[7]+a[8]||"odd"===a[3])):a[3]&&ga.error(a[0]),a},PSEUDO:function(a){var b,c=!a[6]&&a[2];return V.CHILD.test(a[0])?null:(a[3]?a[2]=a[4]||a[5]||"":c&&T.test(c)&&(b=g(c,!0))&&(b=c.indexOf(")",c.length-b)-c.length)&&(a[0]=a[0].slice(0,b),a[2]=c.slice(0,b)),a.slice(0,3))}},filter:{TAG:function(a){var b=a.replace(_,aa).toLowerCase();return"*"===a?function(){return!0}:function(a){return a.nodeName&&a.nodeName.toLowerCase()===b}},CLASS:function(a){var b=y[a+" "];return b||(b=new RegExp("(^|"+K+")"+a+"("+K+"|$)"))&&y(a,function(a){return b.test("string"==typeof a.className&&a.className||"undefined"!=typeof a.getAttribute&&a.getAttribute("class")||"")})},ATTR:function(a,b,c){return function(d){var e=ga.attr(d,a);return null==e?"!="===b:b?(e+="","="===b?e===c:"!="===b?e!==c:"^="===b?c&&0===e.indexOf(c):"*="===b?c&&e.indexOf(c)>-1:"$="===b?c&&e.slice(-c.length)===c:"~="===b?(" "+e.replace(O," ")+" ").indexOf(c)>-1:"|="===b?e===c||e.slice(0,c.length+1)===c+"-":!1):!0}},CHILD:function(a,b,c,d,e){var f="nth"!==a.slice(0,3),g="last"!==a.slice(-4),h="of-type"===b;return 1===d&&0===e?function(a){return!!a.parentNode}:function(b,c,i){var j,k,l,m,n,o,p=f!==g?"nextSibling":"previousSibling",q=b.parentNode,r=h&&b.nodeName.toLowerCase(),s=!i&&!h,t=!1;if(q){if(f){while(p){m=b;while(m=m[p])if(h?m.nodeName.toLowerCase()===r:1===m.nodeType)return!1;o=p="only"===a&&!o&&"nextSibling"}return!0}if(o=[g?q.firstChild:q.lastChild],g&&s){m=q,l=m[u]||(m[u]={}),k=l[m.uniqueID]||(l[m.uniqueID]={}),j=k[a]||[],n=j[0]===w&&j[1],t=n&&j[2],m=n&&q.childNodes[n];while(m=++n&&m&&m[p]||(t=n=0)||o.pop())if(1===m.nodeType&&++t&&m===b){k[a]=[w,n,t];break}}else if(s&&(m=b,l=m[u]||(m[u]={}),k=l[m.uniqueID]||(l[m.uniqueID]={}),j=k[a]||[],n=j[0]===w&&j[1],t=n),t===!1)while(m=++n&&m&&m[p]||(t=n=0)||o.pop())if((h?m.nodeName.toLowerCase()===r:1===m.nodeType)&&++t&&(s&&(l=m[u]||(m[u]={}),k=l[m.uniqueID]||(l[m.uniqueID]={}),k[a]=[w,t]),m===b))break;return t-=e,t===d||t%d===0&&t/d>=0}}},PSEUDO:function(a,b){var c,e=d.pseudos[a]||d.setFilters[a.toLowerCase()]||ga.error("unsupported pseudo: "+a);return e[u]?e(b):e.length>1?(c=[a,a,"",b],d.setFilters.hasOwnProperty(a.toLowerCase())?ia(function(a,c){var d,f=e(a,b),g=f.length;while(g--)d=I(a,f[g]),a[d]=!(c[d]=f[g])}):function(a){return e(a,0,c)}):e}},pseudos:{not:ia(function(a){var b=[],c=[],d=h(a.replace(P,"$1"));return d[u]?ia(function(a,b,c,e){var f,g=d(a,null,e,[]),h=a.length;while(h--)(f=g[h])&&(a[h]=!(b[h]=f))}):function(a,e,f){return b[0]=a,d(b,null,f,c),b[0]=null,!c.pop()}}),has:ia(function(a){return function(b){return ga(a,b).length>0}}),contains:ia(function(a){return a=a.replace(_,aa),function(b){return(b.textContent||b.innerText||e(b)).indexOf(a)>-1}}),lang:ia(function(a){return U.test(a||"")||ga.error("unsupported lang: "+a),a=a.replace(_,aa).toLowerCase(),function(b){var c;do if(c=p?b.lang:b.getAttribute("xml:lang")||b.getAttribute("lang"))return c=c.toLowerCase(),c===a||0===c.indexOf(a+"-");while((b=b.parentNode)&&1===b.nodeType);return!1}}),target:function(b){var c=a.location&&a.location.hash;return c&&c.slice(1)===b.id},root:function(a){return a===o},focus:function(a){return a===n.activeElement&&(!n.hasFocus||n.hasFocus())&&!!(a.type||a.href||~a.tabIndex)},enabled:oa(!1),disabled:oa(!0),checked:function(a){var b=a.nodeName.toLowerCase();return"input"===b&&!!a.checked||"option"===b&&!!a.selected},selected:function(a){return a.parentNode&&a.parentNode.selectedIndex,a.selected===!0},empty:function(a){for(a=a.firstChild;a;a=a.nextSibling)if(a.nodeType<6)return!1;return!0},parent:function(a){return!d.pseudos.empty(a)},header:function(a){return X.test(a.nodeName)},input:function(a){return W.test(a.nodeName)},button:function(a){var b=a.nodeName.toLowerCase();return"input"===b&&"button"===a.type||"button"===b},text:function(a){var b;return"input"===a.nodeName.toLowerCase()&&"text"===a.type&&(null==(b=a.getAttribute("type"))||"text"===b.toLowerCase())},first:pa(function(){return[0]}),last:pa(function(a,b){return[b-1]}),eq:pa(function(a,b,c){return[0>c?c+b:c]}),even:pa(function(a,b){for(var c=0;b>c;c+=2)a.push(c);return a}),odd:pa(function(a,b){for(var c=1;b>c;c+=2)a.push(c);return a}),lt:pa(function(a,b,c){for(var d=0>c?c+b:c;--d>=0;)a.push(d);return a}),gt:pa(function(a,b,c){for(var d=0>c?c+b:c;++d<b;)a.push(d);return a})}},d.pseudos.nth=d.pseudos.eq;for(b in{radio:!0,checkbox:!0,file:!0,password:!0,image:!0})d.pseudos[b]=ma(b);for(b in{submit:!0,reset:!0})d.pseudos[b]=na(b);function ra(){}ra.prototype=d.filters=d.pseudos,d.setFilters=new ra,g=ga.tokenize=function(a,b){var c,e,f,g,h,i,j,k=z[a+" "];if(k)return b?0:k.slice(0);h=a,i=[],j=d.preFilter;while(h){c&&!(e=Q.exec(h))||(e&&(h=h.slice(e[0].length)||h),i.push(f=[])),c=!1,(e=R.exec(h))&&(c=e.shift(),f.push({value:c,type:e[0].replace(P," ")}),h=h.slice(c.length));for(g in d.filter)!(e=V[g].exec(h))||j[g]&&!(e=j[g](e))||(c=e.shift(),f.push({value:c,type:g,matches:e}),h=h.slice(c.length));if(!c)break}return b?h.length:h?ga.error(a):z(a,i).slice(0)};function sa(a){for(var b=0,c=a.length,d="";c>b;b++)d+=a[b].value;return d}function ta(a,b,c){var d=b.dir,e=b.next,f=e||d,g=c&&"parentNode"===f,h=x++;return b.first?function(b,c,e){while(b=b[d])if(1===b.nodeType||g)return a(b,c,e)}:function(b,c,i){var j,k,l,m=[w,h];if(i){while(b=b[d])if((1===b.nodeType||g)&&a(b,c,i))return!0}else while(b=b[d])if(1===b.nodeType||g)if(l=b[u]||(b[u]={}),k=l[b.uniqueID]||(l[b.uniqueID]={}),e&&e===b.nodeName.toLowerCase())b=b[d]||b;else{if((j=k[f])&&j[0]===w&&j[1]===h)return m[2]=j[2];if(k[f]=m,m[2]=a(b,c,i))return!0}}}function ua(a){return a.length>1?function(b,c,d){var e=a.length;while(e--)if(!a[e](b,c,d))return!1;return!0}:a[0]}function va(a,b,c){for(var d=0,e=b.length;e>d;d++)ga(a,b[d],c);return c}function wa(a,b,c,d,e){for(var f,g=[],h=0,i=a.length,j=null!=b;i>h;h++)(f=a[h])&&(c&&!c(f,d,e)||(g.push(f),j&&b.push(h)));return g}function xa(a,b,c,d,e,f){return d&&!d[u]&&(d=xa(d)),e&&!e[u]&&(e=xa(e,f)),ia(function(f,g,h,i){var j,k,l,m=[],n=[],o=g.length,p=f||va(b||"*",h.nodeType?[h]:h,[]),q=!a||!f&&b?p:wa(p,m,a,h,i),r=c?e||(f?a:o||d)?[]:g:q;if(c&&c(q,r,h,i),d){j=wa(r,n),d(j,[],h,i),k=j.length;while(k--)(l=j[k])&&(r[n[k]]=!(q[n[k]]=l))}if(f){if(e||a){if(e){j=[],k=r.length;while(k--)(l=r[k])&&j.push(q[k]=l);e(null,r=[],j,i)}k=r.length;while(k--)(l=r[k])&&(j=e?I(f,l):m[k])>-1&&(f[j]=!(g[j]=l))}}else r=wa(r===g?r.splice(o,r.length):r),e?e(null,g,r,i):G.apply(g,r)})}function ya(a){for(var b,c,e,f=a.length,g=d.relative[a[0].type],h=g||d.relative[" "],i=g?1:0,k=ta(function(a){return a===b},h,!0),l=ta(function(a){return I(b,a)>-1},h,!0),m=[function(a,c,d){var e=!g&&(d||c!==j)||((b=c).nodeType?k(a,c,d):l(a,c,d));return b=null,e}];f>i;i++)if(c=d.relative[a[i].type])m=[ta(ua(m),c)];else{if(c=d.filter[a[i].type].apply(null,a[i].matches),c[u]){for(e=++i;f>e;e++)if(d.relative[a[e].type])break;return xa(i>1&&ua(m),i>1&&sa(a.slice(0,i-1).concat({value:" "===a[i-2].type?"*":""})).replace(P,"$1"),c,e>i&&ya(a.slice(i,e)),f>e&&ya(a=a.slice(e)),f>e&&sa(a))}m.push(c)}return ua(m)}function za(a,b){var c=b.length>0,e=a.length>0,f=function(f,g,h,i,k){var l,o,q,r=0,s="0",t=f&&[],u=[],v=j,x=f||e&&d.find.TAG("*",k),y=w+=null==v?1:Math.random()||.1,z=x.length;for(k&&(j=g===n||g||k);s!==z&&null!=(l=x[s]);s++){if(e&&l){o=0,g||l.ownerDocument===n||(m(l),h=!p);while(q=a[o++])if(q(l,g||n,h)){i.push(l);break}k&&(w=y)}c&&((l=!q&&l)&&r--,f&&t.push(l))}if(r+=s,c&&s!==r){o=0;while(q=b[o++])q(t,u,g,h);if(f){if(r>0)while(s--)t[s]||u[s]||(u[s]=E.call(i));u=wa(u)}G.apply(i,u),k&&!f&&u.length>0&&r+b.length>1&&ga.uniqueSort(i)}return k&&(w=y,j=v),t};return c?ia(f):f}return h=ga.compile=function(a,b){var c,d=[],e=[],f=A[a+" "];if(!f){b||(b=g(a)),c=b.length;while(c--)f=ya(b[c]),f[u]?d.push(f):e.push(f);f=A(a,za(e,d)),f.selector=a}return f},i=ga.select=function(a,b,e,f){var i,j,k,l,m,n="function"==typeof a&&a,o=!f&&g(a=n.selector||a);if(e=e||[],1===o.length){if(j=o[0]=o[0].slice(0),j.length>2&&"ID"===(k=j[0]).type&&c.getById&&9===b.nodeType&&p&&d.relative[j[1].type]){if(b=(d.find.ID(k.matches[0].replace(_,aa),b)||[])[0],!b)return e;n&&(b=b.parentNode),a=a.slice(j.shift().value.length)}i=V.needsContext.test(a)?0:j.length;while(i--){if(k=j[i],d.relative[l=k.type])break;if((m=d.find[l])&&(f=m(k.matches[0].replace(_,aa),$.test(j[0].type)&&qa(b.parentNode)||b))){if(j.splice(i,1),a=f.length&&sa(j),!a)return G.apply(e,f),e;break}}}return(n||h(a,o))(f,b,!p,e,!b||$.test(a)&&qa(b.parentNode)||b),e},c.sortStable=u.split("").sort(B).join("")===u,c.detectDuplicates=!!l,m(),c.sortDetached=ja(function(a){return 1&a.compareDocumentPosition(n.createElement("fieldset"))}),ja(function(a){return a.innerHTML="<a href='#'></a>","#"===a.firstChild.getAttribute("href")})||ka("type|href|height|width",function(a,b,c){return c?void 0:a.getAttribute(b,"type"===b.toLowerCase()?1:2)}),c.attributes&&ja(function(a){return a.innerHTML="<input/>",a.firstChild.setAttribute("value",""),""===a.firstChild.getAttribute("value")})||ka("value",function(a,b,c){return c||"input"!==a.nodeName.toLowerCase()?void 0:a.defaultValue}),ja(function(a){return null==a.getAttribute("disabled")})||ka(J,function(a,b,c){var d;return c?void 0:a[b]===!0?b.toLowerCase():(d=a.getAttributeNode(b))&&d.specified?d.value:null}),ga}(a);r.find=x,r.expr=x.selectors,r.expr[":"]=r.expr.pseudos,r.uniqueSort=r.unique=x.uniqueSort,r.text=x.getText,r.isXMLDoc=x.isXML,r.contains=x.contains,r.escapeSelector=x.escape;var y=function(a,b,c){var d=[],e=void 0!==c;while((a=a[b])&&9!==a.nodeType)if(1===a.nodeType){if(e&&r(a).is(c))break;d.push(a)}return d},z=function(a,b){for(var c=[];a;a=a.nextSibling)1===a.nodeType&&a!==b&&c.push(a);return c},A=r.expr.match.needsContext,B=/^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i,C=/^.[^:#\[\.,]*$/;function D(a,b,c){if(r.isFunction(b))return r.grep(a,function(a,d){return!!b.call(a,d,a)!==c});if(b.nodeType)return r.grep(a,function(a){return a===b!==c});if("string"==typeof b){if(C.test(b))return r.filter(b,a,c);b=r.filter(b,a)}return r.grep(a,function(a){return i.call(b,a)>-1!==c&&1===a.nodeType})}r.filter=function(a,b,c){var d=b[0];return c&&(a=":not("+a+")"),1===b.length&&1===d.nodeType?r.find.matchesSelector(d,a)?[d]:[]:r.find.matches(a,r.grep(b,function(a){return 1===a.nodeType}))},r.fn.extend({find:function(a){var b,c,d=this.length,e=this;if("string"!=typeof a)return this.pushStack(r(a).filter(function(){for(b=0;d>b;b++)if(r.contains(e[b],this))return!0}));for(c=this.pushStack([]),b=0;d>b;b++)r.find(a,e[b],c);return d>1?r.uniqueSort(c):c},filter:function(a){return this.pushStack(D(this,a||[],!1))},not:function(a){return this.pushStack(D(this,a||[],!0))},is:function(a){return!!D(this,"string"==typeof a&&A.test(a)?r(a):a||[],!1).length}});var E,F=/^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/,G=r.fn.init=function(a,b,c){var e,f;if(!a)return this;if(c=c||E,"string"==typeof a){if(e="<"===a[0]&&">"===a[a.length-1]&&a.length>=3?[null,a,null]:F.exec(a),!e||!e[1]&&b)return!b||b.jquery?(b||c).find(a):this.constructor(b).find(a);if(e[1]){if(b=b instanceof r?b[0]:b,r.merge(this,r.parseHTML(e[1],b&&b.nodeType?b.ownerDocument||b:d,!0)),B.test(e[1])&&r.isPlainObject(b))for(e in b)r.isFunction(this[e])?this[e](b[e]):this.attr(e,b[e]);return this}return f=d.getElementById(e[2]),f&&(this[0]=f,this.length=1),this}return a.nodeType?(this[0]=a,this.length=1,this):r.isFunction(a)?void 0!==c.ready?c.ready(a):a(r):r.makeArray(a,this)};G.prototype=r.fn,E=r(d);var H=/^(?:parents|prev(?:Until|All))/,I={children:!0,contents:!0,next:!0,prev:!0};r.fn.extend({has:function(a){var b=r(a,this),c=b.length;return this.filter(function(){for(var a=0;c>a;a++)if(r.contains(this,b[a]))return!0})},closest:function(a,b){var c,d=0,e=this.length,f=[],g="string"!=typeof a&&r(a);if(!A.test(a))for(;e>d;d++)for(c=this[d];c&&c!==b;c=c.parentNode)if(c.nodeType<11&&(g?g.index(c)>-1:1===c.nodeType&&r.find.matchesSelector(c,a))){f.push(c);break}return this.pushStack(f.length>1?r.uniqueSort(f):f)},index:function(a){return a?"string"==typeof a?i.call(r(a),this[0]):i.call(this,a.jquery?a[0]:a):this[0]&&this[0].parentNode?this.first().prevAll().length:-1},add:function(a,b){return this.pushStack(r.uniqueSort(r.merge(this.get(),r(a,b))))},addBack:function(a){return this.add(null==a?this.prevObject:this.prevObject.filter(a))}});function J(a,b){while((a=a[b])&&1!==a.nodeType);return a}r.each({parent:function(a){var b=a.parentNode;return b&&11!==b.nodeType?b:null},parents:function(a){return y(a,"parentNode")},parentsUntil:function(a,b,c){return y(a,"parentNode",c)},next:function(a){return J(a,"nextSibling")},prev:function(a){return J(a,"previousSibling")},nextAll:function(a){return y(a,"nextSibling")},prevAll:function(a){return y(a,"previousSibling")},nextUntil:function(a,b,c){return y(a,"nextSibling",c)},prevUntil:function(a,b,c){return y(a,"previousSibling",c)},siblings:function(a){return z((a.parentNode||{}).firstChild,a)},children:function(a){return z(a.firstChild)},contents:function(a){return a.contentDocument||r.merge([],a.childNodes)}},function(a,b){r.fn[a]=function(c,d){var e=r.map(this,b,c);return"Until"!==a.slice(-5)&&(d=c),d&&"string"==typeof d&&(e=r.filter(d,e)),this.length>1&&(I[a]||r.uniqueSort(e),H.test(a)&&e.reverse()),this.pushStack(e)}});var K=/\S+/g;function L(a){var b={};return r.each(a.match(K)||[],function(a,c){b[c]=!0}),b}r.Callbacks=function(a){a="string"==typeof a?L(a):r.extend({},a);var b,c,d,e,f=[],g=[],h=-1,i=function(){for(e=a.once,d=b=!0;g.length;h=-1){c=g.shift();while(++h<f.length)f[h].apply(c[0],c[1])===!1&&a.stopOnFalse&&(h=f.length,c=!1)}a.memory||(c=!1),b=!1,e&&(f=c?[]:"")},j={add:function(){return f&&(c&&!b&&(h=f.length-1,g.push(c)),function d(b){r.each(b,function(b,c){r.isFunction(c)?a.unique&&j.has(c)||f.push(c):c&&c.length&&"string"!==r.type(c)&&d(c)})}(arguments),c&&!b&&i()),this},remove:function(){return r.each(arguments,function(a,b){var c;while((c=r.inArray(b,f,c))>-1)f.splice(c,1),h>=c&&h--}),this},has:function(a){return a?r.inArray(a,f)>-1:f.length>0},empty:function(){return f&&(f=[]),this},disable:function(){return e=g=[],f=c="",this},disabled:function(){return!f},lock:function(){return e=g=[],c||b||(f=c=""),this},locked:function(){return!!e},fireWith:function(a,c){return e||(c=c||[],c=[a,c.slice?c.slice():c],g.push(c),b||i()),this},fire:function(){return j.fireWith(this,arguments),this},fired:function(){return!!d}};return j};function M(a){return a}function N(a){throw a}function O(a,b,c){var d;try{a&&r.isFunction(d=a.promise)?d.call(a).done(b).fail(c):a&&r.isFunction(d=a.then)?d.call(a,b,c):b.call(void 0,a)}catch(a){c.call(void 0,a)}}r.extend({Deferred:function(b){var c=[["notify","progress",r.Callbacks("memory"),r.Callbacks("memory"),2],["resolve","done",r.Callbacks("once memory"),r.Callbacks("once memory"),0,"resolved"],["reject","fail",r.Callbacks("once memory"),r.Callbacks("once memory"),1,"rejected"]],d="pending",e={state:function(){return d},always:function(){return f.done(arguments).fail(arguments),this},"catch":function(a){return e.then(null,a)},pipe:function(){var a=arguments;return r.Deferred(function(b){r.each(c,function(c,d){var e=r.isFunction(a[d[4]])&&a[d[4]];f[d[1]](function(){var a=e&&e.apply(this,arguments);a&&r.isFunction(a.promise)?a.promise().progress(b.notify).done(b.resolve).fail(b.reject):b[d[0]+"With"](this,e?[a]:arguments)})}),a=null}).promise()},then:function(b,d,e){var f=0;function g(b,c,d,e){return function(){var h=this,i=arguments,j=function(){var a,j;if(!(f>b)){if(a=d.apply(h,i),a===c.promise())throw new TypeError("Thenable self-resolution");j=a&&("object"==typeof a||"function"==typeof a)&&a.then,r.isFunction(j)?e?j.call(a,g(f,c,M,e),g(f,c,N,e)):(f++,j.call(a,g(f,c,M,e),g(f,c,N,e),g(f,c,M,c.notifyWith))):(d!==M&&(h=void 0,i=[a]),(e||c.resolveWith)(h,i))}},k=e?j:function(){try{j()}catch(a){r.Deferred.exceptionHook&&r.Deferred.exceptionHook(a,k.stackTrace),b+1>=f&&(d!==N&&(h=void 0,i=[a]),c.rejectWith(h,i))}};b?k():(r.Deferred.getStackHook&&(k.stackTrace=r.Deferred.getStackHook()),a.setTimeout(k))}}return r.Deferred(function(a){c[0][3].add(g(0,a,r.isFunction(e)?e:M,a.notifyWith)),c[1][3].add(g(0,a,r.isFunction(b)?b:M)),c[2][3].add(g(0,a,r.isFunction(d)?d:N))}).promise()},promise:function(a){return null!=a?r.extend(a,e):e}},f={};return r.each(c,function(a,b){var g=b[2],h=b[5];e[b[1]]=g.add,h&&g.add(function(){d=h},c[3-a][2].disable,c[0][2].lock),g.add(b[3].fire),f[b[0]]=function(){return f[b[0]+"With"](this===f?void 0:this,arguments),this},f[b[0]+"With"]=g.fireWith}),e.promise(f),b&&b.call(f,f),f},when:function(a){var b=arguments.length,c=b,d=Array(c),e=f.call(arguments),g=r.Deferred(),h=function(a){return function(c){d[a]=this,e[a]=arguments.length>1?f.call(arguments):c,--b||g.resolveWith(d,e)}};if(1>=b&&(O(a,g.done(h(c)).resolve,g.reject),"pending"===g.state()||r.isFunction(e[c]&&e[c].then)))return g.then();while(c--)O(e[c],h(c),g.reject);return g.promise()}});var P=/^(Eval|Internal|Range|Reference|Syntax|Type|URI)Error$/;r.Deferred.exceptionHook=function(b,c){a.console&&a.console.warn&&b&&P.test(b.name)&&a.console.warn("jQuery.Deferred exception: "+b.message,b.stack,c)};var Q=r.Deferred();r.fn.ready=function(a){return Q.then(a),this},r.extend({isReady:!1,readyWait:1,holdReady:function(a){a?r.readyWait++:r.ready(!0)},ready:function(a){(a===!0?--r.readyWait:r.isReady)||(r.isReady=!0,a!==!0&&--r.readyWait>0||Q.resolveWith(d,[r]))}}),r.ready.then=Q.then;function R(){d.removeEventListener("DOMContentLoaded",R),a.removeEventListener("load",R),r.ready()}"complete"===d.readyState||"loading"!==d.readyState&&!d.documentElement.doScroll?a.setTimeout(r.ready):(d.addEventListener("DOMContentLoaded",R),a.addEventListener("load",R));var S=function(a,b,c,d,e,f,g){var h=0,i=a.length,j=null==c;if("object"===r.type(c)){e=!0;for(h in c)S(a,b,h,c[h],!0,f,g)}else if(void 0!==d&&(e=!0,r.isFunction(d)||(g=!0),j&&(g?(b.call(a,d),b=null):(j=b,b=function(a,b,c){
//return j.call(r(a),c)})),b))for(;i>h;h++)b(a[h],c,g?d:d.call(a[h],h,b(a[h],c)));return e?a:j?b.call(a):i?b(a[0],c):f},T=function(a){return 1===a.nodeType||9===a.nodeType||!+a.nodeType};function U(){this.expando=r.expando+U.uid++}U.uid=1,U.prototype={cache:function(a){var b=a[this.expando];return b||(b={},T(a)&&(a.nodeType?a[this.expando]=b:Object.defineProperty(a,this.expando,{value:b,configurable:!0}))),b},set:function(a,b,c){var d,e=this.cache(a);if("string"==typeof b)e[r.camelCase(b)]=c;else for(d in b)e[r.camelCase(d)]=b[d];return e},get:function(a,b){return void 0===b?this.cache(a):a[this.expando]&&a[this.expando][r.camelCase(b)]},access:function(a,b,c){return void 0===b||b&&"string"==typeof b&&void 0===c?this.get(a,b):(this.set(a,b,c),void 0!==c?c:b)},remove:function(a,b){var c,d=a[this.expando];if(void 0!==d){if(void 0!==b){r.isArray(b)?b=b.map(r.camelCase):(b=r.camelCase(b),b=b in d?[b]:b.match(K)||[]),c=b.length;while(c--)delete d[b[c]]}(void 0===b||r.isEmptyObject(d))&&(a.nodeType?a[this.expando]=void 0:delete a[this.expando])}},hasData:function(a){var b=a[this.expando];return void 0!==b&&!r.isEmptyObject(b)}};var V=new U,W=new U,X=/^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,Y=/[A-Z]/g;function Z(a,b,c){var d;if(void 0===c&&1===a.nodeType)if(d="data-"+b.replace(Y,"-$&").toLowerCase(),c=a.getAttribute(d),"string"==typeof c){try{c="true"===c?!0:"false"===c?!1:"null"===c?null:+c+""===c?+c:X.test(c)?JSON.parse(c):c}catch(e){}W.set(a,b,c)}else c=void 0;return c}r.extend({hasData:function(a){return W.hasData(a)||V.hasData(a)},data:function(a,b,c){return W.access(a,b,c)},removeData:function(a,b){W.remove(a,b)},_data:function(a,b,c){return V.access(a,b,c)},_removeData:function(a,b){V.remove(a,b)}}),r.fn.extend({data:function(a,b){var c,d,e,f=this[0],g=f&&f.attributes;if(void 0===a){if(this.length&&(e=W.get(f),1===f.nodeType&&!V.get(f,"hasDataAttrs"))){c=g.length;while(c--)g[c]&&(d=g[c].name,0===d.indexOf("data-")&&(d=r.camelCase(d.slice(5)),Z(f,d,e[d])));V.set(f,"hasDataAttrs",!0)}return e}return"object"==typeof a?this.each(function(){W.set(this,a)}):S(this,function(b){var c;if(f&&void 0===b){if(c=W.get(f,a),void 0!==c)return c;if(c=Z(f,a),void 0!==c)return c}else this.each(function(){W.set(this,a,b)})},null,b,arguments.length>1,null,!0)},removeData:function(a){return this.each(function(){W.remove(this,a)})}}),r.extend({queue:function(a,b,c){var d;return a?(b=(b||"fx")+"queue",d=V.get(a,b),c&&(!d||r.isArray(c)?d=V.access(a,b,r.makeArray(c)):d.push(c)),d||[]):void 0},dequeue:function(a,b){b=b||"fx";var c=r.queue(a,b),d=c.length,e=c.shift(),f=r._queueHooks(a,b),g=function(){r.dequeue(a,b)};"inprogress"===e&&(e=c.shift(),d--),e&&("fx"===b&&c.unshift("inprogress"),delete f.stop,e.call(a,g,f)),!d&&f&&f.empty.fire()},_queueHooks:function(a,b){var c=b+"queueHooks";return V.get(a,c)||V.access(a,c,{empty:r.Callbacks("once memory").add(function(){V.remove(a,[b+"queue",c])})})}}),r.fn.extend({queue:function(a,b){var c=2;return"string"!=typeof a&&(b=a,a="fx",c--),arguments.length<c?r.queue(this[0],a):void 0===b?this:this.each(function(){var c=r.queue(this,a,b);r._queueHooks(this,a),"fx"===a&&"inprogress"!==c[0]&&r.dequeue(this,a)})},dequeue:function(a){return this.each(function(){r.dequeue(this,a)})},clearQueue:function(a){return this.queue(a||"fx",[])},promise:function(a,b){var c,d=1,e=r.Deferred(),f=this,g=this.length,h=function(){--d||e.resolveWith(f,[f])};"string"!=typeof a&&(b=a,a=void 0),a=a||"fx";while(g--)c=V.get(f[g],a+"queueHooks"),c&&c.empty&&(d++,c.empty.add(h));return h(),e.promise(b)}});var $=/[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,_=new RegExp("^(?:([+-])=|)("+$+")([a-z%]*)$","i"),aa=["Top","Right","Bottom","Left"],ba=function(a,b){return a=b||a,"none"===a.style.display||""===a.style.display&&r.contains(a.ownerDocument,a)&&"none"===r.css(a,"display")},ca=function(a,b,c,d){var e,f,g={};for(f in b)g[f]=a.style[f],a.style[f]=b[f];e=c.apply(a,d||[]);for(f in b)a.style[f]=g[f];return e};function da(a,b,c,d){var e,f=1,g=20,h=d?function(){return d.cur()}:function(){return r.css(a,b,"")},i=h(),j=c&&c[3]||(r.cssNumber[b]?"":"px"),k=(r.cssNumber[b]||"px"!==j&&+i)&&_.exec(r.css(a,b));if(k&&k[3]!==j){j=j||k[3],c=c||[],k=+i||1;do f=f||".5",k/=f,r.style(a,b,k+j);while(f!==(f=h()/i)&&1!==f&&--g)}return c&&(k=+k||+i||0,e=c[1]?k+(c[1]+1)*c[2]:+c[2],d&&(d.unit=j,d.start=k,d.end=e)),e}var ea={};function fa(a){var b,c=a.ownerDocument,d=a.nodeName,e=ea[d];return e?e:(b=c.body.appendChild(c.createElement(d)),e=r.css(b,"display"),b.parentNode.removeChild(b),"none"===e&&(e="block"),ea[d]=e,e)}function ga(a,b){for(var c,d,e=[],f=0,g=a.length;g>f;f++)d=a[f],d.style&&(c=d.style.display,b?("none"===c&&(e[f]=V.get(d,"display")||null,e[f]||(d.style.display="")),""===d.style.display&&ba(d)&&(e[f]=fa(d))):"none"!==c&&(e[f]="none",V.set(d,"display",c)));for(f=0;g>f;f++)null!=e[f]&&(a[f].style.display=e[f]);return a}r.fn.extend({show:function(){return ga(this,!0)},hide:function(){return ga(this)},toggle:function(a){return"boolean"==typeof a?a?this.show():this.hide():this.each(function(){ba(this)?r(this).show():r(this).hide()})}});var ha=/^(?:checkbox|radio)$/i,ia=/<([a-z][^\/\0>\x20\t\r\n\f]+)/i,ja=/^$|\/(?:java|ecma)script/i,ka={option:[1,"<select multiple='multiple'>","</select>"],thead:[1,"<table>","</table>"],col:[2,"<table><colgroup>","</colgroup></table>"],tr:[2,"<table><tbody>","</tbody></table>"],td:[3,"<table><tbody><tr>","</tr></tbody></table>"],_default:[0,"",""]};ka.optgroup=ka.option,ka.tbody=ka.tfoot=ka.colgroup=ka.caption=ka.thead,ka.th=ka.td;function la(a,b){var c="undefined"!=typeof a.getElementsByTagName?a.getElementsByTagName(b||"*"):"undefined"!=typeof a.querySelectorAll?a.querySelectorAll(b||"*"):[];return void 0===b||b&&r.nodeName(a,b)?r.merge([a],c):c}function ma(a,b){for(var c=0,d=a.length;d>c;c++)V.set(a[c],"globalEval",!b||V.get(b[c],"globalEval"))}var na=/<|&#?\w+;/;function oa(a,b,c,d,e){for(var f,g,h,i,j,k,l=b.createDocumentFragment(),m=[],n=0,o=a.length;o>n;n++)if(f=a[n],f||0===f)if("object"===r.type(f))r.merge(m,f.nodeType?[f]:f);else if(na.test(f)){g=g||l.appendChild(b.createElement("div")),h=(ia.exec(f)||["",""])[1].toLowerCase(),i=ka[h]||ka._default,g.innerHTML=i[1]+r.htmlPrefilter(f)+i[2],k=i[0];while(k--)g=g.lastChild;r.merge(m,g.childNodes),g=l.firstChild,g.textContent=""}else m.push(b.createTextNode(f));l.textContent="",n=0;while(f=m[n++])if(d&&r.inArray(f,d)>-1)e&&e.push(f);else if(j=r.contains(f.ownerDocument,f),g=la(l.appendChild(f),"script"),j&&ma(g),c){k=0;while(f=g[k++])ja.test(f.type||"")&&c.push(f)}return l}!function(){var a=d.createDocumentFragment(),b=a.appendChild(d.createElement("div")),c=d.createElement("input");c.setAttribute("type","radio"),c.setAttribute("checked","checked"),c.setAttribute("name","t"),b.appendChild(c),o.checkClone=b.cloneNode(!0).cloneNode(!0).lastChild.checked,b.innerHTML="<textarea>x</textarea>",o.noCloneChecked=!!b.cloneNode(!0).lastChild.defaultValue}();var pa=d.documentElement,qa=/^key/,ra=/^(?:mouse|pointer|contextmenu|drag|drop)|click/,sa=/^([^.]*)(?:\.(.+)|)/;function ta(){return!0}function ua(){return!1}function va(){try{return d.activeElement}catch(a){}}function wa(a,b,c,d,e,f){var g,h;if("object"==typeof b){"string"!=typeof c&&(d=d||c,c=void 0);for(h in b)wa(a,h,c,d,b[h],f);return a}if(null==d&&null==e?(e=c,d=c=void 0):null==e&&("string"==typeof c?(e=d,d=void 0):(e=d,d=c,c=void 0)),e===!1)e=ua;else if(!e)return a;return 1===f&&(g=e,e=function(a){return r().off(a),g.apply(this,arguments)},e.guid=g.guid||(g.guid=r.guid++)),a.each(function(){r.event.add(this,b,e,d,c)})}r.event={global:{},add:function(a,b,c,d,e){var f,g,h,i,j,k,l,m,n,o,p,q=V.get(a);if(q){c.handler&&(f=c,c=f.handler,e=f.selector),e&&r.find.matchesSelector(pa,e),c.guid||(c.guid=r.guid++),(i=q.events)||(i=q.events={}),(g=q.handle)||(g=q.handle=function(b){return"undefined"!=typeof r&&r.event.triggered!==b.type?r.event.dispatch.apply(a,arguments):void 0}),b=(b||"").match(K)||[""],j=b.length;while(j--)h=sa.exec(b[j])||[],n=p=h[1],o=(h[2]||"").split(".").sort(),n&&(l=r.event.special[n]||{},n=(e?l.delegateType:l.bindType)||n,l=r.event.special[n]||{},k=r.extend({type:n,origType:p,data:d,handler:c,guid:c.guid,selector:e,needsContext:e&&r.expr.match.needsContext.test(e),namespace:o.join(".")},f),(m=i[n])||(m=i[n]=[],m.delegateCount=0,l.setup&&l.setup.call(a,d,o,g)!==!1||a.addEventListener&&a.addEventListener(n,g)),l.add&&(l.add.call(a,k),k.handler.guid||(k.handler.guid=c.guid)),e?m.splice(m.delegateCount++,0,k):m.push(k),r.event.global[n]=!0)}},remove:function(a,b,c,d,e){var f,g,h,i,j,k,l,m,n,o,p,q=V.hasData(a)&&V.get(a);if(q&&(i=q.events)){b=(b||"").match(K)||[""],j=b.length;while(j--)if(h=sa.exec(b[j])||[],n=p=h[1],o=(h[2]||"").split(".").sort(),n){l=r.event.special[n]||{},n=(d?l.delegateType:l.bindType)||n,m=i[n]||[],h=h[2]&&new RegExp("(^|\\.)"+o.join("\\.(?:.*\\.|)")+"(\\.|$)"),g=f=m.length;while(f--)k=m[f],!e&&p!==k.origType||c&&c.guid!==k.guid||h&&!h.test(k.namespace)||d&&d!==k.selector&&("**"!==d||!k.selector)||(m.splice(f,1),k.selector&&m.delegateCount--,l.remove&&l.remove.call(a,k));g&&!m.length&&(l.teardown&&l.teardown.call(a,o,q.handle)!==!1||r.removeEvent(a,n,q.handle),delete i[n])}else for(n in i)r.event.remove(a,n+b[j],c,d,!0);r.isEmptyObject(i)&&V.remove(a,"handle events")}},dispatch:function(a){var b=r.event.fix(a),c,d,e,f,g,h,i=new Array(arguments.length),j=(V.get(this,"events")||{})[b.type]||[],k=r.event.special[b.type]||{};for(i[0]=b,c=1;c<arguments.length;c++)i[c]=arguments[c];if(b.delegateTarget=this,!k.preDispatch||k.preDispatch.call(this,b)!==!1){h=r.event.handlers.call(this,b,j),c=0;while((f=h[c++])&&!b.isPropagationStopped()){b.currentTarget=f.elem,d=0;while((g=f.handlers[d++])&&!b.isImmediatePropagationStopped())b.rnamespace&&!b.rnamespace.test(g.namespace)||(b.handleObj=g,b.data=g.data,e=((r.event.special[g.origType]||{}).handle||g.handler).apply(f.elem,i),void 0!==e&&(b.result=e)===!1&&(b.preventDefault(),b.stopPropagation()))}return k.postDispatch&&k.postDispatch.call(this,b),b.result}},handlers:function(a,b){var c,d,e,f,g=[],h=b.delegateCount,i=a.target;if(h&&i.nodeType&&("click"!==a.type||isNaN(a.button)||a.button<1))for(;i!==this;i=i.parentNode||this)if(1===i.nodeType&&(i.disabled!==!0||"click"!==a.type)){for(d=[],c=0;h>c;c++)f=b[c],e=f.selector+" ",void 0===d[e]&&(d[e]=f.needsContext?r(e,this).index(i)>-1:r.find(e,this,null,[i]).length),d[e]&&d.push(f);d.length&&g.push({elem:i,handlers:d})}return h<b.length&&g.push({elem:this,handlers:b.slice(h)}),g},addProp:function(a,b){Object.defineProperty(r.Event.prototype,a,{enumerable:!0,configurable:!0,get:r.isFunction(b)?function(){return this.originalEvent?b(this.originalEvent):void 0}:function(){return this.originalEvent?this.originalEvent[a]:void 0},set:function(b){Object.defineProperty(this,a,{enumerable:!0,configurable:!0,writable:!0,value:b})}})},fix:function(a){return a[r.expando]?a:new r.Event(a)},special:{load:{noBubble:!0},focus:{trigger:function(){return this!==va()&&this.focus?(this.focus(),!1):void 0},delegateType:"focusin"},blur:{trigger:function(){return this===va()&&this.blur?(this.blur(),!1):void 0},delegateType:"focusout"},click:{trigger:function(){return"checkbox"===this.type&&this.click&&r.nodeName(this,"input")?(this.click(),!1):void 0},_default:function(a){return r.nodeName(a.target,"a")}},beforeunload:{postDispatch:function(a){void 0!==a.result&&a.originalEvent&&(a.originalEvent.returnValue=a.result)}}}},r.removeEvent=function(a,b,c){a.removeEventListener&&a.removeEventListener(b,c)},r.Event=function(a,b){return this instanceof r.Event?(a&&a.type?(this.originalEvent=a,this.type=a.type,this.isDefaultPrevented=a.defaultPrevented||void 0===a.defaultPrevented&&a.returnValue===!1?ta:ua,this.target=a.target&&3===a.target.nodeType?a.target.parentNode:a.target,this.currentTarget=a.currentTarget,this.relatedTarget=a.relatedTarget):this.type=a,b&&r.extend(this,b),this.timeStamp=a&&a.timeStamp||r.now(),void(this[r.expando]=!0)):new r.Event(a,b)},r.Event.prototype={constructor:r.Event,isDefaultPrevented:ua,isPropagationStopped:ua,isImmediatePropagationStopped:ua,isSimulated:!1,preventDefault:function(){var a=this.originalEvent;this.isDefaultPrevented=ta,a&&!this.isSimulated&&a.preventDefault()},stopPropagation:function(){var a=this.originalEvent;this.isPropagationStopped=ta,a&&!this.isSimulated&&a.stopPropagation()},stopImmediatePropagation:function(){var a=this.originalEvent;this.isImmediatePropagationStopped=ta,a&&!this.isSimulated&&a.stopImmediatePropagation(),this.stopPropagation()}},r.each({altKey:!0,bubbles:!0,cancelable:!0,changedTouches:!0,ctrlKey:!0,detail:!0,eventPhase:!0,metaKey:!0,pageX:!0,pageY:!0,shiftKey:!0,view:!0,"char":!0,charCode:!0,key:!0,keyCode:!0,button:!0,buttons:!0,clientX:!0,clientY:!0,offsetX:!0,offsetY:!0,pointerId:!0,pointerType:!0,screenX:!0,screenY:!0,targetTouches:!0,toElement:!0,touches:!0,which:function(a){var b=a.button;return null==a.which&&qa.test(a.type)?null!=a.charCode?a.charCode:a.keyCode:!a.which&&void 0!==b&&ra.test(a.type)?1&b?1:2&b?3:4&b?2:0:a.which}},r.event.addProp),r.each({mouseenter:"mouseover",mouseleave:"mouseout",pointerenter:"pointerover",pointerleave:"pointerout"},function(a,b){r.event.special[a]={delegateType:b,bindType:b,handle:function(a){var c,d=this,e=a.relatedTarget,f=a.handleObj;return e&&(e===d||r.contains(d,e))||(a.type=f.origType,c=f.handler.apply(this,arguments),a.type=b),c}}}),r.fn.extend({on:function(a,b,c,d){return wa(this,a,b,c,d)},one:function(a,b,c,d){return wa(this,a,b,c,d,1)},off:function(a,b,c){var d,e;if(a&&a.preventDefault&&a.handleObj)return d=a.handleObj,r(a.delegateTarget).off(d.namespace?d.origType+"."+d.namespace:d.origType,d.selector,d.handler),this;if("object"==typeof a){for(e in a)this.off(e,b,a[e]);return this}return b!==!1&&"function"!=typeof b||(c=b,b=void 0),c===!1&&(c=ua),this.each(function(){r.event.remove(this,a,c,b)})}});var xa=/<(?!area|br|col|embed|hr|img|input|link|meta|param)(([a-z][^\/\0>\x20\t\r\n\f]*)[^>]*)\/>/gi,ya=/<script|<style|<link/i,za=/checked\s*(?:[^=]|=\s*.checked.)/i,Aa=/^true\/(.*)/,Ba=/^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g;function Ca(a,b){return r.nodeName(a,"table")&&r.nodeName(11!==b.nodeType?b:b.firstChild,"tr")?a.getElementsByTagName("tbody")[0]||a:a}function Da(a){return a.type=(null!==a.getAttribute("type"))+"/"+a.type,a}function Ea(a){var b=Aa.exec(a.type);return b?a.type=b[1]:a.removeAttribute("type"),a}function Fa(a,b){var c,d,e,f,g,h,i,j;if(1===b.nodeType){if(V.hasData(a)&&(f=V.access(a),g=V.set(b,f),j=f.events)){delete g.handle,g.events={};for(e in j)for(c=0,d=j[e].length;d>c;c++)r.event.add(b,e,j[e][c])}W.hasData(a)&&(h=W.access(a),i=r.extend({},h),W.set(b,i))}}function Ga(a,b){var c=b.nodeName.toLowerCase();"input"===c&&ha.test(a.type)?b.checked=a.checked:"input"!==c&&"textarea"!==c||(b.defaultValue=a.defaultValue)}function Ha(a,b,c,d){b=g.apply([],b);var e,f,h,i,j,k,l=0,m=a.length,n=m-1,q=b[0],s=r.isFunction(q);if(s||m>1&&"string"==typeof q&&!o.checkClone&&za.test(q))return a.each(function(e){var f=a.eq(e);s&&(b[0]=q.call(this,e,f.html())),Ha(f,b,c,d)});if(m&&(e=oa(b,a[0].ownerDocument,!1,a,d),f=e.firstChild,1===e.childNodes.length&&(e=f),f||d)){for(h=r.map(la(e,"script"),Da),i=h.length;m>l;l++)j=e,l!==n&&(j=r.clone(j,!0,!0),i&&r.merge(h,la(j,"script"))),c.call(a[l],j,l);if(i)for(k=h[h.length-1].ownerDocument,r.map(h,Ea),l=0;i>l;l++)j=h[l],ja.test(j.type||"")&&!V.access(j,"globalEval")&&r.contains(k,j)&&(j.src?r._evalUrl&&r._evalUrl(j.src):p(j.textContent.replace(Ba,""),k))}return a}function Ia(a,b,c){for(var d,e=b?r.filter(b,a):a,f=0;null!=(d=e[f]);f++)c||1!==d.nodeType||r.cleanData(la(d)),d.parentNode&&(c&&r.contains(d.ownerDocument,d)&&ma(la(d,"script")),d.parentNode.removeChild(d));return a}r.extend({htmlPrefilter:function(a){return a.replace(xa,"<$1></$2>")},clone:function(a,b,c){var d,e,f,g,h=a.cloneNode(!0),i=r.contains(a.ownerDocument,a);if(!(o.noCloneChecked||1!==a.nodeType&&11!==a.nodeType||r.isXMLDoc(a)))for(g=la(h),f=la(a),d=0,e=f.length;e>d;d++)Ga(f[d],g[d]);if(b)if(c)for(f=f||la(a),g=g||la(h),d=0,e=f.length;e>d;d++)Fa(f[d],g[d]);else Fa(a,h);return g=la(h,"script"),g.length>0&&ma(g,!i&&la(a,"script")),h},cleanData:function(a){for(var b,c,d,e=r.event.special,f=0;void 0!==(c=a[f]);f++)if(T(c)){if(b=c[V.expando]){if(b.events)for(d in b.events)e[d]?r.event.remove(c,d):r.removeEvent(c,d,b.handle);c[V.expando]=void 0}c[W.expando]&&(c[W.expando]=void 0)}}}),r.fn.extend({detach:function(a){return Ia(this,a,!0)},remove:function(a){return Ia(this,a)},text:function(a){return S(this,function(a){return void 0===a?r.text(this):this.empty().each(function(){1!==this.nodeType&&11!==this.nodeType&&9!==this.nodeType||(this.textContent=a)})},null,a,arguments.length)},append:function(){return Ha(this,arguments,function(a){if(1===this.nodeType||11===this.nodeType||9===this.nodeType){var b=Ca(this,a);b.appendChild(a)}})},prepend:function(){return Ha(this,arguments,function(a){if(1===this.nodeType||11===this.nodeType||9===this.nodeType){var b=Ca(this,a);b.insertBefore(a,b.firstChild)}})},before:function(){return Ha(this,arguments,function(a){this.parentNode&&this.parentNode.insertBefore(a,this)})},after:function(){return Ha(this,arguments,function(a){this.parentNode&&this.parentNode.insertBefore(a,this.nextSibling)})},empty:function(){for(var a,b=0;null!=(a=this[b]);b++)1===a.nodeType&&(r.cleanData(la(a,!1)),a.textContent="");return this},clone:function(a,b){return a=null==a?!1:a,b=null==b?a:b,this.map(function(){return r.clone(this,a,b)})},html:function(a){return S(this,function(a){var b=this[0]||{},c=0,d=this.length;if(void 0===a&&1===b.nodeType)return b.innerHTML;if("string"==typeof a&&!ya.test(a)&&!ka[(ia.exec(a)||["",""])[1].toLowerCase()]){a=r.htmlPrefilter(a);try{for(;d>c;c++)b=this[c]||{},1===b.nodeType&&(r.cleanData(la(b,!1)),b.innerHTML=a);b=0}catch(e){}}b&&this.empty().append(a)},null,a,arguments.length)},replaceWith:function(){var a=[];return Ha(this,arguments,function(b){var c=this.parentNode;r.inArray(this,a)<0&&(r.cleanData(la(this)),c&&c.replaceChild(b,this))},a)}}),r.each({appendTo:"append",prependTo:"prepend",insertBefore:"before",insertAfter:"after",replaceAll:"replaceWith"},function(a,b){r.fn[a]=function(a){for(var c,d=[],e=r(a),f=e.length-1,g=0;f>=g;g++)c=g===f?this:this.clone(!0),r(e[g])[b](c),h.apply(d,c.get());return this.pushStack(d)}});var Ja=/^margin/,Ka=new RegExp("^("+$+")(?!px)[a-z%]+$","i"),La=function(b){var c=b.ownerDocument.defaultView;return c&&c.opener||(c=a),c.getComputedStyle(b)};!function(){function b(){if(i){i.style.cssText="box-sizing:border-box;position:relative;display:block;margin:auto;border:1px;padding:1px;top:1%;width:50%",i.innerHTML="",pa.appendChild(h);var b=a.getComputedStyle(i);c="1%"!==b.top,g="2px"===b.marginLeft,e="4px"===b.width,i.style.marginRight="50%",f="4px"===b.marginRight,pa.removeChild(h),i=null}}var c,e,f,g,h=d.createElement("div"),i=d.createElement("div");i.style&&(i.style.backgroundClip="content-box",i.cloneNode(!0).style.backgroundClip="",o.clearCloneStyle="content-box"===i.style.backgroundClip,h.style.cssText="border:0;width:8px;height:0;top:0;left:-9999px;padding:0;margin-top:1px;position:absolute",h.appendChild(i),r.extend(o,{pixelPosition:function(){return b(),c},boxSizingReliable:function(){return b(),e},pixelMarginRight:function(){return b(),f},reliableMarginLeft:function(){return b(),g}}))}();function Ma(a,b,c){var d,e,f,g,h=a.style;return c=c||La(a),c&&(g=c.getPropertyValue(b)||c[b],""!==g||r.contains(a.ownerDocument,a)||(g=r.style(a,b)),!o.pixelMarginRight()&&Ka.test(g)&&Ja.test(b)&&(d=h.width,e=h.minWidth,f=h.maxWidth,h.minWidth=h.maxWidth=h.width=g,g=c.width,h.width=d,h.minWidth=e,h.maxWidth=f)),void 0!==g?g+"":g}function Na(a,b){return{get:function(){return a()?void delete this.get:(this.get=b).apply(this,arguments)}}}var Oa=/^(none|table(?!-c[ea]).+)/,Pa={position:"absolute",visibility:"hidden",display:"block"},Qa={letterSpacing:"0",fontWeight:"400"},Ra=["Webkit","Moz","ms"],Sa=d.createElement("div").style;function Ta(a){if(a in Sa)return a;var b=a[0].toUpperCase()+a.slice(1),c=Ra.length;while(c--)if(a=Ra[c]+b,a in Sa)return a}function Ua(a,b,c){var d=_.exec(b);return d?Math.max(0,d[2]-(c||0))+(d[3]||"px"):b}function Va(a,b,c,d,e){for(var f=c===(d?"border":"content")?4:"width"===b?1:0,g=0;4>f;f+=2)"margin"===c&&(g+=r.css(a,c+aa[f],!0,e)),d?("content"===c&&(g-=r.css(a,"padding"+aa[f],!0,e)),"margin"!==c&&(g-=r.css(a,"border"+aa[f]+"Width",!0,e))):(g+=r.css(a,"padding"+aa[f],!0,e),"padding"!==c&&(g+=r.css(a,"border"+aa[f]+"Width",!0,e)));return g}function Wa(a,b,c){var d,e=!0,f=La(a),g="border-box"===r.css(a,"boxSizing",!1,f);if(a.getClientRects().length&&(d=a.getBoundingClientRect()[b]),0>=d||null==d){if(d=Ma(a,b,f),(0>d||null==d)&&(d=a.style[b]),Ka.test(d))return d;e=g&&(o.boxSizingReliable()||d===a.style[b]),d=parseFloat(d)||0}return d+Va(a,b,c||(g?"border":"content"),e,f)+"px"}r.extend({cssHooks:{opacity:{get:function(a,b){if(b){var c=Ma(a,"opacity");return""===c?"1":c}}}},cssNumber:{animationIterationCount:!0,columnCount:!0,fillOpacity:!0,flexGrow:!0,flexShrink:!0,fontWeight:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,widows:!0,zIndex:!0,zoom:!0},cssProps:{"float":"cssFloat"},style:function(a,b,c,d){if(a&&3!==a.nodeType&&8!==a.nodeType&&a.style){var e,f,g,h=r.camelCase(b),i=a.style;return b=r.cssProps[h]||(r.cssProps[h]=Ta(h)||h),g=r.cssHooks[b]||r.cssHooks[h],void 0===c?g&&"get"in g&&void 0!==(e=g.get(a,!1,d))?e:i[b]:(f=typeof c,"string"===f&&(e=_.exec(c))&&e[1]&&(c=da(a,b,e),f="number"),null!=c&&c===c&&("number"===f&&(c+=e&&e[3]||(r.cssNumber[h]?"":"px")),o.clearCloneStyle||""!==c||0!==b.indexOf("background")||(i[b]="inherit"),g&&"set"in g&&void 0===(c=g.set(a,c,d))||(i[b]=c)),void 0)}},css:function(a,b,c,d){var e,f,g,h=r.camelCase(b);return b=r.cssProps[h]||(r.cssProps[h]=Ta(h)||h),g=r.cssHooks[b]||r.cssHooks[h],g&&"get"in g&&(e=g.get(a,!0,c)),void 0===e&&(e=Ma(a,b,d)),"normal"===e&&b in Qa&&(e=Qa[b]),""===c||c?(f=parseFloat(e),c===!0||isFinite(f)?f||0:e):e}}),r.each(["height","width"],function(a,b){r.cssHooks[b]={get:function(a,c,d){return c?!Oa.test(r.css(a,"display"))||a.getClientRects().length&&a.getBoundingClientRect().width?Wa(a,b,d):ca(a,Pa,function(){return Wa(a,b,d)}):void 0},set:function(a,c,d){var e,f=d&&La(a),g=d&&Va(a,b,d,"border-box"===r.css(a,"boxSizing",!1,f),f);return g&&(e=_.exec(c))&&"px"!==(e[3]||"px")&&(a.style[b]=c,c=r.css(a,b)),Ua(a,c,g)}}}),r.cssHooks.marginLeft=Na(o.reliableMarginLeft,function(a,b){return b?(parseFloat(Ma(a,"marginLeft"))||a.getBoundingClientRect().left-ca(a,{marginLeft:0},function(){return a.getBoundingClientRect().left}))+"px":void 0}),r.each({margin:"",padding:"",border:"Width"},function(a,b){r.cssHooks[a+b]={expand:function(c){for(var d=0,e={},f="string"==typeof c?c.split(" "):[c];4>d;d++)e[a+aa[d]+b]=f[d]||f[d-2]||f[0];return e}},Ja.test(a)||(r.cssHooks[a+b].set=Ua)}),r.fn.extend({css:function(a,b){return S(this,function(a,b,c){var d,e,f={},g=0;if(r.isArray(b)){for(d=La(a),e=b.length;e>g;g++)f[b[g]]=r.css(a,b[g],!1,d);return f}return void 0!==c?r.style(a,b,c):r.css(a,b)},a,b,arguments.length>1)}});function Xa(a,b,c,d,e){return new Xa.prototype.init(a,b,c,d,e)}r.Tween=Xa,Xa.prototype={constructor:Xa,init:function(a,b,c,d,e,f){this.elem=a,this.prop=c,this.easing=e||r.easing._default,this.options=b,this.start=this.now=this.cur(),this.end=d,this.unit=f||(r.cssNumber[c]?"":"px")},cur:function(){var a=Xa.propHooks[this.prop];return a&&a.get?a.get(this):Xa.propHooks._default.get(this)},run:function(a){var b,c=Xa.propHooks[this.prop];return this.options.duration?this.pos=b=r.easing[this.easing](a,this.options.duration*a,0,1,this.options.duration):this.pos=b=a,this.now=(this.end-this.start)*b+this.start,this.options.step&&this.options.step.call(this.elem,this.now,this),c&&c.set?c.set(this):Xa.propHooks._default.set(this),this}},Xa.prototype.init.prototype=Xa.prototype,Xa.propHooks={_default:{get:function(a){var b;return 1!==a.elem.nodeType||null!=a.elem[a.prop]&&null==a.elem.style[a.prop]?a.elem[a.prop]:(b=r.css(a.elem,a.prop,""),b&&"auto"!==b?b:0)},set:function(a){r.fx.step[a.prop]?r.fx.step[a.prop](a):1!==a.elem.nodeType||null==a.elem.style[r.cssProps[a.prop]]&&!r.cssHooks[a.prop]?a.elem[a.prop]=a.now:r.style(a.elem,a.prop,a.now+a.unit)}}},Xa.propHooks.scrollTop=Xa.propHooks.scrollLeft={set:function(a){a.elem.nodeType&&a.elem.parentNode&&(a.elem[a.prop]=a.now)}},r.easing={linear:function(a){return a},swing:function(a){return.5-Math.cos(a*Math.PI)/2},_default:"swing"},r.fx=Xa.prototype.init,r.fx.step={};var Ya,Za,$a=/^(?:toggle|show|hide)$/,_a=/queueHooks$/;function ab(){Za&&(a.requestAnimationFrame(ab),r.fx.tick())}function bb(){return a.setTimeout(function(){Ya=void 0}),Ya=r.now()}function cb(a,b){var c,d=0,e={height:a};for(b=b?1:0;4>d;d+=2-b)c=aa[d],e["margin"+c]=e["padding"+c]=a;return b&&(e.opacity=e.width=a),e}function db(a,b,c){for(var d,e=(gb.tweeners[b]||[]).concat(gb.tweeners["*"]),f=0,g=e.length;g>f;f++)if(d=e[f].call(c,b,a))return d}function eb(a,b,c){var d,e,f,g,h,i,j,k,l="width"in b||"height"in b,m=this,n={},o=a.style,p=a.nodeType&&ba(a),q=V.get(a,"fxshow");c.queue||(g=r._queueHooks(a,"fx"),null==g.unqueued&&(g.unqueued=0,h=g.empty.fire,g.empty.fire=function(){g.unqueued||h()}),g.unqueued++,m.always(function(){m.always(function(){g.unqueued--,r.queue(a,"fx").length||g.empty.fire()})}));for(d in b)if(e=b[d],$a.test(e)){if(delete b[d],f=f||"toggle"===e,e===(p?"hide":"show")){if("show"!==e||!q||void 0===q[d])continue;p=!0}n[d]=q&&q[d]||r.style(a,d)}if(i=!r.isEmptyObject(b),i||!r.isEmptyObject(n)){l&&1===a.nodeType&&(c.overflow=[o.overflow,o.overflowX,o.overflowY],j=q&&q.display,null==j&&(j=V.get(a,"display")),k=r.css(a,"display"),"none"===k&&(j?k=j:(ga([a],!0),j=a.style.display||j,k=r.css(a,"display"),ga([a]))),("inline"===k||"inline-block"===k&&null!=j)&&"none"===r.css(a,"float")&&(i||(m.done(function(){o.display=j}),null==j&&(k=o.display,j="none"===k?"":k)),o.display="inline-block")),c.overflow&&(o.overflow="hidden",m.always(function(){o.overflow=c.overflow[0],o.overflowX=c.overflow[1],o.overflowY=c.overflow[2]})),i=!1;for(d in n)i||(q?"hidden"in q&&(p=q.hidden):q=V.access(a,"fxshow",{display:j}),f&&(q.hidden=!p),p&&ga([a],!0),m.done(function(){p||ga([a]),V.remove(a,"fxshow");for(d in n)r.style(a,d,n[d])})),i=db(p?q[d]:0,d,m),d in q||(q[d]=i.start,p&&(i.end=i.start,i.start=0))}}function fb(a,b){var c,d,e,f,g;for(c in a)if(d=r.camelCase(c),e=b[d],f=a[c],r.isArray(f)&&(e=f[1],f=a[c]=f[0]),c!==d&&(a[d]=f,delete a[c]),g=r.cssHooks[d],g&&"expand"in g){f=g.expand(f),delete a[d];for(c in f)c in a||(a[c]=f[c],b[c]=e)}else b[d]=e}function gb(a,b,c){var d,e,f=0,g=gb.prefilters.length,h=r.Deferred().always(function(){delete i.elem}),i=function(){if(e)return!1;for(var b=Ya||bb(),c=Math.max(0,j.startTime+j.duration-b),d=c/j.duration||0,f=1-d,g=0,i=j.tweens.length;i>g;g++)j.tweens[g].run(f);return h.notifyWith(a,[j,f,c]),1>f&&i?c:(h.resolveWith(a,[j]),!1)},j=h.promise({elem:a,props:r.extend({},b),opts:r.extend(!0,{specialEasing:{},easing:r.easing._default},c),originalProperties:b,originalOptions:c,startTime:Ya||bb(),duration:c.duration,tweens:[],createTween:function(b,c){var d=r.Tween(a,j.opts,b,c,j.opts.specialEasing[b]||j.opts.easing);return j.tweens.push(d),d},stop:function(b){var c=0,d=b?j.tweens.length:0;if(e)return this;for(e=!0;d>c;c++)j.tweens[c].run(1);return b?(h.notifyWith(a,[j,1,0]),h.resolveWith(a,[j,b])):h.rejectWith(a,[j,b]),this}}),k=j.props;for(fb(k,j.opts.specialEasing);g>f;f++)if(d=gb.prefilters[f].call(j,a,k,j.opts))return r.isFunction(d.stop)&&(r._queueHooks(j.elem,j.opts.queue).stop=r.proxy(d.stop,d)),d;return r.map(k,db,j),r.isFunction(j.opts.start)&&j.opts.start.call(a,j),r.fx.timer(r.extend(i,{elem:a,anim:j,queue:j.opts.queue})),j.progress(j.opts.progress).done(j.opts.done,j.opts.complete).fail(j.opts.fail).always(j.opts.always)}r.Animation=r.extend(gb,{tweeners:{"*":[function(a,b){var c=this.createTween(a,b);return da(c.elem,a,_.exec(b),c),c}]},tweener:function(a,b){r.isFunction(a)?(b=a,a=["*"]):a=a.match(K);for(var c,d=0,e=a.length;e>d;d++)c=a[d],gb.tweeners[c]=gb.tweeners[c]||[],gb.tweeners[c].unshift(b)},prefilters:[eb],prefilter:function(a,b){b?gb.prefilters.unshift(a):gb.prefilters.push(a)}}),r.speed=function(a,b,c){var e=a&&"object"==typeof a?r.extend({},a):{complete:c||!c&&b||r.isFunction(a)&&a,duration:a,easing:c&&b||b&&!r.isFunction(b)&&b};return r.fx.off||d.hidden?e.duration=0:e.duration="number"==typeof e.duration?e.duration:e.duration in r.fx.speeds?r.fx.speeds[e.duration]:r.fx.speeds._default,null!=e.queue&&e.queue!==!0||(e.queue="fx"),e.old=e.complete,e.complete=function(){r.isFunction(e.old)&&e.old.call(this),e.queue&&r.dequeue(this,e.queue)},e},r.fn.extend({fadeTo:function(a,b,c,d){return this.filter(ba).css("opacity",0).show().end().animate({opacity:b},a,c,d)},animate:function(a,b,c,d){var e=r.isEmptyObject(a),f=r.speed(b,c,d),g=function(){var b=gb(this,r.extend({},a),f);(e||V.get(this,"finish"))&&b.stop(!0)};return g.finish=g,e||f.queue===!1?this.each(g):this.queue(f.queue,g)},stop:function(a,b,c){var d=function(a){var b=a.stop;delete a.stop,b(c)};return"string"!=typeof a&&(c=b,b=a,a=void 0),b&&a!==!1&&this.queue(a||"fx",[]),this.each(function(){var b=!0,e=null!=a&&a+"queueHooks",f=r.timers,g=V.get(this);if(e)g[e]&&g[e].stop&&d(g[e]);else for(e in g)g[e]&&g[e].stop&&_a.test(e)&&d(g[e]);for(e=f.length;e--;)f[e].elem!==this||null!=a&&f[e].queue!==a||(f[e].anim.stop(c),b=!1,f.splice(e,1));!b&&c||r.dequeue(this,a)})},finish:function(a){return a!==!1&&(a=a||"fx"),this.each(function(){var b,c=V.get(this),d=c[a+"queue"],e=c[a+"queueHooks"],f=r.timers,g=d?d.length:0;for(c.finish=!0,r.queue(this,a,[]),e&&e.stop&&e.stop.call(this,!0),b=f.length;b--;)f[b].elem===this&&f[b].queue===a&&(f[b].anim.stop(!0),f.splice(b,1));for(b=0;g>b;b++)d[b]&&d[b].finish&&d[b].finish.call(this);delete c.finish})}}),r.each(["toggle","show","hide"],function(a,b){var c=r.fn[b];r.fn[b]=function(a,d,e){return null==a||"boolean"==typeof a?c.apply(this,arguments):this.animate(cb(b,!0),a,d,e)}}),r.each({slideDown:cb("show"),slideUp:cb("hide"),slideToggle:cb("toggle"),fadeIn:{opacity:"show"},fadeOut:{opacity:"hide"},fadeToggle:{opacity:"toggle"}},function(a,b){r.fn[a]=function(a,c,d){return this.animate(b,a,c,d)}}),r.timers=[],r.fx.tick=function(){var a,b=0,c=r.timers;for(Ya=r.now();b<c.length;b++)a=c[b],a()||c[b]!==a||c.splice(b--,1);c.length||r.fx.stop(),Ya=void 0},r.fx.timer=function(a){r.timers.push(a),a()?r.fx.start():r.timers.pop()},r.fx.interval=13,r.fx.start=function(){Za||(Za=a.requestAnimationFrame?a.requestAnimationFrame(ab):a.setInterval(r.fx.tick,r.fx.interval))},r.fx.stop=function(){a.cancelAnimationFrame?a.cancelAnimationFrame(Za):a.clearInterval(Za),Za=null},r.fx.speeds={slow:600,fast:200,_default:400},r.fn.delay=function(b,c){return b=r.fx?r.fx.speeds[b]||b:b,c=c||"fx",this.queue(c,function(c,d){var e=a.setTimeout(c,b);d.stop=function(){a.clearTimeout(e)}})},function(){var a=d.createElement("input"),b=d.createElement("select"),c=b.appendChild(d.createElement("option"));a.type="checkbox",o.checkOn=""!==a.value,o.optSelected=c.selected,a=d.createElement("input"),a.value="t",a.type="radio",o.radioValue="t"===a.value}();var hb,ib=r.expr.attrHandle;r.fn.extend({attr:function(a,b){return S(this,r.attr,a,b,arguments.length>1)},removeAttr:function(a){return this.each(function(){r.removeAttr(this,a)})}}),r.extend({attr:function(a,b,c){var d,e,f=a.nodeType;if(3!==f&&8!==f&&2!==f)return"undefined"==typeof a.getAttribute?r.prop(a,b,c):(1===f&&r.isXMLDoc(a)||(e=r.attrHooks[b.toLowerCase()]||(r.expr.match.bool.test(b)?hb:void 0)),void 0!==c?null===c?void r.removeAttr(a,b):e&&"set"in e&&void 0!==(d=e.set(a,c,b))?d:(a.setAttribute(b,c+""),c):e&&"get"in e&&null!==(d=e.get(a,b))?d:(d=r.find.attr(a,b),null==d?void 0:d))},attrHooks:{type:{set:function(a,b){if(!o.radioValue&&"radio"===b&&r.nodeName(a,"input")){var c=a.value;return a.setAttribute("type",b),c&&(a.value=c),b}}}},removeAttr:function(a,b){var c,d=0,e=b&&b.match(K);if(e&&1===a.nodeType)while(c=e[d++])a.removeAttribute(c);
//}}),hb={set:function(a,b,c){return b===!1?r.removeAttr(a,c):a.setAttribute(c,c),c}},r.each(r.expr.match.bool.source.match(/\w+/g),function(a,b){var c=ib[b]||r.find.attr;ib[b]=function(a,b,d){var e,f,g=b.toLowerCase();return d||(f=ib[g],ib[g]=e,e=null!=c(a,b,d)?g:null,ib[g]=f),e}});var jb=/^(?:input|select|textarea|button)$/i,kb=/^(?:a|area)$/i;r.fn.extend({prop:function(a,b){return S(this,r.prop,a,b,arguments.length>1)},removeProp:function(a){return this.each(function(){delete this[r.propFix[a]||a]})}}),r.extend({prop:function(a,b,c){var d,e,f=a.nodeType;if(3!==f&&8!==f&&2!==f)return 1===f&&r.isXMLDoc(a)||(b=r.propFix[b]||b,e=r.propHooks[b]),void 0!==c?e&&"set"in e&&void 0!==(d=e.set(a,c,b))?d:a[b]=c:e&&"get"in e&&null!==(d=e.get(a,b))?d:a[b]},propHooks:{tabIndex:{get:function(a){var b=r.find.attr(a,"tabindex");return b?parseInt(b,10):jb.test(a.nodeName)||kb.test(a.nodeName)&&a.href?0:-1}}},propFix:{"for":"htmlFor","class":"className"}}),o.optSelected||(r.propHooks.selected={get:function(a){var b=a.parentNode;return b&&b.parentNode&&b.parentNode.selectedIndex,null},set:function(a){var b=a.parentNode;b&&(b.selectedIndex,b.parentNode&&b.parentNode.selectedIndex)}}),r.each(["tabIndex","readOnly","maxLength","cellSpacing","cellPadding","rowSpan","colSpan","useMap","frameBorder","contentEditable"],function(){r.propFix[this.toLowerCase()]=this});var lb=/[\t\r\n\f]/g;function mb(a){return a.getAttribute&&a.getAttribute("class")||""}r.fn.extend({addClass:function(a){var b,c,d,e,f,g,h,i=0;if(r.isFunction(a))return this.each(function(b){r(this).addClass(a.call(this,b,mb(this)))});if("string"==typeof a&&a){b=a.match(K)||[];while(c=this[i++])if(e=mb(c),d=1===c.nodeType&&(" "+e+" ").replace(lb," ")){g=0;while(f=b[g++])d.indexOf(" "+f+" ")<0&&(d+=f+" ");h=r.trim(d),e!==h&&c.setAttribute("class",h)}}return this},removeClass:function(a){var b,c,d,e,f,g,h,i=0;if(r.isFunction(a))return this.each(function(b){r(this).removeClass(a.call(this,b,mb(this)))});if(!arguments.length)return this.attr("class","");if("string"==typeof a&&a){b=a.match(K)||[];while(c=this[i++])if(e=mb(c),d=1===c.nodeType&&(" "+e+" ").replace(lb," ")){g=0;while(f=b[g++])while(d.indexOf(" "+f+" ")>-1)d=d.replace(" "+f+" "," ");h=r.trim(d),e!==h&&c.setAttribute("class",h)}}return this},toggleClass:function(a,b){var c=typeof a;return"boolean"==typeof b&&"string"===c?b?this.addClass(a):this.removeClass(a):r.isFunction(a)?this.each(function(c){r(this).toggleClass(a.call(this,c,mb(this),b),b)}):this.each(function(){var b,d,e,f;if("string"===c){d=0,e=r(this),f=a.match(K)||[];while(b=f[d++])e.hasClass(b)?e.removeClass(b):e.addClass(b)}else void 0!==a&&"boolean"!==c||(b=mb(this),b&&V.set(this,"__className__",b),this.setAttribute&&this.setAttribute("class",b||a===!1?"":V.get(this,"__className__")||""))})},hasClass:function(a){var b,c,d=0;b=" "+a+" ";while(c=this[d++])if(1===c.nodeType&&(" "+mb(c)+" ").replace(lb," ").indexOf(b)>-1)return!0;return!1}});var nb=/\r/g,ob=/[\x20\t\r\n\f]+/g;r.fn.extend({val:function(a){var b,c,d,e=this[0];{if(arguments.length)return d=r.isFunction(a),this.each(function(c){var e;1===this.nodeType&&(e=d?a.call(this,c,r(this).val()):a,null==e?e="":"number"==typeof e?e+="":r.isArray(e)&&(e=r.map(e,function(a){return null==a?"":a+""})),b=r.valHooks[this.type]||r.valHooks[this.nodeName.toLowerCase()],b&&"set"in b&&void 0!==b.set(this,e,"value")||(this.value=e))});if(e)return b=r.valHooks[e.type]||r.valHooks[e.nodeName.toLowerCase()],b&&"get"in b&&void 0!==(c=b.get(e,"value"))?c:(c=e.value,"string"==typeof c?c.replace(nb,""):null==c?"":c)}}}),r.extend({valHooks:{option:{get:function(a){var b=r.find.attr(a,"value");return null!=b?b:r.trim(r.text(a)).replace(ob," ")}},select:{get:function(a){for(var b,c,d=a.options,e=a.selectedIndex,f="select-one"===a.type,g=f?null:[],h=f?e+1:d.length,i=0>e?h:f?e:0;h>i;i++)if(c=d[i],(c.selected||i===e)&&!c.disabled&&(!c.parentNode.disabled||!r.nodeName(c.parentNode,"optgroup"))){if(b=r(c).val(),f)return b;g.push(b)}return g},set:function(a,b){var c,d,e=a.options,f=r.makeArray(b),g=e.length;while(g--)d=e[g],(d.selected=r.inArray(r.valHooks.option.get(d),f)>-1)&&(c=!0);return c||(a.selectedIndex=-1),f}}}}),r.each(["radio","checkbox"],function(){r.valHooks[this]={set:function(a,b){return r.isArray(b)?a.checked=r.inArray(r(a).val(),b)>-1:void 0}},o.checkOn||(r.valHooks[this].get=function(a){return null===a.getAttribute("value")?"on":a.value})});var pb=/^(?:focusinfocus|focusoutblur)$/;r.extend(r.event,{trigger:function(b,c,e,f){var g,h,i,j,k,m,n,o=[e||d],p=l.call(b,"type")?b.type:b,q=l.call(b,"namespace")?b.namespace.split("."):[];if(h=i=e=e||d,3!==e.nodeType&&8!==e.nodeType&&!pb.test(p+r.event.triggered)&&(p.indexOf(".")>-1&&(q=p.split("."),p=q.shift(),q.sort()),k=p.indexOf(":")<0&&"on"+p,b=b[r.expando]?b:new r.Event(p,"object"==typeof b&&b),b.isTrigger=f?2:3,b.namespace=q.join("."),b.rnamespace=b.namespace?new RegExp("(^|\\.)"+q.join("\\.(?:.*\\.|)")+"(\\.|$)"):null,b.result=void 0,b.target||(b.target=e),c=null==c?[b]:r.makeArray(c,[b]),n=r.event.special[p]||{},f||!n.trigger||n.trigger.apply(e,c)!==!1)){if(!f&&!n.noBubble&&!r.isWindow(e)){for(j=n.delegateType||p,pb.test(j+p)||(h=h.parentNode);h;h=h.parentNode)o.push(h),i=h;i===(e.ownerDocument||d)&&o.push(i.defaultView||i.parentWindow||a)}g=0;while((h=o[g++])&&!b.isPropagationStopped())b.type=g>1?j:n.bindType||p,m=(V.get(h,"events")||{})[b.type]&&V.get(h,"handle"),m&&m.apply(h,c),m=k&&h[k],m&&m.apply&&T(h)&&(b.result=m.apply(h,c),b.result===!1&&b.preventDefault());return b.type=p,f||b.isDefaultPrevented()||n._default&&n._default.apply(o.pop(),c)!==!1||!T(e)||k&&r.isFunction(e[p])&&!r.isWindow(e)&&(i=e[k],i&&(e[k]=null),r.event.triggered=p,e[p](),r.event.triggered=void 0,i&&(e[k]=i)),b.result}},simulate:function(a,b,c){var d=r.extend(new r.Event,c,{type:a,isSimulated:!0});r.event.trigger(d,null,b)}}),r.fn.extend({trigger:function(a,b){return this.each(function(){r.event.trigger(a,b,this)})},triggerHandler:function(a,b){var c=this[0];return c?r.event.trigger(a,b,c,!0):void 0}}),r.each("blur focus focusin focusout resize scroll click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup contextmenu".split(" "),function(a,b){r.fn[b]=function(a,c){return arguments.length>0?this.on(b,null,a,c):this.trigger(b)}}),r.fn.extend({hover:function(a,b){return this.mouseenter(a).mouseleave(b||a)}}),o.focusin="onfocusin"in a,o.focusin||r.each({focus:"focusin",blur:"focusout"},function(a,b){var c=function(a){r.event.simulate(b,a.target,r.event.fix(a))};r.event.special[b]={setup:function(){var d=this.ownerDocument||this,e=V.access(d,b);e||d.addEventListener(a,c,!0),V.access(d,b,(e||0)+1)},teardown:function(){var d=this.ownerDocument||this,e=V.access(d,b)-1;e?V.access(d,b,e):(d.removeEventListener(a,c,!0),V.remove(d,b))}}});var qb=a.location,rb=r.now(),sb=/\?/;r.parseXML=function(b){var c;if(!b||"string"!=typeof b)return null;try{c=(new a.DOMParser).parseFromString(b,"text/xml")}catch(d){c=void 0}return c&&!c.getElementsByTagName("parsererror").length||r.error("Invalid XML: "+b),c};var tb=/\[\]$/,ub=/\r?\n/g,vb=/^(?:submit|button|image|reset|file)$/i,wb=/^(?:input|select|textarea|keygen)/i;function xb(a,b,c,d){var e;if(r.isArray(b))r.each(b,function(b,e){c||tb.test(a)?d(a,e):xb(a+"["+("object"==typeof e&&null!=e?b:"")+"]",e,c,d)});else if(c||"object"!==r.type(b))d(a,b);else for(e in b)xb(a+"["+e+"]",b[e],c,d)}r.param=function(a,b){var c,d=[],e=function(a,b){var c=r.isFunction(b)?b():b;d[d.length]=encodeURIComponent(a)+"="+encodeURIComponent(null==c?"":c)};if(r.isArray(a)||a.jquery&&!r.isPlainObject(a))r.each(a,function(){e(this.name,this.value)});else for(c in a)xb(c,a[c],b,e);return d.join("&")},r.fn.extend({serialize:function(){return r.param(this.serializeArray())},serializeArray:function(){return this.map(function(){var a=r.prop(this,"elements");return a?r.makeArray(a):this}).filter(function(){var a=this.type;return this.name&&!r(this).is(":disabled")&&wb.test(this.nodeName)&&!vb.test(a)&&(this.checked||!ha.test(a))}).map(function(a,b){var c=r(this).val();return null==c?null:r.isArray(c)?r.map(c,function(a){return{name:b.name,value:a.replace(ub,"\r\n")}}):{name:b.name,value:c.replace(ub,"\r\n")}}).get()}});var yb=/%20/g,zb=/#.*$/,Ab=/([?&])_=[^&]*/,Bb=/^(.*?):[ \t]*([^\r\n]*)$/gm,Cb=/^(?:about|app|app-storage|.+-extension|file|res|widget):$/,Db=/^(?:GET|HEAD)$/,Eb=/^\/\//,Fb={},Gb={},Hb="*/".concat("*"),Ib=d.createElement("a");Ib.href=qb.href;function Jb(a){return function(b,c){"string"!=typeof b&&(c=b,b="*");var d,e=0,f=b.toLowerCase().match(K)||[];if(r.isFunction(c))while(d=f[e++])"+"===d[0]?(d=d.slice(1)||"*",(a[d]=a[d]||[]).unshift(c)):(a[d]=a[d]||[]).push(c)}}function Kb(a,b,c,d){var e={},f=a===Gb;function g(h){var i;return e[h]=!0,r.each(a[h]||[],function(a,h){var j=h(b,c,d);return"string"!=typeof j||f||e[j]?f?!(i=j):void 0:(b.dataTypes.unshift(j),g(j),!1)}),i}return g(b.dataTypes[0])||!e["*"]&&g("*")}function Lb(a,b){var c,d,e=r.ajaxSettings.flatOptions||{};for(c in b)void 0!==b[c]&&((e[c]?a:d||(d={}))[c]=b[c]);return d&&r.extend(!0,a,d),a}function Mb(a,b,c){var d,e,f,g,h=a.contents,i=a.dataTypes;while("*"===i[0])i.shift(),void 0===d&&(d=a.mimeType||b.getResponseHeader("Content-Type"));if(d)for(e in h)if(h[e]&&h[e].test(d)){i.unshift(e);break}if(i[0]in c)f=i[0];else{for(e in c){if(!i[0]||a.converters[e+" "+i[0]]){f=e;break}g||(g=e)}f=f||g}return f?(f!==i[0]&&i.unshift(f),c[f]):void 0}function Nb(a,b,c,d){var e,f,g,h,i,j={},k=a.dataTypes.slice();if(k[1])for(g in a.converters)j[g.toLowerCase()]=a.converters[g];f=k.shift();while(f)if(a.responseFields[f]&&(c[a.responseFields[f]]=b),!i&&d&&a.dataFilter&&(b=a.dataFilter(b,a.dataType)),i=f,f=k.shift())if("*"===f)f=i;else if("*"!==i&&i!==f){if(g=j[i+" "+f]||j["* "+f],!g)for(e in j)if(h=e.split(" "),h[1]===f&&(g=j[i+" "+h[0]]||j["* "+h[0]])){g===!0?g=j[e]:j[e]!==!0&&(f=h[0],k.unshift(h[1]));break}if(g!==!0)if(g&&a["throws"])b=g(b);else try{b=g(b)}catch(l){return{state:"parsererror",error:g?l:"No conversion from "+i+" to "+f}}}return{state:"success",data:b}}r.extend({active:0,lastModified:{},etag:{},ajaxSettings:{url:qb.href,type:"GET",isLocal:Cb.test(qb.protocol),global:!0,processData:!0,async:!0,contentType:"application/x-www-form-urlencoded; charset=UTF-8",accepts:{"*":Hb,text:"text/plain",html:"text/html",xml:"application/xml, text/xml",json:"application/json, text/javascript"},contents:{xml:/\bxml\b/,html:/\bhtml/,json:/\bjson\b/},responseFields:{xml:"responseXML",text:"responseText",json:"responseJSON"},converters:{"* text":String,"text html":!0,"text json":JSON.parse,"text xml":r.parseXML},flatOptions:{url:!0,context:!0}},ajaxSetup:function(a,b){return b?Lb(Lb(a,r.ajaxSettings),b):Lb(r.ajaxSettings,a)},ajaxPrefilter:Jb(Fb),ajaxTransport:Jb(Gb),ajax:function(b,c){"object"==typeof b&&(c=b,b=void 0),c=c||{};var e,f,g,h,i,j,k,l,m,n,o=r.ajaxSetup({},c),p=o.context||o,q=o.context&&(p.nodeType||p.jquery)?r(p):r.event,s=r.Deferred(),t=r.Callbacks("once memory"),u=o.statusCode||{},v={},w={},x="canceled",y={readyState:0,getResponseHeader:function(a){var b;if(k){if(!h){h={};while(b=Bb.exec(g))h[b[1].toLowerCase()]=b[2]}b=h[a.toLowerCase()]}return null==b?null:b},getAllResponseHeaders:function(){return k?g:null},setRequestHeader:function(a,b){return null==k&&(a=w[a.toLowerCase()]=w[a.toLowerCase()]||a,v[a]=b),this},overrideMimeType:function(a){return null==k&&(o.mimeType=a),this},statusCode:function(a){var b;if(a)if(k)y.always(a[y.status]);else for(b in a)u[b]=[u[b],a[b]];return this},abort:function(a){var b=a||x;return e&&e.abort(b),A(0,b),this}};if(s.promise(y),o.url=((b||o.url||qb.href)+"").replace(Eb,qb.protocol+"//"),o.type=c.method||c.type||o.method||o.type,o.dataTypes=(o.dataType||"*").toLowerCase().match(K)||[""],null==o.crossDomain){j=d.createElement("a");try{j.href=o.url,j.href=j.href,o.crossDomain=Ib.protocol+"//"+Ib.host!=j.protocol+"//"+j.host}catch(z){o.crossDomain=!0}}if(o.data&&o.processData&&"string"!=typeof o.data&&(o.data=r.param(o.data,o.traditional)),Kb(Fb,o,c,y),k)return y;l=r.event&&o.global,l&&0===r.active++&&r.event.trigger("ajaxStart"),o.type=o.type.toUpperCase(),o.hasContent=!Db.test(o.type),f=o.url.replace(zb,""),o.hasContent?o.data&&o.processData&&0===(o.contentType||"").indexOf("application/x-www-form-urlencoded")&&(o.data=o.data.replace(yb,"+")):(n=o.url.slice(f.length),o.data&&(f+=(sb.test(f)?"&":"?")+o.data,delete o.data),o.cache===!1&&(f=f.replace(Ab,""),n=(sb.test(f)?"&":"?")+"_="+rb++ +n),o.url=f+n),o.ifModified&&(r.lastModified[f]&&y.setRequestHeader("If-Modified-Since",r.lastModified[f]),r.etag[f]&&y.setRequestHeader("If-None-Match",r.etag[f])),(o.data&&o.hasContent&&o.contentType!==!1||c.contentType)&&y.setRequestHeader("Content-Type",o.contentType),y.setRequestHeader("Accept",o.dataTypes[0]&&o.accepts[o.dataTypes[0]]?o.accepts[o.dataTypes[0]]+("*"!==o.dataTypes[0]?", "+Hb+"; q=0.01":""):o.accepts["*"]);for(m in o.headers)y.setRequestHeader(m,o.headers[m]);if(o.beforeSend&&(o.beforeSend.call(p,y,o)===!1||k))return y.abort();if(x="abort",t.add(o.complete),y.done(o.success),y.fail(o.error),e=Kb(Gb,o,c,y)){if(y.readyState=1,l&&q.trigger("ajaxSend",[y,o]),k)return y;o.async&&o.timeout>0&&(i=a.setTimeout(function(){y.abort("timeout")},o.timeout));try{k=!1,e.send(v,A)}catch(z){if(k)throw z;A(-1,z)}}else A(-1,"No Transport");function A(b,c,d,h){var j,m,n,v,w,x=c;k||(k=!0,i&&a.clearTimeout(i),e=void 0,g=h||"",y.readyState=b>0?4:0,j=b>=200&&300>b||304===b,d&&(v=Mb(o,y,d)),v=Nb(o,v,y,j),j?(o.ifModified&&(w=y.getResponseHeader("Last-Modified"),w&&(r.lastModified[f]=w),w=y.getResponseHeader("etag"),w&&(r.etag[f]=w)),204===b||"HEAD"===o.type?x="nocontent":304===b?x="notmodified":(x=v.state,m=v.data,n=v.error,j=!n)):(n=x,!b&&x||(x="error",0>b&&(b=0))),y.status=b,y.statusText=(c||x)+"",j?s.resolveWith(p,[m,x,y]):s.rejectWith(p,[y,x,n]),y.statusCode(u),u=void 0,l&&q.trigger(j?"ajaxSuccess":"ajaxError",[y,o,j?m:n]),t.fireWith(p,[y,x]),l&&(q.trigger("ajaxComplete",[y,o]),--r.active||r.event.trigger("ajaxStop")))}return y},getJSON:function(a,b,c){return r.get(a,b,c,"json")},getScript:function(a,b){return r.get(a,void 0,b,"script")}}),r.each(["get","post"],function(a,b){r[b]=function(a,c,d,e){return r.isFunction(c)&&(e=e||d,d=c,c=void 0),r.ajax(r.extend({url:a,type:b,dataType:e,data:c,success:d},r.isPlainObject(a)&&a))}}),r._evalUrl=function(a){return r.ajax({url:a,type:"GET",dataType:"script",cache:!0,async:!1,global:!1,"throws":!0})},r.fn.extend({wrapAll:function(a){var b;return this[0]&&(r.isFunction(a)&&(a=a.call(this[0])),b=r(a,this[0].ownerDocument).eq(0).clone(!0),this[0].parentNode&&b.insertBefore(this[0]),b.map(function(){var a=this;while(a.firstElementChild)a=a.firstElementChild;return a}).append(this)),this},wrapInner:function(a){return r.isFunction(a)?this.each(function(b){r(this).wrapInner(a.call(this,b))}):this.each(function(){var b=r(this),c=b.contents();c.length?c.wrapAll(a):b.append(a)})},wrap:function(a){var b=r.isFunction(a);return this.each(function(c){r(this).wrapAll(b?a.call(this,c):a)})},unwrap:function(a){return this.parent(a).not("body").each(function(){r(this).replaceWith(this.childNodes)}),this}}),r.expr.pseudos.hidden=function(a){return!r.expr.pseudos.visible(a)},r.expr.pseudos.visible=function(a){return!!(a.offsetWidth||a.offsetHeight||a.getClientRects().length)},r.ajaxSettings.xhr=function(){try{return new a.XMLHttpRequest}catch(b){}};var Ob={0:200,1223:204},Pb=r.ajaxSettings.xhr();o.cors=!!Pb&&"withCredentials"in Pb,o.ajax=Pb=!!Pb,r.ajaxTransport(function(b){var c,d;return o.cors||Pb&&!b.crossDomain?{send:function(e,f){var g,h=b.xhr();if(h.open(b.type,b.url,b.async,b.username,b.password),b.xhrFields)for(g in b.xhrFields)h[g]=b.xhrFields[g];b.mimeType&&h.overrideMimeType&&h.overrideMimeType(b.mimeType),b.crossDomain||e["X-Requested-With"]||(e["X-Requested-With"]="XMLHttpRequest");for(g in e)h.setRequestHeader(g,e[g]);c=function(a){return function(){c&&(c=d=h.onload=h.onerror=h.onabort=h.onreadystatechange=null,"abort"===a?h.abort():"error"===a?"number"!=typeof h.status?f(0,"error"):f(h.status,h.statusText):f(Ob[h.status]||h.status,h.statusText,"text"!==(h.responseType||"text")||"string"!=typeof h.responseText?{binary:h.response}:{text:h.responseText},h.getAllResponseHeaders()))}},h.onload=c(),d=h.onerror=c("error"),void 0!==h.onabort?h.onabort=d:h.onreadystatechange=function(){4===h.readyState&&a.setTimeout(function(){c&&d()})},c=c("abort");try{h.send(b.hasContent&&b.data||null)}catch(i){if(c)throw i}},abort:function(){c&&c()}}:void 0}),r.ajaxPrefilter(function(a){a.crossDomain&&(a.contents.script=!1)}),r.ajaxSetup({accepts:{script:"text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"},contents:{script:/\b(?:java|ecma)script\b/},converters:{"text script":function(a){return r.globalEval(a),a}}}),r.ajaxPrefilter("script",function(a){void 0===a.cache&&(a.cache=!1),a.crossDomain&&(a.type="GET")}),r.ajaxTransport("script",function(a){if(a.crossDomain){var b,c;return{send:function(e,f){b=r("<script>").prop({charset:a.scriptCharset,src:a.url}).on("load error",c=function(a){b.remove(),c=null,a&&f("error"===a.type?404:200,a.type)}),d.head.appendChild(b[0])},abort:function(){c&&c()}}}});var Qb=[],Rb=/(=)\?(?=&|$)|\?\?/;r.ajaxSetup({jsonp:"callback",jsonpCallback:function(){var a=Qb.pop()||r.expando+"_"+rb++;return this[a]=!0,a}}),r.ajaxPrefilter("json jsonp",function(b,c,d){var e,f,g,h=b.jsonp!==!1&&(Rb.test(b.url)?"url":"string"==typeof b.data&&0===(b.contentType||"").indexOf("application/x-www-form-urlencoded")&&Rb.test(b.data)&&"data");return h||"jsonp"===b.dataTypes[0]?(e=b.jsonpCallback=r.isFunction(b.jsonpCallback)?b.jsonpCallback():b.jsonpCallback,h?b[h]=b[h].replace(Rb,"$1"+e):b.jsonp!==!1&&(b.url+=(sb.test(b.url)?"&":"?")+b.jsonp+"="+e),b.converters["script json"]=function(){return g||r.error(e+" was not called"),g[0]},b.dataTypes[0]="json",f=a[e],a[e]=function(){g=arguments},d.always(function(){void 0===f?r(a).removeProp(e):a[e]=f,b[e]&&(b.jsonpCallback=c.jsonpCallback,Qb.push(e)),g&&r.isFunction(f)&&f(g[0]),g=f=void 0}),"script"):void 0}),o.createHTMLDocument=function(){var a=d.implementation.createHTMLDocument("").body;return a.innerHTML="<form></form><form></form>",2===a.childNodes.length}(),r.parseHTML=function(a,b,c){if("string"!=typeof a)return[];"boolean"==typeof b&&(c=b,b=!1);var e,f,g;return b||(o.createHTMLDocument?(b=d.implementation.createHTMLDocument(""),e=b.createElement("base"),e.href=d.location.href,b.head.appendChild(e)):b=d),f=B.exec(a),g=!c&&[],f?[b.createElement(f[1])]:(f=oa([a],b,g),g&&g.length&&r(g).remove(),r.merge([],f.childNodes))},r.fn.load=function(a,b,c){var d,e,f,g=this,h=a.indexOf(" ");return h>-1&&(d=r.trim(a.slice(h)),a=a.slice(0,h)),r.isFunction(b)?(c=b,b=void 0):b&&"object"==typeof b&&(e="POST"),g.length>0&&r.ajax({url:a,type:e||"GET",dataType:"html",data:b}).done(function(a){f=arguments,g.html(d?r("<div>").append(r.parseHTML(a)).find(d):a)}).always(c&&function(a,b){g.each(function(){c.apply(this,f||[a.responseText,b,a])})}),this},r.each(["ajaxStart","ajaxStop","ajaxComplete","ajaxError","ajaxSuccess","ajaxSend"],function(a,b){r.fn[b]=function(a){return this.on(b,a)}}),r.expr.pseudos.animated=function(a){return r.grep(r.timers,function(b){return a===b.elem}).length};function Sb(a){return r.isWindow(a)?a:9===a.nodeType&&a.defaultView}r.offset={setOffset:function(a,b,c){var d,e,f,g,h,i,j,k=r.css(a,"position"),l=r(a),m={};"static"===k&&(a.style.position="relative"),h=l.offset(),f=r.css(a,"top"),i=r.css(a,"left"),j=("absolute"===k||"fixed"===k)&&(f+i).indexOf("auto")>-1,j?(d=l.position(),g=d.top,e=d.left):(g=parseFloat(f)||0,e=parseFloat(i)||0),r.isFunction(b)&&(b=b.call(a,c,r.extend({},h))),null!=b.top&&(m.top=b.top-h.top+g),null!=b.left&&(m.left=b.left-h.left+e),"using"in b?b.using.call(a,m):l.css(m)}},r.fn.extend({offset:function(a){if(arguments.length)return void 0===a?this:this.each(function(b){r.offset.setOffset(this,a,b)});var b,c,d,e,f=this[0];if(f)return f.getClientRects().length?(d=f.getBoundingClientRect(),d.width||d.height?(e=f.ownerDocument,c=Sb(e),b=e.documentElement,{top:d.top+c.pageYOffset-b.clientTop,left:d.left+c.pageXOffset-b.clientLeft}):d):{top:0,left:0}},position:function(){if(this[0]){var a,b,c=this[0],d={top:0,left:0};return"fixed"===r.css(c,"position")?b=c.getBoundingClientRect():(a=this.offsetParent(),b=this.offset(),r.nodeName(a[0],"html")||(d=a.offset()),d={top:d.top+r.css(a[0],"borderTopWidth",!0),left:d.left+r.css(a[0],"borderLeftWidth",!0)}),{top:b.top-d.top-r.css(c,"marginTop",!0),left:b.left-d.left-r.css(c,"marginLeft",!0)}}},offsetParent:function(){return this.map(function(){var a=this.offsetParent;while(a&&"static"===r.css(a,"position"))a=a.offsetParent;return a||pa})}}),r.each({scrollLeft:"pageXOffset",scrollTop:"pageYOffset"},function(a,b){var c="pageYOffset"===b;r.fn[a]=function(d){return S(this,function(a,d,e){var f=Sb(a);return void 0===e?f?f[b]:a[d]:void(f?f.scrollTo(c?f.pageXOffset:e,c?e:f.pageYOffset):a[d]=e)},a,d,arguments.length)}}),r.each(["top","left"],function(a,b){r.cssHooks[b]=Na(o.pixelPosition,function(a,c){return c?(c=Ma(a,b),Ka.test(c)?r(a).position()[b]+"px":c):void 0})}),r.each({Height:"height",Width:"width"},function(a,b){r.each({padding:"inner"+a,content:b,"":"outer"+a},function(c,d){r.fn[d]=function(e,f){var g=arguments.length&&(c||"boolean"!=typeof e),h=c||(e===!0||f===!0?"margin":"border");return S(this,function(b,c,e){var f;return r.isWindow(b)?0===d.indexOf("outer")?b["inner"+a]:b.document.documentElement["client"+a]:9===b.nodeType?(f=b.documentElement,Math.max(b.body["scroll"+a],f["scroll"+a],b.body["offset"+a],f["offset"+a],f["client"+a])):void 0===e?r.css(b,c,h):r.style(b,c,e,h)},b,g?e:void 0,g)}})}),r.fn.extend({bind:function(a,b,c){return this.on(a,null,b,c)},unbind:function(a,b){return this.off(a,null,b)},delegate:function(a,b,c,d){return this.on(b,a,c,d)},undelegate:function(a,b,c){return 1===arguments.length?this.off(a,"**"):this.off(b,a||"**",c)}}),r.parseJSON=JSON.parse,"function"==typeof define&&define.amd&&define("jquery",[],function(){return r});var Tb=a.jQuery,Ub=a.$;return r.noConflict=function(b){return a.$===r&&(a.$=Ub),b&&a.jQuery===r&&(a.jQuery=Tb),r},b||(a.jQuery=a.$=r),r});
//})();
(function(){
/*! jQuery UI - v1.12.1 - 2018-10-13
* http://jqueryui.com
* Includes: widget.js, disable-selection.js, widgets/resizable.js, widgets/mouse.js
* Copyright jQuery Foundation and other contributors; Licensed MIT */

(function(t){"function"==typeof define&&define.amd?define(["jquery"],t):t(jQuery)})(function(t){t.ui=t.ui||{},t.ui.version="1.12.1";var e=0,i=Array.prototype.slice;t.cleanData=function(e){return function(i){var s,n,o;for(o=0;null!=(n=i[o]);o++)try{s=t._data(n,"events"),s&&s.remove&&t(n).triggerHandler("remove")}catch(a){}e(i)}}(t.cleanData),t.widget=function(e,i,s){var n,o,a,r={},l=e.split(".")[0];e=e.split(".")[1];var h=l+"-"+e;return s||(s=i,i=t.Widget),t.isArray(s)&&(s=t.extend.apply(null,[{}].concat(s))),t.expr[":"][h.toLowerCase()]=function(e){return!!t.data(e,h)},t[l]=t[l]||{},n=t[l][e],o=t[l][e]=function(t,e){return this._createWidget?(arguments.length&&this._createWidget(t,e),void 0):new o(t,e)},t.extend(o,n,{version:s.version,_proto:t.extend({},s),_childConstructors:[]}),a=new i,a.options=t.widget.extend({},a.options),t.each(s,function(e,s){return t.isFunction(s)?(r[e]=function(){function t(){return i.prototype[e].apply(this,arguments)}function n(t){return i.prototype[e].apply(this,t)}return function(){var e,i=this._super,o=this._superApply;return this._super=t,this._superApply=n,e=s.apply(this,arguments),this._super=i,this._superApply=o,e}}(),void 0):(r[e]=s,void 0)}),o.prototype=t.widget.extend(a,{widgetEventPrefix:n?a.widgetEventPrefix||e:e},r,{constructor:o,namespace:l,widgetName:e,widgetFullName:h}),n?(t.each(n._childConstructors,function(e,i){var s=i.prototype;t.widget(s.namespace+"."+s.widgetName,o,i._proto)}),delete n._childConstructors):i._childConstructors.push(o),t.widget.bridge(e,o),o},t.widget.extend=function(e){for(var s,n,o=i.call(arguments,1),a=0,r=o.length;r>a;a++)for(s in o[a])n=o[a][s],o[a].hasOwnProperty(s)&&void 0!==n&&(e[s]=t.isPlainObject(n)?t.isPlainObject(e[s])?t.widget.extend({},e[s],n):t.widget.extend({},n):n);return e},t.widget.bridge=function(e,s){var n=s.prototype.widgetFullName||e;t.fn[e]=function(o){var a="string"==typeof o,r=i.call(arguments,1),l=this;return a?this.length||"instance"!==o?this.each(function(){var i,s=t.data(this,n);return"instance"===o?(l=s,!1):s?t.isFunction(s[o])&&"_"!==o.charAt(0)?(i=s[o].apply(s,r),i!==s&&void 0!==i?(l=i&&i.jquery?l.pushStack(i.get()):i,!1):void 0):t.error("no such method '"+o+"' for "+e+" widget instance"):t.error("cannot call methods on "+e+" prior to initialization; "+"attempted to call method '"+o+"'")}):l=void 0:(r.length&&(o=t.widget.extend.apply(null,[o].concat(r))),this.each(function(){var e=t.data(this,n);e?(e.option(o||{}),e._init&&e._init()):t.data(this,n,new s(o,this))})),l}},t.Widget=function(){},t.Widget._childConstructors=[],t.Widget.prototype={widgetName:"widget",widgetEventPrefix:"",defaultElement:"<div>",options:{classes:{},disabled:!1,create:null},_createWidget:function(i,s){s=t(s||this.defaultElement||this)[0],this.element=t(s),this.uuid=e++,this.eventNamespace="."+this.widgetName+this.uuid,this.bindings=t(),this.hoverable=t(),this.focusable=t(),this.classesElementLookup={},s!==this&&(t.data(s,this.widgetFullName,this),this._on(!0,this.element,{remove:function(t){t.target===s&&this.destroy()}}),this.document=t(s.style?s.ownerDocument:s.document||s),this.window=t(this.document[0].defaultView||this.document[0].parentWindow)),this.options=t.widget.extend({},this.options,this._getCreateOptions(),i),this._create(),this.options.disabled&&this._setOptionDisabled(this.options.disabled),this._trigger("create",null,this._getCreateEventData()),this._init()},_getCreateOptions:function(){return{}},_getCreateEventData:t.noop,_create:t.noop,_init:t.noop,destroy:function(){var e=this;this._destroy(),t.each(this.classesElementLookup,function(t,i){e._removeClass(i,t)}),this.element.off(this.eventNamespace).removeData(this.widgetFullName),this.widget().off(this.eventNamespace).removeAttr("aria-disabled"),this.bindings.off(this.eventNamespace)},_destroy:t.noop,widget:function(){return this.element},option:function(e,i){var s,n,o,a=e;if(0===arguments.length)return t.widget.extend({},this.options);if("string"==typeof e)if(a={},s=e.split("."),e=s.shift(),s.length){for(n=a[e]=t.widget.extend({},this.options[e]),o=0;s.length-1>o;o++)n[s[o]]=n[s[o]]||{},n=n[s[o]];if(e=s.pop(),1===arguments.length)return void 0===n[e]?null:n[e];n[e]=i}else{if(1===arguments.length)return void 0===this.options[e]?null:this.options[e];a[e]=i}return this._setOptions(a),this},_setOptions:function(t){var e;for(e in t)this._setOption(e,t[e]);return this},_setOption:function(t,e){return"classes"===t&&this._setOptionClasses(e),this.options[t]=e,"disabled"===t&&this._setOptionDisabled(e),this},_setOptionClasses:function(e){var i,s,n;for(i in e)n=this.classesElementLookup[i],e[i]!==this.options.classes[i]&&n&&n.length&&(s=t(n.get()),this._removeClass(n,i),s.addClass(this._classes({element:s,keys:i,classes:e,add:!0})))},_setOptionDisabled:function(t){this._toggleClass(this.widget(),this.widgetFullName+"-disabled",null,!!t),t&&(this._removeClass(this.hoverable,null,"ui-state-hover"),this._removeClass(this.focusable,null,"ui-state-focus"))},enable:function(){return this._setOptions({disabled:!1})},disable:function(){return this._setOptions({disabled:!0})},_classes:function(e){function i(i,o){var a,r;for(r=0;i.length>r;r++)a=n.classesElementLookup[i[r]]||t(),a=e.add?t(t.unique(a.get().concat(e.element.get()))):t(a.not(e.element).get()),n.classesElementLookup[i[r]]=a,s.push(i[r]),o&&e.classes[i[r]]&&s.push(e.classes[i[r]])}var s=[],n=this;return e=t.extend({element:this.element,classes:this.options.classes||{}},e),this._on(e.element,{remove:"_untrackClassesElement"}),e.keys&&i(e.keys.match(/\S+/g)||[],!0),e.extra&&i(e.extra.match(/\S+/g)||[]),s.join(" ")},_untrackClassesElement:function(e){var i=this;t.each(i.classesElementLookup,function(s,n){-1!==t.inArray(e.target,n)&&(i.classesElementLookup[s]=t(n.not(e.target).get()))})},_removeClass:function(t,e,i){return this._toggleClass(t,e,i,!1)},_addClass:function(t,e,i){return this._toggleClass(t,e,i,!0)},_toggleClass:function(t,e,i,s){s="boolean"==typeof s?s:i;var n="string"==typeof t||null===t,o={extra:n?e:i,keys:n?t:e,element:n?this.element:t,add:s};return o.element.toggleClass(this._classes(o),s),this},_on:function(e,i,s){var n,o=this;"boolean"!=typeof e&&(s=i,i=e,e=!1),s?(i=n=t(i),this.bindings=this.bindings.add(i)):(s=i,i=this.element,n=this.widget()),t.each(s,function(s,a){function r(){return e||o.options.disabled!==!0&&!t(this).hasClass("ui-state-disabled")?("string"==typeof a?o[a]:a).apply(o,arguments):void 0}"string"!=typeof a&&(r.guid=a.guid=a.guid||r.guid||t.guid++);var l=s.match(/^([\w:-]*)\s*(.*)$/),h=l[1]+o.eventNamespace,c=l[2];c?n.on(h,c,r):i.on(h,r)})},_off:function(e,i){i=(i||"").split(" ").join(this.eventNamespace+" ")+this.eventNamespace,e.off(i).off(i),this.bindings=t(this.bindings.not(e).get()),this.focusable=t(this.focusable.not(e).get()),this.hoverable=t(this.hoverable.not(e).get())},_delay:function(t,e){function i(){return("string"==typeof t?s[t]:t).apply(s,arguments)}var s=this;return setTimeout(i,e||0)},_hoverable:function(e){this.hoverable=this.hoverable.add(e),this._on(e,{mouseenter:function(e){this._addClass(t(e.currentTarget),null,"ui-state-hover")},mouseleave:function(e){this._removeClass(t(e.currentTarget),null,"ui-state-hover")}})},_focusable:function(e){this.focusable=this.focusable.add(e),this._on(e,{focusin:function(e){this._addClass(t(e.currentTarget),null,"ui-state-focus")},focusout:function(e){this._removeClass(t(e.currentTarget),null,"ui-state-focus")}})},_trigger:function(e,i,s){var n,o,a=this.options[e];if(s=s||{},i=t.Event(i),i.type=(e===this.widgetEventPrefix?e:this.widgetEventPrefix+e).toLowerCase(),i.target=this.element[0],o=i.originalEvent)for(n in o)n in i||(i[n]=o[n]);return this.element.trigger(i,s),!(t.isFunction(a)&&a.apply(this.element[0],[i].concat(s))===!1||i.isDefaultPrevented())}},t.each({show:"fadeIn",hide:"fadeOut"},function(e,i){t.Widget.prototype["_"+e]=function(s,n,o){"string"==typeof n&&(n={effect:n});var a,r=n?n===!0||"number"==typeof n?i:n.effect||i:e;n=n||{},"number"==typeof n&&(n={duration:n}),a=!t.isEmptyObject(n),n.complete=o,n.delay&&s.delay(n.delay),a&&t.effects&&t.effects.effect[r]?s[e](n):r!==e&&s[r]?s[r](n.duration,n.easing,o):s.queue(function(i){t(this)[e](),o&&o.call(s[0]),i()})}}),t.widget,t.fn.extend({disableSelection:function(){var t="onselectstart"in document.createElement("div")?"selectstart":"mousedown";return function(){return this.on(t+".ui-disableSelection",function(t){t.preventDefault()})}}(),enableSelection:function(){return this.off(".ui-disableSelection")}}),t.ui.ie=!!/msie [\w.]+/.exec(navigator.userAgent.toLowerCase());var s=!1;t(document).on("mouseup",function(){s=!1}),t.widget("ui.mouse",{version:"1.12.1",options:{cancel:"input, textarea, button, select, option",distance:1,delay:0},_mouseInit:function(){var e=this;this.element.on("mousedown."+this.widgetName,function(t){return e._mouseDown(t)}).on("click."+this.widgetName,function(i){return!0===t.data(i.target,e.widgetName+".preventClickEvent")?(t.removeData(i.target,e.widgetName+".preventClickEvent"),i.stopImmediatePropagation(),!1):void 0}),this.started=!1},_mouseDestroy:function(){this.element.off("."+this.widgetName),this._mouseMoveDelegate&&this.document.off("mousemove."+this.widgetName,this._mouseMoveDelegate).off("mouseup."+this.widgetName,this._mouseUpDelegate)},_mouseDown:function(e){if(!s){this._mouseMoved=!1,this._mouseStarted&&this._mouseUp(e),this._mouseDownEvent=e;var i=this,n=1===e.which,o="string"==typeof this.options.cancel&&e.target.nodeName?t(e.target).closest(this.options.cancel).length:!1;return n&&!o&&this._mouseCapture(e)?(this.mouseDelayMet=!this.options.delay,this.mouseDelayMet||(this._mouseDelayTimer=setTimeout(function(){i.mouseDelayMet=!0},this.options.delay)),this._mouseDistanceMet(e)&&this._mouseDelayMet(e)&&(this._mouseStarted=this._mouseStart(e)!==!1,!this._mouseStarted)?(e.preventDefault(),!0):(!0===t.data(e.target,this.widgetName+".preventClickEvent")&&t.removeData(e.target,this.widgetName+".preventClickEvent"),this._mouseMoveDelegate=function(t){return i._mouseMove(t)},this._mouseUpDelegate=function(t){return i._mouseUp(t)},this.document.on("mousemove."+this.widgetName,this._mouseMoveDelegate).on("mouseup."+this.widgetName,this._mouseUpDelegate),e.preventDefault(),s=!0,!0)):!0}},_mouseMove:function(e){if(this._mouseMoved){if(t.ui.ie&&(!document.documentMode||9>document.documentMode)&&!e.button)return this._mouseUp(e);if(!e.which)if(e.originalEvent.altKey||e.originalEvent.ctrlKey||e.originalEvent.metaKey||e.originalEvent.shiftKey)this.ignoreMissingWhich=!0;else if(!this.ignoreMissingWhich)return this._mouseUp(e)}return(e.which||e.button)&&(this._mouseMoved=!0),this._mouseStarted?(this._mouseDrag(e),e.preventDefault()):(this._mouseDistanceMet(e)&&this._mouseDelayMet(e)&&(this._mouseStarted=this._mouseStart(this._mouseDownEvent,e)!==!1,this._mouseStarted?this._mouseDrag(e):this._mouseUp(e)),!this._mouseStarted)},_mouseUp:function(e){this.document.off("mousemove."+this.widgetName,this._mouseMoveDelegate).off("mouseup."+this.widgetName,this._mouseUpDelegate),this._mouseStarted&&(this._mouseStarted=!1,e.target===this._mouseDownEvent.target&&t.data(e.target,this.widgetName+".preventClickEvent",!0),this._mouseStop(e)),this._mouseDelayTimer&&(clearTimeout(this._mouseDelayTimer),delete this._mouseDelayTimer),this.ignoreMissingWhich=!1,s=!1,e.preventDefault()},_mouseDistanceMet:function(t){return Math.max(Math.abs(this._mouseDownEvent.pageX-t.pageX),Math.abs(this._mouseDownEvent.pageY-t.pageY))>=this.options.distance},_mouseDelayMet:function(){return this.mouseDelayMet},_mouseStart:function(){},_mouseDrag:function(){},_mouseStop:function(){},_mouseCapture:function(){return!0}}),t.ui.plugin={add:function(e,i,s){var n,o=t.ui[e].prototype;for(n in s)o.plugins[n]=o.plugins[n]||[],o.plugins[n].push([i,s[n]])},call:function(t,e,i,s){var n,o=t.plugins[e];if(o&&(s||t.element[0].parentNode&&11!==t.element[0].parentNode.nodeType))for(n=0;o.length>n;n++)t.options[o[n][0]]&&o[n][1].apply(t.element,i)}},t.widget("ui.resizable",t.ui.mouse,{version:"1.12.1",widgetEventPrefix:"resize",options:{alsoResize:!1,animate:!1,animateDuration:"slow",animateEasing:"swing",aspectRatio:!1,autoHide:!1,classes:{"ui-resizable-se":"ui-icon ui-icon-gripsmall-diagonal-se"},containment:!1,ghost:!1,grid:!1,handles:"e,s,se",helper:!1,maxHeight:null,maxWidth:null,minHeight:10,minWidth:10,zIndex:90,resize:null,start:null,stop:null},_num:function(t){return parseFloat(t)||0},_isNumber:function(t){return!isNaN(parseFloat(t))},_hasScroll:function(e,i){if("hidden"===t(e).css("overflow"))return!1;var s=i&&"left"===i?"scrollLeft":"scrollTop",n=!1;return e[s]>0?!0:(e[s]=1,n=e[s]>0,e[s]=0,n)},_create:function(){var e,i=this.options,s=this;this._addClass("ui-resizable"),t.extend(this,{_aspectRatio:!!i.aspectRatio,aspectRatio:i.aspectRatio,originalElement:this.element,_proportionallyResizeElements:[],_helper:i.helper||i.ghost||i.animate?i.helper||"ui-resizable-helper":null}),this.element[0].nodeName.match(/^(canvas|textarea|input|select|button|img)$/i)&&(this.element.wrap(t("<div class='ui-wrapper' style='overflow: hidden;'></div>").css({position:this.element.css("position"),width:this.element.outerWidth(),height:this.element.outerHeight(),top:this.element.css("top"),left:this.element.css("left")})),this.element=this.element.parent().data("ui-resizable",this.element.resizable("instance")),this.elementIsWrapper=!0,e={marginTop:this.originalElement.css("marginTop"),marginRight:this.originalElement.css("marginRight"),marginBottom:this.originalElement.css("marginBottom"),marginLeft:this.originalElement.css("marginLeft")},this.element.css(e),this.originalElement.css("margin",0),this.originalResizeStyle=this.originalElement.css("resize"),this.originalElement.css("resize","none"),this._proportionallyResizeElements.push(this.originalElement.css({position:"static",zoom:1,display:"block"})),this.originalElement.css(e),this._proportionallyResize()),this._setupHandles(),i.autoHide&&t(this.element).on("mouseenter",function(){i.disabled||(s._removeClass("ui-resizable-autohide"),s._handles.show())}).on("mouseleave",function(){i.disabled||s.resizing||(s._addClass("ui-resizable-autohide"),s._handles.hide())}),this._mouseInit()},_destroy:function(){this._mouseDestroy();var e,i=function(e){t(e).removeData("resizable").removeData("ui-resizable").off(".resizable").find(".ui-resizable-handle").remove()};return this.elementIsWrapper&&(i(this.element),e=this.element,this.originalElement.css({position:e.css("position"),width:e.outerWidth(),height:e.outerHeight(),top:e.css("top"),left:e.css("left")}).insertAfter(e),e.remove()),this.originalElement.css("resize",this.originalResizeStyle),i(this.originalElement),this},_setOption:function(t,e){switch(this._super(t,e),t){case"handles":this._removeHandles(),this._setupHandles();break;default:}},_setupHandles:function(){var e,i,s,n,o,a=this.options,r=this;if(this.handles=a.handles||(t(".ui-resizable-handle",this.element).length?{n:".ui-resizable-n",e:".ui-resizable-e",s:".ui-resizable-s",w:".ui-resizable-w",se:".ui-resizable-se",sw:".ui-resizable-sw",ne:".ui-resizable-ne",nw:".ui-resizable-nw"}:"e,s,se"),this._handles=t(),this.handles.constructor===String)for("all"===this.handles&&(this.handles="n,e,s,w,se,sw,ne,nw"),s=this.handles.split(","),this.handles={},i=0;s.length>i;i++)e=t.trim(s[i]),n="ui-resizable-"+e,o=t("<div>"),this._addClass(o,"ui-resizable-handle "+n),o.css({zIndex:a.zIndex}),this.handles[e]=".ui-resizable-"+e,this.element.append(o);this._renderAxis=function(e){var i,s,n,o;e=e||this.element;for(i in this.handles)this.handles[i].constructor===String?this.handles[i]=this.element.children(this.handles[i]).first().show():(this.handles[i].jquery||this.handles[i].nodeType)&&(this.handles[i]=t(this.handles[i]),this._on(this.handles[i],{mousedown:r._mouseDown})),this.elementIsWrapper&&this.originalElement[0].nodeName.match(/^(textarea|input|select|button)$/i)&&(s=t(this.handles[i],this.element),o=/sw|ne|nw|se|n|s/.test(i)?s.outerHeight():s.outerWidth(),n=["padding",/ne|nw|n/.test(i)?"Top":/se|sw|s/.test(i)?"Bottom":/^e$/.test(i)?"Right":"Left"].join(""),e.css(n,o),this._proportionallyResize()),this._handles=this._handles.add(this.handles[i])},this._renderAxis(this.element),this._handles=this._handles.add(this.element.find(".ui-resizable-handle")),this._handles.disableSelection(),this._handles.on("mouseover",function(){r.resizing||(this.className&&(o=this.className.match(/ui-resizable-(se|sw|ne|nw|n|e|s|w)/i)),r.axis=o&&o[1]?o[1]:"se")}),a.autoHide&&(this._handles.hide(),this._addClass("ui-resizable-autohide"))},_removeHandles:function(){this._handles.remove()},_mouseCapture:function(e){var i,s,n=!1;for(i in this.handles)s=t(this.handles[i])[0],(s===e.target||t.contains(s,e.target))&&(n=!0);return!this.options.disabled&&n},_mouseStart:function(e){var i,s,n,o=this.options,a=this.element;return this.resizing=!0,this._renderProxy(),i=this._num(this.helper.css("left")),s=this._num(this.helper.css("top")),o.containment&&(i+=t(o.containment).scrollLeft()||0,s+=t(o.containment).scrollTop()||0),this.offset=this.helper.offset(),this.position={left:i,top:s},this.size=this._helper?{width:this.helper.width(),height:this.helper.height()}:{width:a.width(),height:a.height()},this.originalSize=this._helper?{width:a.outerWidth(),height:a.outerHeight()}:{width:a.width(),height:a.height()},this.sizeDiff={width:a.outerWidth()-a.width(),height:a.outerHeight()-a.height()},this.originalPosition={left:i,top:s},this.originalMousePosition={left:e.pageX,top:e.pageY},this.aspectRatio="number"==typeof o.aspectRatio?o.aspectRatio:this.originalSize.width/this.originalSize.height||1,n=t(".ui-resizable-"+this.axis).css("cursor"),t("body").css("cursor","auto"===n?this.axis+"-resize":n),this._addClass("ui-resizable-resizing"),this._propagate("start",e),!0},_mouseDrag:function(e){var i,s,n=this.originalMousePosition,o=this.axis,a=e.pageX-n.left||0,r=e.pageY-n.top||0,l=this._change[o];return this._updatePrevProperties(),l?(i=l.apply(this,[e,a,r]),this._updateVirtualBoundaries(e.shiftKey),(this._aspectRatio||e.shiftKey)&&(i=this._updateRatio(i,e)),i=this._respectSize(i,e),this._updateCache(i),this._propagate("resize",e),s=this._applyChanges(),!this._helper&&this._proportionallyResizeElements.length&&this._proportionallyResize(),t.isEmptyObject(s)||(this._updatePrevProperties(),this._trigger("resize",e,this.ui()),this._applyChanges()),!1):!1},_mouseStop:function(e){this.resizing=!1;var i,s,n,o,a,r,l,h=this.options,c=this;return this._helper&&(i=this._proportionallyResizeElements,s=i.length&&/textarea/i.test(i[0].nodeName),n=s&&this._hasScroll(i[0],"left")?0:c.sizeDiff.height,o=s?0:c.sizeDiff.width,a={width:c.helper.width()-o,height:c.helper.height()-n},r=parseFloat(c.element.css("left"))+(c.position.left-c.originalPosition.left)||null,l=parseFloat(c.element.css("top"))+(c.position.top-c.originalPosition.top)||null,h.animate||this.element.css(t.extend(a,{top:l,left:r})),c.helper.height(c.size.height),c.helper.width(c.size.width),this._helper&&!h.animate&&this._proportionallyResize()),t("body").css("cursor","auto"),this._removeClass("ui-resizable-resizing"),this._propagate("stop",e),this._helper&&this.helper.remove(),!1},_updatePrevProperties:function(){this.prevPosition={top:this.position.top,left:this.position.left},this.prevSize={width:this.size.width,height:this.size.height}},_applyChanges:function(){var t={};return this.position.top!==this.prevPosition.top&&(t.top=this.position.top+"px"),this.position.left!==this.prevPosition.left&&(t.left=this.position.left+"px"),this.size.width!==this.prevSize.width&&(t.width=this.size.width+"px"),this.size.height!==this.prevSize.height&&(t.height=this.size.height+"px"),this.helper.css(t),t},_updateVirtualBoundaries:function(t){var e,i,s,n,o,a=this.options;o={minWidth:this._isNumber(a.minWidth)?a.minWidth:0,maxWidth:this._isNumber(a.maxWidth)?a.maxWidth:1/0,minHeight:this._isNumber(a.minHeight)?a.minHeight:0,maxHeight:this._isNumber(a.maxHeight)?a.maxHeight:1/0},(this._aspectRatio||t)&&(e=o.minHeight*this.aspectRatio,s=o.minWidth/this.aspectRatio,i=o.maxHeight*this.aspectRatio,n=o.maxWidth/this.aspectRatio,e>o.minWidth&&(o.minWidth=e),s>o.minHeight&&(o.minHeight=s),o.maxWidth>i&&(o.maxWidth=i),o.maxHeight>n&&(o.maxHeight=n)),this._vBoundaries=o},_updateCache:function(t){this.offset=this.helper.offset(),this._isNumber(t.left)&&(this.position.left=t.left),this._isNumber(t.top)&&(this.position.top=t.top),this._isNumber(t.height)&&(this.size.height=t.height),this._isNumber(t.width)&&(this.size.width=t.width)},_updateRatio:function(t){var e=this.position,i=this.size,s=this.axis;return this._isNumber(t.height)?t.width=t.height*this.aspectRatio:this._isNumber(t.width)&&(t.height=t.width/this.aspectRatio),"sw"===s&&(t.left=e.left+(i.width-t.width),t.top=null),"nw"===s&&(t.top=e.top+(i.height-t.height),t.left=e.left+(i.width-t.width)),t},_respectSize:function(t){var e=this._vBoundaries,i=this.axis,s=this._isNumber(t.width)&&e.maxWidth&&e.maxWidth<t.width,n=this._isNumber(t.height)&&e.maxHeight&&e.maxHeight<t.height,o=this._isNumber(t.width)&&e.minWidth&&e.minWidth>t.width,a=this._isNumber(t.height)&&e.minHeight&&e.minHeight>t.height,r=this.originalPosition.left+this.originalSize.width,l=this.originalPosition.top+this.originalSize.height,h=/sw|nw|w/.test(i),c=/nw|ne|n/.test(i);return o&&(t.width=e.minWidth),a&&(t.height=e.minHeight),s&&(t.width=e.maxWidth),n&&(t.height=e.maxHeight),o&&h&&(t.left=r-e.minWidth),s&&h&&(t.left=r-e.maxWidth),a&&c&&(t.top=l-e.minHeight),n&&c&&(t.top=l-e.maxHeight),t.width||t.height||t.left||!t.top?t.width||t.height||t.top||!t.left||(t.left=null):t.top=null,t},_getPaddingPlusBorderDimensions:function(t){for(var e=0,i=[],s=[t.css("borderTopWidth"),t.css("borderRightWidth"),t.css("borderBottomWidth"),t.css("borderLeftWidth")],n=[t.css("paddingTop"),t.css("paddingRight"),t.css("paddingBottom"),t.css("paddingLeft")];4>e;e++)i[e]=parseFloat(s[e])||0,i[e]+=parseFloat(n[e])||0;return{height:i[0]+i[2],width:i[1]+i[3]}},_proportionallyResize:function(){if(this._proportionallyResizeElements.length)for(var t,e=0,i=this.helper||this.element;this._proportionallyResizeElements.length>e;e++)t=this._proportionallyResizeElements[e],this.outerDimensions||(this.outerDimensions=this._getPaddingPlusBorderDimensions(t)),t.css({height:i.height()-this.outerDimensions.height||0,width:i.width()-this.outerDimensions.width||0})},_renderProxy:function(){var e=this.element,i=this.options;this.elementOffset=e.offset(),this._helper?(this.helper=this.helper||t("<div style='overflow:hidden;'></div>"),this._addClass(this.helper,this._helper),this.helper.css({width:this.element.outerWidth(),height:this.element.outerHeight(),position:"absolute",left:this.elementOffset.left+"px",top:this.elementOffset.top+"px",zIndex:++i.zIndex}),this.helper.appendTo("body").disableSelection()):this.helper=this.element},_change:{e:function(t,e){return{width:this.originalSize.width+e}},w:function(t,e){var i=this.originalSize,s=this.originalPosition;return{left:s.left+e,width:i.width-e}},n:function(t,e,i){var s=this.originalSize,n=this.originalPosition;return{top:n.top+i,height:s.height-i}},s:function(t,e,i){return{height:this.originalSize.height+i}},se:function(e,i,s){return t.extend(this._change.s.apply(this,arguments),this._change.e.apply(this,[e,i,s]))},sw:function(e,i,s){return t.extend(this._change.s.apply(this,arguments),this._change.w.apply(this,[e,i,s]))},ne:function(e,i,s){return t.extend(this._change.n.apply(this,arguments),this._change.e.apply(this,[e,i,s]))},nw:function(e,i,s){return t.extend(this._change.n.apply(this,arguments),this._change.w.apply(this,[e,i,s]))}},_propagate:function(e,i){t.ui.plugin.call(this,e,[i,this.ui()]),"resize"!==e&&this._trigger(e,i,this.ui())},plugins:{},ui:function(){return{originalElement:this.originalElement,element:this.element,helper:this.helper,position:this.position,size:this.size,originalSize:this.originalSize,originalPosition:this.originalPosition}}}),t.ui.plugin.add("resizable","animate",{stop:function(e){var i=t(this).resizable("instance"),s=i.options,n=i._proportionallyResizeElements,o=n.length&&/textarea/i.test(n[0].nodeName),a=o&&i._hasScroll(n[0],"left")?0:i.sizeDiff.height,r=o?0:i.sizeDiff.width,l={width:i.size.width-r,height:i.size.height-a},h=parseFloat(i.element.css("left"))+(i.position.left-i.originalPosition.left)||null,c=parseFloat(i.element.css("top"))+(i.position.top-i.originalPosition.top)||null;i.element.animate(t.extend(l,c&&h?{top:c,left:h}:{}),{duration:s.animateDuration,easing:s.animateEasing,step:function(){var s={width:parseFloat(i.element.css("width")),height:parseFloat(i.element.css("height")),top:parseFloat(i.element.css("top")),left:parseFloat(i.element.css("left"))};n&&n.length&&t(n[0]).css({width:s.width,height:s.height}),i._updateCache(s),i._propagate("resize",e)}})}}),t.ui.plugin.add("resizable","containment",{start:function(){var e,i,s,n,o,a,r,l=t(this).resizable("instance"),h=l.options,c=l.element,u=h.containment,d=u instanceof t?u.get(0):/parent/.test(u)?c.parent().get(0):u;d&&(l.containerElement=t(d),/document/.test(u)||u===document?(l.containerOffset={left:0,top:0},l.containerPosition={left:0,top:0},l.parentData={element:t(document),left:0,top:0,width:t(document).width(),height:t(document).height()||document.body.parentNode.scrollHeight}):(e=t(d),i=[],t(["Top","Right","Left","Bottom"]).each(function(t,s){i[t]=l._num(e.css("padding"+s))}),l.containerOffset=e.offset(),l.containerPosition=e.position(),l.containerSize={height:e.innerHeight()-i[3],width:e.innerWidth()-i[1]},s=l.containerOffset,n=l.containerSize.height,o=l.containerSize.width,a=l._hasScroll(d,"left")?d.scrollWidth:o,r=l._hasScroll(d)?d.scrollHeight:n,l.parentData={element:d,left:s.left,top:s.top,width:a,height:r}))},resize:function(e){var i,s,n,o,a=t(this).resizable("instance"),r=a.options,l=a.containerOffset,h=a.position,c=a._aspectRatio||e.shiftKey,u={top:0,left:0},d=a.containerElement,p=!0;d[0]!==document&&/static/.test(d.css("position"))&&(u=l),h.left<(a._helper?l.left:0)&&(a.size.width=a.size.width+(a._helper?a.position.left-l.left:a.position.left-u.left),c&&(a.size.height=a.size.width/a.aspectRatio,p=!1),a.position.left=r.helper?l.left:0),h.top<(a._helper?l.top:0)&&(a.size.height=a.size.height+(a._helper?a.position.top-l.top:a.position.top),c&&(a.size.width=a.size.height*a.aspectRatio,p=!1),a.position.top=a._helper?l.top:0),n=a.containerElement.get(0)===a.element.parent().get(0),o=/relative|absolute/.test(a.containerElement.css("position")),n&&o?(a.offset.left=a.parentData.left+a.position.left,a.offset.top=a.parentData.top+a.position.top):(a.offset.left=a.element.offset().left,a.offset.top=a.element.offset().top),i=Math.abs(a.sizeDiff.width+(a._helper?a.offset.left-u.left:a.offset.left-l.left)),s=Math.abs(a.sizeDiff.height+(a._helper?a.offset.top-u.top:a.offset.top-l.top)),i+a.size.width>=a.parentData.width&&(a.size.width=a.parentData.width-i,c&&(a.size.height=a.size.width/a.aspectRatio,p=!1)),s+a.size.height>=a.parentData.height&&(a.size.height=a.parentData.height-s,c&&(a.size.width=a.size.height*a.aspectRatio,p=!1)),p||(a.position.left=a.prevPosition.left,a.position.top=a.prevPosition.top,a.size.width=a.prevSize.width,a.size.height=a.prevSize.height)},stop:function(){var e=t(this).resizable("instance"),i=e.options,s=e.containerOffset,n=e.containerPosition,o=e.containerElement,a=t(e.helper),r=a.offset(),l=a.outerWidth()-e.sizeDiff.width,h=a.outerHeight()-e.sizeDiff.height;e._helper&&!i.animate&&/relative/.test(o.css("position"))&&t(this).css({left:r.left-n.left-s.left,width:l,height:h}),e._helper&&!i.animate&&/static/.test(o.css("position"))&&t(this).css({left:r.left-n.left-s.left,width:l,height:h})}}),t.ui.plugin.add("resizable","alsoResize",{start:function(){var e=t(this).resizable("instance"),i=e.options;t(i.alsoResize).each(function(){var e=t(this);e.data("ui-resizable-alsoresize",{width:parseFloat(e.width()),height:parseFloat(e.height()),left:parseFloat(e.css("left")),top:parseFloat(e.css("top"))})})},resize:function(e,i){var s=t(this).resizable("instance"),n=s.options,o=s.originalSize,a=s.originalPosition,r={height:s.size.height-o.height||0,width:s.size.width-o.width||0,top:s.position.top-a.top||0,left:s.position.left-a.left||0};t(n.alsoResize).each(function(){var e=t(this),s=t(this).data("ui-resizable-alsoresize"),n={},o=e.parents(i.originalElement[0]).length?["width","height"]:["width","height","top","left"];t.each(o,function(t,e){var i=(s[e]||0)+(r[e]||0);i&&i>=0&&(n[e]=i||null)}),e.css(n)})},stop:function(){t(this).removeData("ui-resizable-alsoresize")}}),t.ui.plugin.add("resizable","ghost",{start:function(){var e=t(this).resizable("instance"),i=e.size;e.ghost=e.originalElement.clone(),e.ghost.css({opacity:.25,display:"block",position:"relative",height:i.height,width:i.width,margin:0,left:0,top:0}),e._addClass(e.ghost,"ui-resizable-ghost"),t.uiBackCompat!==!1&&"string"==typeof e.options.ghost&&e.ghost.addClass(this.options.ghost),e.ghost.appendTo(e.helper)},resize:function(){var e=t(this).resizable("instance");e.ghost&&e.ghost.css({position:"relative",height:e.size.height,width:e.size.width})},stop:function(){var e=t(this).resizable("instance");e.ghost&&e.helper&&e.helper.get(0).removeChild(e.ghost.get(0))}}),t.ui.plugin.add("resizable","grid",{resize:function(){var e,i=t(this).resizable("instance"),s=i.options,n=i.size,o=i.originalSize,a=i.originalPosition,r=i.axis,l="number"==typeof s.grid?[s.grid,s.grid]:s.grid,h=l[0]||1,c=l[1]||1,u=Math.round((n.width-o.width)/h)*h,d=Math.round((n.height-o.height)/c)*c,p=o.width+u,f=o.height+d,g=s.maxWidth&&p>s.maxWidth,m=s.maxHeight&&f>s.maxHeight,_=s.minWidth&&s.minWidth>p,v=s.minHeight&&s.minHeight>f;s.grid=l,_&&(p+=h),v&&(f+=c),g&&(p-=h),m&&(f-=c),/^(se|s|e)$/.test(r)?(i.size.width=p,i.size.height=f):/^(ne)$/.test(r)?(i.size.width=p,i.size.height=f,i.position.top=a.top-d):/^(sw)$/.test(r)?(i.size.width=p,i.size.height=f,i.position.left=a.left-u):((0>=f-c||0>=p-h)&&(e=i._getPaddingPlusBorderDimensions(this)),f-c>0?(i.size.height=f,i.position.top=a.top-d):(f=c-e.height,i.size.height=f,i.position.top=a.top+o.height-f),p-h>0?(i.size.width=p,i.position.left=a.left-u):(p=h-e.width,i.size.width=p,i.position.left=a.left+o.width-p))}}),t.ui.resizable});
})();
(function(){
/*! jsTree - v3.3.7 - 2018-11-06 - (MIT) */
!function(a){"use strict";"function"==typeof define&&define.amd?define(["jquery"],a):"undefined"!=typeof module&&module.exports?module.exports=a(require("jquery")):a(jQuery)}(function(a,b){"use strict";if(!a.jstree){var c=0,d=!1,e=!1,f=!1,g=[],h=a("script:last").attr("src"),i=window.document;a.jstree={version:"3.3.7",defaults:{plugins:[]},plugins:{},path:h&&-1!==h.indexOf("/")?h.replace(/\/[^\/]+$/,""):"",idregex:/[\\:&!^|()\[\]<>@*'+~#";.,=\- \/${}%?`]/g,root:"#"},a.jstree.create=function(b,d){var e=new a.jstree.core(++c),f=d;return d=a.extend(!0,{},a.jstree.defaults,d),f&&f.plugins&&(d.plugins=f.plugins),a.each(d.plugins,function(a,b){"core"!==a&&(e=e.plugin(b,d[b]))}),a(b).data("jstree",e),e.init(b,d),e},a.jstree.destroy=function(){a(".jstree:jstree").jstree("destroy"),a(i).off(".jstree")},a.jstree.core=function(a){this._id=a,this._cnt=0,this._wrk=null,this._data={core:{themes:{name:!1,dots:!1,icons:!1,ellipsis:!1},selected:[],last_error:{},working:!1,worker_queue:[],focused:null}}},a.jstree.reference=function(b){var c=null,d=null;if(!b||!b.id||b.tagName&&b.nodeType||(b=b.id),!d||!d.length)try{d=a(b)}catch(e){}if(!d||!d.length)try{d=a("#"+b.replace(a.jstree.idregex,"\\$&"))}catch(e){}return d&&d.length&&(d=d.closest(".jstree")).length&&(d=d.data("jstree"))?c=d:a(".jstree").each(function(){var d=a(this).data("jstree");return d&&d._model.data[b]?(c=d,!1):void 0}),c},a.fn.jstree=function(c){var d="string"==typeof c,e=Array.prototype.slice.call(arguments,1),f=null;return c!==!0||this.length?(this.each(function(){var g=a.jstree.reference(this),h=d&&g?g[c]:null;return f=d&&h?h.apply(g,e):null,g||d||c!==b&&!a.isPlainObject(c)||a.jstree.create(this,c),(g&&!d||c===!0)&&(f=g||!1),null!==f&&f!==b?!1:void 0}),null!==f&&f!==b?f:this):!1},a.expr.pseudos.jstree=a.expr.createPseudo(function(c){return function(c){return a(c).hasClass("jstree")&&a(c).data("jstree")!==b}}),a.jstree.defaults.core={data:!1,strings:!1,check_callback:!1,error:a.noop,animation:200,multiple:!0,themes:{name:!1,url:!1,dir:!1,dots:!0,icons:!0,ellipsis:!1,stripes:!1,variant:!1,responsive:!1},expand_selected_onload:!0,worker:!0,force_text:!1,dblclick_toggle:!0,loaded_state:!1,restore_focus:!0,keyboard:{"ctrl-space":function(b){b.type="click",a(b.currentTarget).trigger(b)},enter:function(b){b.type="click",a(b.currentTarget).trigger(b)},left:function(b){if(b.preventDefault(),this.is_open(b.currentTarget))this.close_node(b.currentTarget);else{var c=this.get_parent(b.currentTarget);c&&c.id!==a.jstree.root&&this.get_node(c,!0).children(".jstree-anchor").focus()}},up:function(a){a.preventDefault();var b=this.get_prev_dom(a.currentTarget);b&&b.length&&b.children(".jstree-anchor").focus()},right:function(b){if(b.preventDefault(),this.is_closed(b.currentTarget))this.open_node(b.currentTarget,function(a){this.get_node(a,!0).children(".jstree-anchor").focus()});else if(this.is_open(b.currentTarget)){var c=this.get_node(b.currentTarget,!0).children(".jstree-children")[0];c&&a(this._firstChild(c)).children(".jstree-anchor").focus()}},down:function(a){a.preventDefault();var b=this.get_next_dom(a.currentTarget);b&&b.length&&b.children(".jstree-anchor").focus()},"*":function(a){this.open_all()},home:function(b){b.preventDefault();var c=this._firstChild(this.get_container_ul()[0]);c&&a(c).children(".jstree-anchor").filter(":visible").focus()},end:function(a){a.preventDefault(),this.element.find(".jstree-anchor").filter(":visible").last().focus()},f2:function(a){a.preventDefault(),this.edit(a.currentTarget)}}},a.jstree.core.prototype={plugin:function(b,c){var d=a.jstree.plugins[b];return d?(this._data[b]={},d.prototype=this,new d(c,this)):this},init:function(b,c){this._model={data:{},changed:[],force_full_redraw:!1,redraw_timeout:!1,default_state:{loaded:!0,opened:!1,selected:!1,disabled:!1}},this._model.data[a.jstree.root]={id:a.jstree.root,parent:null,parents:[],children:[],children_d:[],state:{loaded:!1}},this.element=a(b).addClass("jstree jstree-"+this._id),this.settings=c,this._data.core.ready=!1,this._data.core.loaded=!1,this._data.core.rtl="rtl"===this.element.css("direction"),this.element[this._data.core.rtl?"addClass":"removeClass"]("jstree-rtl"),this.element.attr("role","tree"),this.settings.core.multiple&&this.element.attr("aria-multiselectable",!0),this.element.attr("tabindex")||this.element.attr("tabindex","0"),this.bind(),this.trigger("init"),this._data.core.original_container_html=this.element.find(" > ul > li").clone(!0),this._data.core.original_container_html.find("li").addBack().contents().filter(function(){return 3===this.nodeType&&(!this.nodeValue||/^\s+$/.test(this.nodeValue))}).remove(),this.element.html("<ul class='jstree-container-ul jstree-children' role='group'><li id='j"+this._id+"_loading' class='jstree-initial-node jstree-loading jstree-leaf jstree-last' role='tree-item'><i class='jstree-icon jstree-ocl'></i><a class='jstree-anchor' href='#'><i class='jstree-icon jstree-themeicon-hidden'></i>"+this.get_string("Loading ...")+"</a></li></ul>"),this.element.attr("aria-activedescendant","j"+this._id+"_loading"),this._data.core.li_height=this.get_container_ul().children("li").first().outerHeight()||24,this._data.core.node=this._create_prototype_node(),this.trigger("loading"),this.load_node(a.jstree.root)},destroy:function(a){if(this.trigger("destroy"),this._wrk)try{window.URL.revokeObjectURL(this._wrk),this._wrk=null}catch(b){}a||this.element.empty(),this.teardown()},_create_prototype_node:function(){var a=i.createElement("LI"),b,c;return a.setAttribute("role","treeitem"),b=i.createElement("I"),b.className="jstree-icon jstree-ocl",b.setAttribute("role","presentation"),a.appendChild(b),b=i.createElement("A"),b.className="jstree-anchor",b.setAttribute("href","#"),b.setAttribute("tabindex","-1"),c=i.createElement("I"),c.className="jstree-icon jstree-themeicon",c.setAttribute("role","presentation"),b.appendChild(c),a.appendChild(b),b=c=null,a},_kbevent_to_func:function(a){var b={8:"Backspace",9:"Tab",13:"Return",19:"Pause",27:"Esc",32:"Space",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"Left",38:"Up",39:"Right",40:"Down",44:"Print",45:"Insert",46:"Delete",96:"Numpad0",97:"Numpad1",98:"Numpad2",99:"Numpad3",100:"Numpad4",101:"Numpad5",102:"Numpad6",103:"Numpad7",104:"Numpad8",105:"Numpad9","-13":"NumpadEnter",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"Numlock",145:"Scrolllock",16:"Shift",17:"Ctrl",18:"Alt",48:"0",49:"1",50:"2",51:"3",52:"4",53:"5",54:"6",55:"7",56:"8",57:"9",59:";",61:"=",65:"a",66:"b",67:"c",68:"d",69:"e",70:"f",71:"g",72:"h",73:"i",74:"j",75:"k",76:"l",77:"m",78:"n",79:"o",80:"p",81:"q",82:"r",83:"s",84:"t",85:"u",86:"v",87:"w",88:"x",89:"y",90:"z",107:"+",109:"-",110:".",186:";",187:"=",188:",",189:"-",190:".",191:"/",192:"`",219:"[",220:"\\",221:"]",222:"'",111:"/",106:"*",173:"-"},c=[];a.ctrlKey&&c.push("ctrl"),a.altKey&&c.push("alt"),a.shiftKey&&c.push("shift"),c.push(b[a.which]||a.which),c=c.sort().join("-").toLowerCase();var d=this.settings.core.keyboard,e,f;for(e in d)if(d.hasOwnProperty(e)&&(f=e,"-"!==f&&"+"!==f&&(f=f.replace("--","-MINUS").replace("+-","-MINUS").replace("++","-PLUS").replace("-+","-PLUS"),f=f.split(/-|\+/).sort().join("-").replace("MINUS","-").replace("PLUS","+").toLowerCase()),f===c))return d[e];return null},teardown:function(){this.unbind(),this.element.removeClass("jstree").removeData("jstree").find("[class^='jstree']").addBack().attr("class",function(){return this.className.replace(/jstree[^ ]*|$/gi,"")}),this.element=null},bind:function(){var b="",c=null,d=0;this.element.on("dblclick.jstree",function(a){if(a.target.tagName&&"input"===a.target.tagName.toLowerCase())return!0;if(i.selection&&i.selection.empty)i.selection.empty();else if(window.getSelection){var b=window.getSelection();try{b.removeAllRanges(),b.collapse()}catch(c){}}}).on("mousedown.jstree",a.proxy(function(a){a.target===this.element[0]&&(a.preventDefault(),d=+new Date)},this)).on("mousedown.jstree",".jstree-ocl",function(a){a.preventDefault()}).on("click.jstree",".jstree-ocl",a.proxy(function(a){this.toggle_node(a.target)},this)).on("dblclick.jstree",".jstree-anchor",a.proxy(function(a){return a.target.tagName&&"input"===a.target.tagName.toLowerCase()?!0:void(this.settings.core.dblclick_toggle&&this.toggle_node(a.target))},this)).on("click.jstree",".jstree-anchor",a.proxy(function(b){b.preventDefault(),b.currentTarget!==i.activeElement&&a(b.currentTarget).focus(),this.activate_node(b.currentTarget,b)},this)).on("keydown.jstree",".jstree-anchor",a.proxy(function(a){if(a.target.tagName&&"input"===a.target.tagName.toLowerCase())return!0;this._data.core.rtl&&(37===a.which?a.which=39:39===a.which&&(a.which=37));var b=this._kbevent_to_func(a);if(b){var c=b.call(this,a);if(c===!1||c===!0)return c}},this)).on("load_node.jstree",a.proxy(function(b,c){c.status&&(c.node.id!==a.jstree.root||this._data.core.loaded||(this._data.core.loaded=!0,this._firstChild(this.get_container_ul()[0])&&this.element.attr("aria-activedescendant",this._firstChild(this.get_container_ul()[0]).id),this.trigger("loaded")),this._data.core.ready||setTimeout(a.proxy(function(){if(this.element&&!this.get_container_ul().find(".jstree-loading").length){if(this._data.core.ready=!0,this._data.core.selected.length){if(this.settings.core.expand_selected_onload){var b=[],c,d;for(c=0,d=this._data.core.selected.length;d>c;c++)b=b.concat(this._model.data[this._data.core.selected[c]].parents);for(b=a.vakata.array_unique(b),c=0,d=b.length;d>c;c++)this.open_node(b[c],!1,0)}this.trigger("changed",{action:"ready",selected:this._data.core.selected})}this.trigger("ready")}},this),0))},this)).on("keypress.jstree",a.proxy(function(d){if(d.target.tagName&&"input"===d.target.tagName.toLowerCase())return!0;c&&clearTimeout(c),c=setTimeout(function(){b=""},500);var e=String.fromCharCode(d.which).toLowerCase(),f=this.element.find(".jstree-anchor").filter(":visible"),g=f.index(i.activeElement)||0,h=!1;if(b+=e,b.length>1){if(f.slice(g).each(a.proxy(function(c,d){return 0===a(d).text().toLowerCase().indexOf(b)?(a(d).focus(),h=!0,!1):void 0},this)),h)return;if(f.slice(0,g).each(a.proxy(function(c,d){return 0===a(d).text().toLowerCase().indexOf(b)?(a(d).focus(),h=!0,!1):void 0},this)),h)return}if(new RegExp("^"+e.replace(/[-\/\\^$*+?.()|[\]{}]/g,"\\$&")+"+$").test(b)){if(f.slice(g+1).each(a.proxy(function(b,c){return a(c).text().toLowerCase().charAt(0)===e?(a(c).focus(),h=!0,!1):void 0},this)),h)return;if(f.slice(0,g+1).each(a.proxy(function(b,c){return a(c).text().toLowerCase().charAt(0)===e?(a(c).focus(),h=!0,!1):void 0},this)),h)return}},this)).on("init.jstree",a.proxy(function(){var a=this.settings.core.themes;this._data.core.themes.dots=a.dots,this._data.core.themes.stripes=a.stripes,this._data.core.themes.icons=a.icons,this._data.core.themes.ellipsis=a.ellipsis,this.set_theme(a.name||"default",a.url),this.set_theme_variant(a.variant)},this)).on("loading.jstree",a.proxy(function(){this[this._data.core.themes.dots?"show_dots":"hide_dots"](),this[this._data.core.themes.icons?"show_icons":"hide_icons"](),this[this._data.core.themes.stripes?"show_stripes":"hide_stripes"](),this[this._data.core.themes.ellipsis?"show_ellipsis":"hide_ellipsis"]()},this)).on("blur.jstree",".jstree-anchor",a.proxy(function(b){this._data.core.focused=null,a(b.currentTarget).filter(".jstree-hovered").mouseleave(),this.element.attr("tabindex","0")},this)).on("focus.jstree",".jstree-anchor",a.proxy(function(b){var c=this.get_node(b.currentTarget);c&&c.id&&(this._data.core.focused=c.id),this.element.find(".jstree-hovered").not(b.currentTarget).mouseleave(),a(b.currentTarget).mouseenter(),this.element.attr("tabindex","-1")},this)).on("focus.jstree",a.proxy(function(){if(+new Date-d>500&&!this._data.core.focused&&this.settings.core.restore_focus){d=0;var a=this.get_node(this.element.attr("aria-activedescendant"),!0);a&&a.find("> .jstree-anchor").focus()}},this)).on("mouseenter.jstree",".jstree-anchor",a.proxy(function(a){this.hover_node(a.currentTarget)},this)).on("mouseleave.jstree",".jstree-anchor",a.proxy(function(a){this.dehover_node(a.currentTarget)},this))},unbind:function(){this.element.off(".jstree"),a(i).off(".jstree-"+this._id)},trigger:function(a,b){b||(b={}),b.instance=this,this.element.triggerHandler(a.replace(".jstree","")+".jstree",b)},get_container:function(){return this.element},get_container_ul:function(){return this.element.children(".jstree-children").first()},get_string:function(b){var c=this.settings.core.strings;return a.isFunction(c)?c.call(this,b):c&&c[b]?c[b]:b},_firstChild:function(a){a=a?a.firstChild:null;while(null!==a&&1!==a.nodeType)a=a.nextSibling;return a},_nextSibling:function(a){a=a?a.nextSibling:null;while(null!==a&&1!==a.nodeType)a=a.nextSibling;return a},_previousSibling:function(a){a=a?a.previousSibling:null;while(null!==a&&1!==a.nodeType)a=a.previousSibling;return a},get_node:function(b,c){b&&b.id&&(b=b.id),b instanceof jQuery&&b.length&&b[0].id&&(b=b[0].id);var d;try{if(this._model.data[b])b=this._model.data[b];else if("string"==typeof b&&this._model.data[b.replace(/^#/,"")])b=this._model.data[b.replace(/^#/,"")];else if("string"==typeof b&&(d=a("#"+b.replace(a.jstree.idregex,"\\$&"),this.element)).length&&this._model.data[d.closest(".jstree-node").attr("id")])b=this._model.data[d.closest(".jstree-node").attr("id")];else if((d=this.element.find(b)).length&&this._model.data[d.closest(".jstree-node").attr("id")])b=this._model.data[d.closest(".jstree-node").attr("id")];else{if(!(d=this.element.find(b)).length||!d.hasClass("jstree"))return!1;b=this._model.data[a.jstree.root]}return c&&(b=b.id===a.jstree.root?this.element:a("#"+b.id.replace(a.jstree.idregex,"\\$&"),this.element)),b}catch(e){return!1}},get_path:function(b,c,d){if(b=b.parents?b:this.get_node(b),!b||b.id===a.jstree.root||!b.parents)return!1;var e,f,g=[];for(g.push(d?b.id:b.text),e=0,f=b.parents.length;f>e;e++)g.push(d?b.parents[e]:this.get_text(b.parents[e]));return g=g.reverse().slice(1),c?g.join(c):g},get_next_dom:function(b,c){var d;if(b=this.get_node(b,!0),b[0]===this.element[0]){d=this._firstChild(this.get_container_ul()[0]);while(d&&0===d.offsetHeight)d=this._nextSibling(d);return d?a(d):!1}if(!b||!b.length)return!1;if(c){d=b[0];do d=this._nextSibling(d);while(d&&0===d.offsetHeight);return d?a(d):!1}if(b.hasClass("jstree-open")){d=this._firstChild(b.children(".jstree-children")[0]);while(d&&0===d.offsetHeight)d=this._nextSibling(d);if(null!==d)return a(d)}d=b[0];do d=this._nextSibling(d);while(d&&0===d.offsetHeight);return null!==d?a(d):b.parentsUntil(".jstree",".jstree-node").nextAll(".jstree-node:visible").first()},get_prev_dom:function(b,c){var d;if(b=this.get_node(b,!0),b[0]===this.element[0]){d=this.get_container_ul()[0].lastChild;while(d&&0===d.offsetHeight)d=this._previousSibling(d);return d?a(d):!1}if(!b||!b.length)return!1;if(c){d=b[0];do d=this._previousSibling(d);while(d&&0===d.offsetHeight);return d?a(d):!1}d=b[0];do d=this._previousSibling(d);while(d&&0===d.offsetHeight);if(null!==d){b=a(d);while(b.hasClass("jstree-open"))b=b.children(".jstree-children").first().children(".jstree-node:visible:last");return b}return d=b[0].parentNode.parentNode,d&&d.className&&-1!==d.className.indexOf("jstree-node")?a(d):!1},get_parent:function(b){return b=this.get_node(b),b&&b.id!==a.jstree.root?b.parent:!1},get_children_dom:function(a){return a=this.get_node(a,!0),a[0]===this.element[0]?this.get_container_ul().children(".jstree-node"):a&&a.length?a.children(".jstree-children").children(".jstree-node"):!1},is_parent:function(a){return a=this.get_node(a),a&&(a.state.loaded===!1||a.children.length>0)},is_loaded:function(a){return a=this.get_node(a),a&&a.state.loaded},is_loading:function(a){return a=this.get_node(a),a&&a.state&&a.state.loading},is_open:function(a){return a=this.get_node(a),a&&a.state.opened},is_closed:function(a){return a=this.get_node(a),a&&this.is_parent(a)&&!a.state.opened},is_leaf:function(a){return!this.is_parent(a)},load_node:function(b,c){var d,e,f,g,h;if(a.isArray(b))return this._load_nodes(b.slice(),c),!0;if(b=this.get_node(b),!b)return c&&c.call(this,b,!1),!1;if(b.state.loaded){for(b.state.loaded=!1,f=0,g=b.parents.length;g>f;f++)this._model.data[b.parents[f]].children_d=a.vakata.array_filter(this._model.data[b.parents[f]].children_d,function(c){return-1===a.inArray(c,b.children_d)});for(d=0,e=b.children_d.length;e>d;d++)this._model.data[b.children_d[d]].state.selected&&(h=!0),delete this._model.data[b.children_d[d]];h&&(this._data.core.selected=a.vakata.array_filter(this._data.core.selected,function(c){return-1===a.inArray(c,b.children_d)})),b.children=[],b.children_d=[],h&&this.trigger("changed",{action:"load_node",node:b,selected:this._data.core.selected})}return b.state.failed=!1,b.state.loading=!0,this.get_node(b,!0).addClass("jstree-loading").attr("aria-busy",!0),this._load_node(b,a.proxy(function(a){b=this._model.data[b.id],b.state.loading=!1,b.state.loaded=a,b.state.failed=!b.state.loaded;var d=this.get_node(b,!0),e=0,f=0,g=this._model.data,h=!1;for(e=0,f=b.children.length;f>e;e++)if(g[b.children[e]]&&!g[b.children[e]].state.hidden){h=!0;break}b.state.loaded&&d&&d.length&&(d.removeClass("jstree-closed jstree-open jstree-leaf"),h?"#"!==b.id&&d.addClass(b.state.opened?"jstree-open":"jstree-closed"):d.addClass("jstree-leaf")),d.removeClass("jstree-loading").attr("aria-busy",!1),this.trigger("load_node",{node:b,status:a}),c&&c.call(this,b,a)},this)),!0},_load_nodes:function(a,b,c,d){var e=!0,f=function(){this._load_nodes(a,b,!0)},g=this._model.data,h,i,j=[];for(h=0,i=a.length;i>h;h++)g[a[h]]&&(!g[a[h]].state.loaded&&!g[a[h]].state.failed||!c&&d)&&(this.is_loading(a[h])||this.load_node(a[h],f),e=!1);if(e){for(h=0,i=a.length;i>h;h++)g[a[h]]&&g[a[h]].state.loaded&&j.push(a[h]);b&&!b.done&&(b.call(this,j),b.done=!0)}},load_all:function(b,c){if(b||(b=a.jstree.root),b=this.get_node(b),!b)return!1;var d=[],e=this._model.data,f=e[b.id].children_d,g,h;for(b.state&&!b.state.loaded&&d.push(b.id),g=0,h=f.length;h>g;g++)e[f[g]]&&e[f[g]].state&&!e[f[g]].state.loaded&&d.push(f[g]);d.length?this._load_nodes(d,function(){this.load_all(b,c)}):(c&&c.call(this,b),this.trigger("load_all",{node:b}))},_load_node:function(b,c){var d=this.settings.core.data,e,f=function g(){return 3!==this.nodeType&&8!==this.nodeType};return d?a.isFunction(d)?d.call(this,b,a.proxy(function(d){d===!1?c.call(this,!1):this["string"==typeof d?"_append_html_data":"_append_json_data"](b,"string"==typeof d?a(a.parseHTML(d)).filter(f):d,function(a){c.call(this,a)})},this)):"object"==typeof d?d.url?(d=a.extend(!0,{},d),a.isFunction(d.url)&&(d.url=d.url.call(this,b)),a.isFunction(d.data)&&(d.data=d.data.call(this,b)),a.ajax(d).done(a.proxy(function(d,e,g){var h=g.getResponseHeader("Content-Type");return h&&-1!==h.indexOf("json")||"object"==typeof d?this._append_json_data(b,d,function(a){c.call(this,a)}):h&&-1!==h.indexOf("html")||"string"==typeof d?this._append_html_data(b,a(a.parseHTML(d)).filter(f),function(a){c.call(this,a)}):(this._data.core.last_error={error:"ajax",plugin:"core",id:"core_04",reason:"Could not load node",data:JSON.stringify({id:b.id,xhr:g})},this.settings.core.error.call(this,this._data.core.last_error),c.call(this,!1))},this)).fail(a.proxy(function(a){this._data.core.last_error={error:"ajax",plugin:"core",id:"core_04",reason:"Could not load node",data:JSON.stringify({id:b.id,xhr:a})},c.call(this,!1),this.settings.core.error.call(this,this._data.core.last_error)},this))):(e=a.isArray(d)?a.extend(!0,[],d):a.isPlainObject(d)?a.extend(!0,{},d):d,b.id===a.jstree.root?this._append_json_data(b,e,function(a){c.call(this,a)}):(this._data.core.last_error={error:"nodata",plugin:"core",id:"core_05",reason:"Could not load node",data:JSON.stringify({id:b.id})},this.settings.core.error.call(this,this._data.core.last_error),c.call(this,!1))):"string"==typeof d?b.id===a.jstree.root?this._append_html_data(b,a(a.parseHTML(d)).filter(f),function(a){c.call(this,a)}):(this._data.core.last_error={error:"nodata",plugin:"core",id:"core_06",reason:"Could not load node",data:JSON.stringify({id:b.id})},this.settings.core.error.call(this,this._data.core.last_error),c.call(this,!1)):c.call(this,!1):b.id===a.jstree.root?this._append_html_data(b,this._data.core.original_container_html.clone(!0),function(a){c.call(this,a)}):c.call(this,!1)},_node_changed:function(b){b=this.get_node(b),b&&-1===a.inArray(b.id,this._model.changed)&&this._model.changed.push(b.id)},_append_html_data:function(b,c,d){b=this.get_node(b),b.children=[],b.children_d=[];var e=c.is("ul")?c.children():c,f=b.id,g=[],h=[],i=this._model.data,j=i[f],k=this._data.core.selected.length,l,m,n;for(e.each(a.proxy(function(b,c){l=this._parse_model_from_html(a(c),f,j.parents.concat()),l&&(g.push(l),h.push(l),i[l].children_d.length&&(h=h.concat(i[l].children_d)))},this)),j.children=g,j.children_d=h,m=0,n=j.parents.length;n>m;m++)i[j.parents[m]].children_d=i[j.parents[m]].children_d.concat(h);this.trigger("model",{nodes:h,parent:f}),f!==a.jstree.root?(this._node_changed(f),this.redraw()):(this.get_container_ul().children(".jstree-initial-node").remove(),this.redraw(!0)),this._data.core.selected.length!==k&&this.trigger("changed",{action:"model",selected:this._data.core.selected}),d.call(this,!0)},_append_json_data:function(b,c,d,e){if(null!==this.element){b=this.get_node(b),b.children=[],b.children_d=[],c.d&&(c=c.d,"string"==typeof c&&(c=JSON.parse(c))),a.isArray(c)||(c=[c]);var f=null,g={df:this._model.default_state,dat:c,par:b.id,m:this._model.data,t_id:this._id,t_cnt:this._cnt,sel:this._data.core.selected},h=function(a,b){a.data&&(a=a.data);var c=a.dat,d=a.par,e=[],f=[],g=[],h=a.df,i=a.t_id,j=a.t_cnt,k=a.m,l=k[d],m=a.sel,n,o,p,q,r=function(a,c,d){d=d?d.concat():[],c&&d.unshift(c);var e=a.id.toString(),f,i,j,l,m={id:e,text:a.text||"",icon:a.icon!==b?a.icon:!0,parent:c,parents:d,children:a.children||[],children_d:a.children_d||[],data:a.data,state:{},li_attr:{id:!1},a_attr:{href:"#"},original:!1};for(f in h)h.hasOwnProperty(f)&&(m.state[f]=h[f]);if(a&&a.data&&a.data.jstree&&a.data.jstree.icon&&(m.icon=a.data.jstree.icon),(m.icon===b||null===m.icon||""===m.icon)&&(m.icon=!0),a&&a.data&&(m.data=a.data,a.data.jstree))for(f in a.data.jstree)a.data.jstree.hasOwnProperty(f)&&(m.state[f]=a.data.jstree[f]);if(a&&"object"==typeof a.state)for(f in a.state)a.state.hasOwnProperty(f)&&(m.state[f]=a.state[f]);if(a&&"object"==typeof a.li_attr)for(f in a.li_attr)a.li_attr.hasOwnProperty(f)&&(m.li_attr[f]=a.li_attr[f]);if(m.li_attr.id||(m.li_attr.id=e),a&&"object"==typeof a.a_attr)for(f in a.a_attr)a.a_attr.hasOwnProperty(f)&&(m.a_attr[f]=a.a_attr[f]);for(a&&a.children&&a.children===!0&&(m.state.loaded=!1,m.children=[],m.children_d=[]),k[m.id]=m,f=0,i=m.children.length;i>f;f++)j=r(k[m.children[f]],m.id,d),l=k[j],m.children_d.push(j),l.children_d.length&&(m.children_d=m.children_d.concat(l.children_d));return delete a.data,delete a.children,k[m.id].original=a,m.state.selected&&g.push(m.id),m.id},s=function(a,c,d){d=d?d.concat():[],c&&d.unshift(c);var e=!1,f,l,m,n,o;do e="j"+i+"_"+ ++j;while(k[e]);o={id:!1,text:"string"==typeof a?a:"",icon:"object"==typeof a&&a.icon!==b?a.icon:!0,parent:c,parents:d,children:[],children_d:[],data:null,state:{},li_attr:{id:!1},a_attr:{href:"#"},original:!1};for(f in h)h.hasOwnProperty(f)&&(o.state[f]=h[f]);if(a&&a.id&&(o.id=a.id.toString()),a&&a.text&&(o.text=a.text),a&&a.data&&a.data.jstree&&a.data.jstree.icon&&(o.icon=a.data.jstree.icon),(o.icon===b||null===o.icon||""===o.icon)&&(o.icon=!0),a&&a.data&&(o.data=a.data,a.data.jstree))for(f in a.data.jstree)a.data.jstree.hasOwnProperty(f)&&(o.state[f]=a.data.jstree[f]);if(a&&"object"==typeof a.state)for(f in a.state)a.state.hasOwnProperty(f)&&(o.state[f]=a.state[f]);if(a&&"object"==typeof a.li_attr)for(f in a.li_attr)a.li_attr.hasOwnProperty(f)&&(o.li_attr[f]=a.li_attr[f]);if(o.li_attr.id&&!o.id&&(o.id=o.li_attr.id.toString()),o.id||(o.id=e),o.li_attr.id||(o.li_attr.id=o.id),a&&"object"==typeof a.a_attr)for(f in a.a_attr)a.a_attr.hasOwnProperty(f)&&(o.a_attr[f]=a.a_attr[f]);if(a&&a.children&&a.children.length){for(f=0,l=a.children.length;l>f;f++)m=s(a.children[f],o.id,d),n=k[m],o.children.push(m),n.children_d.length&&(o.children_d=o.children_d.concat(n.children_d));o.children_d=o.children_d.concat(o.children)}return a&&a.children&&a.children===!0&&(o.state.loaded=!1,o.children=[],o.children_d=[]),delete a.data,delete a.children,o.original=a,k[o.id]=o,o.state.selected&&g.push(o.id),o.id};if(c.length&&c[0].id!==b&&c[0].parent!==b){for(o=0,p=c.length;p>o;o++)c[o].children||(c[o].children=[]),c[o].state||(c[o].state={}),k[c[o].id.toString()]=c[o];for(o=0,p=c.length;p>o;o++)k[c[o].parent.toString()]?(k[c[o].parent.toString()].children.push(c[o].id.toString()),l.children_d.push(c[o].id.toString())):(this._data.core.last_error={error:"parse",plugin:"core",id:"core_07",reason:"Node with invalid parent",data:JSON.stringify({id:c[o].id.toString(),parent:c[o].parent.toString()})},this.settings.core.error.call(this,this._data.core.last_error));for(o=0,p=l.children.length;p>o;o++)n=r(k[l.children[o]],d,l.parents.concat()),f.push(n),k[n].children_d.length&&(f=f.concat(k[n].children_d));for(o=0,p=l.parents.length;p>o;o++)k[l.parents[o]].children_d=k[l.parents[o]].children_d.concat(f);q={cnt:j,mod:k,sel:m,par:d,dpc:f,add:g}}else{for(o=0,p=c.length;p>o;o++)n=s(c[o],d,l.parents.concat()),n&&(e.push(n),f.push(n),k[n].children_d.length&&(f=f.concat(k[n].children_d)));for(l.children=e,l.children_d=f,o=0,p=l.parents.length;p>o;o++)k[l.parents[o]].children_d=k[l.parents[o]].children_d.concat(f);q={cnt:j,mod:k,sel:m,par:d,dpc:f,add:g}}return"undefined"!=typeof window&&"undefined"!=typeof window.document?q:void postMessage(q)},i=function(b,c){if(null!==this.element){this._cnt=b.cnt;var e,f=this._model.data;for(e in f)f.hasOwnProperty(e)&&f[e].state&&f[e].state.loading&&b.mod[e]&&(b.mod[e].state.loading=!0);if(this._model.data=b.mod,c){var g,h=b.add,i=b.sel,j=this._data.core.selected.slice();if(f=this._model.data,i.length!==j.length||a.vakata.array_unique(i.concat(j)).length!==i.length){for(e=0,g=i.length;g>e;e++)-1===a.inArray(i[e],h)&&-1===a.inArray(i[e],j)&&(f[i[e]].state.selected=!1);for(e=0,g=j.length;g>e;e++)-1===a.inArray(j[e],i)&&(f[j[e]].state.selected=!0)}}b.add.length&&(this._data.core.selected=this._data.core.selected.concat(b.add)),this.trigger("model",{nodes:b.dpc,parent:b.par}),b.par!==a.jstree.root?(this._node_changed(b.par),this.redraw()):this.redraw(!0),b.add.length&&this.trigger("changed",{action:"model",selected:this._data.core.selected}),d.call(this,!0)}};if(this.settings.core.worker&&window.Blob&&window.URL&&window.Worker)try{null===this._wrk&&(this._wrk=window.URL.createObjectURL(new window.Blob(["self.onmessage = "+h.toString()],{type:"text/javascript"}))),!this._data.core.working||e?(this._data.core.working=!0,f=new window.Worker(this._wrk),f.onmessage=a.proxy(function(a){i.call(this,a.data,!0);try{f.terminate(),f=null}catch(b){}this._data.core.worker_queue.length?this._append_json_data.apply(this,this._data.core.worker_queue.shift()):this._data.core.working=!1},this),g.par?f.postMessage(g):this._data.core.worker_queue.length?this._append_json_data.apply(this,this._data.core.worker_queue.shift()):this._data.core.working=!1):this._data.core.worker_queue.push([b,c,d,!0])}catch(j){i.call(this,h(g),!1),this._data.core.worker_queue.length?this._append_json_data.apply(this,this._data.core.worker_queue.shift()):this._data.core.working=!1}else i.call(this,h(g),!1)}},_parse_model_from_html:function(c,d,e){e=e?[].concat(e):[],d&&e.unshift(d);var f,g,h=this._model.data,i={id:!1,text:!1,icon:!0,parent:d,parents:e,children:[],children_d:[],data:null,state:{},li_attr:{id:!1},a_attr:{href:"#"},original:!1},j,k,l;for(j in this._model.default_state)this._model.default_state.hasOwnProperty(j)&&(i.state[j]=this._model.default_state[j]);if(k=a.vakata.attributes(c,!0),a.each(k,function(b,c){return c=a.trim(c),c.length?(i.li_attr[b]=c,void("id"===b&&(i.id=c.toString()))):!0}),k=c.children("a").first(),k.length&&(k=a.vakata.attributes(k,!0),a.each(k,function(b,c){c=a.trim(c),c.length&&(i.a_attr[b]=c)})),k=c.children("a").first().length?c.children("a").first().clone():c.clone(),k.children("ins, i, ul").remove(),k=k.html(),k=a("<div />").html(k),i.text=this.settings.core.force_text?k.text():k.html(),k=c.data(),i.data=k?a.extend(!0,{},k):null,i.state.opened=c.hasClass("jstree-open"),i.state.selected=c.children("a").hasClass("jstree-clicked"),i.state.disabled=c.children("a").hasClass("jstree-disabled"),i.data&&i.data.jstree)for(j in i.data.jstree)i.data.jstree.hasOwnProperty(j)&&(i.state[j]=i.data.jstree[j]);k=c.children("a").children(".jstree-themeicon"),k.length&&(i.icon=k.hasClass("jstree-themeicon-hidden")?!1:k.attr("rel")),i.state.icon!==b&&(i.icon=i.state.icon),(i.icon===b||null===i.icon||""===i.icon)&&(i.icon=!0),k=c.children("ul").children("li");do l="j"+this._id+"_"+ ++this._cnt;while(h[l]);return i.id=i.li_attr.id?i.li_attr.id.toString():l,k.length?(k.each(a.proxy(function(b,c){f=this._parse_model_from_html(a(c),i.id,e),g=this._model.data[f],i.children.push(f),g.children_d.length&&(i.children_d=i.children_d.concat(g.children_d))},this)),i.children_d=i.children_d.concat(i.children)):c.hasClass("jstree-closed")&&(i.state.loaded=!1),i.li_attr["class"]&&(i.li_attr["class"]=i.li_attr["class"].replace("jstree-closed","").replace("jstree-open","")),i.a_attr["class"]&&(i.a_attr["class"]=i.a_attr["class"].replace("jstree-clicked","").replace("jstree-disabled","")),h[i.id]=i,i.state.selected&&this._data.core.selected.push(i.id),i.id},_parse_model_from_flat_json:function(a,c,d){d=d?d.concat():[],c&&d.unshift(c);var e=a.id.toString(),f=this._model.data,g=this._model.default_state,h,i,j,k,l={id:e,text:a.text||"",icon:a.icon!==b?a.icon:!0,parent:c,parents:d,children:a.children||[],children_d:a.children_d||[],data:a.data,state:{},li_attr:{id:!1},a_attr:{href:"#"},original:!1};for(h in g)g.hasOwnProperty(h)&&(l.state[h]=g[h]);if(a&&a.data&&a.data.jstree&&a.data.jstree.icon&&(l.icon=a.data.jstree.icon),(l.icon===b||null===l.icon||""===l.icon)&&(l.icon=!0),a&&a.data&&(l.data=a.data,a.data.jstree))for(h in a.data.jstree)a.data.jstree.hasOwnProperty(h)&&(l.state[h]=a.data.jstree[h]);if(a&&"object"==typeof a.state)for(h in a.state)a.state.hasOwnProperty(h)&&(l.state[h]=a.state[h]);if(a&&"object"==typeof a.li_attr)for(h in a.li_attr)a.li_attr.hasOwnProperty(h)&&(l.li_attr[h]=a.li_attr[h]);if(l.li_attr.id||(l.li_attr.id=e),a&&"object"==typeof a.a_attr)for(h in a.a_attr)a.a_attr.hasOwnProperty(h)&&(l.a_attr[h]=a.a_attr[h]);for(a&&a.children&&a.children===!0&&(l.state.loaded=!1,l.children=[],l.children_d=[]),f[l.id]=l,h=0,i=l.children.length;i>h;h++)j=this._parse_model_from_flat_json(f[l.children[h]],l.id,d),k=f[j],l.children_d.push(j),k.children_d.length&&(l.children_d=l.children_d.concat(k.children_d));return delete a.data,delete a.children,f[l.id].original=a,l.state.selected&&this._data.core.selected.push(l.id),l.id},_parse_model_from_json:function(a,c,d){d=d?d.concat():[],c&&d.unshift(c);var e=!1,f,g,h,i,j=this._model.data,k=this._model.default_state,l;do e="j"+this._id+"_"+ ++this._cnt;while(j[e]);l={id:!1,text:"string"==typeof a?a:"",icon:"object"==typeof a&&a.icon!==b?a.icon:!0,parent:c,parents:d,children:[],children_d:[],data:null,state:{},li_attr:{id:!1},a_attr:{href:"#"},original:!1};for(f in k)k.hasOwnProperty(f)&&(l.state[f]=k[f]);if(a&&a.id&&(l.id=a.id.toString()),a&&a.text&&(l.text=a.text),a&&a.data&&a.data.jstree&&a.data.jstree.icon&&(l.icon=a.data.jstree.icon),(l.icon===b||null===l.icon||""===l.icon)&&(l.icon=!0),a&&a.data&&(l.data=a.data,a.data.jstree))for(f in a.data.jstree)a.data.jstree.hasOwnProperty(f)&&(l.state[f]=a.data.jstree[f]);if(a&&"object"==typeof a.state)for(f in a.state)a.state.hasOwnProperty(f)&&(l.state[f]=a.state[f]);if(a&&"object"==typeof a.li_attr)for(f in a.li_attr)a.li_attr.hasOwnProperty(f)&&(l.li_attr[f]=a.li_attr[f]);if(l.li_attr.id&&!l.id&&(l.id=l.li_attr.id.toString()),
l.id||(l.id=e),l.li_attr.id||(l.li_attr.id=l.id),a&&"object"==typeof a.a_attr)for(f in a.a_attr)a.a_attr.hasOwnProperty(f)&&(l.a_attr[f]=a.a_attr[f]);if(a&&a.children&&a.children.length){for(f=0,g=a.children.length;g>f;f++)h=this._parse_model_from_json(a.children[f],l.id,d),i=j[h],l.children.push(h),i.children_d.length&&(l.children_d=l.children_d.concat(i.children_d));l.children_d=l.children_d.concat(l.children)}return a&&a.children&&a.children===!0&&(l.state.loaded=!1,l.children=[],l.children_d=[]),delete a.data,delete a.children,l.original=a,j[l.id]=l,l.state.selected&&this._data.core.selected.push(l.id),l.id},_redraw:function(){var b=this._model.force_full_redraw?this._model.data[a.jstree.root].children.concat([]):this._model.changed.concat([]),c=i.createElement("UL"),d,e,f,g=this._data.core.focused;for(e=0,f=b.length;f>e;e++)d=this.redraw_node(b[e],!0,this._model.force_full_redraw),d&&this._model.force_full_redraw&&c.appendChild(d);this._model.force_full_redraw&&(c.className=this.get_container_ul()[0].className,c.setAttribute("role","group"),this.element.empty().append(c)),null!==g&&this.settings.core.restore_focus&&(d=this.get_node(g,!0),d&&d.length&&d.children(".jstree-anchor")[0]!==i.activeElement?d.children(".jstree-anchor").focus():this._data.core.focused=null),this._model.force_full_redraw=!1,this._model.changed=[],this.trigger("redraw",{nodes:b})},redraw:function(a){a&&(this._model.force_full_redraw=!0),this._redraw()},draw_children:function(b){var c=this.get_node(b),d=!1,e=!1,f=!1,g=i;if(!c)return!1;if(c.id===a.jstree.root)return this.redraw(!0);if(b=this.get_node(b,!0),!b||!b.length)return!1;if(b.children(".jstree-children").remove(),b=b[0],c.children.length&&c.state.loaded){for(f=g.createElement("UL"),f.setAttribute("role","group"),f.className="jstree-children",d=0,e=c.children.length;e>d;d++)f.appendChild(this.redraw_node(c.children[d],!0,!0));b.appendChild(f)}},redraw_node:function(b,c,d,e){var f=this.get_node(b),g=!1,h=!1,j=!1,k=!1,l=!1,m=!1,n="",o=i,p=this._model.data,q=!1,r=!1,s=null,t=0,u=0,v=!1,w=!1;if(!f)return!1;if(f.id===a.jstree.root)return this.redraw(!0);if(c=c||0===f.children.length,b=i.querySelector?this.element[0].querySelector("#"+(-1!=="0123456789".indexOf(f.id[0])?"\\3"+f.id[0]+" "+f.id.substr(1).replace(a.jstree.idregex,"\\$&"):f.id.replace(a.jstree.idregex,"\\$&"))):i.getElementById(f.id))b=a(b),d||(g=b.parent().parent()[0],g===this.element[0]&&(g=null),h=b.index()),c||!f.children.length||b.children(".jstree-children").length||(c=!0),c||(j=b.children(".jstree-children")[0]),q=b.children(".jstree-anchor")[0]===i.activeElement,b.remove();else if(c=!0,!d){if(g=f.parent!==a.jstree.root?a("#"+f.parent.replace(a.jstree.idregex,"\\$&"),this.element)[0]:null,!(null===g||g&&p[f.parent].state.opened))return!1;h=a.inArray(f.id,null===g?p[a.jstree.root].children:p[f.parent].children)}b=this._data.core.node.cloneNode(!0),n="jstree-node ";for(k in f.li_attr)if(f.li_attr.hasOwnProperty(k)){if("id"===k)continue;"class"!==k?b.setAttribute(k,f.li_attr[k]):n+=f.li_attr[k]}for(f.a_attr.id||(f.a_attr.id=f.id+"_anchor"),b.setAttribute("aria-selected",!!f.state.selected),b.setAttribute("aria-level",f.parents.length),b.setAttribute("aria-labelledby",f.a_attr.id),f.state.disabled&&b.setAttribute("aria-disabled",!0),k=0,l=f.children.length;l>k;k++)if(!p[f.children[k]].state.hidden){v=!0;break}if(null!==f.parent&&p[f.parent]&&!f.state.hidden&&(k=a.inArray(f.id,p[f.parent].children),w=f.id,-1!==k))for(k++,l=p[f.parent].children.length;l>k;k++)if(p[p[f.parent].children[k]].state.hidden||(w=p[f.parent].children[k]),w!==f.id)break;f.state.hidden&&(n+=" jstree-hidden"),f.state.loading&&(n+=" jstree-loading"),f.state.loaded&&!v?n+=" jstree-leaf":(n+=f.state.opened&&f.state.loaded?" jstree-open":" jstree-closed",b.setAttribute("aria-expanded",f.state.opened&&f.state.loaded)),w===f.id&&(n+=" jstree-last"),b.id=f.id,b.className=n,n=(f.state.selected?" jstree-clicked":"")+(f.state.disabled?" jstree-disabled":"");for(l in f.a_attr)if(f.a_attr.hasOwnProperty(l)){if("href"===l&&"#"===f.a_attr[l])continue;"class"!==l?b.childNodes[1].setAttribute(l,f.a_attr[l]):n+=" "+f.a_attr[l]}if(n.length&&(b.childNodes[1].className="jstree-anchor "+n),(f.icon&&f.icon!==!0||f.icon===!1)&&(f.icon===!1?b.childNodes[1].childNodes[0].className+=" jstree-themeicon-hidden":-1===f.icon.indexOf("/")&&-1===f.icon.indexOf(".")?b.childNodes[1].childNodes[0].className+=" "+f.icon+" jstree-themeicon-custom":(b.childNodes[1].childNodes[0].style.backgroundImage='url("'+f.icon+'")',b.childNodes[1].childNodes[0].style.backgroundPosition="center center",b.childNodes[1].childNodes[0].style.backgroundSize="auto",b.childNodes[1].childNodes[0].className+=" jstree-themeicon-custom")),this.settings.core.force_text?b.childNodes[1].appendChild(o.createTextNode(f.text)):b.childNodes[1].innerHTML+=f.text,c&&f.children.length&&(f.state.opened||e)&&f.state.loaded){for(m=o.createElement("UL"),m.setAttribute("role","group"),m.className="jstree-children",k=0,l=f.children.length;l>k;k++)m.appendChild(this.redraw_node(f.children[k],c,!0));b.appendChild(m)}if(j&&b.appendChild(j),!d){for(g||(g=this.element[0]),k=0,l=g.childNodes.length;l>k;k++)if(g.childNodes[k]&&g.childNodes[k].className&&-1!==g.childNodes[k].className.indexOf("jstree-children")){s=g.childNodes[k];break}s||(s=o.createElement("UL"),s.setAttribute("role","group"),s.className="jstree-children",g.appendChild(s)),g=s,h<g.childNodes.length?g.insertBefore(b,g.childNodes[h]):g.appendChild(b),q&&(t=this.element[0].scrollTop,u=this.element[0].scrollLeft,b.childNodes[1].focus(),this.element[0].scrollTop=t,this.element[0].scrollLeft=u)}return f.state.opened&&!f.state.loaded&&(f.state.opened=!1,setTimeout(a.proxy(function(){this.open_node(f.id,!1,0)},this),0)),b},open_node:function(c,d,e){var f,g,h,i;if(a.isArray(c)){for(c=c.slice(),f=0,g=c.length;g>f;f++)this.open_node(c[f],d,e);return!0}return c=this.get_node(c),c&&c.id!==a.jstree.root?(e=e===b?this.settings.core.animation:e,this.is_closed(c)?this.is_loaded(c)?(h=this.get_node(c,!0),i=this,h.length&&(e&&h.children(".jstree-children").length&&h.children(".jstree-children").stop(!0,!0),c.children.length&&!this._firstChild(h.children(".jstree-children")[0])&&this.draw_children(c),e?(this.trigger("before_open",{node:c}),h.children(".jstree-children").css("display","none").end().removeClass("jstree-closed").addClass("jstree-open").attr("aria-expanded",!0).children(".jstree-children").stop(!0,!0).slideDown(e,function(){this.style.display="",i.element&&i.trigger("after_open",{node:c})})):(this.trigger("before_open",{node:c}),h[0].className=h[0].className.replace("jstree-closed","jstree-open"),h[0].setAttribute("aria-expanded",!0))),c.state.opened=!0,d&&d.call(this,c,!0),h.length||this.trigger("before_open",{node:c}),this.trigger("open_node",{node:c}),e&&h.length||this.trigger("after_open",{node:c}),!0):this.is_loading(c)?setTimeout(a.proxy(function(){this.open_node(c,d,e)},this),500):void this.load_node(c,function(a,b){return b?this.open_node(a,d,e):d?d.call(this,a,!1):!1}):(d&&d.call(this,c,!1),!1)):!1},_open_to:function(b){if(b=this.get_node(b),!b||b.id===a.jstree.root)return!1;var c,d,e=b.parents;for(c=0,d=e.length;d>c;c+=1)c!==a.jstree.root&&this.open_node(e[c],!1,0);return a("#"+b.id.replace(a.jstree.idregex,"\\$&"),this.element)},close_node:function(c,d){var e,f,g,h;if(a.isArray(c)){for(c=c.slice(),e=0,f=c.length;f>e;e++)this.close_node(c[e],d);return!0}return c=this.get_node(c),c&&c.id!==a.jstree.root?this.is_closed(c)?!1:(d=d===b?this.settings.core.animation:d,g=this,h=this.get_node(c,!0),c.state.opened=!1,this.trigger("close_node",{node:c}),void(h.length?d?h.children(".jstree-children").attr("style","display:block !important").end().removeClass("jstree-open").addClass("jstree-closed").attr("aria-expanded",!1).children(".jstree-children").stop(!0,!0).slideUp(d,function(){this.style.display="",h.children(".jstree-children").remove(),g.element&&g.trigger("after_close",{node:c})}):(h[0].className=h[0].className.replace("jstree-open","jstree-closed"),h.attr("aria-expanded",!1).children(".jstree-children").remove(),this.trigger("after_close",{node:c})):this.trigger("after_close",{node:c}))):!1},toggle_node:function(b){var c,d;if(a.isArray(b)){for(b=b.slice(),c=0,d=b.length;d>c;c++)this.toggle_node(b[c]);return!0}return this.is_closed(b)?this.open_node(b):this.is_open(b)?this.close_node(b):void 0},open_all:function(b,c,d){if(b||(b=a.jstree.root),b=this.get_node(b),!b)return!1;var e=b.id===a.jstree.root?this.get_container_ul():this.get_node(b,!0),f,g,h;if(!e.length){for(f=0,g=b.children_d.length;g>f;f++)this.is_closed(this._model.data[b.children_d[f]])&&(this._model.data[b.children_d[f]].state.opened=!0);return this.trigger("open_all",{node:b})}d=d||e,h=this,e=this.is_closed(b)?e.find(".jstree-closed").addBack():e.find(".jstree-closed"),e.each(function(){h.open_node(this,function(a,b){b&&this.is_parent(a)&&this.open_all(a,c,d)},c||0)}),0===d.find(".jstree-closed").length&&this.trigger("open_all",{node:this.get_node(d)})},close_all:function(b,c){if(b||(b=a.jstree.root),b=this.get_node(b),!b)return!1;var d=b.id===a.jstree.root?this.get_container_ul():this.get_node(b,!0),e=this,f,g;for(d.length&&(d=this.is_open(b)?d.find(".jstree-open").addBack():d.find(".jstree-open"),a(d.get().reverse()).each(function(){e.close_node(this,c||0)})),f=0,g=b.children_d.length;g>f;f++)this._model.data[b.children_d[f]].state.opened=!1;this.trigger("close_all",{node:b})},is_disabled:function(a){return a=this.get_node(a),a&&a.state&&a.state.disabled},enable_node:function(b){var c,d;if(a.isArray(b)){for(b=b.slice(),c=0,d=b.length;d>c;c++)this.enable_node(b[c]);return!0}return b=this.get_node(b),b&&b.id!==a.jstree.root?(b.state.disabled=!1,this.get_node(b,!0).children(".jstree-anchor").removeClass("jstree-disabled").attr("aria-disabled",!1),void this.trigger("enable_node",{node:b})):!1},disable_node:function(b){var c,d;if(a.isArray(b)){for(b=b.slice(),c=0,d=b.length;d>c;c++)this.disable_node(b[c]);return!0}return b=this.get_node(b),b&&b.id!==a.jstree.root?(b.state.disabled=!0,this.get_node(b,!0).children(".jstree-anchor").addClass("jstree-disabled").attr("aria-disabled",!0),void this.trigger("disable_node",{node:b})):!1},is_hidden:function(a){return a=this.get_node(a),a.state.hidden===!0},hide_node:function(b,c){var d,e;if(a.isArray(b)){for(b=b.slice(),d=0,e=b.length;e>d;d++)this.hide_node(b[d],!0);return c||this.redraw(),!0}return b=this.get_node(b),b&&b.id!==a.jstree.root?void(b.state.hidden||(b.state.hidden=!0,this._node_changed(b.parent),c||this.redraw(),this.trigger("hide_node",{node:b}))):!1},show_node:function(b,c){var d,e;if(a.isArray(b)){for(b=b.slice(),d=0,e=b.length;e>d;d++)this.show_node(b[d],!0);return c||this.redraw(),!0}return b=this.get_node(b),b&&b.id!==a.jstree.root?void(b.state.hidden&&(b.state.hidden=!1,this._node_changed(b.parent),c||this.redraw(),this.trigger("show_node",{node:b}))):!1},hide_all:function(b){var c,d=this._model.data,e=[];for(c in d)d.hasOwnProperty(c)&&c!==a.jstree.root&&!d[c].state.hidden&&(d[c].state.hidden=!0,e.push(c));return this._model.force_full_redraw=!0,b||this.redraw(),this.trigger("hide_all",{nodes:e}),e},show_all:function(b){var c,d=this._model.data,e=[];for(c in d)d.hasOwnProperty(c)&&c!==a.jstree.root&&d[c].state.hidden&&(d[c].state.hidden=!1,e.push(c));return this._model.force_full_redraw=!0,b||this.redraw(),this.trigger("show_all",{nodes:e}),e},activate_node:function(a,c){if(this.is_disabled(a))return!1;if(c&&"object"==typeof c||(c={}),this._data.core.last_clicked=this._data.core.last_clicked&&this._data.core.last_clicked.id!==b?this.get_node(this._data.core.last_clicked.id):null,this._data.core.last_clicked&&!this._data.core.last_clicked.state.selected&&(this._data.core.last_clicked=null),!this._data.core.last_clicked&&this._data.core.selected.length&&(this._data.core.last_clicked=this.get_node(this._data.core.selected[this._data.core.selected.length-1])),this.settings.core.multiple&&(c.metaKey||c.ctrlKey||c.shiftKey)&&(!c.shiftKey||this._data.core.last_clicked&&this.get_parent(a)&&this.get_parent(a)===this._data.core.last_clicked.parent))if(c.shiftKey){var d=this.get_node(a).id,e=this._data.core.last_clicked.id,f=this.get_node(this._data.core.last_clicked.parent).children,g=!1,h,i;for(h=0,i=f.length;i>h;h+=1)f[h]===d&&(g=!g),f[h]===e&&(g=!g),this.is_disabled(f[h])||!g&&f[h]!==d&&f[h]!==e?this.deselect_node(f[h],!0,c):this.is_hidden(f[h])||this.select_node(f[h],!0,!1,c);this.trigger("changed",{action:"select_node",node:this.get_node(a),selected:this._data.core.selected,event:c})}else this.is_selected(a)?this.deselect_node(a,!1,c):this.select_node(a,!1,!1,c);else!this.settings.core.multiple&&(c.metaKey||c.ctrlKey||c.shiftKey)&&this.is_selected(a)?this.deselect_node(a,!1,c):(this.deselect_all(!0),this.select_node(a,!1,!1,c),this._data.core.last_clicked=this.get_node(a));this.trigger("activate_node",{node:this.get_node(a),event:c})},hover_node:function(a){if(a=this.get_node(a,!0),!a||!a.length||a.children(".jstree-hovered").length)return!1;var b=this.element.find(".jstree-hovered"),c=this.element;b&&b.length&&this.dehover_node(b),a.children(".jstree-anchor").addClass("jstree-hovered"),this.trigger("hover_node",{node:this.get_node(a)}),setTimeout(function(){c.attr("aria-activedescendant",a[0].id)},0)},dehover_node:function(a){return a=this.get_node(a,!0),a&&a.length&&a.children(".jstree-hovered").length?(a.children(".jstree-anchor").removeClass("jstree-hovered"),void this.trigger("dehover_node",{node:this.get_node(a)})):!1},select_node:function(b,c,d,e){var f,g,h,i;if(a.isArray(b)){for(b=b.slice(),g=0,h=b.length;h>g;g++)this.select_node(b[g],c,d,e);return!0}return b=this.get_node(b),b&&b.id!==a.jstree.root?(f=this.get_node(b,!0),void(b.state.selected||(b.state.selected=!0,this._data.core.selected.push(b.id),d||(f=this._open_to(b)),f&&f.length&&f.attr("aria-selected",!0).children(".jstree-anchor").addClass("jstree-clicked"),this.trigger("select_node",{node:b,selected:this._data.core.selected,event:e}),c||this.trigger("changed",{action:"select_node",node:b,selected:this._data.core.selected,event:e})))):!1},deselect_node:function(b,c,d){var e,f,g;if(a.isArray(b)){for(b=b.slice(),e=0,f=b.length;f>e;e++)this.deselect_node(b[e],c,d);return!0}return b=this.get_node(b),b&&b.id!==a.jstree.root?(g=this.get_node(b,!0),void(b.state.selected&&(b.state.selected=!1,this._data.core.selected=a.vakata.array_remove_item(this._data.core.selected,b.id),g.length&&g.attr("aria-selected",!1).children(".jstree-anchor").removeClass("jstree-clicked"),this.trigger("deselect_node",{node:b,selected:this._data.core.selected,event:d}),c||this.trigger("changed",{action:"deselect_node",node:b,selected:this._data.core.selected,event:d})))):!1},select_all:function(b){var c=this._data.core.selected.concat([]),d,e;for(this._data.core.selected=this._model.data[a.jstree.root].children_d.concat(),d=0,e=this._data.core.selected.length;e>d;d++)this._model.data[this._data.core.selected[d]]&&(this._model.data[this._data.core.selected[d]].state.selected=!0);this.redraw(!0),this.trigger("select_all",{selected:this._data.core.selected}),b||this.trigger("changed",{action:"select_all",selected:this._data.core.selected,old_selection:c})},deselect_all:function(a){var b=this._data.core.selected.concat([]),c,d;for(c=0,d=this._data.core.selected.length;d>c;c++)this._model.data[this._data.core.selected[c]]&&(this._model.data[this._data.core.selected[c]].state.selected=!1);this._data.core.selected=[],this.element.find(".jstree-clicked").removeClass("jstree-clicked").parent().attr("aria-selected",!1),this.trigger("deselect_all",{selected:this._data.core.selected,node:b}),a||this.trigger("changed",{action:"deselect_all",selected:this._data.core.selected,old_selection:b})},is_selected:function(b){return b=this.get_node(b),b&&b.id!==a.jstree.root?b.state.selected:!1},get_selected:function(b){return b?a.map(this._data.core.selected,a.proxy(function(a){return this.get_node(a)},this)):this._data.core.selected.slice()},get_top_selected:function(b){var c=this.get_selected(!0),d={},e,f,g,h;for(e=0,f=c.length;f>e;e++)d[c[e].id]=c[e];for(e=0,f=c.length;f>e;e++)for(g=0,h=c[e].children_d.length;h>g;g++)d[c[e].children_d[g]]&&delete d[c[e].children_d[g]];c=[];for(e in d)d.hasOwnProperty(e)&&c.push(e);return b?a.map(c,a.proxy(function(a){return this.get_node(a)},this)):c},get_bottom_selected:function(b){var c=this.get_selected(!0),d=[],e,f;for(e=0,f=c.length;f>e;e++)c[e].children.length||d.push(c[e].id);return b?a.map(d,a.proxy(function(a){return this.get_node(a)},this)):d},get_state:function(){var b={core:{open:[],loaded:[],scroll:{left:this.element.scrollLeft(),top:this.element.scrollTop()},selected:[]}},c;for(c in this._model.data)this._model.data.hasOwnProperty(c)&&c!==a.jstree.root&&(this._model.data[c].state.loaded&&this.settings.core.loaded_state&&b.core.loaded.push(c),this._model.data[c].state.opened&&b.core.open.push(c),this._model.data[c].state.selected&&b.core.selected.push(c));return b},set_state:function(c,d){if(c){if(c.core&&c.core.selected&&c.core.initial_selection===b&&(c.core.initial_selection=this._data.core.selected.concat([]).sort().join(",")),c.core){var e,f,g,h,i;if(c.core.loaded)return this.settings.core.loaded_state&&a.isArray(c.core.loaded)&&c.core.loaded.length?this._load_nodes(c.core.loaded,function(a){delete c.core.loaded,this.set_state(c,d)}):(delete c.core.loaded,this.set_state(c,d)),!1;if(c.core.open)return a.isArray(c.core.open)&&c.core.open.length?this._load_nodes(c.core.open,function(a){this.open_node(a,!1,0),delete c.core.open,this.set_state(c,d)}):(delete c.core.open,this.set_state(c,d)),!1;if(c.core.scroll)return c.core.scroll&&c.core.scroll.left!==b&&this.element.scrollLeft(c.core.scroll.left),c.core.scroll&&c.core.scroll.top!==b&&this.element.scrollTop(c.core.scroll.top),delete c.core.scroll,this.set_state(c,d),!1;if(c.core.selected)return h=this,(c.core.initial_selection===b||c.core.initial_selection===this._data.core.selected.concat([]).sort().join(","))&&(this.deselect_all(),a.each(c.core.selected,function(a,b){h.select_node(b,!1,!0)})),delete c.core.initial_selection,delete c.core.selected,this.set_state(c,d),!1;for(i in c)c.hasOwnProperty(i)&&"core"!==i&&-1===a.inArray(i,this.settings.plugins)&&delete c[i];if(a.isEmptyObject(c.core))return delete c.core,this.set_state(c,d),!1}return a.isEmptyObject(c)?(c=null,d&&d.call(this),this.trigger("set_state"),!1):!0}return!1},refresh:function(b,c){this._data.core.state=c===!0?{}:this.get_state(),c&&a.isFunction(c)&&(this._data.core.state=c.call(this,this._data.core.state)),this._cnt=0,this._model.data={},this._model.data[a.jstree.root]={id:a.jstree.root,parent:null,parents:[],children:[],children_d:[],state:{loaded:!1}},this._data.core.selected=[],this._data.core.last_clicked=null,this._data.core.focused=null;var d=this.get_container_ul()[0].className;b||(this.element.html("<ul class='"+d+"' role='group'><li class='jstree-initial-node jstree-loading jstree-leaf jstree-last' role='treeitem' id='j"+this._id+"_loading'><i class='jstree-icon jstree-ocl'></i><a class='jstree-anchor' href='#'><i class='jstree-icon jstree-themeicon-hidden'></i>"+this.get_string("Loading ...")+"</a></li></ul>"),this.element.attr("aria-activedescendant","j"+this._id+"_loading")),this.load_node(a.jstree.root,function(b,c){c&&(this.get_container_ul()[0].className=d,this._firstChild(this.get_container_ul()[0])&&this.element.attr("aria-activedescendant",this._firstChild(this.get_container_ul()[0]).id),this.set_state(a.extend(!0,{},this._data.core.state),function(){this.trigger("refresh")})),this._data.core.state=null})},refresh_node:function(b){if(b=this.get_node(b),!b||b.id===a.jstree.root)return!1;var c=[],d=[],e=this._data.core.selected.concat([]);d.push(b.id),b.state.opened===!0&&c.push(b.id),this.get_node(b,!0).find(".jstree-open").each(function(){d.push(this.id),c.push(this.id)}),this._load_nodes(d,a.proxy(function(a){this.open_node(c,!1,0),this.select_node(e),this.trigger("refresh_node",{node:b,nodes:a})},this),!1,!0)},set_id:function(b,c){if(b=this.get_node(b),!b||b.id===a.jstree.root)return!1;var d,e,f=this._model.data,g=b.id;for(c=c.toString(),f[b.parent].children[a.inArray(b.id,f[b.parent].children)]=c,d=0,e=b.parents.length;e>d;d++)f[b.parents[d]].children_d[a.inArray(b.id,f[b.parents[d]].children_d)]=c;for(d=0,e=b.children.length;e>d;d++)f[b.children[d]].parent=c;for(d=0,e=b.children_d.length;e>d;d++)f[b.children_d[d]].parents[a.inArray(b.id,f[b.children_d[d]].parents)]=c;return d=a.inArray(b.id,this._data.core.selected),-1!==d&&(this._data.core.selected[d]=c),d=this.get_node(b.id,!0),d&&(d.attr("id",c),this.element.attr("aria-activedescendant")===b.id&&this.element.attr("aria-activedescendant",c)),delete f[b.id],b.id=c,b.li_attr.id=c,f[c]=b,this.trigger("set_id",{node:b,"new":b.id,old:g}),!0},get_text:function(b){return b=this.get_node(b),b&&b.id!==a.jstree.root?b.text:!1},set_text:function(b,c){var d,e;if(a.isArray(b)){for(b=b.slice(),d=0,e=b.length;e>d;d++)this.set_text(b[d],c);return!0}return b=this.get_node(b),b&&b.id!==a.jstree.root?(b.text=c,this.get_node(b,!0).length&&this.redraw_node(b.id),this.trigger("set_text",{obj:b,text:c}),!0):!1},get_json:function(b,c,d){if(b=this.get_node(b||a.jstree.root),!b)return!1;c&&c.flat&&!d&&(d=[]);var e={id:b.id,text:b.text,icon:this.get_icon(b),li_attr:a.extend(!0,{},b.li_attr),a_attr:a.extend(!0,{},b.a_attr),state:{},data:c&&c.no_data?!1:a.extend(!0,a.isArray(b.data)?[]:{},b.data)},f,g;if(c&&c.flat?e.parent=b.parent:e.children=[],c&&c.no_state)delete e.state;else for(f in b.state)b.state.hasOwnProperty(f)&&(e.state[f]=b.state[f]);if(c&&c.no_li_attr&&delete e.li_attr,c&&c.no_a_attr&&delete e.a_attr,c&&c.no_id&&(delete e.id,e.li_attr&&e.li_attr.id&&delete e.li_attr.id,e.a_attr&&e.a_attr.id&&delete e.a_attr.id),c&&c.flat&&b.id!==a.jstree.root&&d.push(e),!c||!c.no_children)for(f=0,g=b.children.length;g>f;f++)c&&c.flat?this.get_json(b.children[f],c,d):e.children.push(this.get_json(b.children[f],c));return c&&c.flat?d:b.id===a.jstree.root?e.children:e},create_node:function(c,d,e,f,g){if(null===c&&(c=a.jstree.root),c=this.get_node(c),!c)return!1;if(e=e===b?"last":e,!e.toString().match(/^(before|after)$/)&&!g&&!this.is_loaded(c))return this.load_node(c,function(){this.create_node(c,d,e,f,!0)});d||(d={text:this.get_string("New node")}),d="string"==typeof d?{text:d}:a.extend(!0,{},d),d.text===b&&(d.text=this.get_string("New node"));var h,i,j,k;switch(c.id===a.jstree.root&&("before"===e&&(e="first"),"after"===e&&(e="last")),e){case"before":h=this.get_node(c.parent),e=a.inArray(c.id,h.children),c=h;break;case"after":h=this.get_node(c.parent),e=a.inArray(c.id,h.children)+1,c=h;break;case"inside":case"first":e=0;break;case"last":e=c.children.length;break;default:e||(e=0)}if(e>c.children.length&&(e=c.children.length),d.id||(d.id=!0),!this.check("create_node",d,c,e))return this.settings.core.error.call(this,this._data.core.last_error),!1;if(d.id===!0&&delete d.id,d=this._parse_model_from_json(d,c.id,c.parents.concat()),!d)return!1;for(h=this.get_node(d),i=[],i.push(d),i=i.concat(h.children_d),this.trigger("model",{nodes:i,parent:c.id}),c.children_d=c.children_d.concat(i),j=0,k=c.parents.length;k>j;j++)this._model.data[c.parents[j]].children_d=this._model.data[c.parents[j]].children_d.concat(i);for(d=h,h=[],j=0,k=c.children.length;k>j;j++)h[j>=e?j+1:j]=c.children[j];return h[e]=d.id,c.children=h,this.redraw_node(c,!0),this.trigger("create_node",{node:this.get_node(d),parent:c.id,position:e}),f&&f.call(this,this.get_node(d)),d.id},rename_node:function(b,c){var d,e,f;if(a.isArray(b)){for(b=b.slice(),d=0,e=b.length;e>d;d++)this.rename_node(b[d],c);return!0}return b=this.get_node(b),b&&b.id!==a.jstree.root?(f=b.text,this.check("rename_node",b,this.get_parent(b),c)?(this.set_text(b,c),this.trigger("rename_node",{node:b,text:c,old:f}),!0):(this.settings.core.error.call(this,this._data.core.last_error),!1)):!1},delete_node:function(b){var c,d,e,f,g,h,i,j,k,l,m,n;if(a.isArray(b)){for(b=b.slice(),c=0,d=b.length;d>c;c++)this.delete_node(b[c]);return!0}if(b=this.get_node(b),!b||b.id===a.jstree.root)return!1;if(e=this.get_node(b.parent),f=a.inArray(b.id,e.children),l=!1,!this.check("delete_node",b,e,f))return this.settings.core.error.call(this,this._data.core.last_error),!1;for(-1!==f&&(e.children=a.vakata.array_remove(e.children,f)),g=b.children_d.concat([]),g.push(b.id),h=0,i=b.parents.length;i>h;h++)this._model.data[b.parents[h]].children_d=a.vakata.array_filter(this._model.data[b.parents[h]].children_d,function(b){return-1===a.inArray(b,g)});for(j=0,k=g.length;k>j;j++)if(this._model.data[g[j]].state.selected){l=!0;break}for(l&&(this._data.core.selected=a.vakata.array_filter(this._data.core.selected,function(b){return-1===a.inArray(b,g)})),this.trigger("delete_node",{node:b,parent:e.id}),l&&this.trigger("changed",{action:"delete_node",node:b,selected:this._data.core.selected,parent:e.id}),j=0,k=g.length;k>j;j++)delete this._model.data[g[j]];return-1!==a.inArray(this._data.core.focused,g)&&(this._data.core.focused=null,m=this.element[0].scrollTop,n=this.element[0].scrollLeft,e.id===a.jstree.root?this._model.data[a.jstree.root].children[0]&&this.get_node(this._model.data[a.jstree.root].children[0],!0).children(".jstree-anchor").focus():this.get_node(e,!0).children(".jstree-anchor").focus(),this.element[0].scrollTop=m,this.element[0].scrollLeft=n),this.redraw_node(e,!0),!0},check:function(b,c,d,e,f){c=c&&c.id?c:this.get_node(c),d=d&&d.id?d:this.get_node(d);var g=b.match(/^move_node|copy_node|create_node$/i)?d:c,h=this.settings.core.check_callback;return"move_node"!==b&&"copy_node"!==b||f&&f.is_multi||c.id!==d.id&&("move_node"!==b||a.inArray(c.id,d.children)!==e)&&-1===a.inArray(d.id,c.children_d)?(g&&g.data&&(g=g.data),g&&g.functions&&(g.functions[b]===!1||g.functions[b]===!0)?(g.functions[b]===!1&&(this._data.core.last_error={error:"check",plugin:"core",id:"core_02",reason:"Node data prevents function: "+b,data:JSON.stringify({chk:b,pos:e,obj:c&&c.id?c.id:!1,par:d&&d.id?d.id:!1})}),g.functions[b]):h===!1||a.isFunction(h)&&h.call(this,b,c,d,e,f)===!1||h&&h[b]===!1?(this._data.core.last_error={error:"check",plugin:"core",id:"core_03",reason:"User config for core.check_callback prevents function: "+b,data:JSON.stringify({chk:b,pos:e,obj:c&&c.id?c.id:!1,par:d&&d.id?d.id:!1})},!1):!0):(this._data.core.last_error={error:"check",plugin:"core",id:"core_01",reason:"Moving parent inside child",data:JSON.stringify({chk:b,pos:e,obj:c&&c.id?c.id:!1,par:d&&d.id?d.id:!1})},!1)},last_error:function(){return this._data.core.last_error},move_node:function(c,d,e,f,g,h,i){var j,k,l,m,n,o,p,q,r,s,t,u,v,w;if(d=this.get_node(d),e=e===b?0:e,!d)return!1;if(!e.toString().match(/^(before|after)$/)&&!g&&!this.is_loaded(d))return this.load_node(d,function(){this.move_node(c,d,e,f,!0,!1,i)});if(a.isArray(c)){if(1!==c.length){for(j=0,k=c.length;k>j;j++)(r=this.move_node(c[j],d,e,f,g,!1,i))&&(d=r,e="after");return this.redraw(),!0}c=c[0]}if(c=c&&c.id?c:this.get_node(c),!c||c.id===a.jstree.root)return!1;if(l=(c.parent||a.jstree.root).toString(),n=e.toString().match(/^(before|after)$/)&&d.id!==a.jstree.root?this.get_node(d.parent):d,o=i?i:this._model.data[c.id]?this:a.jstree.reference(c.id),p=!o||!o._id||this._id!==o._id,m=o&&o._id&&l&&o._model.data[l]&&o._model.data[l].children?a.inArray(c.id,o._model.data[l].children):-1,o&&o._id&&(c=o._model.data[c.id]),p)return(r=this.copy_node(c,d,e,f,g,!1,i))?(o&&o.delete_node(c),r):!1;switch(d.id===a.jstree.root&&("before"===e&&(e="first"),"after"===e&&(e="last")),e){case"before":e=a.inArray(d.id,n.children);break;case"after":e=a.inArray(d.id,n.children)+1;break;case"inside":case"first":e=0;break;case"last":e=n.children.length;break;default:e||(e=0)}if(e>n.children.length&&(e=n.children.length),!this.check("move_node",c,n,e,{core:!0,origin:i,is_multi:o&&o._id&&o._id!==this._id,is_foreign:!o||!o._id}))return this.settings.core.error.call(this,this._data.core.last_error),!1;if(c.parent===n.id){for(q=n.children.concat(),r=a.inArray(c.id,q),-1!==r&&(q=a.vakata.array_remove(q,r),e>r&&e--),r=[],s=0,t=q.length;t>s;s++)r[s>=e?s+1:s]=q[s];r[e]=c.id,n.children=r,this._node_changed(n.id),this.redraw(n.id===a.jstree.root)}else{for(r=c.children_d.concat(),r.push(c.id),s=0,t=c.parents.length;t>s;s++){for(q=[],w=o._model.data[c.parents[s]].children_d,u=0,v=w.length;v>u;u++)-1===a.inArray(w[u],r)&&q.push(w[u]);o._model.data[c.parents[s]].children_d=q}for(o._model.data[l].children=a.vakata.array_remove_item(o._model.data[l].children,c.id),s=0,t=n.parents.length;t>s;s++)this._model.data[n.parents[s]].children_d=this._model.data[n.parents[s]].children_d.concat(r);for(q=[],s=0,t=n.children.length;t>s;s++)q[s>=e?s+1:s]=n.children[s];for(q[e]=c.id,n.children=q,n.children_d.push(c.id),n.children_d=n.children_d.concat(c.children_d),c.parent=n.id,r=n.parents.concat(),r.unshift(n.id),w=c.parents.length,c.parents=r,r=r.concat(),s=0,t=c.children_d.length;t>s;s++)this._model.data[c.children_d[s]].parents=this._model.data[c.children_d[s]].parents.slice(0,-1*w),Array.prototype.push.apply(this._model.data[c.children_d[s]].parents,r);(l===a.jstree.root||n.id===a.jstree.root)&&(this._model.force_full_redraw=!0),this._model.force_full_redraw||(this._node_changed(l),this._node_changed(n.id)),h||this.redraw()}return f&&f.call(this,c,n,e),this.trigger("move_node",{node:c,parent:n.id,position:e,old_parent:l,old_position:m,is_multi:o&&o._id&&o._id!==this._id,is_foreign:!o||!o._id,old_instance:o,new_instance:this}),c.id},copy_node:function(c,d,e,f,g,h,i){var j,k,l,m,n,o,p,q,r,s,t;if(d=this.get_node(d),e=e===b?0:e,!d)return!1;if(!e.toString().match(/^(before|after)$/)&&!g&&!this.is_loaded(d))return this.load_node(d,function(){this.copy_node(c,d,e,f,!0,!1,i)});if(a.isArray(c)){if(1!==c.length){for(j=0,k=c.length;k>j;j++)(m=this.copy_node(c[j],d,e,f,g,!0,i))&&(d=m,e="after");return this.redraw(),!0}c=c[0]}if(c=c&&c.id?c:this.get_node(c),!c||c.id===a.jstree.root)return!1;switch(q=(c.parent||a.jstree.root).toString(),r=e.toString().match(/^(before|after)$/)&&d.id!==a.jstree.root?this.get_node(d.parent):d,s=i?i:this._model.data[c.id]?this:a.jstree.reference(c.id),t=!s||!s._id||this._id!==s._id,s&&s._id&&(c=s._model.data[c.id]),d.id===a.jstree.root&&("before"===e&&(e="first"),"after"===e&&(e="last")),e){case"before":e=a.inArray(d.id,r.children);break;case"after":e=a.inArray(d.id,r.children)+1;break;case"inside":case"first":e=0;break;case"last":e=r.children.length;break;default:e||(e=0)}if(e>r.children.length&&(e=r.children.length),!this.check("copy_node",c,r,e,{core:!0,origin:i,is_multi:s&&s._id&&s._id!==this._id,is_foreign:!s||!s._id}))return this.settings.core.error.call(this,this._data.core.last_error),!1;if(p=s?s.get_json(c,{no_id:!0,no_data:!0,no_state:!0}):c,!p)return!1;if(p.id===!0&&delete p.id,p=this._parse_model_from_json(p,r.id,r.parents.concat()),!p)return!1;for(m=this.get_node(p),c&&c.state&&c.state.loaded===!1&&(m.state.loaded=!1),l=[],l.push(p),l=l.concat(m.children_d),this.trigger("model",{nodes:l,parent:r.id}),n=0,o=r.parents.length;o>n;n++)this._model.data[r.parents[n]].children_d=this._model.data[r.parents[n]].children_d.concat(l);for(l=[],n=0,o=r.children.length;o>n;n++)l[n>=e?n+1:n]=r.children[n];return l[e]=m.id,r.children=l,r.children_d.push(m.id),r.children_d=r.children_d.concat(m.children_d),r.id===a.jstree.root&&(this._model.force_full_redraw=!0),this._model.force_full_redraw||this._node_changed(r.id),h||this.redraw(r.id===a.jstree.root),f&&f.call(this,m,r,e),this.trigger("copy_node",{node:m,original:c,parent:r.id,position:e,old_parent:q,old_position:s&&s._id&&q&&s._model.data[q]&&s._model.data[q].children?a.inArray(c.id,s._model.data[q].children):-1,is_multi:s&&s._id&&s._id!==this._id,is_foreign:!s||!s._id,old_instance:s,new_instance:this}),m.id},cut:function(b){if(b||(b=this._data.core.selected.concat()),a.isArray(b)||(b=[b]),!b.length)return!1;var c=[],g,h,i;for(h=0,i=b.length;i>h;h++)g=this.get_node(b[h]),g&&g.id&&g.id!==a.jstree.root&&c.push(g);
return c.length?(d=c,f=this,e="move_node",void this.trigger("cut",{node:b})):!1},copy:function(b){if(b||(b=this._data.core.selected.concat()),a.isArray(b)||(b=[b]),!b.length)return!1;var c=[],g,h,i;for(h=0,i=b.length;i>h;h++)g=this.get_node(b[h]),g&&g.id&&g.id!==a.jstree.root&&c.push(g);return c.length?(d=c,f=this,e="copy_node",void this.trigger("copy",{node:b})):!1},get_buffer:function(){return{mode:e,node:d,inst:f}},can_paste:function(){return e!==!1&&d!==!1},paste:function(a,b){return a=this.get_node(a),a&&e&&e.match(/^(copy_node|move_node)$/)&&d?(this[e](d,a,b,!1,!1,!1,f)&&this.trigger("paste",{parent:a.id,node:d,mode:e}),d=!1,e=!1,void(f=!1)):!1},clear_buffer:function(){d=!1,e=!1,f=!1,this.trigger("clear_buffer")},edit:function(b,c,d){var e,f,g,h,j,k,l,m,n,o=!1;return(b=this.get_node(b))?this.check("edit",b,this.get_parent(b))?(n=b,c="string"==typeof c?c:b.text,this.set_text(b,""),b=this._open_to(b),n.text=c,e=this._data.core.rtl,f=this.element.width(),this._data.core.focused=n.id,g=b.children(".jstree-anchor").focus(),h=a("<span>"),j=c,k=a("<div />",{css:{position:"absolute",top:"-200px",left:e?"0px":"-1000px",visibility:"hidden"}}).appendTo(i.body),l=a("<input />",{value:j,"class":"jstree-rename-input",css:{padding:"0",border:"1px solid silver","box-sizing":"border-box",display:"inline-block",height:this._data.core.li_height+"px",lineHeight:this._data.core.li_height+"px",width:"150px"},blur:a.proxy(function(c){c.stopImmediatePropagation(),c.preventDefault();var e=h.children(".jstree-rename-input"),f=e.val(),i=this.settings.core.force_text,m;""===f&&(f=j),k.remove(),h.replaceWith(g),h.remove(),j=i?j:a("<div></div>").append(a.parseHTML(j)).html(),b=this.get_node(b),this.set_text(b,j),m=!!this.rename_node(b,i?a("<div></div>").text(f).text():a("<div></div>").append(a.parseHTML(f)).html()),m||this.set_text(b,j),this._data.core.focused=n.id,setTimeout(a.proxy(function(){var a=this.get_node(n.id,!0);a.length&&(this._data.core.focused=n.id,a.children(".jstree-anchor").focus())},this),0),d&&d.call(this,n,m,o),l=null},this),keydown:function(a){var b=a.which;27===b&&(o=!0,this.value=j),(27===b||13===b||37===b||38===b||39===b||40===b||32===b)&&a.stopImmediatePropagation(),(27===b||13===b)&&(a.preventDefault(),this.blur())},click:function(a){a.stopImmediatePropagation()},mousedown:function(a){a.stopImmediatePropagation()},keyup:function(a){l.width(Math.min(k.text("pW"+this.value).width(),f))},keypress:function(a){return 13===a.which?!1:void 0}}),m={fontFamily:g.css("fontFamily")||"",fontSize:g.css("fontSize")||"",fontWeight:g.css("fontWeight")||"",fontStyle:g.css("fontStyle")||"",fontStretch:g.css("fontStretch")||"",fontVariant:g.css("fontVariant")||"",letterSpacing:g.css("letterSpacing")||"",wordSpacing:g.css("wordSpacing")||""},h.attr("class",g.attr("class")).append(g.contents().clone()).append(l),g.replaceWith(h),k.css(m),l.css(m).width(Math.min(k.text("pW"+l[0].value).width(),f))[0].select(),void a(i).one("mousedown.jstree touchstart.jstree dnd_start.vakata",function(b){l&&b.target!==l&&a(l).blur()})):(this.settings.core.error.call(this,this._data.core.last_error),!1):!1},set_theme:function(b,c){if(!b)return!1;if(c===!0){var d=this.settings.core.themes.dir;d||(d=a.jstree.path+"/themes"),c=d+"/"+b+"/style.css"}c&&-1===a.inArray(c,g)&&(a("head").append('<link rel="stylesheet" href="'+c+'" type="text/css" />'),g.push(c)),this._data.core.themes.name&&this.element.removeClass("jstree-"+this._data.core.themes.name),this._data.core.themes.name=b,this.element.addClass("jstree-"+b),this.element[this.settings.core.themes.responsive?"addClass":"removeClass"]("jstree-"+b+"-responsive"),this.trigger("set_theme",{theme:b})},get_theme:function(){return this._data.core.themes.name},set_theme_variant:function(a){this._data.core.themes.variant&&this.element.removeClass("jstree-"+this._data.core.themes.name+"-"+this._data.core.themes.variant),this._data.core.themes.variant=a,a&&this.element.addClass("jstree-"+this._data.core.themes.name+"-"+this._data.core.themes.variant)},get_theme_variant:function(){return this._data.core.themes.variant},show_stripes:function(){this._data.core.themes.stripes=!0,this.get_container_ul().addClass("jstree-striped"),this.trigger("show_stripes")},hide_stripes:function(){this._data.core.themes.stripes=!1,this.get_container_ul().removeClass("jstree-striped"),this.trigger("hide_stripes")},toggle_stripes:function(){this._data.core.themes.stripes?this.hide_stripes():this.show_stripes()},show_dots:function(){this._data.core.themes.dots=!0,this.get_container_ul().removeClass("jstree-no-dots"),this.trigger("show_dots")},hide_dots:function(){this._data.core.themes.dots=!1,this.get_container_ul().addClass("jstree-no-dots"),this.trigger("hide_dots")},toggle_dots:function(){this._data.core.themes.dots?this.hide_dots():this.show_dots()},show_icons:function(){this._data.core.themes.icons=!0,this.get_container_ul().removeClass("jstree-no-icons"),this.trigger("show_icons")},hide_icons:function(){this._data.core.themes.icons=!1,this.get_container_ul().addClass("jstree-no-icons"),this.trigger("hide_icons")},toggle_icons:function(){this._data.core.themes.icons?this.hide_icons():this.show_icons()},show_ellipsis:function(){this._data.core.themes.ellipsis=!0,this.get_container_ul().addClass("jstree-ellipsis"),this.trigger("show_ellipsis")},hide_ellipsis:function(){this._data.core.themes.ellipsis=!1,this.get_container_ul().removeClass("jstree-ellipsis"),this.trigger("hide_ellipsis")},toggle_ellipsis:function(){this._data.core.themes.ellipsis?this.hide_ellipsis():this.show_ellipsis()},set_icon:function(c,d){var e,f,g,h;if(a.isArray(c)){for(c=c.slice(),e=0,f=c.length;f>e;e++)this.set_icon(c[e],d);return!0}return c=this.get_node(c),c&&c.id!==a.jstree.root?(h=c.icon,c.icon=d===!0||null===d||d===b||""===d?!0:d,g=this.get_node(c,!0).children(".jstree-anchor").children(".jstree-themeicon"),d===!1?(g.removeClass("jstree-themeicon-custom "+h).css("background","").removeAttr("rel"),this.hide_icon(c)):d===!0||null===d||d===b||""===d?(g.removeClass("jstree-themeicon-custom "+h).css("background","").removeAttr("rel"),h===!1&&this.show_icon(c)):-1===d.indexOf("/")&&-1===d.indexOf(".")?(g.removeClass(h).css("background",""),g.addClass(d+" jstree-themeicon-custom").attr("rel",d),h===!1&&this.show_icon(c)):(g.removeClass(h).css("background",""),g.addClass("jstree-themeicon-custom").css("background","url('"+d+"') center center no-repeat").attr("rel",d),h===!1&&this.show_icon(c)),!0):!1},get_icon:function(b){return b=this.get_node(b),b&&b.id!==a.jstree.root?b.icon:!1},hide_icon:function(b){var c,d;if(a.isArray(b)){for(b=b.slice(),c=0,d=b.length;d>c;c++)this.hide_icon(b[c]);return!0}return b=this.get_node(b),b&&b!==a.jstree.root?(b.icon=!1,this.get_node(b,!0).children(".jstree-anchor").children(".jstree-themeicon").addClass("jstree-themeicon-hidden"),!0):!1},show_icon:function(b){var c,d,e;if(a.isArray(b)){for(b=b.slice(),c=0,d=b.length;d>c;c++)this.show_icon(b[c]);return!0}return b=this.get_node(b),b&&b!==a.jstree.root?(e=this.get_node(b,!0),b.icon=e.length?e.children(".jstree-anchor").children(".jstree-themeicon").attr("rel"):!0,b.icon||(b.icon=!0),e.children(".jstree-anchor").children(".jstree-themeicon").removeClass("jstree-themeicon-hidden"),!0):!1}},a.vakata={},a.vakata.attributes=function(b,c){b=a(b)[0];var d=c?{}:[];return b&&b.attributes&&a.each(b.attributes,function(b,e){-1===a.inArray(e.name.toLowerCase(),["style","contenteditable","hasfocus","tabindex"])&&null!==e.value&&""!==a.trim(e.value)&&(c?d[e.name]=e.value:d.push(e.name))}),d},a.vakata.array_unique=function(a){var c=[],d,e,f,g={};for(d=0,f=a.length;f>d;d++)g[a[d]]===b&&(c.push(a[d]),g[a[d]]=!0);return c},a.vakata.array_remove=function(a,b){return a.splice(b,1),a},a.vakata.array_remove_item=function(b,c){var d=a.inArray(c,b);return-1!==d?a.vakata.array_remove(b,d):b},a.vakata.array_filter=function(a,b,c,d,e){if(a.filter)return a.filter(b,c);d=[];for(e in a)~~e+""==e+""&&e>=0&&b.call(c,a[e],+e,a)&&d.push(a[e]);return d},a.jstree.plugins.changed=function(a,b){var c=[];this.trigger=function(a,d){var e,f;if(d||(d={}),"changed"===a.replace(".jstree","")){d.changed={selected:[],deselected:[]};var g={};for(e=0,f=c.length;f>e;e++)g[c[e]]=1;for(e=0,f=d.selected.length;f>e;e++)g[d.selected[e]]?g[d.selected[e]]=2:d.changed.selected.push(d.selected[e]);for(e=0,f=c.length;f>e;e++)1===g[c[e]]&&d.changed.deselected.push(c[e]);c=d.selected.slice()}b.trigger.call(this,a,d)},this.refresh=function(a,d){return c=[],b.refresh.apply(this,arguments)}};var j=i.createElement("I");j.className="jstree-icon jstree-checkbox",j.setAttribute("role","presentation"),a.jstree.defaults.checkbox={visible:!0,three_state:!0,whole_node:!0,keep_selected_style:!0,cascade:"",tie_selection:!0,cascade_to_disabled:!0,cascade_to_hidden:!0},a.jstree.plugins.checkbox=function(c,d){this.bind=function(){d.bind.call(this),this._data.checkbox.uto=!1,this._data.checkbox.selected=[],this.settings.checkbox.three_state&&(this.settings.checkbox.cascade="up+down+undetermined"),this.element.on("init.jstree",a.proxy(function(){this._data.checkbox.visible=this.settings.checkbox.visible,this.settings.checkbox.keep_selected_style||this.element.addClass("jstree-checkbox-no-clicked"),this.settings.checkbox.tie_selection&&this.element.addClass("jstree-checkbox-selection")},this)).on("loading.jstree",a.proxy(function(){this[this._data.checkbox.visible?"show_checkboxes":"hide_checkboxes"]()},this)),-1!==this.settings.checkbox.cascade.indexOf("undetermined")&&this.element.on("changed.jstree uncheck_node.jstree check_node.jstree uncheck_all.jstree check_all.jstree move_node.jstree copy_node.jstree redraw.jstree open_node.jstree",a.proxy(function(){this._data.checkbox.uto&&clearTimeout(this._data.checkbox.uto),this._data.checkbox.uto=setTimeout(a.proxy(this._undetermined,this),50)},this)),this.settings.checkbox.tie_selection||this.element.on("model.jstree",a.proxy(function(a,b){var c=this._model.data,d=c[b.parent],e=b.nodes,f,g;for(f=0,g=e.length;g>f;f++)c[e[f]].state.checked=c[e[f]].state.checked||c[e[f]].original&&c[e[f]].original.state&&c[e[f]].original.state.checked,c[e[f]].state.checked&&this._data.checkbox.selected.push(e[f])},this)),(-1!==this.settings.checkbox.cascade.indexOf("up")||-1!==this.settings.checkbox.cascade.indexOf("down"))&&this.element.on("model.jstree",a.proxy(function(b,c){var d=this._model.data,e=d[c.parent],f=c.nodes,g=[],h,i,j,k,l,m,n=this.settings.checkbox.cascade,o=this.settings.checkbox.tie_selection;if(-1!==n.indexOf("down"))if(e.state[o?"selected":"checked"]){for(i=0,j=f.length;j>i;i++)d[f[i]].state[o?"selected":"checked"]=!0;this._data[o?"core":"checkbox"].selected=this._data[o?"core":"checkbox"].selected.concat(f)}else for(i=0,j=f.length;j>i;i++)if(d[f[i]].state[o?"selected":"checked"]){for(k=0,l=d[f[i]].children_d.length;l>k;k++)d[d[f[i]].children_d[k]].state[o?"selected":"checked"]=!0;this._data[o?"core":"checkbox"].selected=this._data[o?"core":"checkbox"].selected.concat(d[f[i]].children_d)}if(-1!==n.indexOf("up")){for(i=0,j=e.children_d.length;j>i;i++)d[e.children_d[i]].children.length||g.push(d[e.children_d[i]].parent);for(g=a.vakata.array_unique(g),k=0,l=g.length;l>k;k++){e=d[g[k]];while(e&&e.id!==a.jstree.root){for(h=0,i=0,j=e.children.length;j>i;i++)h+=d[e.children[i]].state[o?"selected":"checked"];if(h!==j)break;e.state[o?"selected":"checked"]=!0,this._data[o?"core":"checkbox"].selected.push(e.id),m=this.get_node(e,!0),m&&m.length&&m.attr("aria-selected",!0).children(".jstree-anchor").addClass(o?"jstree-clicked":"jstree-checked"),e=this.get_node(e.parent)}}}this._data[o?"core":"checkbox"].selected=a.vakata.array_unique(this._data[o?"core":"checkbox"].selected)},this)).on(this.settings.checkbox.tie_selection?"select_node.jstree":"check_node.jstree",a.proxy(function(b,c){var d=this,e=c.node,f=this._model.data,g=this.get_node(e.parent),h,i,j,k,l=this.settings.checkbox.cascade,m=this.settings.checkbox.tie_selection,n={},o=this._data[m?"core":"checkbox"].selected;for(h=0,i=o.length;i>h;h++)n[o[h]]=!0;if(-1!==l.indexOf("down")){var p=this._cascade_new_checked_state(e.id,!0),q=e.children_d.concat(e.id);for(h=0,i=q.length;i>h;h++)p.indexOf(q[h])>-1?n[q[h]]=!0:delete n[q[h]]}if(-1!==l.indexOf("up"))while(g&&g.id!==a.jstree.root){for(j=0,h=0,i=g.children.length;i>h;h++)j+=f[g.children[h]].state[m?"selected":"checked"];if(j!==i)break;g.state[m?"selected":"checked"]=!0,n[g.id]=!0,k=this.get_node(g,!0),k&&k.length&&k.attr("aria-selected",!0).children(".jstree-anchor").addClass(m?"jstree-clicked":"jstree-checked"),g=this.get_node(g.parent)}o=[];for(h in n)n.hasOwnProperty(h)&&o.push(h);this._data[m?"core":"checkbox"].selected=o},this)).on(this.settings.checkbox.tie_selection?"deselect_all.jstree":"uncheck_all.jstree",a.proxy(function(b,c){var d=this.get_node(a.jstree.root),e=this._model.data,f,g,h;for(f=0,g=d.children_d.length;g>f;f++)h=e[d.children_d[f]],h&&h.original&&h.original.state&&h.original.state.undetermined&&(h.original.state.undetermined=!1)},this)).on(this.settings.checkbox.tie_selection?"deselect_node.jstree":"uncheck_node.jstree",a.proxy(function(a,b){var c=this,d=b.node,e=this.get_node(d,!0),f,g,h,i=this.settings.checkbox.cascade,j=this.settings.checkbox.tie_selection,k=this._data[j?"core":"checkbox"].selected,l={},m=[],n=d.children_d.concat(d.id);if(-1!==i.indexOf("down")){var o=this._cascade_new_checked_state(d.id,!1);k=k.filter(function(a){return-1===n.indexOf(a)||o.indexOf(a)>-1})}if(-1!==i.indexOf("up")&&-1===k.indexOf(d.id)){for(f=0,g=d.parents.length;g>f;f++)h=this._model.data[d.parents[f]],h.state[j?"selected":"checked"]=!1,h&&h.original&&h.original.state&&h.original.state.undetermined&&(h.original.state.undetermined=!1),h=this.get_node(d.parents[f],!0),h&&h.length&&h.attr("aria-selected",!1).children(".jstree-anchor").removeClass(j?"jstree-clicked":"jstree-checked");k=k.filter(function(a){return-1===d.parents.indexOf(a)})}this._data[j?"core":"checkbox"].selected=k},this)),-1!==this.settings.checkbox.cascade.indexOf("up")&&this.element.on("delete_node.jstree",a.proxy(function(b,c){var d=this.get_node(c.parent),e=this._model.data,f,g,h,i,j=this.settings.checkbox.tie_selection;while(d&&d.id!==a.jstree.root&&!d.state[j?"selected":"checked"]){for(h=0,f=0,g=d.children.length;g>f;f++)h+=e[d.children[f]].state[j?"selected":"checked"];if(!(g>0&&h===g))break;d.state[j?"selected":"checked"]=!0,this._data[j?"core":"checkbox"].selected.push(d.id),i=this.get_node(d,!0),i&&i.length&&i.attr("aria-selected",!0).children(".jstree-anchor").addClass(j?"jstree-clicked":"jstree-checked"),d=this.get_node(d.parent)}},this)).on("move_node.jstree",a.proxy(function(b,c){var d=c.is_multi,e=c.old_parent,f=this.get_node(c.parent),g=this._model.data,h,i,j,k,l,m=this.settings.checkbox.tie_selection;if(!d){h=this.get_node(e);while(h&&h.id!==a.jstree.root&&!h.state[m?"selected":"checked"]){for(i=0,j=0,k=h.children.length;k>j;j++)i+=g[h.children[j]].state[m?"selected":"checked"];if(!(k>0&&i===k))break;h.state[m?"selected":"checked"]=!0,this._data[m?"core":"checkbox"].selected.push(h.id),l=this.get_node(h,!0),l&&l.length&&l.attr("aria-selected",!0).children(".jstree-anchor").addClass(m?"jstree-clicked":"jstree-checked"),h=this.get_node(h.parent)}}h=f;while(h&&h.id!==a.jstree.root){for(i=0,j=0,k=h.children.length;k>j;j++)i+=g[h.children[j]].state[m?"selected":"checked"];if(i===k)h.state[m?"selected":"checked"]||(h.state[m?"selected":"checked"]=!0,this._data[m?"core":"checkbox"].selected.push(h.id),l=this.get_node(h,!0),l&&l.length&&l.attr("aria-selected",!0).children(".jstree-anchor").addClass(m?"jstree-clicked":"jstree-checked"));else{if(!h.state[m?"selected":"checked"])break;h.state[m?"selected":"checked"]=!1,this._data[m?"core":"checkbox"].selected=a.vakata.array_remove_item(this._data[m?"core":"checkbox"].selected,h.id),l=this.get_node(h,!0),l&&l.length&&l.attr("aria-selected",!1).children(".jstree-anchor").removeClass(m?"jstree-clicked":"jstree-checked")}h=this.get_node(h.parent)}},this))},this.get_undetermined=function(c){if(-1===this.settings.checkbox.cascade.indexOf("undetermined"))return[];var d,e,f,g,h={},i=this._model.data,j=this.settings.checkbox.tie_selection,k=this._data[j?"core":"checkbox"].selected,l=[],m=this,n=[];for(d=0,e=k.length;e>d;d++)if(i[k[d]]&&i[k[d]].parents)for(f=0,g=i[k[d]].parents.length;g>f;f++){if(h[i[k[d]].parents[f]]!==b)break;i[k[d]].parents[f]!==a.jstree.root&&(h[i[k[d]].parents[f]]=!0,l.push(i[k[d]].parents[f]))}for(this.element.find(".jstree-closed").not(":has(.jstree-children)").each(function(){var c=m.get_node(this),j;if(c)if(c.state.loaded){for(d=0,e=c.children_d.length;e>d;d++)if(j=i[c.children_d[d]],!j.state.loaded&&j.original&&j.original.state&&j.original.state.undetermined&&j.original.state.undetermined===!0)for(h[j.id]===b&&j.id!==a.jstree.root&&(h[j.id]=!0,l.push(j.id)),f=0,g=j.parents.length;g>f;f++)h[j.parents[f]]===b&&j.parents[f]!==a.jstree.root&&(h[j.parents[f]]=!0,l.push(j.parents[f]))}else if(c.original&&c.original.state&&c.original.state.undetermined&&c.original.state.undetermined===!0)for(h[c.id]===b&&c.id!==a.jstree.root&&(h[c.id]=!0,l.push(c.id)),f=0,g=c.parents.length;g>f;f++)h[c.parents[f]]===b&&c.parents[f]!==a.jstree.root&&(h[c.parents[f]]=!0,l.push(c.parents[f]))}),d=0,e=l.length;e>d;d++)i[l[d]].state[j?"selected":"checked"]||n.push(c?i[l[d]]:l[d]);return n},this._undetermined=function(){if(null!==this.element){var a=this.get_undetermined(!1),b,c,d;for(this.element.find(".jstree-undetermined").removeClass("jstree-undetermined"),b=0,c=a.length;c>b;b++)d=this.get_node(a[b],!0),d&&d.length&&d.children(".jstree-anchor").children(".jstree-checkbox").addClass("jstree-undetermined")}},this.redraw_node=function(b,c,e,f){if(b=d.redraw_node.apply(this,arguments)){var g,h,i=null,k=null;for(g=0,h=b.childNodes.length;h>g;g++)if(b.childNodes[g]&&b.childNodes[g].className&&-1!==b.childNodes[g].className.indexOf("jstree-anchor")){i=b.childNodes[g];break}i&&(!this.settings.checkbox.tie_selection&&this._model.data[b.id].state.checked&&(i.className+=" jstree-checked"),k=j.cloneNode(!1),this._model.data[b.id].state.checkbox_disabled&&(k.className+=" jstree-checkbox-disabled"),i.insertBefore(k,i.childNodes[0]))}return e||-1===this.settings.checkbox.cascade.indexOf("undetermined")||(this._data.checkbox.uto&&clearTimeout(this._data.checkbox.uto),this._data.checkbox.uto=setTimeout(a.proxy(this._undetermined,this),50)),b},this.show_checkboxes=function(){this._data.core.themes.checkboxes=!0,this.get_container_ul().removeClass("jstree-no-checkboxes")},this.hide_checkboxes=function(){this._data.core.themes.checkboxes=!1,this.get_container_ul().addClass("jstree-no-checkboxes")},this.toggle_checkboxes=function(){this._data.core.themes.checkboxes?this.hide_checkboxes():this.show_checkboxes()},this.is_undetermined=function(b){b=this.get_node(b);var c=this.settings.checkbox.cascade,d,e,f=this.settings.checkbox.tie_selection,g=this._data[f?"core":"checkbox"].selected,h=this._model.data;if(!b||b.state[f?"selected":"checked"]===!0||-1===c.indexOf("undetermined")||-1===c.indexOf("down")&&-1===c.indexOf("up"))return!1;if(!b.state.loaded&&b.original.state.undetermined===!0)return!0;for(d=0,e=b.children_d.length;e>d;d++)if(-1!==a.inArray(b.children_d[d],g)||!h[b.children_d[d]].state.loaded&&h[b.children_d[d]].original.state.undetermined)return!0;return!1},this.disable_checkbox=function(b){var c,d,e;if(a.isArray(b)){for(b=b.slice(),c=0,d=b.length;d>c;c++)this.disable_checkbox(b[c]);return!0}return b=this.get_node(b),b&&b.id!==a.jstree.root?(e=this.get_node(b,!0),void(b.state.checkbox_disabled||(b.state.checkbox_disabled=!0,e&&e.length&&e.children(".jstree-anchor").children(".jstree-checkbox").addClass("jstree-checkbox-disabled"),this.trigger("disable_checkbox",{node:b})))):!1},this.enable_checkbox=function(b){var c,d,e;if(a.isArray(b)){for(b=b.slice(),c=0,d=b.length;d>c;c++)this.enable_checkbox(b[c]);return!0}return b=this.get_node(b),b&&b.id!==a.jstree.root?(e=this.get_node(b,!0),void(b.state.checkbox_disabled&&(b.state.checkbox_disabled=!1,e&&e.length&&e.children(".jstree-anchor").children(".jstree-checkbox").removeClass("jstree-checkbox-disabled"),this.trigger("enable_checkbox",{node:b})))):!1},this.activate_node=function(b,c){return a(c.target).hasClass("jstree-checkbox-disabled")?!1:(this.settings.checkbox.tie_selection&&(this.settings.checkbox.whole_node||a(c.target).hasClass("jstree-checkbox"))&&(c.ctrlKey=!0),this.settings.checkbox.tie_selection||!this.settings.checkbox.whole_node&&!a(c.target).hasClass("jstree-checkbox")?d.activate_node.call(this,b,c):this.is_disabled(b)?!1:(this.is_checked(b)?this.uncheck_node(b,c):this.check_node(b,c),void this.trigger("activate_node",{node:this.get_node(b)})))},this._cascade_new_checked_state=function(a,b){var c=this,d=this.settings.checkbox.tie_selection,e=this._model.data[a],f=[],g=[],h,i,j;if(!this.settings.checkbox.cascade_to_disabled&&e.state.disabled||!this.settings.checkbox.cascade_to_hidden&&e.state.hidden)j=this.get_checked_descendants(a),e.state[d?"selected":"checked"]&&j.push(e.id),f=f.concat(j);else{if(e.children)for(h=0,i=e.children.length;i>h;h++){var k=e.children[h];j=c._cascade_new_checked_state(k,b),f=f.concat(j),j.indexOf(k)>-1&&g.push(k)}var l=c.get_node(e,!0),m=g.length>0&&g.length<e.children.length;e.original&&e.original.state&&e.original.state.undetermined&&(e.original.state.undetermined=m),m?(e.state[d?"selected":"checked"]=!1,l.attr("aria-selected",!1).children(".jstree-anchor").removeClass(d?"jstree-clicked":"jstree-checked")):b&&g.length===e.children.length?(e.state[d?"selected":"checked"]=b,f.push(e.id),l.attr("aria-selected",!0).children(".jstree-anchor").addClass(d?"jstree-clicked":"jstree-checked")):(e.state[d?"selected":"checked"]=!1,l.attr("aria-selected",!1).children(".jstree-anchor").removeClass(d?"jstree-clicked":"jstree-checked"))}return f},this.get_checked_descendants=function(a){var b=this,c=b.settings.checkbox.tie_selection,d=b._model.data[a];return d.children_d.filter(function(a){return b._model.data[a].state[c?"selected":"checked"]})},this.check_node=function(b,c){if(this.settings.checkbox.tie_selection)return this.select_node(b,!1,!0,c);var d,e,f,g;if(a.isArray(b)){for(b=b.slice(),e=0,f=b.length;f>e;e++)this.check_node(b[e],c);return!0}return b=this.get_node(b),b&&b.id!==a.jstree.root?(d=this.get_node(b,!0),void(b.state.checked||(b.state.checked=!0,this._data.checkbox.selected.push(b.id),d&&d.length&&d.children(".jstree-anchor").addClass("jstree-checked"),this.trigger("check_node",{node:b,selected:this._data.checkbox.selected,event:c})))):!1},this.uncheck_node=function(b,c){if(this.settings.checkbox.tie_selection)return this.deselect_node(b,!1,c);var d,e,f;if(a.isArray(b)){for(b=b.slice(),d=0,e=b.length;e>d;d++)this.uncheck_node(b[d],c);return!0}return b=this.get_node(b),b&&b.id!==a.jstree.root?(f=this.get_node(b,!0),void(b.state.checked&&(b.state.checked=!1,this._data.checkbox.selected=a.vakata.array_remove_item(this._data.checkbox.selected,b.id),f.length&&f.children(".jstree-anchor").removeClass("jstree-checked"),this.trigger("uncheck_node",{node:b,selected:this._data.checkbox.selected,event:c})))):!1},this.check_all=function(){if(this.settings.checkbox.tie_selection)return this.select_all();var b=this._data.checkbox.selected.concat([]),c,d;for(this._data.checkbox.selected=this._model.data[a.jstree.root].children_d.concat(),c=0,d=this._data.checkbox.selected.length;d>c;c++)this._model.data[this._data.checkbox.selected[c]]&&(this._model.data[this._data.checkbox.selected[c]].state.checked=!0);this.redraw(!0),this.trigger("check_all",{selected:this._data.checkbox.selected})},this.uncheck_all=function(){if(this.settings.checkbox.tie_selection)return this.deselect_all();var a=this._data.checkbox.selected.concat([]),b,c;for(b=0,c=this._data.checkbox.selected.length;c>b;b++)this._model.data[this._data.checkbox.selected[b]]&&(this._model.data[this._data.checkbox.selected[b]].state.checked=!1);this._data.checkbox.selected=[],this.element.find(".jstree-checked").removeClass("jstree-checked"),this.trigger("uncheck_all",{selected:this._data.checkbox.selected,node:a})},this.is_checked=function(b){return this.settings.checkbox.tie_selection?this.is_selected(b):(b=this.get_node(b),b&&b.id!==a.jstree.root?b.state.checked:!1)},this.get_checked=function(b){return this.settings.checkbox.tie_selection?this.get_selected(b):b?a.map(this._data.checkbox.selected,a.proxy(function(a){return this.get_node(a)},this)):this._data.checkbox.selected},this.get_top_checked=function(b){if(this.settings.checkbox.tie_selection)return this.get_top_selected(b);var c=this.get_checked(!0),d={},e,f,g,h;for(e=0,f=c.length;f>e;e++)d[c[e].id]=c[e];for(e=0,f=c.length;f>e;e++)for(g=0,h=c[e].children_d.length;h>g;g++)d[c[e].children_d[g]]&&delete d[c[e].children_d[g]];c=[];for(e in d)d.hasOwnProperty(e)&&c.push(e);return b?a.map(c,a.proxy(function(a){return this.get_node(a)},this)):c},this.get_bottom_checked=function(b){if(this.settings.checkbox.tie_selection)return this.get_bottom_selected(b);var c=this.get_checked(!0),d=[],e,f;for(e=0,f=c.length;f>e;e++)c[e].children.length||d.push(c[e].id);return b?a.map(d,a.proxy(function(a){return this.get_node(a)},this)):d},this.load_node=function(b,c){var e,f,g,h,i,j;if(!a.isArray(b)&&!this.settings.checkbox.tie_selection&&(j=this.get_node(b),j&&j.state.loaded))for(e=0,f=j.children_d.length;f>e;e++)this._model.data[j.children_d[e]].state.checked&&(i=!0,this._data.checkbox.selected=a.vakata.array_remove_item(this._data.checkbox.selected,j.children_d[e]));return d.load_node.apply(this,arguments)},this.get_state=function(){var a=d.get_state.apply(this,arguments);return this.settings.checkbox.tie_selection?a:(a.checkbox=this._data.checkbox.selected.slice(),a)},this.set_state=function(b,c){var e=d.set_state.apply(this,arguments);if(e&&b.checkbox){if(!this.settings.checkbox.tie_selection){this.uncheck_all();var f=this;a.each(b.checkbox,function(a,b){f.check_node(b)})}return delete b.checkbox,this.set_state(b,c),!1}return e},this.refresh=function(a,b){return this.settings.checkbox.tie_selection&&(this._data.checkbox.selected=[]),d.refresh.apply(this,arguments)}},a.jstree.defaults.conditionalselect=function(){return!0},a.jstree.plugins.conditionalselect=function(a,b){this.activate_node=function(a,c){return this.settings.conditionalselect.call(this,this.get_node(a),c)?b.activate_node.call(this,a,c):void 0}},a.jstree.defaults.contextmenu={select_node:!0,show_at_node:!0,items:function(b,c){return{create:{separator_before:!1,separator_after:!0,_disabled:!1,label:"Create",action:function(b){var c=a.jstree.reference(b.reference),d=c.get_node(b.reference);c.create_node(d,{},"last",function(a){try{c.edit(a)}catch(b){setTimeout(function(){c.edit(a)},0)}})}},rename:{separator_before:!1,separator_after:!1,_disabled:!1,label:"Rename",action:function(b){var c=a.jstree.reference(b.reference),d=c.get_node(b.reference);c.edit(d)}},remove:{separator_before:!1,icon:!1,separator_after:!1,_disabled:!1,label:"Delete",action:function(b){var c=a.jstree.reference(b.reference),d=c.get_node(b.reference);c.is_selected(d)?c.delete_node(c.get_selected()):c.delete_node(d)}},ccp:{separator_before:!0,icon:!1,separator_after:!1,label:"Edit",action:!1,submenu:{cut:{separator_before:!1,separator_after:!1,label:"Cut",action:function(b){var c=a.jstree.reference(b.reference),d=c.get_node(b.reference);c.is_selected(d)?c.cut(c.get_top_selected()):c.cut(d)}},copy:{separator_before:!1,icon:!1,separator_after:!1,label:"Copy",action:function(b){var c=a.jstree.reference(b.reference),d=c.get_node(b.reference);c.is_selected(d)?c.copy(c.get_top_selected()):c.copy(d)}},paste:{separator_before:!1,icon:!1,_disabled:function(b){return!a.jstree.reference(b.reference).can_paste()},separator_after:!1,label:"Paste",action:function(b){var c=a.jstree.reference(b.reference),d=c.get_node(b.reference);c.paste(d)}}}}}}},a.jstree.plugins.contextmenu=function(c,d){this.bind=function(){d.bind.call(this);var b=0,c=null,e,f;this.element.on("init.jstree loading.jstree ready.jstree",a.proxy(function(){this.get_container_ul().addClass("jstree-contextmenu")},this)).on("contextmenu.jstree",".jstree-anchor",a.proxy(function(a,d){"input"!==a.target.tagName.toLowerCase()&&(a.preventDefault(),b=a.ctrlKey?+new Date:0,(d||c)&&(b=+new Date+1e4),c&&clearTimeout(c),this.is_loading(a.currentTarget)||this.show_contextmenu(a.currentTarget,a.pageX,a.pageY,a))},this)).on("click.jstree",".jstree-anchor",a.proxy(function(c){this._data.contextmenu.visible&&(!b||+new Date-b>250)&&a.vakata.context.hide(),b=0},this)).on("touchstart.jstree",".jstree-anchor",function(b){b.originalEvent&&b.originalEvent.changedTouches&&b.originalEvent.changedTouches[0]&&(e=b.originalEvent.changedTouches[0].clientX,f=b.originalEvent.changedTouches[0].clientY,c=setTimeout(function(){a(b.currentTarget).trigger("contextmenu",!0)},750))}).on("touchmove.vakata.jstree",function(b){c&&b.originalEvent&&b.originalEvent.changedTouches&&b.originalEvent.changedTouches[0]&&(Math.abs(e-b.originalEvent.changedTouches[0].clientX)>10||Math.abs(f-b.originalEvent.changedTouches[0].clientY)>10)&&(clearTimeout(c),a.vakata.context.hide())}).on("touchend.vakata.jstree",function(a){c&&clearTimeout(c)}),a(i).on("context_hide.vakata.jstree",a.proxy(function(b,c){this._data.contextmenu.visible=!1,a(c.reference).removeClass("jstree-context")},this))},this.teardown=function(){this._data.contextmenu.visible&&a.vakata.context.hide(),d.teardown.call(this)},this.show_contextmenu=function(c,d,e,f){if(c=this.get_node(c),!c||c.id===a.jstree.root)return!1;var g=this.settings.contextmenu,h=this.get_node(c,!0),i=h.children(".jstree-anchor"),j=!1,k=!1;(g.show_at_node||d===b||e===b)&&(j=i.offset(),d=j.left,e=j.top+this._data.core.li_height),this.settings.contextmenu.select_node&&!this.is_selected(c)&&this.activate_node(c,f),k=g.items,a.isFunction(k)&&(k=k.call(this,c,a.proxy(function(a){this._show_contextmenu(c,d,e,a)},this))),a.isPlainObject(k)&&this._show_contextmenu(c,d,e,k)},this._show_contextmenu=function(b,c,d,e){var f=this.get_node(b,!0),g=f.children(".jstree-anchor");a(i).one("context_show.vakata.jstree",a.proxy(function(b,c){var d="jstree-contextmenu jstree-"+this.get_theme()+"-contextmenu";a(c.element).addClass(d),g.addClass("jstree-context")},this)),this._data.contextmenu.visible=!0,a.vakata.context.show(g,{x:c,y:d},e),this.trigger("show_contextmenu",{node:b,x:c,y:d})}},function(a){var b=!1,c={element:!1,reference:!1,position_x:0,position_y:0,items:[],html:"",is_visible:!1};a.vakata.context={settings:{hide_onmouseleave:0,icons:!0},_trigger:function(b){a(i).triggerHandler("context_"+b+".vakata",{reference:c.reference,element:c.element,position:{x:c.position_x,y:c.position_y}})},_execute:function(b){return b=c.items[b],b&&(!b._disabled||a.isFunction(b._disabled)&&!b._disabled({item:b,reference:c.reference,element:c.element}))&&b.action?b.action.call(null,{item:b,reference:c.reference,element:c.element,position:{x:c.position_x,y:c.position_y}}):!1},_parse:function(b,d){if(!b)return!1;d||(c.html="",c.items=[]);var e="",f=!1,g;return d&&(e+="<ul>"),a.each(b,function(b,d){return d?(c.items.push(d),!f&&d.separator_before&&(e+="<li class='vakata-context-separator'><a href='#' "+(a.vakata.context.settings.icons?"":'style="margin-left:0px;"')+">&#160;</a></li>"),f=!1,e+="<li class='"+(d._class||"")+(d._disabled===!0||a.isFunction(d._disabled)&&d._disabled({item:d,reference:c.reference,element:c.element})?" vakata-contextmenu-disabled ":"")+"' "+(d.shortcut?" data-shortcut='"+d.shortcut+"' ":"")+">",e+="<a href='#' rel='"+(c.items.length-1)+"' "+(d.title?"title='"+d.title+"'":"")+">",a.vakata.context.settings.icons&&(e+="<i ",d.icon&&(e+=-1!==d.icon.indexOf("/")||-1!==d.icon.indexOf(".")?" style='background:url(\""+d.icon+"\") center center no-repeat' ":" class='"+d.icon+"' "),e+="></i><span class='vakata-contextmenu-sep'>&#160;</span>"),e+=(a.isFunction(d.label)?d.label({item:b,reference:c.reference,element:c.element}):d.label)+(d.shortcut?' <span class="vakata-contextmenu-shortcut vakata-contextmenu-shortcut-'+d.shortcut+'">'+(d.shortcut_label||"")+"</span>":"")+"</a>",
d.submenu&&(g=a.vakata.context._parse(d.submenu,!0),g&&(e+=g)),e+="</li>",void(d.separator_after&&(e+="<li class='vakata-context-separator'><a href='#' "+(a.vakata.context.settings.icons?"":'style="margin-left:0px;"')+">&#160;</a></li>",f=!0))):!0}),e=e.replace(/<li class\='vakata-context-separator'\><\/li\>$/,""),d&&(e+="</ul>"),d||(c.html=e,a.vakata.context._trigger("parse")),e.length>10?e:!1},_show_submenu:function(c){if(c=a(c),c.length&&c.children("ul").length){var d=c.children("ul"),e=c.offset().left,f=e+c.outerWidth(),g=c.offset().top,h=d.width(),i=d.height(),j=a(window).width()+a(window).scrollLeft(),k=a(window).height()+a(window).scrollTop();b?c[f-(h+10+c.outerWidth())<0?"addClass":"removeClass"]("vakata-context-left"):c[f+h>j&&e>j-f?"addClass":"removeClass"]("vakata-context-right"),g+i+10>k&&d.css("bottom","-1px"),c.hasClass("vakata-context-right")?h>e&&d.css("margin-right",e-h):h>j-f&&d.css("margin-left",j-f-h),d.show()}},show:function(d,e,f){var g,h,j,k,l,m,n,o,p=!0;switch(c.element&&c.element.length&&c.element.width(""),p){case!e&&!d:return!1;case!!e&&!!d:c.reference=d,c.position_x=e.x,c.position_y=e.y;break;case!e&&!!d:c.reference=d,g=d.offset(),c.position_x=g.left+d.outerHeight(),c.position_y=g.top;break;case!!e&&!d:c.position_x=e.x,c.position_y=e.y}d&&!f&&a(d).data("vakata_contextmenu")&&(f=a(d).data("vakata_contextmenu")),a.vakata.context._parse(f)&&c.element.html(c.html),c.items.length&&(c.element.appendTo(i.body),h=c.element,j=c.position_x,k=c.position_y,l=h.width(),m=h.height(),n=a(window).width()+a(window).scrollLeft(),o=a(window).height()+a(window).scrollTop(),b&&(j-=h.outerWidth()-a(d).outerWidth(),j<a(window).scrollLeft()+20&&(j=a(window).scrollLeft()+20)),j+l+20>n&&(j=n-(l+20)),k+m+20>o&&(k=o-(m+20)),c.element.css({left:j,top:k}).show().find("a").first().focus().parent().addClass("vakata-context-hover"),c.is_visible=!0,a.vakata.context._trigger("show"))},hide:function(){c.is_visible&&(c.element.hide().find("ul").hide().end().find(":focus").blur().end().detach(),c.is_visible=!1,a.vakata.context._trigger("hide"))}},a(function(){b="rtl"===a(i.body).css("direction");var d=!1;c.element=a("<ul class='vakata-context'></ul>"),c.element.on("mouseenter","li",function(b){b.stopImmediatePropagation(),a.contains(this,b.relatedTarget)||(d&&clearTimeout(d),c.element.find(".vakata-context-hover").removeClass("vakata-context-hover").end(),a(this).siblings().find("ul").hide().end().end().parentsUntil(".vakata-context","li").addBack().addClass("vakata-context-hover"),a.vakata.context._show_submenu(this))}).on("mouseleave","li",function(b){a.contains(this,b.relatedTarget)||a(this).find(".vakata-context-hover").addBack().removeClass("vakata-context-hover")}).on("mouseleave",function(b){a(this).find(".vakata-context-hover").removeClass("vakata-context-hover"),a.vakata.context.settings.hide_onmouseleave&&(d=setTimeout(function(b){return function(){a.vakata.context.hide()}}(this),a.vakata.context.settings.hide_onmouseleave))}).on("click","a",function(b){b.preventDefault(),a(this).blur().parent().hasClass("vakata-context-disabled")||a.vakata.context._execute(a(this).attr("rel"))===!1||a.vakata.context.hide()}).on("keydown","a",function(b){var d=null;switch(b.which){case 13:case 32:b.type="click",b.preventDefault(),a(b.currentTarget).trigger(b);break;case 37:c.is_visible&&(c.element.find(".vakata-context-hover").last().closest("li").first().find("ul").hide().find(".vakata-context-hover").removeClass("vakata-context-hover").end().end().children("a").focus(),b.stopImmediatePropagation(),b.preventDefault());break;case 38:c.is_visible&&(d=c.element.find("ul:visible").addBack().last().children(".vakata-context-hover").removeClass("vakata-context-hover").prevAll("li:not(.vakata-context-separator)").first(),d.length||(d=c.element.find("ul:visible").addBack().last().children("li:not(.vakata-context-separator)").last()),d.addClass("vakata-context-hover").children("a").focus(),b.stopImmediatePropagation(),b.preventDefault());break;case 39:c.is_visible&&(c.element.find(".vakata-context-hover").last().children("ul").show().children("li:not(.vakata-context-separator)").removeClass("vakata-context-hover").first().addClass("vakata-context-hover").children("a").focus(),b.stopImmediatePropagation(),b.preventDefault());break;case 40:c.is_visible&&(d=c.element.find("ul:visible").addBack().last().children(".vakata-context-hover").removeClass("vakata-context-hover").nextAll("li:not(.vakata-context-separator)").first(),d.length||(d=c.element.find("ul:visible").addBack().last().children("li:not(.vakata-context-separator)").first()),d.addClass("vakata-context-hover").children("a").focus(),b.stopImmediatePropagation(),b.preventDefault());break;case 27:a.vakata.context.hide(),b.preventDefault()}}).on("keydown",function(a){a.preventDefault();var b=c.element.find(".vakata-contextmenu-shortcut-"+a.which).parent();b.parent().not(".vakata-context-disabled")&&b.click()}),a(i).on("mousedown.vakata.jstree",function(b){c.is_visible&&c.element[0]!==b.target&&!a.contains(c.element[0],b.target)&&a.vakata.context.hide()}).on("context_show.vakata.jstree",function(a,d){c.element.find("li:has(ul)").children("a").addClass("vakata-context-parent"),b&&c.element.addClass("vakata-context-rtl").css("direction","rtl"),c.element.find("ul").hide().end()})})}(a),a.jstree.defaults.dnd={copy:!0,open_timeout:500,is_draggable:!0,check_while_dragging:!0,always_copy:!1,inside_pos:0,drag_selection:!0,touch:!0,large_drop_target:!1,large_drag_target:!1,use_html5:!1};var k,l;a.jstree.plugins.dnd=function(b,c){this.init=function(a,b){c.init.call(this,a,b),this.settings.dnd.use_html5=this.settings.dnd.use_html5&&"draggable"in i.createElement("span")},this.bind=function(){c.bind.call(this),this.element.on(this.settings.dnd.use_html5?"dragstart.jstree":"mousedown.jstree touchstart.jstree",this.settings.dnd.large_drag_target?".jstree-node":".jstree-anchor",a.proxy(function(b){if(this.settings.dnd.large_drag_target&&a(b.target).closest(".jstree-node")[0]!==b.currentTarget)return!0;if("touchstart"===b.type&&(!this.settings.dnd.touch||"selected"===this.settings.dnd.touch&&!a(b.currentTarget).closest(".jstree-node").children(".jstree-anchor").hasClass("jstree-clicked")))return!0;var c=this.get_node(b.target),d=this.is_selected(c)&&this.settings.dnd.drag_selection?this.get_top_selected().length:1,e=d>1?d+" "+this.get_string("nodes"):this.get_text(b.currentTarget);if(this.settings.core.force_text&&(e=a.vakata.html.escape(e)),c&&c.id&&c.id!==a.jstree.root&&(1===b.which||"touchstart"===b.type||"dragstart"===b.type)&&(this.settings.dnd.is_draggable===!0||a.isFunction(this.settings.dnd.is_draggable)&&this.settings.dnd.is_draggable.call(this,d>1?this.get_top_selected(!0):[c],b))){if(k={jstree:!0,origin:this,obj:this.get_node(c,!0),nodes:d>1?this.get_top_selected():[c.id]},l=b.currentTarget,!this.settings.dnd.use_html5)return this.element.trigger("mousedown.jstree"),a.vakata.dnd.start(b,k,'<div id="jstree-dnd" class="jstree-'+this.get_theme()+" jstree-"+this.get_theme()+"-"+this.get_theme_variant()+" "+(this.settings.core.themes.responsive?" jstree-dnd-responsive":"")+'"><i class="jstree-icon jstree-er"></i>'+e+'<ins class="jstree-copy" style="display:none;">+</ins></div>');a.vakata.dnd._trigger("start",b,{helper:a(),element:l,data:k})}},this)),this.settings.dnd.use_html5&&this.element.on("dragover.jstree",function(b){return b.preventDefault(),a.vakata.dnd._trigger("move",b,{helper:a(),element:l,data:k}),!1}).on("drop.jstree",a.proxy(function(b){return b.preventDefault(),a.vakata.dnd._trigger("stop",b,{helper:a(),element:l,data:k}),!1},this))},this.redraw_node=function(a,b,d,e){if(a=c.redraw_node.apply(this,arguments),a&&this.settings.dnd.use_html5)if(this.settings.dnd.large_drag_target)a.setAttribute("draggable",!0);else{var f,g,h=null;for(f=0,g=a.childNodes.length;g>f;f++)if(a.childNodes[f]&&a.childNodes[f].className&&-1!==a.childNodes[f].className.indexOf("jstree-anchor")){h=a.childNodes[f];break}h&&h.setAttribute("draggable",!0)}return a}},a(function(){var c=!1,d=!1,e=!1,f=!1,g=a('<div id="jstree-marker">&#160;</div>').hide();a(i).on("dragover.vakata.jstree",function(b){l&&a.vakata.dnd._trigger("move",b,{helper:a(),element:l,data:k})}).on("drop.vakata.jstree",function(b){l&&(a.vakata.dnd._trigger("stop",b,{helper:a(),element:l,data:k}),l=null,k=null)}).on("dnd_start.vakata.jstree",function(a,b){c=!1,e=!1,b&&b.data&&b.data.jstree&&g.appendTo(i.body)}).on("dnd_move.vakata.jstree",function(h,i){var j=i.event.target!==e.target;if(f&&(!i.event||"dragover"!==i.event.type||j)&&clearTimeout(f),i&&i.data&&i.data.jstree&&(!i.event.target.id||"jstree-marker"!==i.event.target.id)){e=i.event;var k=a.jstree.reference(i.event.target),l=!1,m=!1,n=!1,o,p,q,r,s,t,u,v,w,x,y,z,A,B,C,D,E;if(k&&k._data&&k._data.dnd)if(g.attr("class","jstree-"+k.get_theme()+(k.settings.core.themes.responsive?" jstree-dnd-responsive":"")),D=i.data.origin&&(i.data.origin.settings.dnd.always_copy||i.data.origin.settings.dnd.copy&&(i.event.metaKey||i.event.ctrlKey)),i.helper.children().attr("class","jstree-"+k.get_theme()+" jstree-"+k.get_theme()+"-"+k.get_theme_variant()+" "+(k.settings.core.themes.responsive?" jstree-dnd-responsive":"")).find(".jstree-copy").first()[D?"show":"hide"](),i.event.target!==k.element[0]&&i.event.target!==k.get_container_ul()[0]||0!==k.get_container_ul().children().length){if(l=k.settings.dnd.large_drop_target?a(i.event.target).closest(".jstree-node").children(".jstree-anchor"):a(i.event.target).closest(".jstree-anchor"),l&&l.length&&l.parent().is(".jstree-closed, .jstree-open, .jstree-leaf")&&(m=l.offset(),n=(i.event.pageY!==b?i.event.pageY:i.event.originalEvent.pageY)-m.top,r=l.outerHeight(),u=r/3>n?["b","i","a"]:n>r-r/3?["a","i","b"]:n>r/2?["i","a","b"]:["i","b","a"],a.each(u,function(b,e){switch(e){case"b":p=m.left-6,q=m.top,s=k.get_parent(l),t=l.parent().index();break;case"i":B=k.settings.dnd.inside_pos,C=k.get_node(l.parent()),p=m.left-2,q=m.top+r/2+1,s=C.id,t="first"===B?0:"last"===B?C.children.length:Math.min(B,C.children.length);break;case"a":p=m.left-6,q=m.top+r,s=k.get_parent(l),t=l.parent().index()+1}for(v=!0,w=0,x=i.data.nodes.length;x>w;w++)if(y=i.data.origin&&(i.data.origin.settings.dnd.always_copy||i.data.origin.settings.dnd.copy&&(i.event.metaKey||i.event.ctrlKey))?"copy_node":"move_node",z=t,"move_node"===y&&"a"===e&&i.data.origin&&i.data.origin===k&&s===k.get_parent(i.data.nodes[w])&&(A=k.get_node(s),z>a.inArray(i.data.nodes[w],A.children)&&(z-=1)),v=v&&(k&&k.settings&&k.settings.dnd&&k.settings.dnd.check_while_dragging===!1||k.check(y,i.data.origin&&i.data.origin!==k?i.data.origin.get_node(i.data.nodes[w]):i.data.nodes[w],s,z,{dnd:!0,ref:k.get_node(l.parent()),pos:e,origin:i.data.origin,is_multi:i.data.origin&&i.data.origin!==k,is_foreign:!i.data.origin})),!v){k&&k.last_error&&(d=k.last_error());break}return"i"===e&&l.parent().is(".jstree-closed")&&k.settings.dnd.open_timeout&&(!i.event||"dragover"!==i.event.type||j)&&(f&&clearTimeout(f),f=setTimeout(function(a,b){return function(){a.open_node(b)}}(k,l),k.settings.dnd.open_timeout)),v?(E=k.get_node(s,!0),E.hasClass(".jstree-dnd-parent")||(a(".jstree-dnd-parent").removeClass("jstree-dnd-parent"),E.addClass("jstree-dnd-parent")),c={ins:k,par:s,pos:"i"!==e||"last"!==B||0!==t||k.is_loaded(C)?t:"last"},g.css({left:p+"px",top:q+"px"}).show(),i.helper.find(".jstree-icon").first().removeClass("jstree-er").addClass("jstree-ok"),i.event.originalEvent&&i.event.originalEvent.dataTransfer&&(i.event.originalEvent.dataTransfer.dropEffect=D?"copy":"move"),d={},u=!0,!1):void 0}),u===!0))return}else{for(v=!0,w=0,x=i.data.nodes.length;x>w;w++)if(v=v&&k.check(i.data.origin&&(i.data.origin.settings.dnd.always_copy||i.data.origin.settings.dnd.copy&&(i.event.metaKey||i.event.ctrlKey))?"copy_node":"move_node",i.data.origin&&i.data.origin!==k?i.data.origin.get_node(i.data.nodes[w]):i.data.nodes[w],a.jstree.root,"last",{dnd:!0,ref:k.get_node(a.jstree.root),pos:"i",origin:i.data.origin,is_multi:i.data.origin&&i.data.origin!==k,is_foreign:!i.data.origin}),!v)break;if(v)return c={ins:k,par:a.jstree.root,pos:"last"},g.hide(),i.helper.find(".jstree-icon").first().removeClass("jstree-er").addClass("jstree-ok"),void(i.event.originalEvent&&i.event.originalEvent.dataTransfer&&(i.event.originalEvent.dataTransfer.dropEffect=D?"copy":"move"))}a(".jstree-dnd-parent").removeClass("jstree-dnd-parent"),c=!1,i.helper.find(".jstree-icon").removeClass("jstree-ok").addClass("jstree-er"),i.event.originalEvent&&i.event.originalEvent.dataTransfer,g.hide()}}).on("dnd_scroll.vakata.jstree",function(a,b){b&&b.data&&b.data.jstree&&(g.hide(),c=!1,e=!1,b.helper.find(".jstree-icon").first().removeClass("jstree-ok").addClass("jstree-er"))}).on("dnd_stop.vakata.jstree",function(b,h){if(a(".jstree-dnd-parent").removeClass("jstree-dnd-parent"),f&&clearTimeout(f),h&&h.data&&h.data.jstree){g.hide().detach();var i,j,k=[];if(c){for(i=0,j=h.data.nodes.length;j>i;i++)k[i]=h.data.origin?h.data.origin.get_node(h.data.nodes[i]):h.data.nodes[i];c.ins[h.data.origin&&(h.data.origin.settings.dnd.always_copy||h.data.origin.settings.dnd.copy&&(h.event.metaKey||h.event.ctrlKey))?"copy_node":"move_node"](k,c.par,c.pos,!1,!1,!1,h.data.origin)}else i=a(h.event.target).closest(".jstree"),i.length&&d&&d.error&&"check"===d.error&&(i=i.jstree(!0),i&&i.settings.core.error.call(this,d));e=!1,c=!1}}).on("keyup.jstree keydown.jstree",function(b,h){h=a.vakata.dnd._get(),h&&h.data&&h.data.jstree&&("keyup"===b.type&&27===b.which?(f&&clearTimeout(f),c=!1,d=!1,e=!1,f=!1,g.hide().detach(),a.vakata.dnd._clean()):(h.helper.find(".jstree-copy").first()[h.data.origin&&(h.data.origin.settings.dnd.always_copy||h.data.origin.settings.dnd.copy&&(b.metaKey||b.ctrlKey))?"show":"hide"](),e&&(e.metaKey=b.metaKey,e.ctrlKey=b.ctrlKey,a.vakata.dnd._trigger("move",e))))})}),function(a){a.vakata.html={div:a("<div />"),escape:function(b){return a.vakata.html.div.text(b).html()},strip:function(b){return a.vakata.html.div.empty().append(a.parseHTML(b)).text()}};var c={element:!1,target:!1,is_down:!1,is_drag:!1,helper:!1,helper_w:0,data:!1,init_x:0,init_y:0,scroll_l:0,scroll_t:0,scroll_e:!1,scroll_i:!1,is_touch:!1};a.vakata.dnd={settings:{scroll_speed:10,scroll_proximity:20,helper_left:5,helper_top:10,threshold:5,threshold_touch:10},_trigger:function(c,d,e){e===b&&(e=a.vakata.dnd._get()),e.event=d,a(i).triggerHandler("dnd_"+c+".vakata",e)},_get:function(){return{data:c.data,element:c.element,helper:c.helper}},_clean:function(){c.helper&&c.helper.remove(),c.scroll_i&&(clearInterval(c.scroll_i),c.scroll_i=!1),c={element:!1,target:!1,is_down:!1,is_drag:!1,helper:!1,helper_w:0,data:!1,init_x:0,init_y:0,scroll_l:0,scroll_t:0,scroll_e:!1,scroll_i:!1,is_touch:!1},a(i).off("mousemove.vakata.jstree touchmove.vakata.jstree",a.vakata.dnd.drag),a(i).off("mouseup.vakata.jstree touchend.vakata.jstree",a.vakata.dnd.stop)},_scroll:function(b){if(!c.scroll_e||!c.scroll_l&&!c.scroll_t)return c.scroll_i&&(clearInterval(c.scroll_i),c.scroll_i=!1),!1;if(!c.scroll_i)return c.scroll_i=setInterval(a.vakata.dnd._scroll,100),!1;if(b===!0)return!1;var d=c.scroll_e.scrollTop(),e=c.scroll_e.scrollLeft();c.scroll_e.scrollTop(d+c.scroll_t*a.vakata.dnd.settings.scroll_speed),c.scroll_e.scrollLeft(e+c.scroll_l*a.vakata.dnd.settings.scroll_speed),(d!==c.scroll_e.scrollTop()||e!==c.scroll_e.scrollLeft())&&a.vakata.dnd._trigger("scroll",c.scroll_e)},start:function(b,d,e){"touchstart"===b.type&&b.originalEvent&&b.originalEvent.changedTouches&&b.originalEvent.changedTouches[0]&&(b.pageX=b.originalEvent.changedTouches[0].pageX,b.pageY=b.originalEvent.changedTouches[0].pageY,b.target=i.elementFromPoint(b.originalEvent.changedTouches[0].pageX-window.pageXOffset,b.originalEvent.changedTouches[0].pageY-window.pageYOffset)),c.is_drag&&a.vakata.dnd.stop({});try{b.currentTarget.unselectable="on",b.currentTarget.onselectstart=function(){return!1},b.currentTarget.style&&(b.currentTarget.style.touchAction="none",b.currentTarget.style.msTouchAction="none",b.currentTarget.style.MozUserSelect="none")}catch(f){}return c.init_x=b.pageX,c.init_y=b.pageY,c.data=d,c.is_down=!0,c.element=b.currentTarget,c.target=b.target,c.is_touch="touchstart"===b.type,e!==!1&&(c.helper=a("<div id='vakata-dnd'></div>").html(e).css({display:"block",margin:"0",padding:"0",position:"absolute",top:"-2000px",lineHeight:"16px",zIndex:"10000"})),a(i).on("mousemove.vakata.jstree touchmove.vakata.jstree",a.vakata.dnd.drag),a(i).on("mouseup.vakata.jstree touchend.vakata.jstree",a.vakata.dnd.stop),!1},drag:function(b){if("touchmove"===b.type&&b.originalEvent&&b.originalEvent.changedTouches&&b.originalEvent.changedTouches[0]&&(b.pageX=b.originalEvent.changedTouches[0].pageX,b.pageY=b.originalEvent.changedTouches[0].pageY,b.target=i.elementFromPoint(b.originalEvent.changedTouches[0].pageX-window.pageXOffset,b.originalEvent.changedTouches[0].pageY-window.pageYOffset)),c.is_down){if(!c.is_drag){if(!(Math.abs(b.pageX-c.init_x)>(c.is_touch?a.vakata.dnd.settings.threshold_touch:a.vakata.dnd.settings.threshold)||Math.abs(b.pageY-c.init_y)>(c.is_touch?a.vakata.dnd.settings.threshold_touch:a.vakata.dnd.settings.threshold)))return;c.helper&&(c.helper.appendTo(i.body),c.helper_w=c.helper.outerWidth()),c.is_drag=!0,a(c.target).one("click.vakata",!1),a.vakata.dnd._trigger("start",b)}var d=!1,e=!1,f=!1,g=!1,h=!1,j=!1,k=!1,l=!1,m=!1,n=!1;return c.scroll_t=0,c.scroll_l=0,c.scroll_e=!1,a(a(b.target).parentsUntil("body").addBack().get().reverse()).filter(function(){return/^auto|scroll$/.test(a(this).css("overflow"))&&(this.scrollHeight>this.offsetHeight||this.scrollWidth>this.offsetWidth)}).each(function(){var d=a(this),e=d.offset();return this.scrollHeight>this.offsetHeight&&(e.top+d.height()-b.pageY<a.vakata.dnd.settings.scroll_proximity&&(c.scroll_t=1),b.pageY-e.top<a.vakata.dnd.settings.scroll_proximity&&(c.scroll_t=-1)),this.scrollWidth>this.offsetWidth&&(e.left+d.width()-b.pageX<a.vakata.dnd.settings.scroll_proximity&&(c.scroll_l=1),b.pageX-e.left<a.vakata.dnd.settings.scroll_proximity&&(c.scroll_l=-1)),c.scroll_t||c.scroll_l?(c.scroll_e=a(this),!1):void 0}),c.scroll_e||(d=a(i),e=a(window),f=d.height(),g=e.height(),h=d.width(),j=e.width(),k=d.scrollTop(),l=d.scrollLeft(),f>g&&b.pageY-k<a.vakata.dnd.settings.scroll_proximity&&(c.scroll_t=-1),f>g&&g-(b.pageY-k)<a.vakata.dnd.settings.scroll_proximity&&(c.scroll_t=1),h>j&&b.pageX-l<a.vakata.dnd.settings.scroll_proximity&&(c.scroll_l=-1),h>j&&j-(b.pageX-l)<a.vakata.dnd.settings.scroll_proximity&&(c.scroll_l=1),(c.scroll_t||c.scroll_l)&&(c.scroll_e=d)),c.scroll_e&&a.vakata.dnd._scroll(!0),c.helper&&(m=parseInt(b.pageY+a.vakata.dnd.settings.helper_top,10),n=parseInt(b.pageX+a.vakata.dnd.settings.helper_left,10),f&&m+25>f&&(m=f-50),h&&n+c.helper_w>h&&(n=h-(c.helper_w+2)),c.helper.css({left:n+"px",top:m+"px"})),a.vakata.dnd._trigger("move",b),!1}},stop:function(b){if("touchend"===b.type&&b.originalEvent&&b.originalEvent.changedTouches&&b.originalEvent.changedTouches[0]&&(b.pageX=b.originalEvent.changedTouches[0].pageX,b.pageY=b.originalEvent.changedTouches[0].pageY,b.target=i.elementFromPoint(b.originalEvent.changedTouches[0].pageX-window.pageXOffset,b.originalEvent.changedTouches[0].pageY-window.pageYOffset)),c.is_drag)b.target!==c.target&&a(c.target).off("click.vakata"),a.vakata.dnd._trigger("stop",b);else if("touchend"===b.type&&b.target===c.target){var d=setTimeout(function(){a(b.target).click()},100);a(b.target).one("click",function(){d&&clearTimeout(d)})}return a.vakata.dnd._clean(),!1}}}(a),a.jstree.defaults.massload=null,a.jstree.plugins.massload=function(b,c){this.init=function(a,b){this._data.massload={},c.init.call(this,a,b)},this._load_nodes=function(b,d,e,f){var g=this.settings.massload,h=JSON.stringify(b),i=[],j=this._model.data,k,l,m;if(!e){for(k=0,l=b.length;l>k;k++)(!j[b[k]]||!j[b[k]].state.loaded&&!j[b[k]].state.failed||f)&&(i.push(b[k]),m=this.get_node(b[k],!0),m&&m.length&&m.addClass("jstree-loading").attr("aria-busy",!0));if(this._data.massload={},i.length){if(a.isFunction(g))return g.call(this,i,a.proxy(function(a){var g,h;if(a)for(g in a)a.hasOwnProperty(g)&&(this._data.massload[g]=a[g]);for(g=0,h=b.length;h>g;g++)m=this.get_node(b[g],!0),m&&m.length&&m.removeClass("jstree-loading").attr("aria-busy",!1);c._load_nodes.call(this,b,d,e,f)},this));if("object"==typeof g&&g&&g.url)return g=a.extend(!0,{},g),a.isFunction(g.url)&&(g.url=g.url.call(this,i)),a.isFunction(g.data)&&(g.data=g.data.call(this,i)),a.ajax(g).done(a.proxy(function(a,g,h){var i,j;if(a)for(i in a)a.hasOwnProperty(i)&&(this._data.massload[i]=a[i]);for(i=0,j=b.length;j>i;i++)m=this.get_node(b[i],!0),m&&m.length&&m.removeClass("jstree-loading").attr("aria-busy",!1);c._load_nodes.call(this,b,d,e,f)},this)).fail(a.proxy(function(a){c._load_nodes.call(this,b,d,e,f)},this))}}return c._load_nodes.call(this,b,d,e,f)},this._load_node=function(b,d){var e=this._data.massload[b.id],f=null,g;return e?(f=this["string"==typeof e?"_append_html_data":"_append_json_data"](b,"string"==typeof e?a(a.parseHTML(e)).filter(function(){return 3!==this.nodeType}):e,function(a){d.call(this,a)}),g=this.get_node(b.id,!0),g&&g.length&&g.removeClass("jstree-loading").attr("aria-busy",!1),delete this._data.massload[b.id],f):c._load_node.call(this,b,d)}},a.jstree.defaults.search={ajax:!1,fuzzy:!1,case_sensitive:!1,show_only_matches:!1,show_only_matches_children:!1,close_opened_onclear:!0,search_leaves_only:!1,search_callback:!1},a.jstree.plugins.search=function(c,d){this.bind=function(){d.bind.call(this),this._data.search.str="",this._data.search.dom=a(),this._data.search.res=[],this._data.search.opn=[],this._data.search.som=!1,this._data.search.smc=!1,this._data.search.hdn=[],this.element.on("search.jstree",a.proxy(function(b,c){if(this._data.search.som&&c.res.length){var d=this._model.data,e,f,g=[],h,i;for(e=0,f=c.res.length;f>e;e++)if(d[c.res[e]]&&!d[c.res[e]].state.hidden&&(g.push(c.res[e]),g=g.concat(d[c.res[e]].parents),this._data.search.smc))for(h=0,i=d[c.res[e]].children_d.length;i>h;h++)d[d[c.res[e]].children_d[h]]&&!d[d[c.res[e]].children_d[h]].state.hidden&&g.push(d[c.res[e]].children_d[h]);g=a.vakata.array_remove_item(a.vakata.array_unique(g),a.jstree.root),this._data.search.hdn=this.hide_all(!0),this.show_node(g,!0),this.redraw(!0)}},this)).on("clear_search.jstree",a.proxy(function(a,b){this._data.search.som&&b.res.length&&(this.show_node(this._data.search.hdn,!0),this.redraw(!0))},this))},this.search=function(c,d,e,f,g,h){if(c===!1||""===a.trim(c.toString()))return this.clear_search();f=this.get_node(f),f=f&&f.id?f.id:null,c=c.toString();var i=this.settings.search,j=i.ajax?i.ajax:!1,k=this._model.data,l=null,m=[],n=[],o,p;if(this._data.search.res.length&&!g&&this.clear_search(),e===b&&(e=i.show_only_matches),h===b&&(h=i.show_only_matches_children),!d&&j!==!1)return a.isFunction(j)?j.call(this,c,a.proxy(function(b){b&&b.d&&(b=b.d),this._load_nodes(a.isArray(b)?a.vakata.array_unique(b):[],function(){this.search(c,!0,e,f,g,h)})},this),f):(j=a.extend({},j),j.data||(j.data={}),j.data.str=c,f&&(j.data.inside=f),this._data.search.lastRequest&&this._data.search.lastRequest.abort(),this._data.search.lastRequest=a.ajax(j).fail(a.proxy(function(){this._data.core.last_error={error:"ajax",plugin:"search",id:"search_01",reason:"Could not load search parents",data:JSON.stringify(j)},this.settings.core.error.call(this,this._data.core.last_error)},this)).done(a.proxy(function(b){b&&b.d&&(b=b.d),this._load_nodes(a.isArray(b)?a.vakata.array_unique(b):[],function(){this.search(c,!0,e,f,g,h)})},this)),this._data.search.lastRequest);if(g||(this._data.search.str=c,this._data.search.dom=a(),this._data.search.res=[],this._data.search.opn=[],this._data.search.som=e,this._data.search.smc=h),l=new a.vakata.search(c,!0,{caseSensitive:i.case_sensitive,fuzzy:i.fuzzy}),a.each(k[f?f:a.jstree.root].children_d,function(a,b){var d=k[b];d.text&&!d.state.hidden&&(!i.search_leaves_only||d.state.loaded&&0===d.children.length)&&(i.search_callback&&i.search_callback.call(this,c,d)||!i.search_callback&&l.search(d.text).isMatch)&&(m.push(b),n=n.concat(d.parents))}),m.length){for(n=a.vakata.array_unique(n),o=0,p=n.length;p>o;o++)n[o]!==a.jstree.root&&k[n[o]]&&this.open_node(n[o],null,0)===!0&&this._data.search.opn.push(n[o]);g?(this._data.search.dom=this._data.search.dom.add(a(this.element[0].querySelectorAll("#"+a.map(m,function(b){return-1!=="0123456789".indexOf(b[0])?"\\3"+b[0]+" "+b.substr(1).replace(a.jstree.idregex,"\\$&"):b.replace(a.jstree.idregex,"\\$&")}).join(", #")))),this._data.search.res=a.vakata.array_unique(this._data.search.res.concat(m))):(this._data.search.dom=a(this.element[0].querySelectorAll("#"+a.map(m,function(b){return-1!=="0123456789".indexOf(b[0])?"\\3"+b[0]+" "+b.substr(1).replace(a.jstree.idregex,"\\$&"):b.replace(a.jstree.idregex,"\\$&")}).join(", #"))),this._data.search.res=m),this._data.search.dom.children(".jstree-anchor").addClass("jstree-search")}this.trigger("search",{nodes:this._data.search.dom,str:c,res:this._data.search.res,show_only_matches:e})},this.clear_search=function(){this.settings.search.close_opened_onclear&&this.close_node(this._data.search.opn,0),this.trigger("clear_search",{nodes:this._data.search.dom,str:this._data.search.str,res:this._data.search.res}),this._data.search.res.length&&(this._data.search.dom=a(this.element[0].querySelectorAll("#"+a.map(this._data.search.res,function(b){return-1!=="0123456789".indexOf(b[0])?"\\3"+b[0]+" "+b.substr(1).replace(a.jstree.idregex,"\\$&"):b.replace(a.jstree.idregex,"\\$&")}).join(", #"))),this._data.search.dom.children(".jstree-anchor").removeClass("jstree-search")),this._data.search.str="",this._data.search.res=[],this._data.search.opn=[],this._data.search.dom=a()},this.redraw_node=function(b,c,e,f){if(b=d.redraw_node.apply(this,arguments),b&&-1!==a.inArray(b.id,this._data.search.res)){var g,h,i=null;for(g=0,h=b.childNodes.length;h>g;g++)if(b.childNodes[g]&&b.childNodes[g].className&&-1!==b.childNodes[g].className.indexOf("jstree-anchor")){i=b.childNodes[g];break}i&&(i.className+=" jstree-search")}return b}},function(a){a.vakata.search=function(b,c,d){d=d||{},d=a.extend({},a.vakata.search.defaults,d),d.fuzzy!==!1&&(d.fuzzy=!0),b=d.caseSensitive?b:b.toLowerCase();var e=d.location,f=d.distance,g=d.threshold,h=b.length,i,j,k,l;return h>32&&(d.fuzzy=!1),d.fuzzy&&(i=1<<h-1,j=function(){var a={},c=0;for(c=0;h>c;c++)a[b.charAt(c)]=0;for(c=0;h>c;c++)a[b.charAt(c)]|=1<<h-c-1;return a}(),k=function(a,b){var c=a/h,d=Math.abs(e-b);return f?c+d/f:d?1:c}),l=function(a){if(a=d.caseSensitive?a:a.toLowerCase(),b===a||-1!==a.indexOf(b))return{isMatch:!0,score:0};if(!d.fuzzy)return{isMatch:!1,score:1};var c,f,l=a.length,m=g,n=a.indexOf(b,e),o,p,q=h+l,r,s,t,u,v,w=1,x=[];for(-1!==n&&(m=Math.min(k(0,n),m),n=a.lastIndexOf(b,e+h),-1!==n&&(m=Math.min(k(0,n),m))),n=-1,c=0;h>c;c++){o=0,p=q;while(p>o)k(c,e+p)<=m?o=p:q=p,p=Math.floor((q-o)/2+o);for(q=p,s=Math.max(1,e-p+1),t=Math.min(e+p,l)+h,u=new Array(t+2),u[t+1]=(1<<c)-1,f=t;f>=s;f--)if(v=j[a.charAt(f-1)],0===c?u[f]=(u[f+1]<<1|1)&v:u[f]=(u[f+1]<<1|1)&v|((r[f+1]|r[f])<<1|1)|r[f+1],u[f]&i&&(w=k(c,f-1),m>=w)){if(m=w,n=f-1,x.push(n),!(n>e))break;s=Math.max(1,2*e-n)}if(k(c+1,e)>m)break;r=u}return{isMatch:n>=0,score:w}},c===!0?{search:l}:l(c)},a.vakata.search.defaults={location:0,distance:100,threshold:.6,fuzzy:!1,caseSensitive:!1}}(a),a.jstree.defaults.sort=function(a,b){return this.get_text(a)>this.get_text(b)?1:-1},a.jstree.plugins.sort=function(b,c){this.bind=function(){c.bind.call(this),this.element.on("model.jstree",a.proxy(function(a,b){this.sort(b.parent,!0)},this)).on("rename_node.jstree create_node.jstree",a.proxy(function(a,b){this.sort(b.parent||b.node.parent,!1),this.redraw_node(b.parent||b.node.parent,!0)},this)).on("move_node.jstree copy_node.jstree",a.proxy(function(a,b){this.sort(b.parent,!1),this.redraw_node(b.parent,!0)},this))},this.sort=function(b,c){var d,e;if(b=this.get_node(b),b&&b.children&&b.children.length&&(b.children.sort(a.proxy(this.settings.sort,this)),c))for(d=0,e=b.children_d.length;e>d;d++)this.sort(b.children_d[d],!1)}};var m=!1;a.jstree.defaults.state={key:"jstree",events:"changed.jstree open_node.jstree close_node.jstree check_node.jstree uncheck_node.jstree",ttl:!1,filter:!1,preserve_loaded:!1},a.jstree.plugins.state=function(b,c){this.bind=function(){c.bind.call(this);var b=a.proxy(function(){this.element.on(this.settings.state.events,a.proxy(function(){m&&clearTimeout(m),m=setTimeout(a.proxy(function(){this.save_state()},this),100)},this)),this.trigger("state_ready")},this);this.element.on("ready.jstree",a.proxy(function(a,c){this.element.one("restore_state.jstree",b),this.restore_state()||b()},this))},this.save_state=function(){var b=this.get_state();this.settings.state.preserve_loaded||delete b.core.loaded;var c={state:b,ttl:this.settings.state.ttl,sec:+new Date};a.vakata.storage.set(this.settings.state.key,JSON.stringify(c))},this.restore_state=function(){var b=a.vakata.storage.get(this.settings.state.key);if(b)try{b=JSON.parse(b)}catch(c){return!1}return b&&b.ttl&&b.sec&&+new Date-b.sec>b.ttl?!1:(b&&b.state&&(b=b.state),b&&a.isFunction(this.settings.state.filter)&&(b=this.settings.state.filter.call(this,b)),b?(this.settings.state.preserve_loaded||delete b.core.loaded,this.element.one("set_state.jstree",function(c,d){d.instance.trigger("restore_state",{state:a.extend(!0,{},b)})}),this.set_state(b),!0):!1)},this.clear_state=function(){return a.vakata.storage.del(this.settings.state.key)}},function(a,b){a.vakata.storage={set:function(a,b){return window.localStorage.setItem(a,b)},get:function(a){return window.localStorage.getItem(a)},del:function(a){return window.localStorage.removeItem(a)}}}(a),a.jstree.defaults.types={"default":{}},a.jstree.defaults.types[a.jstree.root]={},a.jstree.plugins.types=function(c,d){this.init=function(c,e){var f,g;if(e&&e.types&&e.types["default"])for(f in e.types)if("default"!==f&&f!==a.jstree.root&&e.types.hasOwnProperty(f))for(g in e.types["default"])e.types["default"].hasOwnProperty(g)&&e.types[f][g]===b&&(e.types[f][g]=e.types["default"][g]);d.init.call(this,c,e),this._model.data[a.jstree.root].type=a.jstree.root},this.refresh=function(b,c){d.refresh.call(this,b,c),this._model.data[a.jstree.root].type=a.jstree.root},this.bind=function(){this.element.on("model.jstree",a.proxy(function(c,d){var e=this._model.data,f=d.nodes,g=this.settings.types,h,i,j="default",k;for(h=0,i=f.length;i>h;h++){if(j="default",e[f[h]].original&&e[f[h]].original.type&&g[e[f[h]].original.type]&&(j=e[f[h]].original.type),e[f[h]].data&&e[f[h]].data.jstree&&e[f[h]].data.jstree.type&&g[e[f[h]].data.jstree.type]&&(j=e[f[h]].data.jstree.type),e[f[h]].type=j,e[f[h]].icon===!0&&g[j].icon!==b&&(e[f[h]].icon=g[j].icon),g[j].li_attr!==b&&"object"==typeof g[j].li_attr)for(k in g[j].li_attr)if(g[j].li_attr.hasOwnProperty(k)){if("id"===k)continue;e[f[h]].li_attr[k]===b?e[f[h]].li_attr[k]=g[j].li_attr[k]:"class"===k&&(e[f[h]].li_attr["class"]=g[j].li_attr["class"]+" "+e[f[h]].li_attr["class"])}if(g[j].a_attr!==b&&"object"==typeof g[j].a_attr)for(k in g[j].a_attr)if(g[j].a_attr.hasOwnProperty(k)){if("id"===k)continue;e[f[h]].a_attr[k]===b?e[f[h]].a_attr[k]=g[j].a_attr[k]:"href"===k&&"#"===e[f[h]].a_attr[k]?e[f[h]].a_attr.href=g[j].a_attr.href:"class"===k&&(e[f[h]].a_attr["class"]=g[j].a_attr["class"]+" "+e[f[h]].a_attr["class"])}}e[a.jstree.root].type=a.jstree.root},this)),d.bind.call(this)},this.get_json=function(b,c,e){var f,g,h=this._model.data,i=c?a.extend(!0,{},c,{no_id:!1}):{},j=d.get_json.call(this,b,i,e);if(j===!1)return!1;if(a.isArray(j))for(f=0,g=j.length;g>f;f++)j[f].type=j[f].id&&h[j[f].id]&&h[j[f].id].type?h[j[f].id].type:"default",c&&c.no_id&&(delete j[f].id,j[f].li_attr&&j[f].li_attr.id&&delete j[f].li_attr.id,j[f].a_attr&&j[f].a_attr.id&&delete j[f].a_attr.id);else j.type=j.id&&h[j.id]&&h[j.id].type?h[j.id].type:"default",c&&c.no_id&&(j=this._delete_ids(j));return j},this._delete_ids=function(b){if(a.isArray(b)){for(var c=0,d=b.length;d>c;c++)b[c]=this._delete_ids(b[c]);return b}return delete b.id,
b.li_attr&&b.li_attr.id&&delete b.li_attr.id,b.a_attr&&b.a_attr.id&&delete b.a_attr.id,b.children&&a.isArray(b.children)&&(b.children=this._delete_ids(b.children)),b},this.check=function(c,e,f,g,h){if(d.check.call(this,c,e,f,g,h)===!1)return!1;e=e&&e.id?e:this.get_node(e),f=f&&f.id?f:this.get_node(f);var i=e&&e.id?h&&h.origin?h.origin:a.jstree.reference(e.id):null,j,k,l,m;switch(i=i&&i._model&&i._model.data?i._model.data:null,c){case"create_node":case"move_node":case"copy_node":if("move_node"!==c||-1===a.inArray(e.id,f.children)){if(j=this.get_rules(f),j.max_children!==b&&-1!==j.max_children&&j.max_children===f.children.length)return this._data.core.last_error={error:"check",plugin:"types",id:"types_01",reason:"max_children prevents function: "+c,data:JSON.stringify({chk:c,pos:g,obj:e&&e.id?e.id:!1,par:f&&f.id?f.id:!1})},!1;if(j.valid_children!==b&&-1!==j.valid_children&&-1===a.inArray(e.type||"default",j.valid_children))return this._data.core.last_error={error:"check",plugin:"types",id:"types_02",reason:"valid_children prevents function: "+c,data:JSON.stringify({chk:c,pos:g,obj:e&&e.id?e.id:!1,par:f&&f.id?f.id:!1})},!1;if(i&&e.children_d&&e.parents){for(k=0,l=0,m=e.children_d.length;m>l;l++)k=Math.max(k,i[e.children_d[l]].parents.length);k=k-e.parents.length+1}(0>=k||k===b)&&(k=1);do{if(j.max_depth!==b&&-1!==j.max_depth&&j.max_depth<k)return this._data.core.last_error={error:"check",plugin:"types",id:"types_03",reason:"max_depth prevents function: "+c,data:JSON.stringify({chk:c,pos:g,obj:e&&e.id?e.id:!1,par:f&&f.id?f.id:!1})},!1;f=this.get_node(f.parent),j=this.get_rules(f),k++}while(f)}}return!0},this.get_rules=function(a){if(a=this.get_node(a),!a)return!1;var c=this.get_type(a,!0);return c.max_depth===b&&(c.max_depth=-1),c.max_children===b&&(c.max_children=-1),c.valid_children===b&&(c.valid_children=-1),c},this.get_type=function(b,c){return b=this.get_node(b),b?c?a.extend({type:b.type},this.settings.types[b.type]):b.type:!1},this.set_type=function(c,d){var e=this._model.data,f,g,h,i,j,k,l,m;if(a.isArray(c)){for(c=c.slice(),g=0,h=c.length;h>g;g++)this.set_type(c[g],d);return!0}if(f=this.settings.types,c=this.get_node(c),!f[d]||!c)return!1;if(l=this.get_node(c,!0),l&&l.length&&(m=l.children(".jstree-anchor")),i=c.type,j=this.get_icon(c),c.type=d,(j===!0||!f[i]||f[i].icon!==b&&j===f[i].icon)&&this.set_icon(c,f[d].icon!==b?f[d].icon:!0),f[i]&&f[i].li_attr!==b&&"object"==typeof f[i].li_attr)for(k in f[i].li_attr)if(f[i].li_attr.hasOwnProperty(k)){if("id"===k)continue;"class"===k?(e[c.id].li_attr["class"]=(e[c.id].li_attr["class"]||"").replace(f[i].li_attr[k],""),l&&l.removeClass(f[i].li_attr[k])):e[c.id].li_attr[k]===f[i].li_attr[k]&&(e[c.id].li_attr[k]=null,l&&l.removeAttr(k))}if(f[i]&&f[i].a_attr!==b&&"object"==typeof f[i].a_attr)for(k in f[i].a_attr)if(f[i].a_attr.hasOwnProperty(k)){if("id"===k)continue;"class"===k?(e[c.id].a_attr["class"]=(e[c.id].a_attr["class"]||"").replace(f[i].a_attr[k],""),m&&m.removeClass(f[i].a_attr[k])):e[c.id].a_attr[k]===f[i].a_attr[k]&&("href"===k?(e[c.id].a_attr[k]="#",m&&m.attr("href","#")):(delete e[c.id].a_attr[k],m&&m.removeAttr(k)))}if(f[d].li_attr!==b&&"object"==typeof f[d].li_attr)for(k in f[d].li_attr)if(f[d].li_attr.hasOwnProperty(k)){if("id"===k)continue;e[c.id].li_attr[k]===b?(e[c.id].li_attr[k]=f[d].li_attr[k],l&&("class"===k?l.addClass(f[d].li_attr[k]):l.attr(k,f[d].li_attr[k]))):"class"===k&&(e[c.id].li_attr["class"]=f[d].li_attr[k]+" "+e[c.id].li_attr["class"],l&&l.addClass(f[d].li_attr[k]))}if(f[d].a_attr!==b&&"object"==typeof f[d].a_attr)for(k in f[d].a_attr)if(f[d].a_attr.hasOwnProperty(k)){if("id"===k)continue;e[c.id].a_attr[k]===b?(e[c.id].a_attr[k]=f[d].a_attr[k],m&&("class"===k?m.addClass(f[d].a_attr[k]):m.attr(k,f[d].a_attr[k]))):"href"===k&&"#"===e[c.id].a_attr[k]?(e[c.id].a_attr.href=f[d].a_attr.href,m&&m.attr("href",f[d].a_attr.href)):"class"===k&&(e[c.id].a_attr["class"]=f[d].a_attr["class"]+" "+e[c.id].a_attr["class"],m&&m.addClass(f[d].a_attr[k]))}return!0}},a.jstree.defaults.unique={case_sensitive:!1,trim_whitespace:!1,duplicate:function(a,b){return a+" ("+b+")"}},a.jstree.plugins.unique=function(c,d){this.check=function(b,c,e,f,g){if(d.check.call(this,b,c,e,f,g)===!1)return!1;if(c=c&&c.id?c:this.get_node(c),e=e&&e.id?e:this.get_node(e),!e||!e.children)return!0;var h="rename_node"===b?f:c.text,i=[],j=this.settings.unique.case_sensitive,k=this.settings.unique.trim_whitespace,l=this._model.data,m,n,o;for(m=0,n=e.children.length;n>m;m++)o=l[e.children[m]].text,j||(o=o.toLowerCase()),k&&(o=o.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,"")),i.push(o);switch(j||(h=h.toLowerCase()),k&&(h=h.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,"")),b){case"delete_node":return!0;case"rename_node":return o=c.text||"",j||(o=o.toLowerCase()),k&&(o=o.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,"")),m=-1===a.inArray(h,i)||c.text&&o===h,m||(this._data.core.last_error={error:"check",plugin:"unique",id:"unique_01",reason:"Child with name "+h+" already exists. Preventing: "+b,data:JSON.stringify({chk:b,pos:f,obj:c&&c.id?c.id:!1,par:e&&e.id?e.id:!1})}),m;case"create_node":return m=-1===a.inArray(h,i),m||(this._data.core.last_error={error:"check",plugin:"unique",id:"unique_04",reason:"Child with name "+h+" already exists. Preventing: "+b,data:JSON.stringify({chk:b,pos:f,obj:c&&c.id?c.id:!1,par:e&&e.id?e.id:!1})}),m;case"copy_node":return m=-1===a.inArray(h,i),m||(this._data.core.last_error={error:"check",plugin:"unique",id:"unique_02",reason:"Child with name "+h+" already exists. Preventing: "+b,data:JSON.stringify({chk:b,pos:f,obj:c&&c.id?c.id:!1,par:e&&e.id?e.id:!1})}),m;case"move_node":return m=c.parent===e.id&&(!g||!g.is_multi)||-1===a.inArray(h,i),m||(this._data.core.last_error={error:"check",plugin:"unique",id:"unique_03",reason:"Child with name "+h+" already exists. Preventing: "+b,data:JSON.stringify({chk:b,pos:f,obj:c&&c.id?c.id:!1,par:e&&e.id?e.id:!1})}),m}return!0},this.create_node=function(c,e,f,g,h){if(!e||e.text===b){if(null===c&&(c=a.jstree.root),c=this.get_node(c),!c)return d.create_node.call(this,c,e,f,g,h);if(f=f===b?"last":f,!f.toString().match(/^(before|after)$/)&&!h&&!this.is_loaded(c))return d.create_node.call(this,c,e,f,g,h);e||(e={});var i,j,k,l,m,n=this._model.data,o=this.settings.unique.case_sensitive,p=this.settings.unique.trim_whitespace,q=this.settings.unique.duplicate,r;for(j=i=this.get_string("New node"),k=[],l=0,m=c.children.length;m>l;l++)r=n[c.children[l]].text,o||(r=r.toLowerCase()),p&&(r=r.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,"")),k.push(r);l=1,r=j,o||(r=r.toLowerCase()),p&&(r=r.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,""));while(-1!==a.inArray(r,k))j=q.call(this,i,++l).toString(),r=j,o||(r=r.toLowerCase()),p&&(r=r.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,""));e.text=j}return d.create_node.call(this,c,e,f,g,h)}};var n=i.createElement("DIV");if(n.setAttribute("unselectable","on"),n.setAttribute("role","presentation"),n.className="jstree-wholerow",n.innerHTML="&#160;",a.jstree.plugins.wholerow=function(b,c){this.bind=function(){c.bind.call(this),this.element.on("ready.jstree set_state.jstree",a.proxy(function(){this.hide_dots()},this)).on("init.jstree loading.jstree ready.jstree",a.proxy(function(){this.get_container_ul().addClass("jstree-wholerow-ul")},this)).on("deselect_all.jstree",a.proxy(function(a,b){this.element.find(".jstree-wholerow-clicked").removeClass("jstree-wholerow-clicked")},this)).on("changed.jstree",a.proxy(function(a,b){this.element.find(".jstree-wholerow-clicked").removeClass("jstree-wholerow-clicked");var c=!1,d,e;for(d=0,e=b.selected.length;e>d;d++)c=this.get_node(b.selected[d],!0),c&&c.length&&c.children(".jstree-wholerow").addClass("jstree-wholerow-clicked")},this)).on("open_node.jstree",a.proxy(function(a,b){this.get_node(b.node,!0).find(".jstree-clicked").parent().children(".jstree-wholerow").addClass("jstree-wholerow-clicked")},this)).on("hover_node.jstree dehover_node.jstree",a.proxy(function(a,b){"hover_node"===a.type&&this.is_disabled(b.node)||this.get_node(b.node,!0).children(".jstree-wholerow")["hover_node"===a.type?"addClass":"removeClass"]("jstree-wholerow-hovered")},this)).on("contextmenu.jstree",".jstree-wholerow",a.proxy(function(b){if(this._data.contextmenu){b.preventDefault();var c=a.Event("contextmenu",{metaKey:b.metaKey,ctrlKey:b.ctrlKey,altKey:b.altKey,shiftKey:b.shiftKey,pageX:b.pageX,pageY:b.pageY});a(b.currentTarget).closest(".jstree-node").children(".jstree-anchor").first().trigger(c)}},this)).on("click.jstree",".jstree-wholerow",function(b){b.stopImmediatePropagation();var c=a.Event("click",{metaKey:b.metaKey,ctrlKey:b.ctrlKey,altKey:b.altKey,shiftKey:b.shiftKey});a(b.currentTarget).closest(".jstree-node").children(".jstree-anchor").first().trigger(c).focus()}).on("dblclick.jstree",".jstree-wholerow",function(b){b.stopImmediatePropagation();var c=a.Event("dblclick",{metaKey:b.metaKey,ctrlKey:b.ctrlKey,altKey:b.altKey,shiftKey:b.shiftKey});a(b.currentTarget).closest(".jstree-node").children(".jstree-anchor").first().trigger(c).focus()}).on("click.jstree",".jstree-leaf > .jstree-ocl",a.proxy(function(b){b.stopImmediatePropagation();var c=a.Event("click",{metaKey:b.metaKey,ctrlKey:b.ctrlKey,altKey:b.altKey,shiftKey:b.shiftKey});a(b.currentTarget).closest(".jstree-node").children(".jstree-anchor").first().trigger(c).focus()},this)).on("mouseover.jstree",".jstree-wholerow, .jstree-icon",a.proxy(function(a){return a.stopImmediatePropagation(),this.is_disabled(a.currentTarget)||this.hover_node(a.currentTarget),!1},this)).on("mouseleave.jstree",".jstree-node",a.proxy(function(a){this.dehover_node(a.currentTarget)},this))},this.teardown=function(){this.settings.wholerow&&this.element.find(".jstree-wholerow").remove(),c.teardown.call(this)},this.redraw_node=function(b,d,e,f){if(b=c.redraw_node.apply(this,arguments)){var g=n.cloneNode(!0);-1!==a.inArray(b.id,this._data.core.selected)&&(g.className+=" jstree-wholerow-clicked"),this._data.core.focused&&this._data.core.focused===b.id&&(g.className+=" jstree-wholerow-hovered"),b.insertBefore(g,b.childNodes[0])}return b}},window.customElements&&Object&&Object.create){var o=Object.create(HTMLElement.prototype);o.createdCallback=function(){var b={core:{},plugins:[]},c;for(c in a.jstree.plugins)a.jstree.plugins.hasOwnProperty(c)&&this.attributes[c]&&(b.plugins.push(c),this.getAttribute(c)&&JSON.parse(this.getAttribute(c))&&(b[c]=JSON.parse(this.getAttribute(c))));for(c in a.jstree.defaults.core)a.jstree.defaults.core.hasOwnProperty(c)&&this.attributes[c]&&(b.core[c]=JSON.parse(this.getAttribute(c))||this.getAttribute(c));a(this).jstree(b)};try{window.customElements.define("vakata-jstree",function(){},{prototype:o})}catch(p){}}}});
})();
(function(){
//     keymaster.js
//     (c) 2011-2013 Thomas Fuchs
//     keymaster.js may be freely distributed under the MIT license.

;(function(global){
  var k,
    _handlers = {},
    _mods = { 16: false, 18: false, 17: false, 91: false },
    _scope = 'all',
    // modifier keys
    _MODIFIERS = {
      '⇧': 16, shift: 16,
      '⌥': 18, alt: 18, option: 18,
      '⌃': 17, ctrl: 17, control: 17,
      '⌘': 91, command: 91
    },
    // special keys
    _MAP = {
      backspace: 8, tab: 9, clear: 12,
      enter: 13, 'return': 13,
      esc: 27, escape: 27, space: 32,
      left: 37, up: 38,
      right: 39, down: 40,
      del: 46, 'delete': 46,
      home: 36, end: 35,
      pageup: 33, pagedown: 34,
      ',': 188, '.': 190, '/': 191,
      '`': 192, '-': 189, '=': 187,
      ';': 186, '\'': 222,
      '[': 219, ']': 221, '\\': 220
    },
    code = function(x){
      return _MAP[x] || x.toUpperCase().charCodeAt(0);
    },
    _downKeys = [];

  for(k=1;k<20;k++) _MAP['f'+k] = 111+k;

  // IE doesn't support Array#indexOf, so have a simple replacement
  function index(array, item){
    var i = array.length;
    while(i--) if(array[i]===item) return i;
    return -1;
  }

  // for comparing mods before unassignment
  function compareArray(a1, a2) {
    if (a1.length != a2.length) return false;
    for (var i = 0; i < a1.length; i++) {
        if (a1[i] !== a2[i]) return false;
    }
    return true;
  }

  var modifierMap = {
      16:'shiftKey',
      18:'altKey',
      17:'ctrlKey',
      91:'metaKey'
  };
  function updateModifierKey(event) {
      for(k in _mods) _mods[k] = event[modifierMap[k]];
  };

  // handle keydown event
  function dispatch(event) {
    var key, handler, k, i, modifiersMatch, scope;
    key = event.keyCode;

    if (index(_downKeys, key) == -1) {
        _downKeys.push(key);
    }

    // if a modifier key, set the key.<modifierkeyname> property to true and return
    if(key == 93 || key == 224) key = 91; // right command on webkit, command on Gecko
    if(key in _mods) {
      _mods[key] = true;
      // 'assignKey' from inside this closure is exported to window.key
      for(k in _MODIFIERS) if(_MODIFIERS[k] == key) assignKey[k] = true;
      return;
    }
    updateModifierKey(event);

    // see if we need to ignore the keypress (filter() can can be overridden)
    // by default ignore key presses if a select, textarea, or input is focused
    if(!assignKey.filter.call(this, event)) return;

    // abort if no potentially matching shortcuts found
    if (!(key in _handlers)) return;

    scope = getScope();

    // for each potential shortcut
    for (i = 0; i < _handlers[key].length; i++) {
      handler = _handlers[key][i];

      // see if it's in the current scope
      if(handler.scope == scope || handler.scope == 'all'){
        // check if modifiers match if any
        modifiersMatch = handler.mods.length > 0;
        for(k in _mods)
          if((!_mods[k] && index(handler.mods, +k) > -1) ||
            (_mods[k] && index(handler.mods, +k) == -1)) modifiersMatch = false;
        // call the handler and stop the event if neccessary
        if((handler.mods.length == 0 && !_mods[16] && !_mods[18] && !_mods[17] && !_mods[91]) || modifiersMatch){
          if(handler.method(event, handler)===false){
            if(event.preventDefault) event.preventDefault();
              else event.returnValue = false;
            if(event.stopPropagation) event.stopPropagation();
            if(event.cancelBubble) event.cancelBubble = true;
          }
        }
      }
    }
  };

  // unset modifier keys on keyup
  function clearModifier(event){
    var key = event.keyCode, k,
        i = index(_downKeys, key);

    // remove key from _downKeys
    if (i >= 0) {
        _downKeys.splice(i, 1);
    }

    if(key == 93 || key == 224) key = 91;
    if(key in _mods) {
      _mods[key] = false;
      for(k in _MODIFIERS) if(_MODIFIERS[k] == key) assignKey[k] = false;
    }
  };

  function resetModifiers() {
    for(k in _mods) _mods[k] = false;
    for(k in _MODIFIERS) assignKey[k] = false;
  };

  // parse and assign shortcut
  function assignKey(key, scope, method){
    var keys, mods;
    keys = getKeys(key);
    if (method === undefined) {
      method = scope;
      scope = 'all';
    }

    // for each shortcut
    for (var i = 0; i < keys.length; i++) {
      // set modifier keys if any
      mods = [];
      key = keys[i].split('+');
      if (key.length > 1){
        mods = getMods(key);
        key = [key[key.length-1]];
      }
      // convert to keycode and...
      key = key[0]
      key = code(key);
      // ...store handler
      if (!(key in _handlers)) _handlers[key] = [];
      _handlers[key].push({ shortcut: keys[i], scope: scope, method: method, key: keys[i], mods: mods });
    }
  };

  // unbind all handlers for given key in current scope
  function unbindKey(key, scope) {
    var multipleKeys, keys,
      mods = [],
      i, j, obj;

    multipleKeys = getKeys(key);

    for (j = 0; j < multipleKeys.length; j++) {
      keys = multipleKeys[j].split('+');

      if (keys.length > 1) {
        mods = getMods(keys);
      }

      key = keys[keys.length - 1];
      key = code(key);

      if (scope === undefined) {
        scope = getScope();
      }
      if (!_handlers[key]) {
        return;
      }
      for (i = 0; i < _handlers[key].length; i++) {
        obj = _handlers[key][i];
        // only clear handlers if correct scope and mods match
        if (obj.scope === scope && compareArray(obj.mods, mods)) {
          _handlers[key][i] = {};
        }
      }
    }
  };

  // Returns true if the key with code 'keyCode' is currently down
  // Converts strings into key codes.
  function isPressed(keyCode) {
      if (typeof(keyCode)=='string') {
        keyCode = code(keyCode);
      }
      return index(_downKeys, keyCode) != -1;
  }

  function getPressedKeyCodes() {
      return _downKeys.slice(0);
  }

  function filter(event){
    var tagName = (event.target || event.srcElement).tagName;
    // ignore keypressed in any elements that support keyboard data input
    return !(tagName == 'INPUT' || tagName == 'SELECT' || tagName == 'TEXTAREA');
  }

  // initialize key.<modifier> to false
  for(k in _MODIFIERS) assignKey[k] = false;

  // set current scope (default 'all')
  function setScope(scope){ _scope = scope || 'all' };
  function getScope(){ return _scope || 'all' };

  // delete all handlers for a given scope
  function deleteScope(scope){
    var key, handlers, i;

    for (key in _handlers) {
      handlers = _handlers[key];
      for (i = 0; i < handlers.length; ) {
        if (handlers[i].scope === scope) handlers.splice(i, 1);
        else i++;
      }
    }
  };

  // abstract key logic for assign and unassign
  function getKeys(key) {
    var keys;
    key = key.replace(/\s/g, '');
    keys = key.split(',');
    if ((keys[keys.length - 1]) == '') {
      keys[keys.length - 2] += ',';
    }
    return keys;
  }

  // abstract mods logic for assign and unassign
  function getMods(key) {
    var mods = key.slice(0, key.length - 1);
    for (var mi = 0; mi < mods.length; mi++)
    mods[mi] = _MODIFIERS[mods[mi]];
    return mods;
  }

  // cross-browser events
  function addEvent(object, event, method) {
    if (object.addEventListener)
      object.addEventListener(event, method, false);
    else if(object.attachEvent)
      object.attachEvent('on'+event, function(){ method(window.event) });
  };

  // set the handlers globally on document
  addEvent(document, 'keydown', function(event) { dispatch(event) }); // Passing _scope to a callback to ensure it remains the same by execution. Fixes #48
  addEvent(document, 'keyup', clearModifier);

  // reset modifiers to false whenever the window is (re)focused.
  addEvent(window, 'focus', resetModifiers);

  // store previously defined key
  var previousKey = global.key;

  // restore previously defined key and return reference to our key object
  function noConflict() {
    var k = global.key;
    global.key = previousKey;
    return k;
  }

  // set window.key and window.key.set/get/deleteScope, and the default filter
  global.key = assignKey;
  global.key.setScope = setScope;
  global.key.getScope = getScope;
  global.key.deleteScope = deleteScope;
  global.key.filter = filter;
  global.key.isPressed = isPressed;
  global.key.getPressedKeyCodes = getPressedKeyCodes;
  global.key.noConflict = noConflict;
  global.key.unbind = unbindKey;

  if(typeof module !== 'undefined') module.exports = assignKey;

})(this);

})();
(function(){
window['jquery.pjax.js'] = function () {
      /*!
 * Copyright 2012, Chris Wanstrath
 * Released under the MIT License
 * https://github.com/defunkt/jquery-pjax
 */

(function($){

// When called on a container with a selector, fetches the href with
// ajax into the container or with the data-pjax attribute on the link
// itself.
//
// Tries to make sure the back button and ctrl+click work the way
// you'd expect.
//
// Exported as $.fn.pjax
//
// Accepts a jQuery ajax options object that may include these
// pjax specific options:
//
//
// container - String selector for the element where to place the response body.
//      push - Whether to pushState the URL. Defaults to true (of course).
//   replace - Want to use replaceState instead? That's cool.
//
// For convenience the second parameter can be either the container or
// the options object.
//
// Returns the jQuery object
function fnPjax(selector, container, options) {
  options = optionsFor(container, options)
  return this.on('click.pjax', selector, function(event) {
    var opts = options
    if (!opts.container) {
      opts = $.extend({}, options)
      opts.container = $(this).attr('data-pjax')
    }
    handleClick(event, opts)
  })
}

// Public: pjax on click handler
//
// Exported as $.pjax.click.
//
// event   - "click" jQuery.Event
// options - pjax options
//
// Examples
//
//   $(document).on('click', 'a', $.pjax.click)
//   // is the same as
//   $(document).pjax('a')
//
// Returns nothing.
function handleClick(event, container, options) {
  options = optionsFor(container, options)

  var link = event.currentTarget
  var $link = $(link)

  if (link.tagName.toUpperCase() !== 'A')
    throw "$.fn.pjax or $.pjax.click requires an anchor element"

  // Middle click, cmd click, and ctrl click should open
  // links in a new tab as normal.
  if ( event.which > 1 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey )
    return

  // Ignore cross origin links
  if ( location.protocol !== link.protocol || location.hostname !== link.hostname )
    return

  // Ignore case when a hash is being tacked on the current URL
  if ( link.href.indexOf('#') > -1 && stripHash(link) == stripHash(location) )
    return

  // Ignore event with default prevented
  if (event.isDefaultPrevented())
    return

  var defaults = {
    url: link.href,
    container: $link.attr('data-pjax'),
    target: link
  }

  var opts = $.extend({}, defaults, options)
  var clickEvent = $.Event('pjax:click')
  $link.trigger(clickEvent, [opts])

  if (!clickEvent.isDefaultPrevented()) {
    pjax(opts)
    event.preventDefault()
    $link.trigger('pjax:clicked', [opts])
  }
}

// Public: pjax on form submit handler
//
// Exported as $.pjax.submit
//
// event   - "click" jQuery.Event
// options - pjax options
//
// Examples
//
//  $(document).on('submit', 'form', function(event) {
//    $.pjax.submit(event, '[data-pjax-container]')
//  })
//
// Returns nothing.
function handleSubmit(event, container, options) {
  options = optionsFor(container, options)

  var form = event.currentTarget
  var $form = $(form)

  if (form.tagName.toUpperCase() !== 'FORM')
    throw "$.pjax.submit requires a form element"

  var defaults = {
    type: ($form.attr('method') || 'GET').toUpperCase(),
    url: $form.attr('action'),
    container: $form.attr('data-pjax'),
    target: form
  }

  if (defaults.type !== 'GET' && window.FormData !== undefined) {
    defaults.data = new FormData(form)
    defaults.processData = false
    defaults.contentType = false
  } else {
    // Can't handle file uploads, exit
    if ($form.find(':file').length) {
      return
    }

    // Fallback to manually serializing the fields
    defaults.data = $form.serializeArray()
  }

  pjax($.extend({}, defaults, options))

  event.preventDefault()
}

// Loads a URL with ajax, puts the response body inside a container,
// then pushState()'s the loaded URL.
//
// Works just like $.ajax in that it accepts a jQuery ajax
// settings object (with keys like url, type, data, etc).
//
// Accepts these extra keys:
//
// container - String selector for where to stick the response body.
//      push - Whether to pushState the URL. Defaults to true (of course).
//   replace - Want to use replaceState instead? That's cool.
//
// Use it just like $.ajax:
//
//   var xhr = $.pjax({ url: this.href, container: '#main' })
//   console.log( xhr.readyState )
//
// Returns whatever $.ajax returns.
function pjax(options) {
  options = $.extend(true, {}, $.ajaxSettings, pjax.defaults, options)

  if ($.isFunction(options.url)) {
    options.url = options.url()
  }

  var hash = parseURL(options.url).hash

  var containerType = $.type(options.container)
  if (containerType !== 'string') {
    throw "expected string value for 'container' option; got " + containerType
  }
  var context = options.context = $(options.container)
  if (!context.length) {
    throw "the container selector '" + options.container + "' did not match anything"
  }

  // We want the browser to maintain two separate internal caches: one
  // for pjax'd partial page loads and one for normal page loads.
  // Without adding this secret parameter, some browsers will often
  // confuse the two.
  if (!options.data) options.data = {}
  if ($.isArray(options.data)) {
    options.data.push({name: '_pjax', value: options.container})
  } else {
    options.data._pjax = options.container
  }

  function fire(type, args, props) {
    if (!props) props = {}
    props.relatedTarget = options.target
    var event = $.Event(type, props)
    context.trigger(event, args)
    return !event.isDefaultPrevented()
  }

  var timeoutTimer

  options.beforeSend = function(xhr, settings) {
    // No timeout for non-GET requests
    // Its not safe to request the resource again with a fallback method.
    if (settings.type !== 'GET') {
      settings.timeout = 0
    }

    xhr.setRequestHeader('X-PJAX', 'true')
    xhr.setRequestHeader('X-PJAX-Container', options.container)

    if (!fire('pjax:beforeSend', [xhr, settings]))
      return false

    if (settings.timeout > 0) {
      timeoutTimer = setTimeout(function() {
        if (fire('pjax:timeout', [xhr, options]))
          xhr.abort('timeout')
      }, settings.timeout)

      // Clear timeout setting so jquerys internal timeout isn't invoked
      settings.timeout = 0
    }

    var url = parseURL(settings.url)
    if (hash) url.hash = hash
    options.requestUrl = stripInternalParams(url)
  }

  options.complete = function(xhr, textStatus) {
    if (timeoutTimer)
      clearTimeout(timeoutTimer)

    fire('pjax:complete', [xhr, textStatus, options])

    fire('pjax:end', [xhr, options])
  }

  options.error = function(xhr, textStatus, errorThrown) {
    var container = extractContainer("", xhr, options)

    var allowed = fire('pjax:error', [xhr, textStatus, errorThrown, options])
    if (options.type == 'GET' && textStatus !== 'abort' && allowed) {
      locationReplace(container.url)
    }
  }

  options.success = function(data, status, xhr) {
    var previousState = pjax.state

    // If $.pjax.defaults.version is a function, invoke it first.
    // Otherwise it can be a static string.
    var currentVersion = (typeof $.pjax.defaults.version === 'function') ?
      $.pjax.defaults.version() :
      $.pjax.defaults.version

    var latestVersion = xhr.getResponseHeader('X-PJAX-Version')

    var container = extractContainer(data, xhr, options)

    var url = parseURL(container.url)
    if (hash) {
      url.hash = hash
      container.url = url.href
    }

    // If there is a layout version mismatch, hard load the new url
    if (currentVersion && latestVersion && currentVersion !== latestVersion) {
      locationReplace(container.url)
      return
    }

    // If the new response is missing a body, hard load the page
    if (!container.contents) {
      locationReplace(container.url)
      return
    }

    pjax.state = {
      id: options.id || uniqueId(),
      url: container.url,
      title: container.title,
      container: options.container,
      fragment: options.fragment,
      timeout: options.timeout
    }

    if (options.push || options.replace) {
      window.history.replaceState(pjax.state, container.title, container.url)
    }

    // Only blur the focus if the focused element is within the container.
    var blurFocus = $.contains(options.container, document.activeElement)

    // Clear out any focused controls before inserting new page contents.
    if (blurFocus) {
      try {
        document.activeElement.blur()
      } catch (e) { }
    }

    if (container.title) document.title = container.title

    fire('pjax:beforeReplace', [container.contents, options], {
      state: pjax.state,
      previousState: previousState
    })
    context.html(container.contents)

    // FF bug: Won't autofocus fields that are inserted via JS.
    // This behavior is incorrect. So if theres no current focus, autofocus
    // the last field.
    //
    // http://www.w3.org/html/wg/drafts/html/master/forms.html
    var autofocusEl = context.find('input[autofocus], textarea[autofocus]').last()[0]
    if (autofocusEl && document.activeElement !== autofocusEl) {
      autofocusEl.focus()
    }

    executeScriptTags(container.scripts)

    var scrollTo = options.scrollTo

    // Ensure browser scrolls to the element referenced by the URL anchor
    if (hash) {
      var name = decodeURIComponent(hash.slice(1))
      var target = document.getElementById(name) || document.getElementsByName(name)[0]
      if (target) scrollTo = $(target).offset().top
    }

    if (typeof scrollTo == 'number') $(window).scrollTop(scrollTo)

    fire('pjax:success', [data, status, xhr, options])
  }


  // Initialize pjax.state for the initial page load. Assume we're
  // using the container and options of the link we're loading for the
  // back button to the initial page. This ensures good back button
  // behavior.
  if (!pjax.state) {
    pjax.state = {
      id: uniqueId(),
      url: window.location.href,
      title: document.title,
      container: options.container,
      fragment: options.fragment,
      timeout: options.timeout
    }
    window.history.replaceState(pjax.state, document.title)
  }

  // Cancel the current request if we're already pjaxing
  abortXHR(pjax.xhr)

  pjax.options = options
  var xhr = pjax.xhr = $.ajax(options)

  if (xhr.readyState > 0) {
    if (options.push && !options.replace) {
      // Cache current container element before replacing it
      cachePush(pjax.state.id, [options.container, cloneContents(context)])

      window.history.pushState(null, "", options.requestUrl)
    }

    fire('pjax:start', [xhr, options])
    fire('pjax:send', [xhr, options])
  }

  return pjax.xhr
}

// Public: Reload current page with pjax.
//
// Returns whatever $.pjax returns.
function pjaxReload(container, options) {
  var defaults = {
    url: window.location.href,
    push: false,
    replace: true,
    scrollTo: false
  }

  return pjax($.extend(defaults, optionsFor(container, options)))
}

// Internal: Hard replace current state with url.
//
// Work for around WebKit
//   https://bugs.webkit.org/show_bug.cgi?id=93506
//
// Returns nothing.
function locationReplace(url) {
  window.history.replaceState(null, "", pjax.state.url)
  window.location.replace(url)
}


var initialPop = true
var initialURL = window.location.href
var initialState = window.history.state

// Initialize $.pjax.state if possible
// Happens when reloading a page and coming forward from a different
// session history.
if (initialState && initialState.container) {
  pjax.state = initialState
}

// Non-webkit browsers don't fire an initial popstate event
if ('state' in window.history) {
  initialPop = false
}

// popstate handler takes care of the back and forward buttons
//
// You probably shouldn't use pjax on pages with other pushState
// stuff yet.
function onPjaxPopstate(event) {

  // Hitting back or forward should override any pending PJAX request.
  if (!initialPop) {
    abortXHR(pjax.xhr)
  }

  var previousState = pjax.state
  var state = event.state
  var direction

  if (state && state.container) {
    // When coming forward from a separate history session, will get an
    // initial pop with a state we are already at. Skip reloading the current
    // page.
    if (initialPop && initialURL == state.url) return

    if (previousState) {
      // If popping back to the same state, just skip.
      // Could be clicking back from hashchange rather than a pushState.
      if (previousState.id === state.id) return

      // Since state IDs always increase, we can deduce the navigation direction
      direction = previousState.id < state.id ? 'forward' : 'back'
    }

    var cache = cacheMapping[state.id] || []
    var containerSelector = cache[0] || state.container
    var container = $(containerSelector), contents = cache[1]

    if (container.length) {
      if (previousState) {
        // Cache current container before replacement and inform the
        // cache which direction the history shifted.
        cachePop(direction, previousState.id, [containerSelector, cloneContents(container)])
      }

      var popstateEvent = $.Event('pjax:popstate', {
        state: state,
        direction: direction
      })
      container.trigger(popstateEvent)

      var options = {
        id: state.id,
        url: state.url,
        container: containerSelector,
        push: false,
        fragment: state.fragment,
        timeout: state.timeout,
        scrollTo: false
      }

      if (contents) {
        container.trigger('pjax:start', [null, options])

        pjax.state = state
        if (state.title) document.title = state.title
        var beforeReplaceEvent = $.Event('pjax:beforeReplace', {
          state: state,
          previousState: previousState
        })
        container.trigger(beforeReplaceEvent, [contents, options])
        container.html(contents)

        container.trigger('pjax:end', [null, options])
      } else {
        pjax(options)
      }

      // Force reflow/relayout before the browser tries to restore the
      // scroll position.
      container[0].offsetHeight
    } else {
      locationReplace(location.href)
    }
  }
  initialPop = false
}

// Fallback version of main pjax function for browsers that don't
// support pushState.
//
// Returns nothing since it retriggers a hard form submission.
function fallbackPjax(options) {
  var url = $.isFunction(options.url) ? options.url() : options.url,
      method = options.type ? options.type.toUpperCase() : 'GET'

  var form = $('<form>', {
    method: method === 'GET' ? 'GET' : 'POST',
    action: url,
    style: 'display:none'
  })

  if (method !== 'GET' && method !== 'POST') {
    form.append($('<input>', {
      type: 'hidden',
      name: '_method',
      value: method.toLowerCase()
    }))
  }

  var data = options.data
  if (typeof data === 'string') {
    $.each(data.split('&'), function(index, value) {
      var pair = value.split('=')
      form.append($('<input>', {type: 'hidden', name: pair[0], value: pair[1]}))
    })
  } else if ($.isArray(data)) {
    $.each(data, function(index, value) {
      form.append($('<input>', {type: 'hidden', name: value.name, value: value.value}))
    })
  } else if (typeof data === 'object') {
    var key
    for (key in data)
      form.append($('<input>', {type: 'hidden', name: key, value: data[key]}))
  }

  $(document.body).append(form)
  form.submit()
}

// Internal: Abort an XmlHttpRequest if it hasn't been completed,
// also removing its event handlers.
function abortXHR(xhr) {
  if ( xhr && xhr.readyState < 4) {
    xhr.onreadystatechange = $.noop
    xhr.abort()
  }
}

// Internal: Generate unique id for state object.
//
// Use a timestamp instead of a counter since ids should still be
// unique across page loads.
//
// Returns Number.
function uniqueId() {
  return (new Date).getTime()
}

function cloneContents(container) {
  var cloned = container.clone()
  // Unmark script tags as already being eval'd so they can get executed again
  // when restored from cache. HAXX: Uses jQuery internal method.
  cloned.find('script').each(function(){
    if (!this.src) jQuery._data(this, 'globalEval', false)
  })
  return cloned.contents()
}

// Internal: Strip internal query params from parsed URL.
//
// Returns sanitized url.href String.
function stripInternalParams(url) {
  url.search = url.search.replace(/([?&])(_pjax|_)=[^&]*/g, '')
  return url.href.replace(/\?($|#)/, '$1')
}

// Internal: Parse URL components and returns a Locationish object.
//
// url - String URL
//
// Returns HTMLAnchorElement that acts like Location.
function parseURL(url) {
  var a = document.createElement('a')
  a.href = url
  return a
}

// Internal: Return the `href` component of given URL object with the hash
// portion removed.
//
// location - Location or HTMLAnchorElement
//
// Returns String
function stripHash(location) {
  return location.href.replace(/#.*/, '')
}

// Internal: Build options Object for arguments.
//
// For convenience the first parameter can be either the container or
// the options object.
//
// Examples
//
//   optionsFor('#container')
//   // => {container: '#container'}
//
//   optionsFor('#container', {push: true})
//   // => {container: '#container', push: true}
//
//   optionsFor({container: '#container', push: true})
//   // => {container: '#container', push: true}
//
// Returns options Object.
function optionsFor(container, options) {
  if (container && options) {
    options = $.extend({}, options)
    options.container = container
    return options
  } else if ($.isPlainObject(container)) {
    return container
  } else {
    return {container: container}
  }
}

// Internal: Filter and find all elements matching the selector.
//
// Where $.fn.find only matches descendants, findAll will test all the
// top level elements in the jQuery object as well.
//
// elems    - jQuery object of Elements
// selector - String selector to match
//
// Returns a jQuery object.
function findAll(elems, selector) {
  return elems.filter(selector).add(elems.find(selector))
}

function parseHTML(html) {
  return $.parseHTML(html, document, true)
}

// Internal: Extracts container and metadata from response.
//
// 1. Extracts X-PJAX-URL header if set
// 2. Extracts inline <title> tags
// 3. Builds response Element and extracts fragment if set
//
// data    - String response data
// xhr     - XHR response
// options - pjax options Object
//
// Returns an Object with url, title, and contents keys.
function extractContainer(data, xhr, options) {
  var obj = {}, fullDocument = /<html/i.test(data)

  // Prefer X-PJAX-URL header if it was set, otherwise fallback to
  // using the original requested url.
  var serverUrl = xhr.getResponseHeader('X-PJAX-URL')
  obj.url = serverUrl ? stripInternalParams(parseURL(serverUrl)) : options.requestUrl

  // Attempt to parse response html into elements
  if (fullDocument) {
    var $head = $(parseHTML(data.match(/<head[^>]*>([\s\S.]*)<\/head>/i)[0]))
    var $body = $(parseHTML(data.match(/<body[^>]*>([\s\S.]*)<\/body>/i)[0]))
  } else {
    var $head = $body = $(parseHTML(data))
  }

  // If response data is empty, return fast
  if ($body.length === 0)
    return obj

  // If there's a <title> tag in the header, use it as
  // the page's title.
  obj.title = findAll($head, 'title').last().text()

  if (options.fragment) {
    // If they specified a fragment, look for it in the response
    // and pull it out.
    if (options.fragment === 'body') {
      var $fragment = $body
    } else {
      var $fragment = findAll($body, options.fragment).first()
    }

    if ($fragment.length) {
      obj.contents = options.fragment === 'body' ? $fragment : $fragment.contents()

      // If there's no title, look for data-title and title attributes
      // on the fragment
      if (!obj.title)
        obj.title = $fragment.attr('title') || $fragment.data('title')
    }

  } else if (!fullDocument) {
    obj.contents = $body
  }

  // Clean up any <title> tags
  if (obj.contents) {
    // Remove any parent title elements
    obj.contents = obj.contents.not(function() { return $(this).is('title') })

    // Then scrub any titles from their descendants
    obj.contents.find('title').remove()

    // Gather all script[src] elements
    obj.scripts = findAll(obj.contents, 'script[src]').remove()
    obj.contents = obj.contents.not(obj.scripts)
  }

  // Trim any whitespace off the title
  if (obj.title) obj.title = $.trim(obj.title)

  return obj
}

// Load an execute scripts using standard script request.
//
// Avoids jQuery's traditional $.getScript which does a XHR request and
// globalEval.
//
// scripts - jQuery object of script Elements
//
// Returns nothing.
function executeScriptTags(scripts) {
  if (!scripts) return

  var existingScripts = $('script[src]')

  scripts.each(function() {
    var src = this.src
    var matchedScripts = existingScripts.filter(function() {
      return this.src === src
    })
    if (matchedScripts.length) return

    var script = document.createElement('script')
    var type = $(this).attr('type')
    if (type) script.type = type
    script.src = $(this).attr('src')
    document.head.appendChild(script)
  })
}

// Internal: History DOM caching class.
var cacheMapping      = {}
var cacheForwardStack = []
var cacheBackStack    = []

// Push previous state id and container contents into the history
// cache. Should be called in conjunction with `pushState` to save the
// previous container contents.
//
// id    - State ID Number
// value - DOM Element to cache
//
// Returns nothing.
function cachePush(id, value) {
  cacheMapping[id] = value
  cacheBackStack.push(id)

  // Remove all entries in forward history stack after pushing a new page.
  trimCacheStack(cacheForwardStack, 0)

  // Trim back history stack to max cache length.
  trimCacheStack(cacheBackStack, pjax.defaults.maxCacheLength)
}

// Shifts cache from directional history cache. Should be
// called on `popstate` with the previous state id and container
// contents.
//
// direction - "forward" or "back" String
// id        - State ID Number
// value     - DOM Element to cache
//
// Returns nothing.
function cachePop(direction, id, value) {
  var pushStack, popStack
  cacheMapping[id] = value

  if (direction === 'forward') {
    pushStack = cacheBackStack
    popStack  = cacheForwardStack
  } else {
    pushStack = cacheForwardStack
    popStack  = cacheBackStack
  }

  pushStack.push(id)
  if (id = popStack.pop())
    delete cacheMapping[id]

  // Trim whichever stack we just pushed to to max cache length.
  trimCacheStack(pushStack, pjax.defaults.maxCacheLength)
}

// Trim a cache stack (either cacheBackStack or cacheForwardStack) to be no
// longer than the specified length, deleting cached DOM elements as necessary.
//
// stack  - Array of state IDs
// length - Maximum length to trim to
//
// Returns nothing.
function trimCacheStack(stack, length) {
  while (stack.length > length)
    delete cacheMapping[stack.shift()]
}

// Public: Find version identifier for the initial page load.
//
// Returns String version or undefined.
function findVersion() {
  return $('meta').filter(function() {
    var name = $(this).attr('http-equiv')
    return name && name.toUpperCase() === 'X-PJAX-VERSION'
  }).attr('content')
}

// Install pjax functions on $.pjax to enable pushState behavior.
//
// Does nothing if already enabled.
//
// Examples
//
//     $.pjax.enable()
//
// Returns nothing.
function enable() {
  $.fn.pjax = fnPjax
  $.pjax = pjax
  $.pjax.enable = $.noop
  $.pjax.disable = disable
  $.pjax.click = handleClick
  $.pjax.submit = handleSubmit
  $.pjax.reload = pjaxReload
  $.pjax.defaults = {
    timeout: 650,
    push: true,
    replace: false,
    type: 'GET',
    dataType: 'html',
    scrollTo: 0,
    maxCacheLength: 20,
    version: findVersion
  }
  $(window).on('popstate.pjax', onPjaxPopstate)
}

// Disable pushState behavior.
//
// This is the case when a browser doesn't support pushState. It is
// sometimes useful to disable pushState for debugging on a modern
// browser.
//
// Examples
//
//     $.pjax.disable()
//
// Returns nothing.
function disable() {
  $.fn.pjax = function() { return this }
  $.pjax = fallbackPjax
  $.pjax.enable = enable
  $.pjax.disable = $.noop
  $.pjax.click = $.noop
  $.pjax.submit = $.noop
  $.pjax.reload = function() { window.location.reload() }

  $(window).off('popstate.pjax', onPjaxPopstate)
}


// Add the state property to jQuery's event object so we can use it in
// $(window).bind('popstate')
if ($.event.props && $.inArray('state', $.event.props) < 0) {
  $.event.props.push('state')
} else if (!('state' in $.Event.prototype)) {
  $.event.addProp('state')
}

// Is pjax supported by this browser?
$.support.pjax =
  window.history && window.history.pushState && window.history.replaceState &&
  // pushState isn't reliable on iOS until 5.
  !navigator.userAgent.match(/((iPod|iPhone|iPad).+\bOS\s+[1-4]\D|WebApps\/.+CFNetwork)/)

$.support.pjax ? enable() : disable()

})(jQuery)

    };

})();
(function(){
	// GitHub代码浏览树是否开启，标记值获取
	Tarp.require('../options/settings').getOptions(function(opts){
		window.GITHUB_CODE_OCTOTREE = opts['GITHUB_CODE_OCTOTREE'];
	});

const TEMPLATE = '<div>\n' +
    '  <nav class="octotree-sidebar">\n' +
    '    <div class="octotree-toggle">\n' +
    '      <i class="octotree-toggle-icon" role="button"></i> <span>54Helper</span>\n' +
    '\n' +
    '      <div class="popup">\n' +
    '        <div class="arrow"></div>\n' +
    '        <div class="content">\n' +
    '          你好，这是54Helper。将鼠标移到该按钮上以显示代码树。你也可以按\n' +
    '          快捷键 <kbd>cmd shift s</kbd> (or <kbd>ctrl shift s</kbd>).\n' +
    '        </div>\n' +
    '      </div>\n' +
    '    </div>\n' +
    '\n' +
    '    <a class="octotree-pin" data-store="PINNED" href="javascript:void(0)">\n' +
    '      <span class="tooltipped tooltipped-s" aria-label="固定边栏"> <i class="octotree-icon-pin"></i> </span>\n' +
    '    </a>\n' +
    '\n' +
    '    <a class="octotree-settings" href="javascript:void(0)">\n' +
    '      <span class="tooltipped tooltipped-s" aria-label="设置"> <i class="octotree-icon-settings"></i> </span>\n' +
    '    </a>\n' +
    '\n' +
    '    <div class="octotree-views">\n' +
    '      <div class="octotree-view octotree-tree-view current">\n' +
    '        <div class="octotree-view-header"></div>\n' +
    '        <div class="octotree-view-body"></div>\n' +
    '        <a class="octotree-spin"> <span class="octotree-spin--loader"></span> </a>\n' +
    '      </div>\n' +
    '\n' +
    '      <div class="octotree-view octotree-error-view">\n' +
    '        <div class="octotree-view-header"></div>\n' +
    '        <form class="octotree-view-body"><div class="message"></div></form>\n' +
    '      </div>\n' +
    '\n' +
    '      <div class="octotree-view octotree-settings-view">\n' +
    '        <div class="octotree-view-header">设置</div>\n' +
    '        <form class="octotree-view-body">\n' +
    '          <div>\n' +
    '            <label>GitHub账户token</label>\n' +
    '            <div class="octotree-token-actions">\n' +
    '              <a class="octotree-create-token" target="_blank" tabindex="-1"\n' +
    '                ><!--\n' +
    '                --><span class="tooltipped tooltipped-n" aria-label="生成新token"\n' +
    '                  ><i class="octotree-icon-key"></i></span\n' +
    '                ><!--\n' +
    '              --></a>\n' +
    '              <a\n' +
    '                class="octotree-help"\n' +
    '                href="https://github.com/lijian17/54Helper/wiki"\n' +
    '                target="_blank"\n' +
    '                tabindex="-1"\n' +
    '              >\n' +
    '                <span class="tooltipped tooltipped-n" aria-label="为什么需要这样做？">\n' +
    '                  <i class="octotree-icon-help"></i>\n' +
    '                </span>\n' +
    '              </a>\n' +
    '            </div>\n' +
    '            <input type="text" class="form-control input-block" data-store="TOKEN" />\n' +
    '          </div>\n' +
    '\n' +
    '          <div>\n' +
    '            <div>\n' +
    '              <label>快捷键</label>\n' +
    '              <div class="octotree-token-actions">\n' +
    '                <a class="octotree-help" href="https://github.com/lijian17/54Helper/wiki" target="_blank" tabindex="-1">\n' +
    '                  <span class="tooltipped tooltipped-n" aria-label="了解更多">\n' +
    '                    <i class="octotree-icon-help"></i>\n' +
    '                  </span>\n' +
    '                </a>\n' +
    '              </div>\n' +
    '            </div>\n' +
    '            <input\n' +
    '              type="text"\n' +
    '              autocomplete="off"\n' +
    '              spellcheck="false"\n' +
    '              autocapitalize="off"\n' +
    '              class="form-control"\n' +
    '              data-store="HOTKEYS"\n' +
    '            />\n' +
    '          </div>\n' +
    '\n' +
    '          <div>\n' +
    '            <label><input type="checkbox" data-store="DARKMODE" /> Dark模式</label>\n' +
    '          </div>\n' +
    '          <div>\n' +
    '            <label><input type="checkbox" data-store="HOVEROPEN" /> 鼠标悬停时打开边栏</label>\n' +
    '          </div>\n' +
    '          <div>\n' +
    '            <label><input type="checkbox" data-store="LOADALL" /> 一次性加载整个GitHub树</label>\n' +
    '          </div>\n' +
    '          <div>\n' +
    '            <label><input type="checkbox" data-store="NONCODE" /> 在非代码页中显示</label>\n' +
    '          </div>\n' +
    '          <div>\n' +
    '            <label><input type="checkbox" data-store="ICONS" /> 显示特定于文件的图标</label>\n' +
    '          </div>\n' +
    '          <div>\n' +
    '            <label>\n' +
    '              <input type="checkbox" data-store="PR" /> 显示拉取、请求、修改\n' +
    '              <span class="octotree-disclaimer">注意：最多300个文件</span>\n' +
    '            </label>\n' +
    '          </div>\n' +
    '\n' +
    '          <div><button class="btn btn-primary">保存设置</button></div>\n' +
    '        </form>\n' +
    '\n' +
    '        <div class="octotree-ad-big">\n' +
    '          <div style="display: none;">54Helper Pro的特点</div>\n' +
    '          <ul style="display: none;">\n' +
    '            <li>Dark模式</li>\n' +
    '            <li>文件搜索</li>\n' +
    '            <li>更改停靠位置</li>\n' +
    '            <li>Github企业</li>\n' +
    '            <li>多个Github帐户</li>\n' +
    '            <li>Safari浏览器支持</li>\n' +
    '          </ul>\n' +
    '          <div style="display: none;">\n' +
    '            <a href="https://github.com/lijian17/54Helper/wiki" target="_blank">\n' +
    '              <i class="octotree-icon-github"></i>在我们的网站上了解更多\n' +
    '            </a>\n' +
    '          </div>\n' +
    '        </div>\n' +
    '      </div>\n' +
    '    </div>\n' +
    '\n' +
    '    <div class="octotree-footer">\n' +
    '      <div class="octotree-ad-small">\n' +
    '        <a href="https://github.com/lijian17/54Helper/wiki" target="_blank"\n' +
    '          >54Helper</a\n' +
    '        >\n' +
    '      </div>\n' +
    '    </div>\n' +
    '  </nav>\n' +
    '</div>\n' +
    ''
// Regexps from https://github.com/shockie/node-iniparser
const INI_SECTION = /^\s*\[\s*([^\]]*)\s*\]\s*$/;
const INI_COMMENT = /^\s*;.*$/;
const INI_PARAM = /^\s*([\w\.\-\_]+)\s*=\s*(.*?)\s*$/;
const SEPARATOR = /\r\n|\r|\n/;

function parseGitmodules(data) {
  if (!data) return;

  const submodules = {};
  const lines = data.split(SEPARATOR);
  let lastPath;

  lines.forEach((line) => {
    let match;
    if (INI_SECTION.test(line) || INI_COMMENT.test(line) || !(match = line.match(INI_PARAM))) {
      return;
    }

    if (match[1] === 'path') lastPath = match[2];
    else if (match[1] === 'url') submodules[lastPath] = match[2];
  });

  return submodules;
}

function parallel(arr, iter, done) {
  var total = arr.length;
  if (total === 0) return done();

  arr.forEach((item) => {
    iter(item, finish);
  });

  function finish() {
    if (--total === 0) done();
  }
}

const NODE_PREFIX = 'octotree';
const ADDON_CLASS = 'octotree';
const SHOW_CLASS = 'octotree-show';
const PINNED_CLASS = 'octotree-pinned';

const STORE = {
  TOKEN: 'octotree.access_token',
  DARKMODE: 'octotree.dark_mode',
  THEME: 'octotree.theme',
  HOVEROPEN: 'octotree.hover_open',
  NONCODE: 'octotree.noncode_shown',
  PR: 'octotree.pr_shown',
  HOTKEYS: 'octotree.hotkeys',
  ICONS: 'octotree.icons',
  LOADALL: 'octotree.loadall',
  POPUP: 'octotree.popup_shown',
  WIDTH: 'octotree.sidebar_width',
  SHOWN: 'octotree.sidebar_shown',
  PINNED: 'octotree.sidebar_pinned',
  HUGE_REPOS: 'octotree.huge_repos'
};

const DEFAULTS = {
  TOKEN: '',
  DARKMODE: false,
  THEME: '',//主题
  HOVEROPEN: true,
  NONCODE: true,
  PR: true,
  LOADALL: true,
  HOTKEYS: '⌘+⇧+s, ⌃+⇧+s',
  ICONS: true,
  POPUP: false,
  WIDTH: 232,
  SHOWN: false,
  PINNED: false,
  HUGE_REPOS: {}
};

const EVENT = {
  TOGGLE: 'octotree:toggle',
  TOGGLE_PIN: 'octotree:pin',
  LOC_CHANGE: 'octotree:location',
  LAYOUT_CHANGE: 'octotree:layout',
  REQ_START: 'octotree:start',
  REQ_END: 'octotree:end',
  OPTS_CHANGE: 'octotree:change',
  VIEW_READY: 'octotree:ready',
  VIEW_CLOSE: 'octotree:close',
  VIEW_SHOW: 'octotree:show',
  FETCH_ERROR: 'octotree:error'
};

window.STORE = STORE;
window.DEFAULTS = DEFAULTS;
window.EVENT = EVENT;

class Storage {
  static create(values, defaults) {
    const store = new Storage();
    for (const key of Object.keys(values)) {
      store.setIfNull(values[key], defaults[key]);
    }
    return store;
  }

  set(key, val, cb) {
    try {
      localStorage.setItem(key, JSON.stringify(val));
    } catch (e) {
      const msg =
        '54Helper无法保存其设置' +
        '如果此域的本地存储已满，请清理并重试。';
      console.error(msg, e);
    }
    if (cb) cb();
  }

  get(key, cb) {
    var val = parse(localStorage.getItem(key));
    if (cb) cb(val);
    else return val;

    function parse(val) {
      try {
        return JSON.parse(val);
      } catch (e) {
        return val;
      }
    }
  }

  setIfNull(key, val, cb) {
    this.get(key, (existingVal) => {
      this.set(key, existingVal == null ? val : existingVal, cb);
    });
  }
}

const store = Storage.create(STORE, DEFAULTS);
window.store = store;

/**
 * Class to manage Octotree plugins.
 */
class PluginManager {
  /**
   * @constructor
   */
  constructor() {
    this._plugins = [];
    this._forward({
      activate: null,
      applyOptions: (results) => results.some((shouldReload) => !!shouldReload)
    });
  }

  /**
   * Registers a plugin class.
   * @param {!Plugin} pluginClass.
   */
  register(plugin) {
    this._plugins.push(plugin);
  }

  /**
   * Forwards the specified methods to every plugins.
   * @private {!Object<!String, !function(Array<*>): *} methods
   * @return the value returned by the collector function associated with each
   * method.
   */
  _forward(methods) {
    for (const method of Object.keys(methods)) {
      this[method] = async (...args) => {
        const promises = this._plugins.map((plugin) => plugin[method](...args));
        const results = await Promise.all(promises);
        const resultHandler = methods[method];

        if (!resultHandler) return results;
        else return resultHandler(results);
      };
    }
  }
}

/**
 * Base plugin class.
 */
class Plugin {
  /**
   * Activates the plugin.
   * @param {!{
   *   adapter: !Adapter,
   *   $sidebar: !JQuery,
   *   $toggler: !JQuery,
   *   $views: !JQuery,
   *   treeView: !TreeView,
   *   optsView: !OptionsView,
   *   errorView: !ErrorView,
   * }}
   * @return {!Promise<undefined>}
   */
  async activate(opts) {
    return undefined;
  }

  /**
   * Applies the option changes user has made.
   * @param {!Object<!string, [(string|boolean), (string|boolean)]>} changes
   * @return {!Promise<boolean>} iff the tree should be reloaded.
   */
  async applyOptions(changes) {
    return false;
  }
}

window.pluginManager = new PluginManager();
window.Plugin = Plugin;

class OctotreeService {
  getAccessToken() {
    return window.store.get(window.STORE.TOKEN);
  }

  getInvalidTokenMessage({responseStatus, requestHeaders}) {
    return (
      'GitHub访问token无效' +
      '请转到 <a class="settings-btn" href="javascript:void(0)">设置</a> 并更新token'
    );
  }
}

window.octotree = new OctotreeService();

class Adapter {
  constructor(deps, store) {
    deps.forEach((dep) => window[dep]());
    this._defaultBranch = {};
    this.store = store;
  }

  /**
   * Loads the code tree of a repository.
   * @param {Object} opts: {
   *                  path: the starting path to load the tree,
   *                  repo: the current repository,
   *                  node (optional): the selected node (null to load entire tree),
   *                  token (optional): the personal access token
   *                 }
   * @param {Function} transform(item)
   * @param {Function} cb(err: error, tree: Array[Array|item])
   * @api protected
   */
  _loadCodeTreeInternal(opts, transform, cb) {
    const folders = {'': []};
    const $dummyDiv = $('<div/>');
    const {path, repo, node} = opts;

    opts.encodedBranch = opts.encodedBranch || encodeURIComponent(decodeURIComponent(repo.branch));

    this._getTree(path, opts, (err, tree) => {
      if (err) return cb(err);

      this._getSubmodules(tree, opts, (err, submodules) => {
        if (err) return cb(err);

        submodules = submodules || {};

        const nextChunk = (iteration = 0) => {
          const CHUNK_SIZE = 300;

          for (let i = 0; i < CHUNK_SIZE; i++) {
            const item = tree[iteration * CHUNK_SIZE + i];

            // We're done
            if (item === undefined) {
              return cb(null, folders['']);
            }

            // Runs transform requested by subclass
            if (transform) {
              transform(item);
            }

            // If lazy load and has parent, prefix with parent path
            if (node && node.path) {
              item.path = node.path + '/' + item.path;
            }

            const path = item.path;
            const type = item.type;
            const index = path.lastIndexOf('/');
            const name = $dummyDiv.text(path.substring(index + 1)).html(); // Sanitizes, closes #9

            item.id = NODE_PREFIX + path;
            item.text = name;

            // Uses `type` as class name for tree node
            item.icon = type;

            if (type === 'blob') {
              if (this.store.get(STORE.ICONS)) {
                const className = FileIcons.getClassWithColor(name);
                item.icon += ' ' + (className || 'file-generic');
              } else {
                item.icon += ' file-generic';
              }
            }

            if (item.patch) {
              const {action, previous, filesChanged: files, additions, deletions} = item.patch;
              let patch = '';
              patch += action === 'added' ? '<span class="text-green">added</span>' : '';
              patch += action === 'renamed' ? `<span class="text-green" title="${previous}">renamed</span>` : '';
              patch += action === 'removed' ? `<span class="text-red" title="${previous}">removed</span>` : '';
              patch += files
                ? `<span class='octotree-patch-files'>${files} ${files === 1 ? 'file' : 'files'}</span>`
                : '';
              patch += additions !== 0 ? `<span class="text-green">+${additions}</span>` : '';
              patch += deletions !== 0 ? `<span class="text-red">-${deletions}</span>` : '';
              item.text += `<span class="octotree-patch">${patch}</span>`;
            }

            if (node) {
              folders[''].push(item);
            } else {
              folders[path.substring(0, index)].push(item);
            }

            if (type === 'tree' || type === 'blob') {
              if (type === 'tree') {
                if (node) item.children = true;
                else folders[item.path] = item.children = [];
              }

              // If item is part of a PR, jump to that file's diff
              if (item.patch && typeof item.patch.diffId === 'number') {
                const url = this._getPatchHref(repo, item.patch);
                item.a_attr = {
                  href: url,
                  'data-download-url': item.url,
                  'data-download-filename': name
                };
              } else {
                // Encodes but retains the slashes, see #274
                const encodedPath = path
                  .split('/')
                  .map(encodeURIComponent)
                  .join('/');
                const url = this._getItemHref(repo, type, encodedPath, opts.encodedBranch);
                item.a_attr = {
                  href: url,
                  'data-download-url': url,
                  'data-download-filename': name
                };
              }
            } else if (type === 'commit') {
              let moduleUrl = submodules[item.path];

              if (moduleUrl) {
                // Fixes #105
                // Special handling for submodules hosted in GitHub
                if (~moduleUrl.indexOf('github.com')) {
                  moduleUrl = moduleUrl
                    .replace(/^git(:\/\/|@)/, window.location.protocol + '//')
                    .replace('github.com:', 'github.com/')
                    .replace(/.git$/, '');
                  item.text =
                    `<a href="${moduleUrl}" class="jstree-anchor">${name}</a>` +
                    '<span>@ </span>' +
                    `<a href="${moduleUrl}/tree/${item.sha}" class="jstree-anchor">${item.sha.substr(0, 7)}</a>`;
                }
                item.a_attr = {href: moduleUrl};
              }
            }
          }

          setTimeout(() => nextChunk(iteration + 1));
        };

        nextChunk();
      });
    });
  }

  /**
   * Generic error handler.
   * @api protected
   */
  _handleError(settings, jqXHR, cb) {
    let error;
    let message;

    switch (jqXHR.status) {
      case 0:
        error = '连接错误';
        message = `无法连接到网站。
                    如果您与此网站的网络连接正常，可能是API中断。
		    请稍后再试。`;
        break;
      case 409:
        error = '空存储库';
        message = '此存储库为空。';
        break;
      case 401:
        error = '无效token';
        message = octotree.getInvalidTokenMessage({
          responseStatus: jqXHR.status,
          requestHeaders: settings.headers
        });
        break;
      case 404:
        error = '私有存储库';
        message =
          '访问私有存储库需要Github访问token。' +
          '请转到 <a class="settings-btn" href="javascript:void(0)">设置</a> 并输入token';
        break;
      case 403:
        if (jqXHR.getResponseHeader('X-RateLimit-Remaining') === '0') {
          // It's kinda specific for GitHub
          error = '超出API限制';
          message =
            '您已经超过了 <a href="https://developer.github.com/v3/#rate-limiting">GitHub API速率限制</a>. ' +
            '要继续使用octotree，需要提供一个github访问token。' +
	        '请转到 <a class="settings-btn" href="javascript:void(0)">设置</a> 并输入token';
        } else {
          error = '禁止的';
          message =
	        '访问私有存储库需要Github访问token。' +
	        '请转到 <a class="settings-btn" href="javascript:void(0)">设置</a> 并输入token';
        }

        break;

      // Fallback message
      default:
        error = message = jqXHR.statusText;
        break;
    }
    cb({
      error: `Error: ${error}`,
      message: message,
      status: jqXHR.status
    });
  }

  /**
   * Returns the CSS class to be added to the Octotree sidebar.
   * @api public
   */
  getCssClass() {
    throw new Error('Not implemented');
  }

  /**
   * Returns the minimum width acceptable for the sidebar.
   * @api protected
   */
  getMinWidth() {
    return 220;
  }

  /**
   * Inits behaviors after the sidebar is added to the DOM.
   * @api public
   */
  init($sidebar) {
    $sidebar.resizable({handles: 'e', minWidth: this.getMinWidth()});
  }

  /**
   * Returns whether the adapter is capable of loading the entire tree in
   * a single request. This is usually determined by the underlying the API.
   * @api public
   */
  canLoadEntireTree(opts) {
    return false;
  }

  /**
   * Loads the code tree.
   * @api public
   */
  loadCodeTree(opts, cb) {
    throw new Error('Not implemented');
  }

  /**
   * Returns the URL to create a personal access token.
   * @api public
   */
  getCreateTokenUrl() {
    throw new Error('Not implemented');
  }

  /**
   * Updates the layout based on sidebar visibility and width.
   * @api public
   */
  updateLayout(sidebarPinned, sidebarVisible, sidebarWidth) {
    throw new Error('Not implemented');
  }

  /**
   * Returns repo info at the current path.
   * @api public
   */
  getRepoFromPath(token, cb) {
    throw new Error('Not implemented');
  }

  /**
   * Selects the file at a specific path.
   * @api public
   */
  selectFile(path) {
    window.location.href = path;
  }

  /**
   * Selects a submodule.
   * @api public
   */
  selectSubmodule(path) {
    window.location.href = path;
  }

  /**
   * Opens file or submodule in a new tab.
   * @api public
   */
  openInNewTab(path) {
    window.open(path, '_blank').focus();
  }

  /**
   * Downloads a file.
   * @api public
   */
  downloadFile(path, fileName) {
    const downloadUrl = path.replace(/\/blob\/|\/src\//, '/raw/');
    const link = document.createElement('a');

    link.setAttribute('href', downloadUrl);

    // Github will redirect to a different origin (host) for downloading the file.
    // However, the new host hasn't been added in the Content-Security-Policy header from
    // Github so the browser won't save the file, it navigates to the file instead.
    // Using '_blank' as a trick to not being navigated
    // See more about Content Security Policy at
    // https://www.html5rocks.com/en/tutorials/security/content-security-policy/
    link.setAttribute('target', '_blank');

    link.click();
  }

  /**
   * Gets tree at path.
   * @param {Object} opts - {token, repo}
   * @api protected
   */
  _getTree(path, opts, cb) {
    throw new Error('Not implemented');
  }

  /**
   * Gets submodules in the tree.
   * @param {Object} opts - {token, repo, encodedBranch}
   * @api protected
   */
  _getSubmodules(tree, opts, cb) {
    throw new Error('Not implemented');
  }

  /**
   * Returns item's href value.
   * @api protected
   */
  _getItemHref(repo, type, encodedPath, encodedBranch) {
    return `/${repo.username}/${repo.reponame}/${type}/${encodedBranch}/${encodedPath}`;
  }
  /**
   * Returns patch's href value.
   * @api protected
   */
  _getPatchHref(repo, patch) {
    return `/${repo.username}/${repo.reponame}/pull/${repo.pullNumber}/files#diff-${patch.diffId}`;
  }
}

class PjaxAdapter extends Adapter {
  constructor(store) {
    super(['jquery.pjax.js'], store);

    $(document)
      .on('pjax:start', () => $(document).trigger(EVENT.REQ_START))
      .on('pjax:end', () => $(document).trigger(EVENT.REQ_END))
      .on('pjax:timeout', (e) => e.preventDefault());
  }

  // @override
  // @param {Object} opts - {pjaxContainer: the specified pjax container}
  // @api public
  init($sidebar, opts) {
    super.init($sidebar);

    opts = opts || {};
    const pjaxContainer = opts.pjaxContainer;

    if (!window.MutationObserver) return;

    // Some host switch pages using pjax. This observer detects if the pjax container
    // Has been updated with new contents and trigger layout.
    const pageChangeObserver = new window.MutationObserver(() => {
      // Trigger location change, can't just relayout as Octotree might need to
      // Hide/show depending on whether the current page is a code page or not.
      return $(document).trigger(EVENT.LOC_CHANGE);
    });

    if (pjaxContainer) {
      pageChangeObserver.observe(pjaxContainer, {
        childList: true
      });
    } else {
      // Fall back if DOM has been changed
      let firstLoad = true,
        href,
        hash;

      function detectLocChange() {
        if (location.href !== href || location.hash !== hash) {
          href = location.href;
          hash = location.hash;

          // If this is the first time this is called, no need to notify change as
          // Octotree does its own initialization after loading options.
          if (firstLoad) {
            firstLoad = false;
          } else {
            setTimeout(() => {
              $(document).trigger(EVENT.LOC_CHANGE);
            }, 300); // Wait a bit for pjax DOM change
          }
        }
        setTimeout(detectLocChange, 200);
      }

      detectLocChange();
    }
  }

  // @override
  // @param {Object} opts - {$pjax_container: jQuery object}
  // @api public
  selectFile(path, opts) {
    opts = opts || {};

    // Do nothing if file is already selected.
    if (location.pathname === path) return;

    // If we're on the same page and just navigating to a different anchor
    // Don't bother fetching the page with pjax
    const pathWithoutAnchor = path.replace(/#.*$/, '');
    const isSamePage = location.pathname === pathWithoutAnchor;
    const pjaxContainerSel = opts.pjaxContainerSel;
    const loadWithPjax = $(pjaxContainerSel).length && !isSamePage;

    if (loadWithPjax) {
      this._patchPjax();
      $.pjax({
        // Needs full path for pjax to work with Firefox as per cross-domain-content setting
        url: location.protocol + '//' + location.host + path,
        container: pjaxContainerSel,
        timeout: 0 // global timeout doesn't seem to work, use this instead
      });
    } else {
      super.selectFile(path);
    }
  }

  _patchPjax() {
    // The pjax plugin ($.pjax) is loaded in same time with Octotree (document ready event) and
    // we don't know when $.pjax fully loaded, so we will do patching once in runtime
    if (!!this._$pjaxPatched) return;

    /**
     * At this moment, when users are on Github Code page, Github sometime refreshes the page when
     * a file is clicked on its file list. Internally, Github uses pjax
     * (a jQuery plugin - defunkt/jquery-pjax) to fetch the file content being selected, and there is
     * a change on Github's server rendering that cause the refreshing problem. And this also impacts
     * on Octotree where Github page refreshes when users select a file in Octotree's sidebar
     *
     * The refresh happens due to this code https://github.com/defunkt/jquery-pjax/blob/c9acf5e7e9e16fdd34cb2de882d627f97364a952/jquery.pjax.js#L272.
     *
     * While waiting for Github to solve the wrong refreshing, below code is a hacking fix that
     * Octotree won't trigger refreshing when a file selected in sidebar (but Github still refreshes
     * if file selected at Github file view)
     */
    $.pjax.defaults.version = function () {
      // Disables checking layout version to prevent refreshing in pjax library
      return null;
    };

    this._$pjaxPatched = true;
  }
}

const GH_RESERVED_USER_NAMES = [
  'settings',
  'orgs',
  'organizations',
  'site',
  'blog',
  'about',
  'explore',
  'styleguide',
  'showcases',
  'trending',
  'stars',
  'dashboard',
  'notifications',
  'search',
  'developer',
  'account',
  'pulls',
  'issues',
  'features',
  'contact',
  'security',
  'join',
  'login',
  'watching',
  'new',
  'integrations',
  'gist',
  'business',
  'mirrors',
  'open-source',
  'personal',
  'pricing',
  'sessions'
];
const GH_RESERVED_REPO_NAMES = ['followers', 'following', 'repositories'];
const GH_404_SEL = '#parallax_wrapper';

// When Github page loads at repo path e.g. https://github.com/jquery/jquery, the HTML tree has
// <main id="js-repo-pjax-container"> to contain server-rendered HTML in response of pjax.
// However, that <main> element doesn't have "id" attribute if the Github page loads at specific
// File e.g. https://github.com/jquery/jquery/blob/master/.editorconfig.
// Therefore, the below selector uses many path but only points to the same <main> element
const GH_PJAX_CONTAINER_SEL =
  '#js-repo-pjax-container, div[itemtype="http://schema.org/SoftwareSourceCode"] main, [data-pjax-container]';

const GH_CONTAINERS = '.container, .container-lg, .container-responsive';
const GH_HEADER = '.js-header-wrapper > header';
const GH_RAW_CONTENT = 'body > pre';
const GH_MAX_HUGE_REPOS_SIZE = 50;

class GitHub extends PjaxAdapter {
  constructor(store) {
    super(store);
  }

  // @override
  init($sidebar) {
    const pjaxContainer = $(GH_PJAX_CONTAINER_SEL)[0];
    super.init($sidebar, {pjaxContainer: pjaxContainer});

    // Fix #151 by detecting when page layout is updated.
    // In this case, split-diff page has a wider layout, so need to recompute margin.
    // Note that couldn't do this in response to URL change, since new DOM via pjax might not be ready.
    const diffModeObserver = new window.MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (~mutation.oldValue.indexOf('split-diff') || ~mutation.target.className.indexOf('split-diff')) {
          return $(document).trigger(EVENT.LAYOUT_CHANGE);
        }
      });
    });

    diffModeObserver.observe(document.body, {
      attributes: true,
      attributeFilter: ['class'],
      attributeOldValue: true
    });
  }

  // @override
  getCssClass() {
    return 'octotree-github-sidebar';
  }

  // @override
  canLoadEntireTree(repo) {
    const key = `${repo.username}/${repo.reponame}`;
    const hugeRepos = this.store.get(STORE.HUGE_REPOS);
    if (hugeRepos[key]) {
      // Update the last load time of the repo
      hugeRepos[key] = new Date().getTime();
      this.store.set(STORE.HUGE_REPOS, hugeRepos);
    }
    return !hugeRepos[key];
  }

  // @override
  getCreateTokenUrl() {
    return (
      `${location.protocol}//${location.host}/settings/tokens/new?` +
      'scopes=repo&description=54Helper%20browser%20extension'
    );
  }

  // @override
  updateLayout(sidebarPinned, sidebarVisible, sidebarWidth) {
    const SPACING = 10;
    const $header = $(GH_HEADER);
    const $containers = $(GH_CONTAINERS);
    const autoMarginLeft = ($(document).width() - $containers.width()) / 2;
    const shouldPushEverything = sidebarPinned && sidebarVisible;
    const smallScreen = autoMarginLeft <= sidebarWidth + SPACING;

    $('html').css('margin-left', shouldPushEverything && smallScreen ? sidebarWidth : '');
    $containers.css('margin-left', shouldPushEverything && smallScreen ? SPACING : '');

    if (shouldPushEverything && !smallScreen) {
      // Override important in Github Header class in large screen
      $header.attr('style', `padding-left: ${sidebarWidth + SPACING}px !important`);
    } else {
      $header.removeAttr('style');
    }
  }

  // @override
  getRepoFromPath(currentRepo, token, cb) {
    // 404 page, skip
    if ($(GH_404_SEL).length) {
      return cb();
    }

    // Skip raw page
    if ($(GH_RAW_CONTENT).length) {
      return cb();
    }

    // (username)/(reponame)[/(type)][/(typeId)]
    const match = window.location.pathname.match(/([^\/]+)\/([^\/]+)(?:\/([^\/]+))?(?:\/([^\/]+))?/);
    if (!match) {
      return cb();
    }

    const username = match[1];
    const reponame = match[2];
    const type = match[3];
    const typeId = match[4];

    // Not a repository, skip
    if (~GH_RESERVED_USER_NAMES.indexOf(username) || ~GH_RESERVED_REPO_NAMES.indexOf(reponame)) {
      return cb();
    }

    // Check if we should show in non-code pages
    const isPR = type === 'pull';
    const isCodePage = !type || isPR || ['tree', 'blob', 'commit'].indexOf(type) >= 0;
    const showInNonCodePage = this.store.get(STORE.NONCODE);
    if (!showInNonCodePage && !isCodePage) {
      return cb();
    }

    // Get branch by inspecting URL or DOM, quite fragile so provide multiple fallbacks.
    // TODO would be great if there's a more robust way to do this
    /**
     * Github renders the branch name in one of below structure depending on the length
     * of branch name
     *
     * Option 1: when the length is short enough
     * <summary title="Switch branches or tags">
     *   <span class="css-truncate-target">feature/1/2/3</span>
     * </summary>
     *
     * Option 2: when the length is too long
     * <summary title="feature/1/2/3/4/5/6/7/8">
     *   <span class="css-truncate-target">feature/1/2/3...</span>
     * </summary>
     */
    const branchDropdownMenuSummary = $('.branch-select-menu summary');
    const branchNameInTitle = branchDropdownMenuSummary.attr('title');
    const branchNameInSpan = branchDropdownMenuSummary.find('span').text();
    const branchFromSummary =
      branchNameInTitle && branchNameInTitle.toLowerCase().startsWith('switch branches')
        ? branchNameInSpan
        : branchNameInTitle;

    const branch =
      // Pick the commit ID as branch name when the code page is listing tree in a particular commit
      (type === 'commit' && typeId) ||
      // Pick the commit ID or branch name from the DOM
      branchFromSummary ||
      ($('.overall-summary .numbers-summary .commits a').attr('href') || '').replace(
        `/${username}/${reponame}/commits/`,
        ''
      ) ||
      // Pull requests page
      ($('.commit-ref.base-ref').attr('title') || ':').match(/:(.*)/)[1] ||
      // Reuse last selected branch if exist
      (currentRepo.username === username && currentRepo.reponame === reponame && currentRepo.branch) ||
      // Get default branch from cache
      this._defaultBranch[username + '/' + reponame];

    const showOnlyChangedInPR = this.store.get(STORE.PR);
    const pullNumber = isPR && showOnlyChangedInPR ? typeId : null;
    const repo = {username, reponame, branch, pullNumber};
    if (repo.branch) {
      cb(null, repo);
    } else {
      // Still no luck, get default branch for real
      this._get(null, {repo, token}, (err, data) => {
        if (err) return cb(err);
        repo.branch = this._defaultBranch[username + '/' + reponame] = data.default_branch || 'master';
        cb(null, repo);
      });
    }
  }

  // @override
  selectFile(path) {
    super.selectFile(path, {pjaxContainerSel: GH_PJAX_CONTAINER_SEL});
  }

  // @override
  loadCodeTree(opts, cb) {
    opts.encodedBranch = encodeURIComponent(decodeURIComponent(opts.repo.branch));
    opts.path = (opts.node && (opts.node.sha || opts.encodedBranch)) || opts.encodedBranch + '?recursive=1';
    this._loadCodeTreeInternal(opts, null, cb);
  }

  // @override
  _getTree(path, opts, cb) {
    if (opts.repo.pullNumber) {
      this._getPatch(opts, cb);
    } else {
      this._get(`/git/trees/${path}`, opts, (err, res) => {
        if (err) cb(err);
        else cb(null, res.tree);
      });
    }
  }

  /**
   * Get files that were patched in Pull Request.
   * The diff map that is returned contains changed files, as well as the parents of the changed files.
   * This allows the tree to be filtered for only folders that contain files with diffs.
   * @param {Object} opts: {
   *                  path: the starting path to load the tree,
   *                  repo: the current repository,
   *                  node (optional): the selected node (null to load entire tree),
   *                  token (optional): the personal access token
   *                 }
   * @param {Function} cb(err: error, diffMap: Object)
   */
  _getPatch(opts, cb) {
    const {pullNumber} = opts.repo;

    this._get(`/pulls/${pullNumber}/files?per_page=300`, opts, (err, res) => {
      if (err) cb(err);
      else {
        const diffMap = {};

        res.forEach((file, index) => {
          // Record file patch info
          diffMap[file.filename] = {
            type: 'blob',
            diffId: index,
            action: file.status,
            additions: file.additions,
            blob_url: file.blob_url,
            deletions: file.deletions,
            filename: file.filename,
            path: file.path,
            sha: file.sha
          };

          // Record ancestor folders
          const folderPath = file.filename
            .split('/')
            .slice(0, -1)
            .join('/');
          const split = folderPath.split('/');

          // Aggregate metadata for ancestor folders
          split.reduce((path, curr) => {
            if (path.length) path = `${path}/${curr}`;
            else path = `${curr}`;

            if (diffMap[path] == null) {
              diffMap[path] = {
                type: 'tree',
                filename: path,
                filesChanged: 1,
                additions: file.additions,
                deletions: file.deletions
              };
            } else {
              diffMap[path].additions += file.additions;
              diffMap[path].deletions += file.deletions;
              diffMap[path].filesChanged++;
            }
            return path;
          }, '');
        });

        // Transform to emulate response from get `tree`
        const tree = Object.keys(diffMap).map((fileName) => {
          const patch = diffMap[fileName];
          return {
            patch,
            path: fileName,
            sha: patch.sha,
            type: patch.type,
            url: patch.blob_url
          };
        });

        // Sort by path, needs to be alphabetical order (so parent folders come before children)
        // Note: this is still part of the above transform to mimic the behavior of get tree
        tree.sort((a, b) => a.path.localeCompare(b.path));

        cb(null, tree);
      }
    });
  }

  // @override
  _getSubmodules(tree, opts, cb) {
    const item = tree.filter((item) => /^\.gitmodules$/i.test(item.path))[0];
    if (!item) return cb();

    this._get(`/git/blobs/${item.sha}`, opts, (err, res) => {
      if (err) return cb(err);
      const data = atob(res.content.replace(/\n/g, ''));
      cb(null, parseGitmodules(data));
    });
  }

  _get(path, opts, cb) {
    const host =
      location.protocol + '//' + (location.host === 'github.com' ? 'api.github.com' : location.host + '/api/v3');
    const url = `${host}/repos/${opts.repo.username}/${opts.repo.reponame}${path || ''}`;
    const cfg = {url, method: 'GET', cache: false};

    if (opts.token) {
      cfg.headers = {Authorization: 'token ' + opts.token};
    }

    $.ajax(cfg)
      .done((data) => {
        if (path && path.indexOf('/git/trees') === 0 && data.truncated) {
          const hugeRepos = this.store.get(STORE.HUGE_REPOS);
          const repo = `${opts.repo.username}/${opts.repo.reponame}`;
          const repos = Object.keys(hugeRepos);
          if (!hugeRepos[repo]) {
            // If there are too many repos memoized, delete the oldest one
            if (repos.length >= GH_MAX_HUGE_REPOS_SIZE) {
              const oldestRepo = repos.reduce((min, p) => (hugeRepos[p] < hugeRepos[min] ? p : min));
              delete hugeRepos[oldestRepo];
            }
            hugeRepos[repo] = new Date().getTime();
            this.store.set(STORE.HUGE_REPOS, hugeRepos);
          }
          this._handleError(cfg, {status: 206}, cb);
        } else cb(null, data);
      })
      .fail((jqXHR) => this._handleError(cfg, jqXHR, cb));
  }
}

/**
 * 帮助popup
 */
class HelpPopup {
  constructor($dom, store) {
    this.$view = $dom.find('.popup');
    this.store = store;
    this.showInstallationWarning = false;
  }

  init() {
    const $view = this.$view;
    const store = this.store;
    const popupShown = store.get(STORE.POPUP);
    const sidebarVisible = $('html').hasClass(SHOW_CLASS);

    if (this.showInstallationWarning) {
      $view
        .find('.content')
        .text('您当前安装了2个54Helper版本。请卸载其中一个。');
    } else if (popupShown || sidebarVisible) {
      return hideAndDestroy();
    }

    $(document).one(EVENT.TOGGLE, hideAndDestroy);

    setTimeout(() => {
      setTimeout(hideAndDestroy, 10000);
      $view.addClass('show').click(hideAndDestroy);
    }, 500);

	/**
	 * 隐藏和销毁
	 */
    function hideAndDestroy() {
      store.set(STORE.POPUP, true);
      if ($view.hasClass('show')) {
        $view.removeClass('show').one('transitionend', () => $view.remove());
      } else {
        $view.remove();
      }
    }
  }

  /**
   * 设置显示安装警告
   */
  setShowInstallationWarning() {
    this.showInstallationWarning = true;
  }
}

class ErrorView {
  constructor($dom) {
    this.$this = $(this);
    this.$view = $dom.find('.octotree-error-view');
  }

  show(err) {
    this.$view.find('.octotree-view-header').html(err.error);
    this.$view.find('.message').html(err.message);
    this.$view.find('.settings-btn').click((event) => {
      event.preventDefault();
      this.$this.trigger(EVENT.VIEW_CLOSE, {showSettings: true});
    });
    this.$this.trigger(EVENT.VIEW_READY);
  }
}

class TreeView {
  constructor($dom, store, adapter) {
    this.store = store;
    this.adapter = adapter;
    this.$view = $dom.find('.octotree-tree-view');
    this.$tree = this.$view
      .find('.octotree-view-body')
      .on('click.jstree', '.jstree-open>a', ({target}) => {
        setTimeout(() => this.$jstree.close_node(target));
      })
      .on('click.jstree', '.jstree-closed>a', ({target}) => {
        setTimeout(() => this.$jstree.open_node(target));
      })
      .on('click', this._onItemClick.bind(this))
      .jstree({
        core: {multiple: false, animation: 50, worker: false, themes: {responsive: false}},
        plugins: ['wholerow', 'search']
      });
  }

  get $jstree() {
    return this.$tree.jstree(true);
  }

  focus() {
    this.$jstree.get_container().focus();
  }

  show(repo, token) {
    const $jstree = this.$jstree;

    $jstree.settings.core.data = (node, cb) => {
      const prMode = this.store.get(STORE.PR) && repo.pullNumber;
      const loadAll = this.adapter.canLoadEntireTree(repo) && (prMode || this.store.get(STORE.LOADALL));

      node = !loadAll && (node.id === '#' ? {path: ''} : node.original);

      this.adapter.loadCodeTree({repo, token, node}, (err, treeData) => {
        if (err) {
          if (err.status === 206 && loadAll) {
            // The repo is too big to load all, need to retry
            $jstree.refresh(true);
          } else {
            $(this).trigger(EVENT.FETCH_ERROR, [err]);
          }
        } else {
          treeData = this._sort(treeData);
          if (loadAll) {
            treeData = this._collapse(treeData);
          }
          cb(treeData);
        }
      });
    };

    this.$tree.one('refresh.jstree', () => {
      this.syncSelection(repo);
      $(this).trigger(EVENT.VIEW_READY);
    });

    this._showHeader(repo);
    $jstree.refresh(true);
  }

  _showHeader(repo) {
    const adapter = this.adapter;

    this.$view
      .find('.octotree-view-header')
      .html(
        `<div class="octotree-header-summary">
          <div class="octotree-header-repo">
            <i class="octotree-icon-repo"></i>
            <a href="/${repo.username}">${repo.username}</a> /
            <a data-pjax href="/${repo.username}/${repo.reponame}">${repo.reponame}</a>
          </div>
          <div class="octotree-header-branch">
            <i class="octotree-icon-branch"></i>
            ${this._deXss(repo.branch.toString())}
          </div>
        </div>`
      )
      .on('click', 'a[data-pjax]', function(event) {
        event.preventDefault();
        // A.href always return absolute URL, don't want that
        const href = $(this).attr('href');
        const newTab = event.shiftKey || event.ctrlKey || event.metaKey;
        newTab ? adapter.openInNewTab(href) : adapter.selectFile(href);
      });
  }

  _deXss(str) {
    return str && str.replace(/[<>'"&]/g, '-');
  }

  _sort(folder) {
    folder.sort((a, b) => {
      if (a.type === b.type) return a.text === b.text ? 0 : a.text < b.text ? -1 : 1;
      return a.type === 'blob' ? 1 : -1;
    });

    folder.forEach((item) => {
      if (item.type === 'tree' && item.children !== true && item.children.length > 0) {
        this._sort(item.children);
      }
    });

    return folder;
  }

  _collapse(folder) {
    return folder.map((item) => {
      if (item.type === 'tree') {
        item.children = this._collapse(item.children);
        if (item.children.length === 1 && item.children[0].type === 'tree') {
          const onlyChild = item.children[0];
          onlyChild.text = item.text + '/' + onlyChild.text;
          return onlyChild;
        }
      }
      return item;
    });
  }

  _onItemClick(event) {
    let $target = $(event.target);
    let download = false;

    // Handle middle click
    if (event.which === 2) return;

    // Handle icon click, fix #122
    if ($target.is('i.jstree-icon')) {
      $target = $target.parent();
      download = true;
    }

    if (!$target.is('a.jstree-anchor')) return;

    // Refocus after complete so that keyboard navigation works, fix #158
    const refocusAfterCompletion = () => {
      $(document).one('pjax:success page:load', () => {
        this.$jstree.get_container().focus();
      });
    };

    const adapter = this.adapter;
    const newTab = event.shiftKey || event.ctrlKey || event.metaKey;
    const href = $target.attr('href');
    // The 2nd path is for submodule child links
    const $icon = $target.children().length ? $target.children(':first') : $target.siblings(':first');

    if ($icon.hasClass('commit')) {
      refocusAfterCompletion();
      newTab ? adapter.openInNewTab(href) : adapter.selectSubmodule(href);
    } else if ($icon.hasClass('blob')) {
      if (download) {
        const downloadUrl = $target.attr('data-download-url');
        const downloadFileName = $target.attr('data-download-filename');
        adapter.downloadFile(downloadUrl, downloadFileName);
      } else {
        refocusAfterCompletion();
        newTab ? adapter.openInNewTab(href) : adapter.selectFile(href);
      }
    }
  }

  syncSelection(repo) {
    const $jstree = this.$jstree;
    if (!$jstree) return;

    // Convert /username/reponame/object_type/branch/path to path
    const path = decodeURIComponent(location.pathname);
    const match = path.match(/(?:[^\/]+\/){4}(.*)/);
    if (!match) return;

    const currentPath = match[1];
    const loadAll = this.adapter.canLoadEntireTree(repo) && this.store.get(STORE.LOADALL);

    selectPath(loadAll ? [currentPath] : breakPath(currentPath));

    // Convert ['a/b'] to ['a', 'a/b']
    function breakPath(fullPath) {
      return fullPath.split('/').reduce((res, path, idx) => {
        res.push(idx === 0 ? path : `${res[idx - 1]}/${path}`);
        return res;
      }, []);
    }

    function selectPath(paths, index = 0) {
      const nodeId = NODE_PREFIX + paths[index];

      if ($jstree.get_node(nodeId)) {
        $jstree.deselect_all();
        $jstree.select_node(nodeId);
        $jstree.open_node(nodeId, () => {
          if (++index < paths.length) {
            selectPath(paths, index);
          }
        });
      }
    }
  }
}

class OptionsView {
  constructor($dom, store, adapter) {
    this.store = store;
    this.adapter = adapter;
    this.$toggler = $dom.find('.octotree-settings').click(this.toggle.bind(this));
    this.$view = $dom.find('.octotree-settings-view').submit((event) => {
      event.preventDefault();
      this.toggle(false);
    });
    this.$view.find('a.octotree-create-token').attr('href', this.adapter.getCreateTokenUrl());

    this.loadElements();

    // Hide options view when sidebar is hidden
    $(document).on(EVENT.TOGGLE, (event, visible) => {
      if (!visible) this.toggle(false);
    });
  }

  /**
   * Load elements with [data-store] attributes. Invoke this if there are dynamically
   * added elements, so that they can be loaded and saved.
   */
  loadElements() {
    this.elements = this.$view.find('[data-store]').toArray();
  }

  /**
   * Toggles the visibility of this screen.
   */
  toggle(visibility) {
    if (visibility !== undefined) {
      if (this.$view.hasClass('current') === visibility) return;
      return this.toggle();
    }

    if (this.$toggler.hasClass('selected')) {
      this._save();
      this.$toggler.removeClass('selected');
      $(this).trigger(EVENT.VIEW_CLOSE);
    } else {
      this._load();
    }
  }

  _load() {
    this._eachOption(
      ($elm, key, value, cb) => {
        if ($elm.is(':checkbox')) $elm.prop('checked', value);
        else $elm.val(value);
        cb();
      },
      () => {
        this.$toggler.addClass('selected');
        $(this).trigger(EVENT.VIEW_READY);
      }
    );
  }

  _save() {
    const changes = {};
    this._eachOption(
      ($elm, key, value, cb) => {
        const newValue = $elm.is(':checkbox') ? $elm.is(':checked') : $elm.val();
        if (value === newValue) return cb();
        changes[key] = [value, newValue];
        this.store.set(key, newValue, cb);
      },
      () => {
        if (Object.keys(changes).length) {
          $(this).trigger(EVENT.OPTS_CHANGE, changes);
        }
      }
    );
  }

  _eachOption(processFn, completeFn) {
    parallel(
      this.elements,
      (elm, cb) => {
        const $elm = $(elm);
        const key = STORE[$elm.data('store')];

        this.store.get(key, (value) => {
          processFn($elm, key, value, () => cb());
        });
      },
      completeFn
    );
  }
}

$(document).ready(() => {
  loadExtension();

  async function loadExtension() {
  	// 是否开启GitHub代码浏览树
  	if (!window.GITHUB_CODE_OCTOTREE) {
  		return;
  	}
  	
    const $html = $('html');
    const $document = $(document);
    const $dom = $(TEMPLATE);
    const $sidebar = $dom.find('.octotree-sidebar');
    const $toggler = $sidebar.find('.octotree-toggle');
    const $views = $sidebar.find('.octotree-view');
    const $footer = $sidebar.find('.octotree-footer');
    const $viewHeader = $views.find('.octotree-view-header');
    const $spinner = $sidebar.find('.octotree-spin');
    const $pinner = $sidebar.find('.octotree-pin');
    const adapter = new GitHub(store);
    const treeView = new TreeView($dom, store, adapter);
    const optsView = new OptionsView($dom, store, adapter);
    const helpPopup = new HelpPopup($dom, store);
    const errorView = new ErrorView($dom, store);
    let currRepo = false;
    let hasError = false;
    
    // TODO 动态修改暗黑模式主题
    setTheme('dark');

    $pinner.click(togglePin);
    setupSidebarFloatingBehaviors();
    setHotkeys(store.get(STORE.HOTKEYS));

    $html.hasClass(ADDON_CLASS) ? helpPopup.setShowInstallationWarning() : $html.addClass(ADDON_CLASS);

	// 监听浏览器窗口大小变化
    $(window).resize((event) => {
      if (event.target === window) layoutChanged();
    });

	// 循环给控件treeView, errorView, optsView注册事件
    for (const view of [treeView, errorView, optsView]) {
      $(view)
        .on(EVENT.VIEW_READY, function(event) {
          if (this !== optsView) {
            $document.trigger(EVENT.REQ_END);
          }
          showView(this);
        })
        .on(EVENT.VIEW_CLOSE, (event, data) => {
          if (data && data.showSettings) {
            optsView.toggle(true);
          } else {
            showView(hasError ? errorView : treeView);
          }
        })
        .on(EVENT.OPTS_CHANGE, optionsChanged)
        .on(EVENT.FETCH_ERROR, (event, err) => showError(err));
    }

	// 给document注册事件
    $document
      .on(EVENT.REQ_START, () => $spinner.addClass('octotree-spin--loading'))
      .on(EVENT.REQ_END, () => $spinner.removeClass('octotree-spin--loading'))
      .on(EVENT.LAYOUT_CHANGE, layoutChanged)
      .on(EVENT.TOGGLE_PIN, layoutChanged)
      .on(EVENT.LOC_CHANGE, () => tryLoadRepo());

	// 侧边栏初始样式参数设置
    $sidebar
      .addClass(adapter.getCssClass())
      .width(Math.min(parseInt(store.get(STORE.WIDTH)), 1000))
      .resize(() => layoutChanged(true))
      .appendTo($('body'));

    adapter.init($sidebar);
    helpPopup.init();

    await pluginManager.activate({
      adapter,
      $document,
      $dom,
      $sidebar,
      $toggler,
      $views,
      treeView,
      optsView,
      errorView
    });

    return tryLoadRepo();

    /**
     * Invoked when the user saves the option changes in the option view.
     * @param {!string} event
     * @param {!Object<!string, [(string|boolean), (string|boolean)]>} changes
     */
    async function optionsChanged(event, changes) {
      let reload = false;

      Object.keys(changes).forEach((storeKey) => {
        const [oldValue, newValue] = changes[storeKey];

        switch (storeKey) {
          case STORE.TOKEN:
          case STORE.LOADALL:
          case STORE.ICONS:
          case STORE.PR:
            reload = true;
            break;
          case STORE.HOVEROPEN:
            handleHoverOpenOption(newValue);
            break;
          case STORE.HOTKEYS:
            setHotkeys(newValue, oldValue);
            break;
          case STORE.DARKMODE:
          	setTheme('dark');
          	console.log("DARKMODE-------------------");
          	break;
        }
      });

      if (await pluginManager.applyOptions(changes)) {
        reload = true;
      }

      if (reload) {
        tryLoadRepo(true);
      }
    }

	/**
	 * 尝试重新加载数据（已做缓存优化，避免重复发请求加载数据）
	 * @param {Object} reload
	 */
    function tryLoadRepo(reload) {
      const token = octotree.getAccessToken();
      adapter.getRepoFromPath(currRepo, token, (err, repo) => {
        if (err) {
          showError(err);
        } else if (repo) {
          if (store.get(STORE.PINNED) && !isSidebarVisible()) {
            // 如果我们处于pin模式，但是侧边栏还没有显示，请显示它。
			//注意，如果我们从另一页返回到代码页，则侧边栏是“固定”的，但不可见。
            if (isSidebarPinned()) toggleSidebar();
            else togglePin();
          } else if (isSidebarVisible()) {
            const replacer = ['username', 'reponame', 'branch', 'pullNumber'];
            const repoChanged = JSON.stringify(repo, replacer) !== JSON.stringify(currRepo, replacer);
            if (repoChanged || reload === true) {
              hasError = false;
              $document.trigger(EVENT.REQ_START);
              currRepo = repo;
              treeView.show(repo, token);
            } else {
              treeView.syncSelection(repo);
            }
          } else {
            // 侧边栏不可见（因为它没有固定），显示切换开关
            $toggler.show();
          }
        } else {
          // 不是repo，不在非代码页中显示
          $toggler.hide();
          toggleSidebar(false);
        }
        layoutChanged();
      });
    }

	/**
	 * 显示view容器页
	 * @param {Object} view
	 */
    function showView(view) {
      $views.removeClass('current');
      view.$view.addClass('current');
      $(view).trigger(EVENT.VIEW_SHOW);
    }

	/**
	 * 显示错误页
	 * @param {Object} err
	 */
    function showError(err) {
      hasError = true;
      errorView.show(err);

      if (store.get(STORE.PINNED)) togglePin(true);
    }

	/**
	 * 侧边栏显示隐藏的切换控制
	 * @param {Object} visibility
	 */
    function toggleSidebar(visibility) {
      if (visibility !== undefined) {
        if (isSidebarVisible() === visibility) return;
        toggleSidebar();
      } else {
        $html.toggleClass(SHOW_CLASS);
        $document.trigger(EVENT.TOGGLE, isSidebarVisible());

        // 确保在侧边栏隐藏后显示时加载repo。
		// 请注意，tryloadrepo（）已经负责在没有任何更改的情况下不重新加载。
        if (isSidebarVisible()) {
          $toggler.show();
          tryLoadRepo();
        }
      }

      return visibility;
    }

	/**
	 * 固定边栏按钮的切换处理
	 * @param {Object} isPinned
	 */
    function togglePin(isPinned) {
      if (isPinned !== undefined) {
        if (isSidebarPinned() === isPinned) return;
        return togglePin();
      }

      $pinner.toggleClass(PINNED_CLASS);

      const sidebarPinned = isSidebarPinned();
      $pinner.find('.tooltipped').attr('aria-label', `${sidebarPinned ? '取消固定' : '固定'}边栏`);
      $document.trigger(EVENT.TOGGLE_PIN, sidebarPinned);
      store.set(STORE.PINNED, sidebarPinned);
      toggleSidebar(sidebarPinned);
      return sidebarPinned;
    }

	/**
	 * 侧边栏宽度改变处理
	 * @param {Object} save
	 */
    function layoutChanged(save = false) {
      const width = $sidebar.outerWidth();
      adapter.updateLayout(isSidebarPinned(), isSidebarVisible(), width);
      if (save === true) {
        store.set(STORE.WIDTH, width);
      }
    }

    /**
     * 控制边栏在浮动模式（即非固定）下的行为。
     */
    function setupSidebarFloatingBehaviors() {
      const MOUSE_LEAVE_DELAY = 500;
      const KEY_PRESS_DELAY = 4000;
      let isMouseInSidebar = false;

      handleHoverOpenOption(this.store.get(STORE.HOVEROPEN));

      // 如果在侧边栏外单击，则立即关闭。
      $document.on('click', () => {
        if (!isMouseInSidebar && !isSidebarPinned() && isSidebarVisible()) {
          toggleSidebar(false);
        }
      });

      $document.on('mouseover', () => {
        // 当鼠标移动到边栏外时，确保仅执行一次StartTimer。
        if (!timerId) {
          isMouseInSidebar = false;
          startTimer(MOUSE_LEAVE_DELAY);
        }
      });

      let timerId = null;

      const startTimer = (delay) => {
        if (!isMouseInSidebar && !isSidebarPinned()) {
          clearTimer();
          timerId = setTimeout(() => toggleSidebar(isSidebarPinned()), delay);
        }
      };
      const clearTimer = () => {
        if (timerId) {
          clearTimeout(timerId);
          timerId = null;
        }
      };

      $sidebar
        .on('keyup', () => startTimer(KEY_PRESS_DELAY))
        .on('mouseover', (event) => {
          // 防止mouseover传播到document
          event.stopPropagation();
        })
        .on('focusin mousemove', (event) => {
          // 悬停在切换开关上时不要做任何事情
          const isHoveringToggler = $toggler.is(event.target) || $toggler.has(event.target).length;

          if (isHoveringToggler) return;

          /**
           * 单击侧边栏中的文件，然后向外移动时，
           * 使用“focusin”而不是“mouseenter”来处理这种情况->侧边栏中触发了“mouseenter”，
           * 清除计时器并保持侧边栏打开。
           */
          isMouseInSidebar = true;
          clearTimer();

          if (event.type === 'mousemove' && !isSidebarVisible()) toggleSidebar(true);
        });
    }

    function onTogglerHovered() {
      toggleSidebar(true);
    }

    function onTogglerClicked(event) {
      event.stopPropagation();
      toggleSidebar(true);
    }

	/**
	 * 处理鼠标滑动到侧边栏开关处
	 * 
	 * @param {Object} enableHoverOpen
	 */
    function handleHoverOpenOption(enableHoverOpen) {
      // on添加事件、off移除事件
      if (enableHoverOpen) {
        $toggler.off('click', onTogglerClicked);
        $toggler.on('mouseenter', onTogglerHovered);
      } else {
        $toggler.off('mouseenter', onTogglerHovered);
        $toggler.on('click', onTogglerClicked);
      }
    }
    
    /**
     * 设置主题
     * 
     * @param {Object} theme
     */
    function setTheme(theme) {
        store.set(STORE.THEME, theme);
        
	    if(this.store.get(STORE.DARKMODE)) {
	    	$views.addClass('theme-dark-octotree-view');
	    	$viewHeader.addClass('theme-dark-octotree-view-header');
	    	$footer.addClass('theme-dark-octotree-footer');
	    } else {
	    	$views.removeClass('theme-dark-octotree-view')
	    	$viewHeader.removeClass('theme-dark-octotree-view-header');
	    	$footer.removeClass('theme-dark-octotree-footer');
	    }
    }

    /**
     * 将新热键设置为固定或取消固定侧边栏。
     * @param {string} newKeys
     * @param {string?} oldKeys
     */
    function setHotkeys(newKeys, oldKeys) {
      key.filter = () => $sidebar.is(':visible');
      if (oldKeys) key.unbind(oldKeys);
      key(newKeys, () => {
        if (togglePin()) treeView.focus();
      });
    }

    function isSidebarVisible() {
      return $html.hasClass(SHOW_CLASS);
    }

    function isSidebarPinned() {
      return $pinner.hasClass(PINNED_CLASS);
    }
  }
});

})();