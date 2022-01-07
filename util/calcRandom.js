function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }
  
function ciclo(array,cant){
    for(let i=0; i<cant; i++)
    {
      let num = getRandomInt(1,1000)
      array[num-1]++
    }
    return array
}

let numArr=[]
for(let i=0;i<100000000;i++)//100000000
{
  numArr[i]=0
}

process.on('message', obj=>{
  process.send({result: ciclo(numArr,obj.cantidad)})
})