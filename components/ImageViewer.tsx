import React from 'react';

interface ImageViewerProps {
  title: string;
  imageData: {
    base64: string;
    mimeType: string;
  } | null;
  placeholderText: string;
  isLoading?: boolean;
}

const ImageViewer: React.FC<ImageViewerProps> = ({ title, imageData, placeholderText, isLoading }) => {
  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 flex flex-col w-full min-h-[300px] lg:min-h-[40vh] shadow-lg">
      <h3 className="text-lg font-semibold text-gray-300 mb-4 self-start">{title}</h3>
      <div className="relative w-full h-full flex-grow flex items-center justify-center border-2 border-dashed border-gray-600 rounded-lg p-2">
        {isLoading ? (
            <div className="flex flex-col items-center justify-center text-center">
              <svg className="animate-spin h-10 w-10 text-indigo-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="mt-4 text-lg font-semibold text-gray-200">{title === 'Original' ? 'Reading file...' : 'Gemini is thinking...'}</p>
            </div>
        ) : imageData ? (
          <img
            src={`data:${imageData.mimeType};base64,${imageData.base64}`}
            alt={title}
            className="max-w-full max-h-full object-contain rounded-md"
          />
        ) : (
          <p className="text-gray-500 text-center px-4">{placeholderText}</p>
        )}
      </div>
    </div>
  );
};

export default ImageViewer;