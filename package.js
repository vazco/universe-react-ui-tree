Package.describe({
    name: 'universe:react-ui-tree',
    version: '1.0.0',
    // Brief, one-line summary of the package.
    summary: 'React tree component for meteor (It use universe modules) ',
    // URL to the Git repository containing the source code for this package.
    git: 'https://github.com/vazco/universe-react-ui-tree',
    // By default, Meteor will default to using README.md for documentation.
    // To avoid submitting documentation, set this field to null.
    documentation: 'README.md'
});

Package.onUse(function (api) {
    api.versionsFrom('1.2.0.2');
    api.use('universe:modules@0.6.0');
    api.use('universe:utilities-react@0.5.3');
    api.use('universe:modules-npm@0.9.4');
    api.addFiles('externals.npm.json');
    api.addFiles('node.import.jsx');
    api.addFiles('tree.import.js');
    api.addFiles('index.import.jsx');
});
