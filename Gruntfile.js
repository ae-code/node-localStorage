module.exports = function(grunt) {
    grunt.initConfig({
	pkg: grunt.file.readJSON('package.json'),
    
	jshint: {
	    all: { 
		options: {
		    '-W099': true // annoying mixed tabs and spaces
		},
		src: [ 'src/*.js', 'test/*.js' ]
	    }
	},

	jasmine_node: {
	    specFolder: 'test',
	    specNameMatcher: ''
	}
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-jasmine-node');

    grunt.registerTask('default', ['jshint', 'jasmine_node']);
    grunt.registerTask('test', ['jasmine_node']);
};