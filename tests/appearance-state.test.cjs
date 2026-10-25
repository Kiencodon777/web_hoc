const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const window={};vm.runInNewContext(fs.readFileSync(__dirname+'/../dist/appearance-state.js','utf8'),{window});const {read,select}=window.KienAppearance;
test('one scene choice survives save/reload and synchronizes legacy page fields',()=>{
 const state=read(JSON.stringify({landing:'sakura',study:'gradient',motion:false,brightness:65}));
 for(const theme of ['wave','grid','topography','chrome','gradient','still','sakura']){assert(select(state,theme));const loaded=read(JSON.stringify(state));assert.equal(loaded.theme,theme);assert.equal(loaded.landing,theme);assert.equal(loaded.study,theme);assert.equal(loaded.motion,false);assert.equal(loaded.brightness,65);}
});
test('legacy preferences migrate once without discarding brightness or motion',()=>{
 const home=read('{"landing":"wave","study":"gradient","brightness":30,"motion":false}');assert.equal(home.theme,'wave');assert.equal(home.study,'wave');assert.equal(home.brightness,30);assert.equal(home.motion,false);
 assert.equal(read('{"study":"chrome"}').theme,'chrome');assert.equal(read('{"theme":"still","landing":"sakura"}').theme,'still');
});
test('invalid stored choices and malformed values fall back safely; invalid selection leaves state intact',()=>{
 for(const raw of ['{','null','[]','42','{"theme":"unknown","landing":"invalid"}'])assert.equal(read(raw).theme,'sakura');
 assert.equal(read('{"brightness":1000}').brightness,80);assert.equal(read('{"brightness":-20}').brightness,15);assert.equal(read('{"brightness":"bad"}').brightness,45);
 const state=read(null),before=JSON.stringify(state);assert.equal(select(state,'bad'),false);assert.equal(JSON.stringify(state),before);
});
