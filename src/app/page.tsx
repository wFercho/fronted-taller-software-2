"use client"
import { ChangeEvent, FormEvent, useState } from 'react'



interface API_RESPONSE {
  contador: number
  frecuencias: Object
}

const RUTA_POST = 'http://localhost:4000/api/v1/normalizar_texto'
export default function Home() {
  const [texto, setTexto] = useState("")
  const [files, setFiles] = useState<FileList | null>(null)
  const [apiResponse, setApiResponse] = useState<API_RESPONSE | null>(null)
  const [lista, setLista] = useState<any[] | null>(null)

  const objetoToLista = ({ frecuencias }: API_RESPONSE) => {
    return Object.entries(frecuencias);
  }


  const handleSubmitText = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (texto.length > 0) {
      const formData = new FormData()
      formData.append('texto', texto)
      const response = await fetch(RUTA_POST, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain'
        },
        body: texto
      })

      const data = await response.json() as API_RESPONSE
      setApiResponse(data)
      const _lista = objetoToLista(data)
      setLista(_lista)



    }

  }

  const handleSubmitFile = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (files) {
      const formData = new FormData()
      formData.append('file', files[0])
      const response = await fetch(RUTA_POST, {
        method: 'POST',
        body: formData
      })

      const data = await response.json() as API_RESPONSE
      setApiResponse(data)
      const _lista = objetoToLista(data)
      setLista(_lista)
      return
    }

    console.log("NO HAY ARCHIVOS SELECCIONADOS");


  }
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const myFiles = e.target.files
    if (myFiles) {
      setFiles(myFiles)
    }
  }

  return (
    <main className="flex bg-gray-600 text-white h-full">
      <section className='flex flex-col justify-around h-full items-center w-1/2 bg-sky-950'>
        <form onSubmit={handleSubmitText} className='w-full'>
          <section className='flex flex-col items-center'>
            <h3 className='text-2xl mb-8'>TEXTO</h3>
            <div className='mb-3 w-3/4'>
              <label htmlFor="" className='block mb-2 text-sm font-medium dark:text-white'>Escriba un texto...</label>
              <textarea rows={4} className="resize-none block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                onChange={(e) => setTexto(e.currentTarget.value)}
              ></textarea>
            </div>
            <button className='focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800'>ENVIAR</button>
          </section>
        </form>

        <form onSubmit={handleSubmitFile} className='w-full'>
          <section className='flex flex-col items-center'>
            <h3 className='text-2xl mb-8'>ARCHIVO</h3>
            <label htmlFor="input-upload-document" className='w-3/4 block mb-2 text-sm font-mediu dark:text-white'>
              Subir archivo
              <input type="file" id='input-upload-document'
                accept='.txt'
                onChange={handleFileChange}
                className='block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400' />
            </label>

            <button className='focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800'>SUBIR</button>
          </section>
        </form>
      </section>
      <section className='w-1/2 bg-teal-600 overflow-y-scroll flex flex-col items-center'>
        {apiResponse !== null ? <h2 className='text-xl font-bold'>Contador de palabras:{apiResponse.contador}</h2>: ""}
        <ul>
          {lista !== null ? lista.map(([key, value]) => (
            <li key={key}>
              <strong>{key}:</strong> {value}
            </li>
          )) : <h2>Acá se verá su texto...</h2>}
        </ul>
      </section>
    </main>
  )
}
