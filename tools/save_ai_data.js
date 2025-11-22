// save_ai_data.js — creates ai_training_dataset.json (200 items)
const fs = require('fs');
const styles = ['modern','traditional','luxury','minimal'];
const rooms = ['living_room','bedroom','dining_room','kitchen','bathroom'];
const palettes = {
  modern: ['#4f6d7a','#c0d6df','#e8dab2','#f8f8f8','#333333'],
  traditional: ['#8b4513','#daa520','#f5f5dc','#f0fff0','#800020'],
  luxury: ['#000033','#8b4513','#ffd700','#f8f8ff','#800020'],
  minimal: ['#ffffff','#f0f0f0','#dddddd','#999999','#333333']
};
const dataset = [];
for (let i=0;i<200;i++){
  const style = styles[i%styles.length];
  const room = rooms[i%rooms.length];
  const budget = Math.round((Math.random()*100 + (i%5)*200) * 1000);
  dataset.push({
    id: i+1,
    room,
    style,
    budget_range: budget,
    recommended_item_types: room==='kitchen' ? ['furniture','decor'] : ['furniture','lighting','decor'],
    color_palette: palettes[style],
    example_products: [
      {name: `${style} sample product A ${i+1}`, price: Math.round(budget*0.15), link: 'https://www.amazon.in'},
      {name: `${style} sample product B ${i+1}`, price: Math.round(budget*0.1), link: 'https://www.pepperfry.com'},
    ],
    notes: `Rule-based example for ${room} in ${style} style`
  });
}
fs.writeFileSync('ai_training_dataset.json', JSON.stringify(dataset, null, 2));
console.log('ai_training_dataset.json written (200 items).');

