import * as Dialog from "@radix-ui/react-dialog"
/* import { set } from "date-fns"
import { tr } from "date-fns/locale" */
import { X } from 'lucide-react'
import { ChangeEvent, FormEvent, useState } from "react"
import { toast } from 'sonner'


interface newNoteCardProps {
  onNoteCreated: (content: string) => void
}
let speechhRecognition: SpeechRecognition | null = null

export const NewNoteCard = ({ onNoteCreated }: newNoteCardProps) => {

  const [isRecording, setIsRecording] = useState(false)
  const [shouldShowOnboarding, setShouldShowOnboarding] = useState(true)
  const [content, setContent] = useState("")

  const handleStartEditor = () => {
    setShouldShowOnboarding(false)
  }
  const handleContentChanged = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setContent(event.target.value)


    if (event.target.value === '') {
      setShouldShowOnboarding(true)
    }
  }

  const handleSaveNote = (event: FormEvent) => {
    event.preventDefault()

    if (content === '') {
      toast.error('A nota não pode estar vazia')
      return
    }

    onNoteCreated(content)
    setContent('')
    setShouldShowOnboarding(true)

    toast.success('Nota salva com sucesso')

  }

  const handleStartRecording = () => {
    const isSpeechRecognitionAPIAvailable = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window

    if (!isSpeechRecognitionAPIAvailable) {
      toast.error('Seu navegador não suporta a API de reconhecimento de voz')
      setIsRecording(false)
      return
    }
    setIsRecording(true)
    setShouldShowOnboarding(false)
    const speechhRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition

    speechhRecognition = new speechhRecognitionAPI()

    speechhRecognition.lang = 'pt-BR'
    speechhRecognition.continuous = true
    speechhRecognition.maxAlternatives = 1
    speechhRecognition.interimResults = true

    speechhRecognition.onresult = (event) => {
      const transcription = Array.from(event.results).reduce((text, result) => {
        return text.concat(result[0].transcript)

      }, "")

      setContent(transcription)
    }
    speechhRecognition.start()
  }

  const handleStopRecording = () => {
    setIsRecording(false)

    if (speechhRecognition !== null) {
      speechhRecognition.stop()
    }
  }

  return (
    <Dialog.Root>
      <Dialog.Trigger className='rounded-md flex flex-col text-left gap-3 bg-slate-700 p-5 space-y-3 hover:ring-2 hover:ring-slate-600 focus-visible:ring-2 focus-visible:ring-lime-400'>
        <span className='text-sm font-medium tex-slate-200'>
          Adicionar nota
        </span>
        <p className='tex-sm leading-6 text-slate-400'>
          Grave uma nota em áudio que será convertida para texto automaticamente.
        </p>
      </Dialog.Trigger>
      
      <Dialog.Portal>
        <Dialog.DialogOverlay className="inset-0 fixed bg-black/50" />
        <Dialog.Content className="overflow-hidden fixed inset-0 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-[640px] w-full md:h-[60vh] bg-slate-700 md:rounded-md flex flex-col outline-none">
          <Dialog.Close className="absolute top-0 right-0 bg-slate-800 p-1.5 text-slate-400 hover:text-slate-100">
            <X className="size-5" />
          </Dialog.Close>
          <form className="flex-1 flex flex-col">
            <div className="flex flex-1 flex-col gap-3 p-5">
              <span className='text-sm font-medium tex-slate-400'>
                Adicionar nota
              </span>
              {shouldShowOnboarding ? (
                <p className='tex-sm leading-6 text-slate-400'>
                  Comece
                  <button
                    type="button"
                    onClick={handleStartRecording}
                    className="font-medium text-lime-400 hover:underline">
                    gravando uma nota
                  </button>
                  em áudio ou se preferir
                  <button
                    type="button"
                    onClick={handleStartEditor}
                    className="font-medium text-lime-400 hover:underline">
                    utilize apenas texto
                  </button>.
                </p>
              ) : (
                <textarea
                  autoFocus
                  className="text-sm leading-6 text-slate400 bg-transparent resize-none flex-1 outline-none"
                  onChange={handleContentChanged}
                  value={content}
                />
              )}
            </div>

            {isRecording ? (
              <button
                onClick={handleStopRecording}
                className="w-full flex items-center justify-center gap-2  bg-slate-900 text-sm text-slate-300 py-4 text-center outline-none font-medium hover:text-slate-100 transition-colors"
                type="button">
                <div className="size-3 rounded-full bg-red-500
                  animate-pulse"/>
                Gravando! (Clique p/ interromper)
              </button>
            ) : (
              <button
                onClick={handleSaveNote}
                className="w-full bg-lime-400 text-sm text-lime-950 py-4 text-center outline-none font-medium hover:bg-lime-500 transition-colors "
                type="button">
                Salvar nota
              </button>
            )}
          </form>
        </Dialog.Content>
      </Dialog.Portal>

    </Dialog.Root>

  )
}