fx_version 'adamant'

game {'gta5'}

author 'ntdotjsx'

version '1.0'

ui_page 'dist/index.html'

files {
    'dist/index.html',
    'dist/assets/index.css',
    'dist/assets/app.js'
}

client_script 'core/main.lua'

shared_scripts {
	'@es_extended/imports.lua',
	'@es_extended/locale.lua',
}