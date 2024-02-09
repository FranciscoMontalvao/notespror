import { toast } from 'sonner';
import logo from './assets/Logo.svg'
import { NewNoteCard } from './components/new-note-card';
import { NoteCard } from './components/note-card';
import { useState } from 'react';

interface Note {
  id: string,
  date: Date,
  content: string
}

export function App() {
  const [search, setSearch] = useState('')

  const [notes, setNotes] = useState<Note[]>(() => { 
    const notes = localStorage.getItem('notes')
    if (notes) {
      return JSON.parse(notes)
    }
    return []
  
  } )

  const onNoteCreated =(content :string)=>{

    const newNote = {
      id: crypto.randomUUID(),
      date: new Date(),
      content,
    }

    const notesArray = [newNote, ...notes]

    setNotes(notesArray)

    localStorage.setItem('notes', JSON.stringify(notesArray))
  }

  const onNoteDeleted = (id: string) => {
    const newNotes = notes.filter(note => {
      return note.id !== id
    })

    setNotes(newNotes)
    localStorage.setItem('notes', JSON.stringify(newNotes))
    toast.success('Nota apagada com sucesso')
  }

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value
    setSearch(query)
  }

  const filteredNotes = search !== ''
  ? notes.filter(note => note.content.toLowerCase().includes(search.toLowerCase())) : notes

  return (
  <div className='mx-auto max-w-6xl my-12 space-y-6 px-5 '>
      <img src={logo} alt="" />

      <form className='w-full'>
        <input type="text"
          placeholder='Busque em suas notas ...'
          className='w-full bg-transparent text-3xl font-semibold -tracking-tight outline-none placeholder:text-slate-500'
          onChange={handleSearch}
        />
      </form>

      <div className='h-px bg-slate-700' />
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 auto-rows-[250px] gap-6 '>
        <NewNoteCard onNoteCreated={onNoteCreated} />
        {filteredNotes.map(note => {
          return <NoteCard key={note.id} note={note} onNoteDeleted={onNoteDeleted}/>
        })}
      </div>
    </div>
  );
}