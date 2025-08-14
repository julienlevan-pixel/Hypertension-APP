interface FeedbackProps {
  isCorrect: boolean;
  correctAnswer: string;
  selectedAnswer: string;
  explanation: string;
  score: number;
  responseTime: number;
  questionText?: string;
  allOptions?: string[];
}

interface FeedbackModalProps {
  feedback: FeedbackProps;
  onContinue: () => void;
}

export default function FeedbackModal({ feedback, onContinue }: FeedbackModalProps) {
  const { isCorrect, explanation, correctAnswer, selectedAnswer, score, responseTime, questionText, allOptions } = feedback;

  const getOptionLetter = (optionText: string) => {
    if (!allOptions) return '';
    const index = allOptions.indexOf(optionText);
    return index >= 0 ? String.fromCharCode(65 + index) : '';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
        <div className="text-center mb-6">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
            isCorrect ? 'bg-success-green' : 'bg-error-red'
          }`}>
            {isCorrect ? (
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            )}
          </div>
          <h3 className={`text-xl font-bold mb-4 ${
            isCorrect ? 'text-success-green' : 'text-error-red'
          }`}>
            {isCorrect ? 'Excellente réponse !' : 'Réponse incorrecte'}
          </h3>
        </div>

        {/* Score Section */}
        <div className={`rounded-lg p-4 mb-6 text-center ${
          isCorrect ? 'bg-success-green bg-opacity-10' : 'bg-error-red bg-opacity-10'
        }`}>
          <div className={`text-2xl font-bold mb-1 ${
            isCorrect ? 'text-success-green' : 'text-error-red'
          }`}>
            {isCorrect ? `+${score}` : '+0'} points
          </div>
          <div className="text-sm text-gray-600">
            {isCorrect 
              ? `Temps de réponse: ${responseTime.toFixed(1)}s`
              : `Temps de réponse: ${responseTime.toFixed(1)}s`
            }
          </div>
        </div>

        {/* Answer Review Section for Incorrect Answers */}
        {!isCorrect && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h4 className="font-semibold text-gray-900 mb-3">📝 Révision de votre réponse</h4>
            <div className="space-y-2">
              <div className="flex items-start space-x-2">
                <div className="bg-error-red text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mt-0.5">
                  {getOptionLetter(selectedAnswer)}
                </div>
                <div>
                  <div className="text-sm font-medium text-error-red">Votre réponse :</div>
                  <div className="text-sm text-gray-700">{selectedAnswer}</div>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <div className="bg-success-green text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mt-0.5">
                  {getOptionLetter(correctAnswer)}
                </div>
                <div>
                  <div className="text-sm font-medium text-success-green">Réponse correcte :</div>
                  <div className="text-sm text-gray-700">{correctAnswer}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Explanation Section */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h4 className="font-semibold text-blue-900 mb-2 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            Explication médicale
          </h4>
          <p className="text-sm text-blue-800 leading-relaxed">{explanation}</p>
        </div>

        {/* Continue Button */}
        <button 
          onClick={onContinue}
          className={`btn-primary w-full font-semibold py-3 px-4 rounded-lg transition-colors ${
            isCorrect 
              ? 'bg-success-green hover:bg-green-600 text-white' 
              : 'bg-medical-blue hover:bg-blue-600 text-white'
          }`}
        >
          {isCorrect ? '🎉 Continuer' : '💪 Continuer et apprendre'}
        </button>
      </div>
    </div>
  );
}
