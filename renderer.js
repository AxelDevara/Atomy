const MongoClient = require('D://Source/Atomy/node_modules/mongodb').MongoClient;
const uri = "mongodb+srv://admin:admin@tutorialdb-uspcp.mongodb.net/test?retryWrites=true&w=majority";

const $ = require('D://Source/Atomy/node_modules/jquery');
const dt = require('D://Source/Atomy/node_modules/datatables.net')(window, $)
const buttons = require('D://Source/Atomy/node_modules/datatables.net-buttons')(window, $)
require( 'datatables.net-buttons/js/buttons.colVis.js' )(window, $);
require( 'datatables.net-buttons/js/buttons.flash.js' )(window, $);
require( 'datatables.net-buttons/js/buttons.html5.js' )(window, $);
require( 'datatables.net-buttons/js/buttons.print.js' )(window, $);

require( 'd:/Source/Atomy/node_modules/datatables.net-colreorder-dt/js/colReorder.dataTables' )(window, $);
require( 'd:/Source/Atomy/node_modules/datatables.net-select-dt/js/select.dataTables' )(window, $);

let datas = []
//Database
async function loadCollection(){
  const client = await new MongoClient.connect(uri, { useNewUrlParser: true });
  return client.db("Atomy").collection("Data");
}

async function getName() {
  let items = []
  try{
  const name = await loadCollection()
  items = await name.find({}, {projection:{_id:0}}).toArray()

 //items = await name.find({founded_year:2010}, {projection:{name: 1, _id:0}} ).toArray()
  //items = await name.aggregate({$match: {founded_year:2010}},{$group : {_id:"$name"}}).toArray()
  }
  catch(e){
    console.log(e)
  }
  //let items = await name.find({founded_year:2010}, {projection:{name: 1, _id:0}} ).toArray()
  console.log(items)

return items
}
getName().then((x) => {
  datas = x
  setTimeout(() => {
    table1.clear().rows.add(datas).draw();
  }, 2000); 
  console.log(datas)
})
const table1 =  $('#table1').DataTable({
  data : datas,
  select : true,
  colReorder: true,
  buttons: [
    'copy', 'excel', 'pdf'
    ],
  columns : [
    {data : 'Nama'},
    {data : 'Tanggal'},
    {data : 'ID'},
    {data : 'Resi'},
    {data : 'hp'},
    {data : 'barang'},
    {data : 'qty'}
  ]
})
table1.on( 'draw.dt', function () {
  console.log( 'Redraw took at: '+(new Date().getTime())+'mS' );
} );
//const datas = await getName()


//Table 
let selectedData = []
let qty
let id
let tgl
let brg
let hape
let nam
let resi

$('#table1 tbody').on('dblclick', ( e, dt, type, indexes ) => {
      selectedData = table1.row().data();
      $('input#editID').val(selectedData['ID'])
      $('input#editTanggal').val(selectedData['Tanggal'])
      $('input#editNama').val(selectedData['Nama'])
      $('input#editbarang').val(selectedData['barang'])
      $('input#edithp').val(selectedData['hp'])
      $('input#editqty').val(selectedData['qty'])
      $('input#editResi').val(selectedData['Resi'])
     
      $('#edit').addClass('is-active')
      console.log(selectedData)
      // do something with the ID of the selected items
  
} )


//UI
$('#insert').click(() =>
{
  $('#input').addClass('is-active')
})

$('.modal-close').click(() =>
{
  $('#input').removeClass('is-active')
})

$('#closeedit').click(() =>
{
  $('#edit').removeClass('is-active')
})
$('#cancel').click(() =>
{
  $('#input').removeClass('is-active')
})
$('#features').click(() =>
{
  
})


//Update
async function insert(){
  const name = await loadCollection()
  name.insertOne({Nama : nam, 
    Tanggal : tgl, 
    ID : id, 
    Resi : resi, 
    hp : hape, 
    barang : brg,
    qty : qty
})

}
async function remove(){
  const name = await loadCollection()
  name.deleteOne({ ID : selectedData['ID'],
    Resi : selectedData['Resi']})
}
async function update(){
  const name = await loadCollection()
  name.updateOne(
    {ID : selectedData['ID'], Resi : selectedData['Resi']},
    {$set : {Nama : nam, 
      Tanggal : tgl, 
      ID : id, 
      Resi : resi, 
      hp : hape, 
      barang : brg,
      qty : qty}}
  )
}
$('button#insert').click(() =>
{
  qty  = $('input#inputQty').val()
  id =  $('input#inputID').val()
  tgl  =  $('input#inputTanggal').val()
  brg = $('input#inputBarang').val()
  hape = $('input#inputHP').val()
  nam = $('input#inputNama').val()
  resi = $('input#inputResi').val()
  setTimeout(() => {
    insert().then(() =>{ 
      alert('Inserted row') 
      getName().then((x) => {
        datas = x
        setTimeout(() => {
          table1.clear().rows.add(datas).draw();
        }, 300); 
        console.log(datas)
      })
      $('#input').removeClass('is-active')
    })
  }, 400);
})
$('#remove').click(() =>
{
  remove().then(() => {
    selectedData = []   
    alert('Removed successfully') 
    $('#edit').removeClass('is-active')
    getName().then((x) => {
      datas = x
      setTimeout(() => {
        table1.clear().rows.add(datas).draw();
      }, 300); 
      console.log(datas)
    })
  })
})
$('#update').click(() =>
{
  qty  = $('input#editqty').val()
  id =  $('input#editID').val()
  tgl  =  $('input#editTanggal').val()
  brg = $('input#editbarang').val()
  hape = $('input#edithp').val()
  nam = $('input#editNama').val()
  resi = $('input#editResi').val()
  setTimeout(() => {
    update().then(() =>{
      selectedData = []   
      alert('update success') 
      getName().then((x) => {
        datas = x
        setTimeout(() => {
          table1.clear().rows.add(datas).draw();
        }, 300); 
        console.log(datas)
      })
    })
  }, 400);
  
  
  
  $('#edit').removeClass('is-active')
})


