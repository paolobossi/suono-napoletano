import { Link } from "wouter";

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full p-6 md:p-8">
        <h1 className="text-3xl font-bold text-center text-[#04a0e0] mb-6">Informazioni</h1>
        
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
            programma radiofonico in onda su <span className="font-semibold text-[#04a0e0]">Radio 24</span>. 
            Non vi è alcun legame o affiliazione ufficiale con Radio 24 o con lo show.
          </p>
          
          <p className="text-base md:text-lg">
            La canzone utilizzata è la <span className="font-semibold text-[#04a0e0]">Tarantella Napoletana</span>, 
            in una versione interpretata da <em>Mario Rusca</em> e l'<em>Orchestra Mandolinistica Italiana</em>, 
            tratta dall'album <em>"Lounges and Restaurants"</em>, pubblicato da 
            <span className="font-semibold text-[#04a0e0]"> Sonoton Music</span> il 30 giugno 2000.
            <br className="my-2" />
            Arrangiamento: Mario Rusca — Compositore: Tradizionale
            <br className="my-1" />
            Editore musicale: Sonoton Music GmbH & Co. KG
          </p>
          
          <p className="text-base md:text-lg">
            Il sito ha finalità esclusivamente ludiche e non commerciali.
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