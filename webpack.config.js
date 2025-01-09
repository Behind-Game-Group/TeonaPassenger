require('dotenv').config({ path: './.env' });

// console.log('Variables manuellement injectées:', process.env.REACT_APP_AUTH0_DOMAIN, process.env.REACT_APP_AUTH0_CLIENT_ID);

const Encore = require('@symfony/webpack-encore');
const Dotenv = require('dotenv-webpack');
const { DefinePlugin } = require('webpack');

// Manually configure the runtime environment if not already configured yet by the "encore" command.
// It's useful when you use tools that rely on webpack.config.js file.
if (!Encore.isRuntimeEnvironmentConfigured()) {
    Encore.configureRuntimeEnvironment(process.env.APP_ENV || 'dev');
}

Encore
    // directory where compiled assets will be stored
    .setOutputPath('public/build/')
    // public path used by the web server to access the output path
    .setPublicPath('/build')
    // only needed for CDN's or subdirectory deploy
    //.setManifestKeyPrefix('build/')
    .addPlugin(new Dotenv({
        path: '.env', // load this now instead of the ones in '.env'
        safe: true, // load '.env.example' to verify the '.env' variables are all set. Can also be a string to a different file.
        allowEmptyValues: true, // allow empty variables (e.g. `FOO=`) (treat it as empty string, rather than missing)
        systemvars: false, // load all the predefined 'process.env' variables which will trump anything local per dotenv specs.
        silent: true, // hide any errors
        defaults: false, // load '.env.defaults' as the default values if empty.
        // prefix: 'process.env.' // reference your env variables as 'import.meta.env.ENV_VAR'.
    }))
    .addPlugin(
        new DefinePlugin({
            'process.env.REACT_APP_AUTH0_DOMAIN': JSON.stringify(process.env.REACT_APP_AUTH0_DOMAIN),
            'process.env.REACT_APP_AUTH0_CLIENT_ID': JSON.stringify(process.env.REACT_APP_AUTH0_CLIENT_ID),
    }))
    /*
     * ENTRY CONFIG
     *
     * Each entry will result in one JavaScript file (e.g. app.js)
     * and one CSS file (e.g. app.css) if your JavaScript imports CSS.
     */
    .addEntry('app', './assets/react/index.tsx')
    .addStyleEntry('style', './assets/styles/styles.scss')

    // When enabled, Webpack "splits" your files into smaller pieces for greater optimization.
    .splitEntryChunks()

    // will require an extra script tag for runtime.js
    // but, you probably want this, unless you're building a single-page app
    .enableSingleRuntimeChunk()

    /*
     * FEATURE CONFIG
     *
     * Enable & configure other features below. For a full
     * list of features, see:
     * https://symfony.com/doc/current/frontend.html#adding-more-features
     */
    .cleanupOutputBeforeBuild()
    .enableBuildNotifications()
    .enableSourceMaps(!Encore.isProduction())
    // enables hashed filenames (e.g. app.abc123.css)
    .enableVersioning(Encore.isProduction())

    // configure Babel
    // .configureBabel((config) => {
    //     config.plugins.push('@babel/a-babel-plugin');
    // })

    // enables and configure @babel/preset-env polyfills
    .configureBabelPresetEnv((config) => {
        config.useBuiltIns = 'usage';
        config.corejs = '3.38';
    })

    // enables Sass/SCSS support
    .enableSassLoader()

    // uncomment if you use TypeScript
    .enableTypeScriptLoader(function(tsConfig) {
        // You can use this callback function to adjust ts-loader settings
        // https://github.com/TypeStrong/ts-loader/blob/master/README.md#loader-options
        // For example:
        // tsConfig.silent = false
    })

    // uncomment if you use React
    .enableReactPreset()

    .enablePostCssLoader()
    .configureBabelPresetEnv((config) => {
        config.useBuiltIns = 'usage';
        config.corejs = '3.38';
    })
    // uncomment to get integrity="..." attributes on your script & link tags
    // requires WebpackEncoreBundle 1.4 or higher
    //.enableIntegrityHashes(Encore.isProduction())

    // uncomment if you're having problems with a jQuery plugin
    //.autoProvidejQuery()
    ;
module.exports = Encore.getWebpackConfig();

// console.log('Environment Variables:', process.env);
// console.log('ENV VARIABLES LOADED:', process.env.REACT_APP_AUTH0_DOMAIN, process.env.REACT_APP_AUTH0_CLIENT_ID);