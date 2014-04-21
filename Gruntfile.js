module.exports = function(grunt){
    // 构建任务配置
    grunt.initConfig({
        //读取package.json的内容，形成个json数据
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            //文件头部输出信息
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            //具体任务配置
            build: {
                //源文件
                src: 'js/zepto.snapscroll.js',
                //目标文件
                dest: 'js/zepto.snapscroll-min.js'
            }
        }
    });

    // 加载指定插件任务
    grunt.loadNpmTasks('grunt-contrib-uglify');

    // 默认执行的任务
    grunt.registerTask('default', ['uglify']);
};