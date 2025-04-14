import { Link } from "wouter";

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full p-6 md:p-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Informazioni</h1>
        
        <div className="space-y-6 text-gray-700">
          <p className="text-base md:text-lg">
            Questo sito è ispirato a <a 
              href="https://www.radio24.ilsole24ore.com/programmi/lazanzara" 
              target="_blank" 
              rel="noopener noreferrer"
              className="font-semibold text-[#04a0e0] hover:underline"
            >
              La Zanzara
            </a>, 
            programma radiofonico in onda su Radio 24. 
            Non vi è alcun legame o affiliazione ufficiale con Radio 24 o con lo show.
          </p>
          
          <p className="text-base md:text-lg">
            La canzone utilizzata è la Tarantella Napoletana, 
            in una versione interpretata da <em>Mario Rusca</em> e l'<em>Orchestra Mandolinistica Italiana</em>, 
            tratta dall'album <em>"Lounges and Restaurants"</em>, pubblicato da 
            Sonoton Music il 30 giugno 2000.
          </p>
          
          <p className="text-base md:text-lg">
            Il sito ha finalità esclusivamente ludiche e non commerciali. Questo è stato un progetto personale divertente per testare nuovi strumenti di intelligenza artificiale (ChatGPT, Replit).
          </p>
          
          <p className="text-base md:text-lg">
            Per informazioni, scrivere a <a 
              href="mailto:info@suononapoletano.com" 
              className="font-semibold text-[#04a0e0] hover:underline"
            >
              info@suononapoletano.com
            </a>
          </p>
        </div>
        
        <div className="mt-8 text-center">
          <Link 
            to="/" 
            className="inline-block bg-[#04a0e0] hover:bg-[#038ecf] text-white font-medium py-3 px-6 rounded-full transition-all transform hover:scale-105 hover:-translate-y-1 border-2 border-white/40 shadow-md"
          >
            Torna alla home
          </Link>
        </div>
      </div>
    </div>
  );
}