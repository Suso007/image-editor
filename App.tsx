import React, { useState, useCallback } from 'react';
import { editImageWithPrompt } from './services/geminiService';
import { fileToBase64 } from './utils/fileUtils';
import { WandIcon } from './components/Icon';
import ImageUploader from './components/ImageUploader';
import ImageViewer from './components/ImageViewer';

interface ImageData {
  base64: string;
  mimeType: string;
}

const App: React.FC = () => {
  const [originalImageFile, setOriginalImageFile] = useState<File | null>(null);
  const [originalImageData, setOriginalImageData] = useState<ImageData | null>(null);
  const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null);

  const [generatedImage, setGeneratedImage] = useState<ImageData | null>(null);
  const [prompt, setPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isReadingFile, setIsReadingFile] = useState<boolean>(false);


  const handleImageSelect = async (file: File) => {
    setIsReadingFile(true);
    setOriginalImageFile(file);
    setGeneratedImage(null);
    setError(null);
    if (originalImageUrl) {
        URL.revokeObjectURL(originalImageUrl);
    }
    setOriginalImageUrl(URL.createObjectURL(file));

    try {
        const { base64, mimeType } = await fileToBase64(file);
        setOriginalImageData({ base64, mimeType });
    } catch(e) {
        setError("Could not read image file.");
        setOriginalImageData(null);
        setOriginalImageUrl(null);
    } finally {
        setIsReadingFile(false);
    }
  };

  const handleSubmit = useCallback(async () => {
    if (!originalImageData || !prompt.trim()) {
      setError('Please upload an image and enter a prompt.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const result = await editImageWithPrompt(originalImageData, prompt);
      setGeneratedImage(result);
    } catch (e) {
      console.error(e);
      setError('Failed to generate image. Please check your API key and network connection.');
    } finally {
      setIsLoading(false);
    }
  }, [originalImageData, prompt]);
  
  const isButtonDisabled = isLoading || isReadingFile || !originalImageFile || !prompt.trim();

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-screen-2xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-600">
            Nano Banana Image Editor
          </h1>
          <p className="mt-2 text-lg text-gray-400">
            Edit images with text prompts using Gemini 2.5 Flash Image.
          </p>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Controls Section */}
          <div className="lg:col-span-1 bg-gray-800/50 rounded-xl p-6 shadow-lg border border-gray-700 self-start">
            <h2 className="text-2xl font-bold mb-4 border-b border-gray-600 pb-2">1. Upload Image</h2>
            <ImageUploader onImageSelect={handleImageSelect} originalImageUrl={originalImageUrl}/>

            <h2 className="text-2xl font-bold mt-8 mb-4 border-b border-gray-600 pb-2">2. Describe Your Edit</h2>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., Add a retro filter, make it black and white..."
              className="w-full h-32 p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              disabled={isLoading || isReadingFile}
            />
            
            <button
              onClick={handleSubmit}
              disabled={isButtonDisabled}
              className="mt-6 w-full flex items-center justify-center gap-2 bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 disabled:scale-100"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <WandIcon className="h-5 w-5" />
                  <span>Generate Image</span>
                </>
              )}
            </button>
            {error && <p className="text-red-400 mt-4 text-center">{error}</p>}
          </div>

          {/* Display Section */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
            <ImageViewer title="Original" imageData={originalImageData} placeholderText="Upload an image to see it here." isLoading={isReadingFile} />
            <ImageViewer 
              title="Edited by Gemini" 
              imageData={generatedImage} 
              placeholderText="Your generated image will appear here."
              isLoading={isLoading}
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;