'use client'

import { useState, useRef } from "react"
import html2canvas from "html2canvas"
import jsPDF from "jspdf"

export default function CartaoProdutor(){

const frenteRef = useRef<HTMLDivElement>(null)
const versoRef = useRef<HTMLDivElement>(null)

const [virado,setVirado] = useState(false)
const [foto,setFoto] = useState<string | null>(null)

const [dados,setDados] = useState({
registro:"",
cpf:"",
nome:"",
propriedade:"",
unloc:"",
inicio:"",
validade:"",
endereco:"",
atividade1:"",
atividade2:"",
geo:""
})

function handleChange(e:any){
setDados({...dados,[e.target.name]:e.target.value})
}

function uploadFoto(e:any){

const file = e.target.files[0]
if(!file) return

const reader = new FileReader()

reader.onload = () => {
setFoto(reader.result as string)
}

reader.readAsDataURL(file)

}

async function gerarPDF(){

if(!frenteRef.current || !versoRef.current) return

const frente = await html2canvas(frenteRef.current,{scale:3})
const verso = await html2canvas(versoRef.current,{scale:3})

const pdf = new jsPDF({
orientation:"landscape",
unit:"px",
format:[1100,680]
})

pdf.addImage(frente.toDataURL("image/png"),"PNG",0,0,1100,680)

pdf.addPage()

pdf.addImage(verso.toDataURL("image/png"),"PNG",0,0,1100,680)

pdf.save("cartao-produtor.pdf")

}

return(

<div style={{
display:"flex",
gap:40,
padding:40,
background:"#f3f6fb",
minHeight:"100vh",
fontFamily:"Arial"
}}>

{/* FORM */}

<div style={{
width:260,
display:"flex",
flexDirection:"column",
gap:10,
background:"#fff",
padding:20,
borderRadius:10,
boxShadow:"0 8px 20px rgba(0,0,0,0.08)"
}}>

<h3>Dados</h3>

<input name="registro" placeholder="Registro" onChange={handleChange}/>
<input name="cpf" placeholder="CPF" onChange={handleChange}/>
<input name="nome" placeholder="Nome" onChange={handleChange}/>
<input name="propriedade" placeholder="Propriedade" onChange={handleChange}/>
<input name="unloc" placeholder="UNLOC / Emissão" onChange={handleChange}/>
<input name="inicio" placeholder="Início atividade" onChange={handleChange}/>
<input name="validade" placeholder="Validade" onChange={handleChange}/>

<input name="endereco" placeholder="Endereço" onChange={handleChange}/>
<input name="atividade1" placeholder="Atividade primária" onChange={handleChange}/>
<input name="atividade2" placeholder="Atividade secundária" onChange={handleChange}/>
<input name="geo" placeholder="Georreferenciamento" onChange={handleChange}/>

<input type="file" onChange={uploadFoto}/>

<button onClick={()=>setVirado(!virado)}>
Virar cartão
</button>

<button onClick={gerarPDF}>
Gerar PDF
</button>

</div>

{/* CARTÃO */}

<div style={{
width:1200,
height:790,
perspective:"1400px"
}}>

<div style={{
width:"100%",
height:"100%",
position:"relative",
transformStyle:"preserve-3d",
transition:"transform 0.8s",
transform:virado ? "rotateY(180deg)" : "rotateY(0deg)"
}}>

{/* FRENTE */}

<div
ref={frenteRef}
style={{
position:"absolute",
width:"100%",
height:"100%",
backgroundImage:"url(/frente.png)",
backgroundSize:"cover",
backfaceVisibility:"hidden"
}}
>

{foto && (

<img
src={foto}
style={{
position:"absolute",
top:340,
right:110,
width:130,
height:160,
objectFit:"cover",
borderRadius:8
}}
/>

)}

<div style={{position:"absolute",top:350,left:90,width:460,fontSize:22}}>
{dados.registro}
</div>

<div style={{position:"absolute",top:350,left:640,width:420,fontSize:22}}>
{dados.cpf}
</div>

<div style={{position:"absolute",top:460,left:90,width:930,fontSize:26,fontWeight:600}}>
{dados.nome}
</div>

<div style={{position:"absolute",top:590,left:90,width:930,fontSize:26}}>
{dados.propriedade}
</div>

{/* UNLOC */}
<div style={{
position:"absolute",
top:710,
left:90,
width:300,
fontSize:22
}}>
{dados.unloc}
</div>

{/* INICIO */}
<div style={{
position:"absolute",
top:710,
left:560,
width:300,
fontSize:22
}}>
{dados.inicio}
</div>

{/* VALIDADE */}
<div style={{
position:"absolute",
top:710,
left:890,
width:300,
fontSize:22
}}>
{dados.validade}
</div>

</div>

{/* VERSO */}

<div
ref={versoRef}
style={{
position:"absolute",
width:"100%",
height:"100%",
backgroundImage:"url(/verso.png)",
backgroundSize:"cover",
transform:"rotateY(180deg)",
backfaceVisibility:"hidden"
}}
>

<div style={{position:"absolute",top:280,left:90,width:920,fontSize:24}}>
{dados.endereco}
</div>

<div style={{position:"absolute",top:430,left:90,width:920,fontSize:24}}>
{dados.atividade1}
</div>

<div style={{position:"absolute",top:560,left:90,width:920,fontSize:24}}>
{dados.atividade2}
</div>

<div style={{position:"absolute",top:690,left:90,width:920,fontSize:24}}>
{dados.geo}
</div>

</div>

</div>

</div>

</div>

)
}