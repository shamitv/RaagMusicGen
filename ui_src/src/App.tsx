import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
/*
Generated from : 
Large heading "Generate Music"
4 selects and 1 file download button. Each select has a label. Header has hero image of guitar.

Middle part of page has music sheet.

There is an audio player 

*/ 
  return (
    <div id="ui-container" className="h-auto min-h-screen grid justify-center items-center">
    <div className="max-w-3xl mx-auto p-8 bg-white rounded-md shadow-md">
      <header className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Generate Music</h1>
        <img src="./img/music_abstract_1.png" alt="Guitar" className="w-20 h-20 rounded-full object-cover" />
      </header>
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div>
          <label htmlFor="select1" className="block mb-2 font-semibold">Raag</label>
          <select id="select1" className="w-full border border-gray-300 rounded-md px-3 py-2">
            <option value="1">Yaman</option>
            <option value="2">Bilawal</option>
            <option value="3">Bhairav</option>
            <option value="4">Bhairavi</option>
            <option value="5">Bhupali</option>
            <option value="6">Baageshri</option>
            <option value="7">Khamaj</option>
            <option value="8">Malkauns</option>


          </select>
        </div>
        <div>
          <label htmlFor="select2" className="block mb-2 font-semibold">Instrument</label>
          <select id="select2" className="w-full border border-gray-300 rounded-md px-3 py-2">
            <option value="1">Flute</option>
            <option value="2">Violin</option>
            <option value="3">Grand Piano</option>
            <option value="4">Harmonium</option>

          </select>
        </div>
        <div>
          <label htmlFor="select3" className="block mb-2 font-semibold">Key/Scale</label>
          <select id="select3" className="w-full border border-gray-300 rounded-md px-3 py-2">
            <option value="1">C</option>
            <option value="2" selected>C#</option>
            <option value="3">D</option>
            <option value="4">D#</option>
            <option value="5">E</option>
            <option value="6">F</option>
            <option value="7">F#</option>
            <option value="8">G</option>
            <option value="9">G#</option>
            <option value="10">A</option>
            <option value="11">A#</option>
            <option value="12">B</option>
          </select>
        </div>
        <div>

        </div>
      </div>
      <div className="mb-8">
        <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded">Generate</button>
      </div>
      <audio controls className="w-full">
      </audio>
      <div className="mb-8">
        <img src="./img/cassete.png" alt="Music Sheet" className="w-full aspect-w-1 aspect-h-1" />
      </div>
    </div>
  </div>
  )
}

export default App
