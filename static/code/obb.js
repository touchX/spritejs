const paper = spritejs.Paper2D('#paper'),
      bglayer = paper.layer('bglayer'),
      fglayer = paper.layer('fglayer'),
      Sprite = spritejs.Sprite,
      Path = spritejs.Path

paper.setResolution(1600, 1200) 

function randomBlock(){
  const s = new Sprite()
  const i = Math.floor(12 * Math.random()),
        j = Math.floor(8 * Math.random()),
        r = Math.random() * 360

  s.attr({
    pos: [400 + i * 100, 300 + j * 100],
    size: [80, 80],
    bgcolor: '#fff',
    rotate: r,
    border: [3, '#3c7'],
  })

  bglayer.appendChild(s)

  return s
}

const bullets = new Set()
function randomBullet() {
  const p = new Path('M0 0 L 50 15 L 0 30 Z')
  const x0 = 100 + Math.floor(250 * Math.random()),
        y0 = 100 + Math.floor(200 * Math.random()),
        speedX = 500 + Math.floor(1500 * Math.random())

  p.attr({
    pos: [x0, y0],
    color: '#0ff',
    renderMode: 'fill',
  })

  const animation = p.animate(
    (attr, p) => {
      let x = x0 + speedX * p,
          y = y0 + 1500 * p * p

      let rotate = 180 * Math.atan(2 * x * 1500 / (speedX * speedX)) / Math.PI
          
      return {pos: [x, y], rotate}
    },{
      duration: 5000
    })

  animation.finished.then(() => {
    fglayer.removeChild(p)
    bullets.delete(p)
  })

  fglayer.appendChild(p)
  bullets.add(p)
}

let blocks = []
for(let i = 0; i < 50; i++){
  blocks.push(randomBlock())
}

setInterval(randomBullet, 500)

fglayer.on('update', () => {
  //console.log(blocks)
  blocks.forEach(block => {
    for(const bullet of bullets){
      if(block.OBBCollision(bullet)){
        block.attr('bgcolor', '#f00')
        return
      }
    }
    block.attr('bgcolor', '#fff')
  })
})

window.addEventListener('resize', evt => {
  paper.setViewport('auto', 'auto')
})