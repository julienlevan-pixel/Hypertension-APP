interface WelcomeScreenProps {
  onStart: () => void;
  onShowLeaderboard: () => void;
}

export default function WelcomeScreen({ onStart, onShowLeaderboard }: WelcomeScreenProps) {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <div className="w-full h-48 bg-gradient-to-r from-red-50 to-red-100 rounded-xl shadow-lg mb-6 flex items-center justify-center">
          {/* Modern Minimalist Heart SVG */}
          <svg className="w-32 h-32 text-red-500" viewBox="0 0 200 200" fill="currentColor">
            <path d="M100 180 C100 180 40 130 40 90 C40 70 55 50 80 50 C90 50 95 55 100 60 C105 55 110 50 120 50 C145 50 160 70 160 90 C160 130 100 180 100 180 Z" 
                  fill="currentColor" 
                  stroke="none"/>
            {/* Subtle highlight */}
            <path d="M100 70 C105 65 110 60 120 60 C135 60 150 75 150 90 C150 110 120 140 100 160" 
                  fill="rgba(255,255,255,0.15)" 
                  stroke="none"/>
          </svg>
        </div>
        
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Quiz Hypertension Artérielle</h2>
        <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
          Testez vos connaissances sur l'hypertension artérielle à travers 4 niveaux progressifs basés sur la taxonomie de Bloom.
        </p>
      </div>

      {/* Game Rules Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <svg className="w-5 h-5 text-medical-blue mr-3" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
          </svg>
          Règles du Jeu
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="bg-medical-blue text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold mt-0.5">1</div>
              <p className="text-gray-700"><strong>4 Niveaux progressifs</strong> : Connaissance, Compréhension, Application, Analyse</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="bg-medical-blue text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold mt-0.5">2</div>
              <p className="text-gray-700"><strong>5 questions correctes</strong> par niveau pour progresser</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="bg-error-red text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold mt-0.5">!</div>
              <p className="text-gray-700"><strong>Maximum 3 erreurs</strong> au total</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="bg-error-red text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold mt-0.5">!</div>
              <p className="text-gray-700"><strong>Maximum 2 erreurs consécutives</strong></p>
            </div>
          </div>
        </div>
        
        {/* Scoring System */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
            <svg className="w-4 h-4 text-medical-blue mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2H6zm1 2a1 1 0 000 2h6a1 1 0 100-2H7zm6 7a1 1 0 011 1v3a1 1 0 11-2 0v-3a1 1 0 011-1zm-3 3a1 1 0 100 2h.01a1 1 0 100-2H10zm-4 1a1 1 0 011-1h.01a1 1 0 110 2H7a1 1 0 01-1-1zm1-4a1 1 0 100 2h.01a1 1 0 100-2H7zm2 1a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1zm4-4a1 1 0 100 2h.01a1 1 0 100-2H13z" clipRule="evenodd" />
            </svg>
            Système de Points
          </h4>
          <p className="text-sm text-gray-700">100 points de base + bonus de vitesse (jusqu'à 50 points). Plus vous répondez rapidement, plus votre score est élevé!</p>
        </div>
      </div>

      {/* Start Game Button */}
      <div className="text-center">
        <button 
          onClick={onStart}
          className="btn-primary bg-medical-blue hover:bg-blue-600 text-white font-semibold py-4 px-8 rounded-xl transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
        >
          <svg className="w-5 h-5 mr-3 inline" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
          </svg>
          Commencer le Quiz
        </button>
        <p className="text-sm text-gray-500 mt-3">Bonne chance dans votre apprentissage !</p>
      </div>
    </div>
  );
}
