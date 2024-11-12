fx_version 'adamant'

game {'gta5'}

author 'ntdotjsx'

version '1.0'

ui_page 'dist/index.html'

files {
    'dist/index.html',
    'dist/assets/index.css',
    'dist/assets/app.js',
    "img/**",
	'img/*.png',
	'img/*.gif',
	'img/items/*.png',
	'img/items/*.gif',
    "sound/**",
	'sound/*.mp3',
	'sound/*.wav',
}

client_script {
    "config/category.lua", 
    'core/main.lua'
}

shared_scripts {
	'@es_extended/imports.lua',
	'@es_extended/locale.lua',
}