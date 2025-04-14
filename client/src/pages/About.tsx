import { Link } from "wouter";

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col items-center p-4 py-6 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-md max-w-md w-full p-5 my-2">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-4">Informazioni</h1>
        
        <div className="space-y-4 text-gray-700">
          <p className="text-sm md:text-base">
            Questo sito è ispirato a <a 
              href="https://www.radio24.ilsole24ore.com/programmi/lazanzara" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[#04a0e0] hover:underline"
            >
              La Zanzara
            </a>, 
            programma radiofonico in onda su Radio 24. 
            Non vi è alcun legame o affiliazione ufficiale con Radio 24 o con lo show.
          </p>
          
          <p className="text-sm md:text-base">
            La canzone utilizzata è la Tarantella Napoletana, 
            in una versione interpretata da <span className="font-normal">Mario Rusca</span> e l'<span className="font-normal">Orchestra Mandolinistica Italiana</span>, 
            tratta dall'album <span className="font-normal">"Lounges and Restaurants"</span>, pubblicato da 
            Sonoton Music il 30 giugno 2000.
          </p>
          
          <p className="text-sm md:text-base">
            Il sito ha finalità esclusivamente ludiche e non commerciali. Questo è stato un progetto personale divertente per testare nuovi strumenti di intelligenza artificiale (ChatGPT, Replit).
          </p>
          
          <p className="text-sm md:text-base">
            Per informazioni, scrivere a <a 
              href="mailto:info@suononapoletano.com" 
              className="text-[#04a0e0] hover:underline"
            >
              info@suononapoletano.com
            </a>
          </p>
        </div>
        
        <div className="mt-6 text-center">
          <Link 
            to="/" 
            className="inline-block bg-[#04a0e0] hover:bg-[#038ecf] text-white font-medium py-2 px-5 rounded-full transition-all shadow-md text-sm"
          >
            Torna alla home
          </Link>
        </div>
      </div>
    </div>
  );
}