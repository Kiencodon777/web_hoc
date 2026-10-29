// Use the reference component's generator with the existing Vanilla frontend.
const fs=require('node:fs'),path=require('node:path'),esbuild=require('esbuild');
const root=path.join(__dirname,'..'),license=fs.readFileSync(path.join(root,'node_modules/blobatar/LICENSE'),'utf8');
esbuild.buildSync({stdin:{contents:"import {blobatar} from 'blobatar';const cache=new Map();window.KienPKAvatar=id=>{if(!cache.has(id)){if(cache.size>=256)cache.clear();cache.set(id,blobatar(id,{background:'circle',animate:'hover'}));}return cache.get(id);};",resolveDir:root},bundle:true,format:'iife',platform:'browser',minify:true,target:'es2022',outfile:path.join(root,'dist/pk-avatar.js'),banner:{js:'/* Blobatar 2.7.0 — '+license.replaceAll('*/','* /')+' */'}});
fs.copyFileSync(path.join(root,'node_modules/blobatar/dist/motion.css'),path.join(root,'dist/pk-avatar-motion.css'));
