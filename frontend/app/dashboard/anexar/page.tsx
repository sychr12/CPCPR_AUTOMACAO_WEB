'use client'

import { useQuery } from "@tanstack/react-query"
import { inscRenovApi, anexarApi } from "@/lib/api"
import type { InscRenov } from "@/types"

export default function AnexarPage(){

  const {data=[], isLoading, refetch} = useQuery({

    queryKey:["processos"],

    queryFn: async () => {

      const res = await inscRenovApi.listar({size:50})

      return res.data.content as InscRenov[]

    }

  })


  async function anexarSIGED(id:number){

    await anexarApi.anexarSIGED(id)

    alert("Documento anexado no SIGED")

    refetch()

  }

  async function anexarSEFA(id:number){

    await anexarApi.anexarSEFA(id)

    alert("Documento anexado na SEFA")

    refetch()

  }


  return (

    <div className="animate-fade-up">

      <h2 style={{fontSize:'20px',marginBottom:'4px'}}>
        Anexar Documentos
      </h2>

      <p style={{
        fontSize:'13px',
        color:'var(--text-muted)',
        marginBottom:'32px'
      }}>
        Automação de anexação nos sistemas.
      </p>


      <div style={{
        display:'grid',
        gridTemplateColumns:'repeat(auto-fill,minmax(320px,1fr))',
        gap:'16px'
      }}>

        {isLoading && <p>Carregando...</p>}

        {data.map(proc=>{

          return(

            <div
              key={proc.id}
              style={{
                background:'var(--bg-card)',
                border:'1px solid var(--border)',
                borderRadius:'12px',
                padding:'20px'
              }}
            >

              <div style={{marginBottom:'12px'}}>

                <strong>{proc.unloc}</strong>

                <div style={{
                  fontSize:'12px',
                  color:'var(--text-muted)'
                }}>
                  {proc.descricao}
                </div>

              </div>

              <div style={{
                display:'flex',
                gap:'8px'
              }}>

                <button
                  onClick={()=>anexarSIGED(proc.id)}
                  style={{
                    padding:'8px 12px',
                    borderRadius:'6px',
                    background:'#4a9eff',
                    color:'#fff',
                    border:'none',
                    cursor:'pointer'
                  }}
                >
                  Anexar SIGED
                </button>

                <button
                  onClick={()=>anexarSEFA(proc.id)}
                  style={{
                    padding:'8px 12px',
                    borderRadius:'6px',
                    background:'#a78bfa',
                    color:'#fff',
                    border:'none',
                    cursor:'pointer'
                  }}
                >
                  Anexar SEFA
                </button>

              </div>

            </div>

          )

        })}

      </div>

    </div>

  )

}